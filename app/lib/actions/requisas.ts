"use server";

import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/app/lib/auth';
import { headers } from 'next/headers';

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
  success?: boolean;
};

function parseMaterialesFromFormData(formData: FormData): { materialId: number; cantidad: number }[] {
  const materiales: { materialId: number; cantidad: number }[] = [];
  const keys = Array.from(formData.keys());

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
      success: false,
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
      success: false,
    };
  }

  const { proyecto, materiales } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      const requisa = await tx.requisa.create({
        data: {
          proyecto,
          solicitanteId,
          estado: 'pendiente',
        },
      });

      for (const material of materiales) {
        let cantidadNecesaria = material.cantidad;

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

        for (const inventario of inventarios) {
          if (cantidadNecesaria <= 0) break;

          const cantidadADescontar = Math.min(cantidadNecesaria, inventario.stock_actual);

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
      success: false,
    };
  }

  revalidatePath('/requisas');
  return { message: 'Requisa creada exitosamente.', errors: {}, success: true };
}

export async function updateRequisa(prevState: State, formData: FormData): Promise<State> {
  const requisaId = Number(formData.get('requisaId'));
  if (isNaN(requisaId)) {
    return { message: 'ID de requisa inválido.', success: false };
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
      success: false,
    };
  }

  const { proyecto, materiales } = validatedFields.data;

  try {
    await prisma.$transaction(async (tx) => {
      await tx.requisa.update({
        where: { id: requisaId },
        data: { proyecto },
      });
      await tx.detalleRequisa.deleteMany({ where: { requisaId: requisaId } });

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
      message: 'Error: No se pudo actualizar la requisa.',
      success: false,
    };
  }

  revalidatePath('/requisas');
  return { message: 'Requisa actualizada exitosamente.', errors: {}, success: true };
}

export async function aprobarDetalle(prevState: State, formData: FormData): Promise<State> {
  const detalleRequisaId = Number(formData.get('detalleRequisaId'));
  const bodegueroId = String(formData.get('bodegueroId'));

  if (isNaN(detalleRequisaId) || !bodegueroId) {
    return { message: 'IDs inválidos.', success: false };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const detalle = await tx.detalleRequisa.findUnique({
        where: { id: detalleRequisaId },
        include: { bodega: true, requisa: true },
      });

      if (!detalle) throw new Error('El detalle de la requisa no existe.');
      if (detalle.estado === 'aprobado') throw new Error('Este detalle ya ha sido aprobado.');
      if (detalle.bodega?.responsableId !== bodegueroId) {
        throw new Error('No tienes permiso para aprobar este movimiento.');
      }

      const inventario = await tx.inventario.findFirst({
        where: {
          bodegaId: detalle.bodegaId!,
          materialId: detalle.materialId,
        },
      });

      if (!inventario || inventario.stock_actual < detalle.cantidad) {
        throw new Error('Stock insuficiente en la bodega para completar esta acción.');
      }

      // 1. Update inventory stock
      await tx.inventario.update({
        where: { id: inventario.id },
        data: { stock_actual: { decrement: detalle.cantidad } },
      });

      // 2. Create the movement record
      const movimiento = await tx.movimiento.create({
        data: {
          inventarioId: inventario.id,
          tipo: 'salida',
          cantidad: detalle.cantidad,
          usuarioId: bodegueroId,
          observaciones: `Salida por Requisa #${detalle.requisaId}`,
          detalleRequisaId: detalle.id, // Link the movement to the detalleRequisa
        }
      });

      // 3. Mark the detail as approved
      await tx.detalleRequisa.update({
        where: { id: detalle.id },
        data: { 
            estado: 'aprobado',
            movimiento: { connect: { id: movimiento.id } } // Also link from detalleRequisa
        },
      });

      // 4. Check the status of all other details for the same requisa
      const todosLosDetalles = await tx.detalleRequisa.findMany({
        where: { requisaId: detalle.requisaId },
      });

      const todosAprobados = todosLosDetalles.every(d => d.estado === 'aprobado');
      
      const nuevoEstadoRequisa = todosAprobados ? 'aprobada' : 'en_proceso';

      // 5. Update the parent requisa status
      await tx.requisa.update({
        where: { id: detalle.requisaId },
        data: { estado: nuevoEstadoRequisa },
      });
    });

    revalidatePath('/bodega/asignaciones');
    return { message: 'Movimiento aprobado y stock descontado.', success: true };

  } catch (error) {
    console.error('Error al aprobar el detalle:', error);
    return { message: error instanceof Error ? error.message : 'Error de base de datos.', success: false };
  }
}

export async function deleteRequisa(prevState: State, formData: FormData): Promise<State> {
  const requisaId = Number(formData.get('requisaId'));

  if (isNaN(requisaId)) {
    return { message: 'ID de requisa inválido.', success: false };
  }
  try {
    const now = new Date();

    await prisma.$transaction(async (tx) => {
      await tx.detalleRequisa.updateMany({
        where: { requisaId: requisaId },
        data: { deletedAt: now },
      });

      await tx.requisa.update({
        where: { id: requisaId },
        data: { deletedAt: now },
      });
    });

    revalidatePath('/requisas');
    return { message: `Requisa #${requisaId} eliminada exitosamente.`, success: true };
  } catch (error) {
    console.error('Error al eliminar la requisa:', error);
    return { message: 'Error de base de datos: No se pudo eliminar la requisa.', success: false };
  }
}
