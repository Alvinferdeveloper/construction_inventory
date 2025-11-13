"use server"
import prisma from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"
import { BodegaForm } from "@/app/(feat)/bodegas/components/create-bodega-modal"

interface CreateBodegaState extends BodegaForm {
    success: boolean;
    message: string;
}

export async function createBodega(prevState: CreateBodegaState, data: BodegaForm) {
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
