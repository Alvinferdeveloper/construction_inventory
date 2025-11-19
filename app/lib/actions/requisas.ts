"use server";

import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/app/lib/auth';

const MaterialSchema = z.object({
  materialId: z.number(),
  cantidad: z.number().min(1, 'La cantidad debe ser mayor a 0'),
});

const CreateRequisaSchema = z.object({
  proyecto: z.string().min(3, 'El nombre del proyecto es requerido'),
  materiales: z.array(MaterialSchema).min(1, 'Debes añadir al menos un material'),
});

export type State = {
  errors?: {
    proyecto?: string[];
    materiales?: string[];
    database?: string[];
  };
  message?: string | null;
};


import { headers } from 'next/headers';

// Función para parsear los materiales desde FormData
function parseMaterialesFromFormData(formData: FormData): { materialId: number; cantidad: number }[] {
  const materiales: { materialId: number; cantidad: number }[] = [];
  const keys = Array.from(formData.keys());

  // Agrupar por índice
  const materialGroups: { [key: string]: any } = {};
  keys.forEach(key => {
    const match = key.match(/materiales\.(\d+)\.(.+)/);
    if (match) {
      const [, index, prop] = match;
      if (!materialGroups[index]) {
        materialGroups[index] = {};
      }
      materialGroups[index][prop] = formData.get(key);
    }
  });

  // Convertir a array de objetos y filtrar incompletos
  for (const index in materialGroups) {
    const group = materialGroups[index];
    if (group.materialId && group.cantidad) {
      materiales.push({
        materialId: parseInt(group.materialId, 10),
        cantidad: Number(group.cantidad),
      });
    }
  }

  return materiales;
}

export async function createRequisa(prevState: State, formData: FormData): Promise<State> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return {
      message: 'Error de autenticación. Por favor, inicia sesión de nuevo.',
    };
  }

  const solicitanteId = session.user.id;
  const parsedMateriales = parseMaterialesFromFormData(formData);

  const validatedFields = CreateRequisaSchema.safeParse({
    proyecto: formData.get('proyecto'),
    materiales: parsedMateriales,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo crear la requisa.',
    };
  }

  const { proyecto, materiales } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Crear la requisa principal para obtener un ID
      const requisa = await tx.requisa.create({
        data: {
          proyecto,
          solicitanteId,
          estado: 'pendiente',
        },
      });

      // 2. Procesar cada material con la lógica de distribución
      for (const material of materiales) {
        let cantidadNecesaria = material.cantidad;

        // Buscar todas las bodegas que tienen este material, ordenadas por la que tiene más stock
        const inventarios = await tx.inventario.findMany({
          where: {
            materialId: material.materialId,
            stock_actual: { gt: 0 },
          },
          orderBy: {
            stock_actual: 'desc',
          },
        });

        if (inventarios.reduce((acc, inv) => acc + inv.stock_actual, 0) < cantidadNecesaria) {
          throw new Error(`Stock insuficiente para el material ID: ${material.materialId}.`);
        }

        // 3. Distribuir la cantidad necesaria entre las bodegas
        for (const inventario of inventarios) {
          if (cantidadNecesaria <= 0) break; // Ya se cubrió la necesidad

          const cantidadADescontar = Math.min(cantidadNecesaria, inventario.stock_actual);

          // Crear el detalle de la requisa asignado a esta bodega
          await tx.detalleRequisa.create({
            data: {
              requisaId: requisa.id,
              materialId: material.materialId,
              bodegaId: inventario.bodegaId,
              cantidad: cantidadADescontar,
            },
          });

          cantidadNecesaria -= cantidadADescontar;
        }
      }
    });
  } catch (error) {
    console.error('Error al crear la requisa:', error);
    return {
      message: error instanceof Error ? error.message : 'Error de base de datos: No se pudo crear la requisa.',
    };
  }

  revalidatePath('/requisas');
  return { message: 'Requisa creada exitosamente.', errors: {} };
}

/**
 * Elimina lógicamente una requisa y sus detalles (soft delete).
 * @param requisaId - El ID de la requisa a eliminar.
 */
