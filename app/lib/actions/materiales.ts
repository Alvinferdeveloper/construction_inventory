"use server"

import prisma from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/app/lib/auth"
import { headers } from "next/headers"
import { ROLES } from "@/app/lib/constants/roles"

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


async function checkAdminPermission() {
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session?.user) {
        throw new Error("No autorizado")
    }
    
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: { rol: true }
    })
    
    if (!user || user.rol.nombre !== ROLES.ADMINISTRADOR) {
        throw new Error("No tienes permisos para realizar esta acción")
    }
    
    return user
}

export async function createMaterial(prevState: CreateMaterialState, data:Omit<MaterialForm, "id">) {
    try {
       
        await checkAdminPermission()
        
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
        console.log("Error al crear material:",error)
        const errorMessage = error instanceof Error ? error.message : "Error al crear el material"
        return{
            ...data,
            success:false,
            message: errorMessage
        }
    }
    
}

export async function updateMaterial(prevState: CreateMaterialState, data: MaterialForm & { id: number }) {
  try {
  
    await checkAdminPermission()
    
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
    const errorMessage = error instanceof Error ? error.message : "Error al actualizar el material"
    return {
      ...data,
      success: false,
      message: errorMessage
    }
  }
}

export async function deleteMaterial(materialId: number) {
    try {
      
        await checkAdminPermission()
        
        await prisma.material.update({
            where: {
                id: materialId
            },
            data: {
                deletedAt: new Date()
            }
        })
        revalidatePath("/materiales")
    } catch(error){
        console.log("Error al eliminar el material:", error)
        const errorMessage = error instanceof Error ? error.message : "No se pudo eliminar el material."
        throw new Error(errorMessage)
    }
    
}