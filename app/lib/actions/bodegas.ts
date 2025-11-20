"use server"
import prisma from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"
import { BodegaForm } from "@/app/(feat)/bodegas/components/bodega-form-modal"
import { auth } from "@/app/lib/auth"
import { headers } from "next/headers"

interface CreateBodegaState extends BodegaForm {
    success: boolean;
    message: string;
}

export async function createBodega(prevState: CreateBodegaState, data: Omit<BodegaForm, "id">) {
    try {
        await prisma.bodega.create({
            data: {
                ...data,
                responsable: {
                    connect: {
                        id: data.responsable
                    }
                }
            }
        })
        revalidatePath("/bodegas")
        return {
            ...data,
            success: true,
            message: "Bodega creada exitosamente"
        }
    } catch (error) {
        return {
            ...data,
            success: false,
            message: "Error al crear la bodega"
        }
    }
}

export async function updateBodega(prevState: CreateBodegaState, data: BodegaForm & { id: number }) {
    try {
        await prisma.bodega.update({
            where: { id: data.id },
            data: {
                nombre: data.nombre,
                ubicacion: data.ubicacion,
                responsable: {
                    connect: {
                        id: data.responsable
                    }
                }
            }
        })
        revalidatePath("/bodegas")
        return {
            ...data,
            success: true,
            message: "Bodega actualizada exitosamente"
        }
    } catch (error) {
        return {
            ...data,
            success: false,
            message: "Error al actualizar la bodega"
        }
    }
}

export async function getBodegaDeleteInfo(bodegaId: number) {
    const stockCount = await prisma.inventario.count({
        where: {
            bodegaId: bodegaId,
            stock_actual: { gt: 0 }
        }
    });

    if (stockCount === 0) {
        return { hasStock: false, transferOptions: [] };
    }

    const transferOptions = await prisma.bodega.findMany({
        where: {
            id: { not: bodegaId },
            deletedAt: null
        },
        select: { id: true, nombre: true }
    });

    return { hasStock: true, transferOptions };
}


export async function softDeleteBodega(bodegaId: number) {
    try {
        await prisma.bodega.update({
            where: { id: bodegaId },
            data: { deletedAt: new Date() }
        });
        revalidatePath("/bodegas");
        return { success: true, message: "Bodega eliminada exitosamente." };
    } catch (error) {
        return { success: false, message: "Error al eliminar la bodega." };
    }
}

export async function transferAndDeleteBodega(sourceBodegaId: number, destinationBodegaId: number) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
        return { success: false, message: "Error de autenticación." };
    }
    const adminUserId = session.user.id;

    try {
        await prisma.$transaction(async (tx) => {
            const sourceInventario = await tx.inventario.findMany({
                where: {
                    bodegaId: sourceBodegaId,
                    stock_actual: { gt: 0 }
                }
            });

            for (const sourceItem of sourceInventario) {
                // Find or create destination inventory item
                let destinationItem = await tx.inventario.findUnique({
                    where: {
                        bodegaId_materialId: {
                            bodegaId: destinationBodegaId,
                            materialId: sourceItem.materialId
                        }
                    }
                });

                if (destinationItem) {
                    await tx.inventario.update({
                        where: { id: destinationItem.id },
                        data: { stock_actual: { increment: sourceItem.stock_actual } }
                    });
                } else {
                    destinationItem = await tx.inventario.create({
                        data: {
                            bodegaId: destinationBodegaId,
                            materialId: sourceItem.materialId,
                            stock_actual: sourceItem.stock_actual,
                            minStock: sourceItem.minStock,
                            maxStock: sourceItem.maxStock,
                        }
                    });
                }

                // Create movement records
                // Salida from source
                await tx.movimiento.create({
                    data: {
                        inventarioId: sourceItem.id,
                        tipo: 'salida',
                        cantidad: sourceItem.stock_actual,
                        usuarioId: adminUserId,
                        observaciones: `Traslado a bodega ID: ${destinationBodegaId}`
                    }
                });
                // Entrada to destination
                await tx.movimiento.create({
                    data: {
                        inventarioId: destinationItem.id,
                        tipo: 'entrada',
                        cantidad: sourceItem.stock_actual,
                        usuarioId: adminUserId,
                        observaciones: `Traslado desde bodega ID: ${sourceBodegaId}`
                    }
                });

                // Set source stock to 0
                await tx.inventario.update({
                    where: { id: sourceItem.id },
                    data: { stock_actual: 0 }
                });
            }

            // Soft delete the source bodega
            await tx.bodega.update({
                where: { id: sourceBodegaId },
                data: { deletedAt: new Date() }
            });
        });

        revalidatePath("/bodegas");
        return { success: true, message: "Inventario transferido y bodega eliminada exitosamente." };

    } catch (error) {
        console.error("Error transferring and deleting bodega:", error);
        return { success: false, message: "Error en la transacción. No se pudo completar la operación." };
    }
}
