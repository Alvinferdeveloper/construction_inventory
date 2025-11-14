"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteMaterial } from "@/app/lib/actions/materiales"

interface DeleteMaterialProps {
    materialId: number
}

export default function DeleteMaterial({ materialId }: DeleteMaterialProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteMaterial(materialId)
        } catch (error) {
            console.error("Error al eliminar material:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <span
                    className="h-8 flex items-center justify-center rounded-md cursor-pointer w-8 p-0 hover:bg-red-100 hover:text-red-700 text-muted-foreground"
                    title="Eliminar material"
                >
                    <Trash2 className="w-4 h-4" />
                </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro de eliminar este material?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. El material será marcado como eliminado.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                        {isDeleting ? "Eliminando..." : "Eliminar"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}