"use server";

import { z } from 'zod';
import prisma from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ROLES } from '../constants/roles';
import bcrypt from 'bcryptjs';

const BodegueroSchema = z.object({
  id: z.string(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().optional(),
});

export type State = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string | null;
};

const CreateBodeguero = BodegueroSchema.omit({ id: true });

export async function createBodeguero(prevState: State, formData: FormData) {
  const validatedFields = CreateBodeguero.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. No se pudo crear el bodeguero.',
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  try {
    const rolBodeguero = await prisma.rol.findFirst({
      where: { nombre: ROLES.BODEGUERO },
      select: { id: true },
    });

    if (!rolBodeguero) {
      throw new Error('Rol "BODEGUERO" no encontrado.');
    }

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        rolId: rolBodeguero.id,
      },
    });
  } catch (error) {
    return {
      message: 'Error de base de datos: No se pudo crear el bodeguero.',
    };
  }

  revalidatePath('/(feat)/bodegueros');
  redirect('/(feat)/bodegueros');
}

const UpdateBodeguero = BodegueroSchema;

export async function updateBodeguero(prevState: State, formData: FormData) {
  const validatedFields = UpdateBodeguero.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Error de validación. No se pudo actualizar el bodeguero.',
    };
  }

  const { id, name, email, password } = validatedFields.data;
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;

  try {
    await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        ...(password && { password: hashedPassword }),
      },
    });
  } catch (error) {
    return { message: 'Error de base de datos: No se pudo actualizar el bodeguero.' };
  }

  revalidatePath('/(feat)/bodegueros');
  redirect('/(feat)/bodegueros');
}

export async function deleteBodeguero(id: string) {
  try {
    await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    revalidatePath('/(feat)/bodegueros');
    return { message: 'Bodeguero eliminado.' };
  } catch (error) {
    return { message: 'Error de base de datos: No se pudo eliminar el bodeguero.' };
  }
}