export async function updateRequisa(prevState: State, formData: FormData): Promise<State> {
  const requisaId = Number(formData.get('requisaId'));
  if (isNaN(requisaId)) {
    return { message: 'ID de requisa inválido.' };
  }
  const parsedMateriales = parseMaterialesFromFormData(formData);

  const validatedFields = CreateRequisaSchema.safeParse({
    proyecto: formData.get('proyecto'),
    materiales: parsedMateriales,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo actualizar la requisa.',
    };
  }

  const { proyecto, materiales } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar el proyecto de la requisa principal
      await tx.requisa.update({
        where: { id: requisaId },
        data: { proyecto },
      });

      // 2. Eliminar los detalles antiguos para recalcular
      await tx.detalleRequisa.deleteMany({ where: { requisaId: requisaId } });

      // 3. Re-ejecutar la lógica de distribución (similar a createRequisa)
      for (const material of materiales) {
        let cantidadNecesaria = material.cantidad;

        const inventarios = await tx.inventario.findMany({
          where: {
            materialId: material.materialId,
            stock_actual: { gt: 0 },
          },
          orderBy: { stock_actual: 'desc' },
        });

        if (inventarios.reduce((acc, inv) => acc + inv.stock_actual, 0) < cantidadNecesaria) {
          throw new Error(`Stock insuficiente para el material ID: ${material.materialId}.`);
        }

        for (const inventario of inventarios) {
          if (cantidadNecesaria <= 0) break;

          const cantidadADescontar = Math.min(cantidadNecesaria, inventario.stock_actual);

          await tx.detalleRequisa.create({
            data: {
              requisaId: requisaId,
              materialId: material.materialId,
              bodegaId: inventario.bodegaId,
              cantidad: cantidadADescontar,
            },
          });

          cantidadNecesaria -= cantidadADescontar;
        }
      }
    });
  } catch (error) {
    console.error('Error al actualizar la requisa:', error);
    return {
      message: error instanceof Error ? error.message : 'Error de base de datos: No se pudo actualizar la requisa.',
    };
  }

  revalidatePath('/requisas');
  return { message: 'Requisa actualizada exitosamente.', errors: {} };
}

export async function aprobarDetalle(prevState: State, formData: FormData): Promise<State> {
  const detalleRequisaId = Number(formData.get('detalleRequisaId'));
  const bodegueroId = String(formData.get('bodegueroId'));

  if (isNaN(detalleRequisaId) || !bodegueroId) {
    return { message: 'IDs inválidos.' };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const detalle = await tx.detalleRequisa.findUnique({
        where: { id: detalleRequisaId },
        include: { bodega: true, requisa: true },
      });

      if (!detalle) throw new Error('El detalle de la requisa no existe.');
      if (detalle.bodega?.responsableId !== bodegueroId) {
        throw new Error('No tienes permiso para aprobar este movimiento.');
      }

      // 1. Descontar del inventario
      const inventario = await tx.inventario.findFirst({
        where: {
          bodegaId: detalle.bodegaId!,
          materialId: detalle.materialId,
        },
      });

      if (!inventario || inventario.stock_actual < detalle.cantidad) {
        throw new Error('Stock insuficiente en la bodega para completar esta acción.');
      }

      await tx.inventario.update({
        where: { id: inventario.id },
        data: { stock_actual: { decrement: detalle.cantidad } },
      });

      // 2. Marcar el detalle como aprobado
      await tx.detalleRequisa.update({
        where: { id: detalle.id },
        data: { estado: 'aprobado' },
      });

      // 3. Actualizar estado de la requisa principal a 'en_proceso' si es necesario
      await tx.requisa.update({
        where: { id: detalle.requisaId },
        data: { estado: 'en_proceso' },
      });
    });

    revalidatePath('/bodega/asignaciones');
    return { message: 'Movimiento aprobado y stock descontado.' };

  } catch (error) {
    console.error('Error al aprobar el detalle:', error);
    return { message: error instanceof Error ? error.message : 'Error de base de datos.' };
  }
}

export async function deleteRequisa(prevState: State, formData: FormData): Promise<State> {
  const requisaId = Number(formData.get('requisaId'));

  if (isNaN(requisaId)) {
    return { message: 'ID de requisa inválido.', errors: {} };
  }
  try {
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      // 1. Marcar como eliminados los detalles de la requisa
      await tx.detalleRequisa.updateMany({
        where: { requisaId: requisaId },
        data: { deletedAt: now },
      });

      // 2. Marcar como eliminada la requisa principal
      await tx.requisa.update({
        where: { id: requisaId },
        data: { deletedAt: now },
      });
    });

    revalidatePath('/requisas');
    return { message: `Requisa #${requisaId} eliminada exitosamente.`, errors: {} };
  } catch (error) {
    console.error('Error al eliminar la requisa:', error);
    return { message: 'Error de base de datos: No se pudo eliminar la requisa.', errors: {} };
  }
}
