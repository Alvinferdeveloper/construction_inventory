"use server"

import { z } from "zod";
import prisma from "@/app/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { AddMaterialForm } from "@/app/(feat)/inventario/components/add-material-form-modal";
import { EntradaForm } from "@/app/(feat)/inventario/components/entrada-form-modal";

const EntradaSchema = z.object({
    inventarioId: z.coerce.number(),
    cantidad: z.coerce.number().int().positive({ message: "La cantidad debe ser mayor a 0." }),
    observaciones: z.string().optional(),
});

export interface EntradaFormState {
    message: string;
    success: boolean;
}

export async function createEntrada(prevState: EntradaFormState, data: EntradaForm): Promise<EntradaFormState> {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    if (!session?.user?.id) {
        return {
            success: false,
            message: "Error de autenticación.",
        };
    }
    const userId = session.user.id;

    const validatedFields = EntradaSchema.safeParse(data);

    if (!validatedFields.success) {
        return {
            success: false,
            message: "Error de validación. Por favor, revisa los datos ingresados.",
        };
    }

    const { inventarioId, cantidad, observaciones } = validatedFields.data;

    try {
        await prisma.$transaction(async (tx) => {
            const updatedInventario = await tx.inventario.update({
                where: { id: inventarioId },
                data: {
                    stock_actual: {
                        increment: cantidad,
                    },
                },
            });

            await tx.movimiento.create({
                data: {
                    inventarioId: updatedInventario.id,
                    tipo: 'entrada',
                    cantidad: cantidad,
                    usuarioId: userId,
                    fecha: new Date(),
                    observaciones: observaciones,
                },
            });
        });

        revalidatePath("/inventario");
        return {
            success: true,
            message: "Entrada registrada exitosamente.",
        };

    } catch (error) {
        console.error("Error creating entrada:", error);
        return {
            success: false,
            message: "Error de base de datos. No se pudo registrar la entrada.",
        };
    }
}

const AddMaterialSchema = z.object({
    bodegaId: z.coerce.number(),
    materialId: z.coerce.number(),
    cantidad: z.coerce.number().int().positive({ message: "La cantidad debe ser mayor a 0." }),
    observaciones: z.string().optional(),
    minStock: z.coerce.number().int().nonnegative().optional(),
    maxStock: z.coerce.number().int().positive().optional(),
}).refine(data => {
    if (data.minStock !== undefined && data.maxStock !== undefined) {
        return data.minStock <= data.maxStock;
    }
    return true;
}, {
    message: "El stock mínimo no puede ser mayor al stock máximo.",
    path: ["minStock"],
});

export async function addMaterialToBodega(prevState: EntradaFormState, data: AddMaterialForm): Promise<EntradaFormState> {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session?.user?.id) {
        return { success: false, message: "Error de autenticación." };
    }
    const userId = session.user.id;

    const validatedFields = AddMaterialSchema.safeParse(data);

    if (!validatedFields.success) {
        return { success: false, message: "Error de validación." };
    }

    const { bodegaId, materialId, cantidad, observaciones, minStock, maxStock } = validatedFields.data;

    try {
        await prisma.$transaction(async (tx) => {
            // Check if the inventory item already exists
            const existingInventory = await tx.inventario.findUnique({
                where: {
                    bodegaId_materialId: {
                        bodegaId,
                        materialId,
                    },
                },
            });

            if (existingInventory) {
                throw new Error("Este material ya existe en la bodega. Use la opción 'Registrar Entrada' para aumentar el stock.");
            }

            // 1. Create the new inventory record
            const newInventario = await tx.inventario.create({
                data: {
                    bodegaId,
                    materialId,
                    stock_actual: cantidad,
                    minStock: minStock,
                    maxStock: maxStock,
                },
            });

            // 2. Create the initial movement record
            await tx.movimiento.create({
                data: {
                    inventarioId: newInventario.id,
                    tipo: 'entrada',
                    cantidad: cantidad,
                    usuarioId: userId,
                    observaciones: observaciones || "Entrada inicial de material nuevo.",
                },
            });
        });

        revalidatePath("/inventario");
        return { success: true, message: "Material agregado y entrada registrada exitosamente." };

    } catch (error: any) {
        console.error("Error adding material to bodega:", error);
        return {
            success: false,
            message: error.message || "Error de base de datos. No se pudo agregar el material.",
        };
    }
}
