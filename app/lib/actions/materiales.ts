"use server"

import prisma from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"
import { updateBodega } from '@/app/lib/actions/bodegas';

interface MaterialForm{
    id?: number
    nombre: string
    unidad_medida: string
    categoriaId: number
}

interface CreateMaterialState extends MaterialForm {
    success: boolean
    message: string
}
 export async function createMaterial(prevState: CreateMaterialState, data:Omit<MaterialForm, "id">) {
    try {
        await prisma.material.create({
            data:{
                nombre:data.nombre,
                unidad_medida:data.unidad_medida,
                categoria:{
                    connect:{
                        id: data.categoriaId
                    }
                }
            }
        })
        revalidatePath("/materiales")
        return{
            ...data,
            success:true,
            message:"Material creado exitosamente"
        }
    } catch(error){
        console.log("Error al crear materiale:",error)
        return{
            ...data,
            success:false,
            message:"Error al crear el material"
        }
    }
    
 }

export async function updateMaterial(prevState: CreateMaterialState, data: MaterialForm & { id: number }) {
  try {
    await prisma.material.update({
      where: { id: data.id },
      data: {
        nombre: data.nombre,
        unidad_medida: data.unidad_medida,
        categoria: {
          connect: {
            id: data.categoriaId
          }
        }
      }
    })
    revalidatePath("/materiales")
    return {
      ...data,
      success: true,
      message: "Material actualizado exitosamente"
    }
  } catch (error) {
    console.error("Error al actualizar material:", error)
    return {
      ...data,
      success: false,
      message: "Error al actualizar el material"
    }
  }
}

export async function deleteMaterial(materialId: number) {
    try{
        await prisma.material.update({
            where: {
                id: materialId
            },
            data: {
                deleteAt: new Date()
            }
        })
        revalidatePath("/materiales")
    } catch(error){
        console.log("Error al eliminar el material:", error)
        throw new Error("No se pudo eliminar el material.")
    }
    
}