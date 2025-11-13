"use client"
import { DeleteConfirmationModal } from "@/app/(feat)/components/shared/delete-confirmation-modal"
import { deleteBodega } from "@/app/lib/actions/bodegas"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface DeleteBodegaProps {
    bodegaId: number
}

export default function DeleteBodega({ bodegaId }: DeleteBodegaProps) {
    return (
        <DeleteConfirmationModal
            title="Eliminar Bodega"
            description="¿Estás seguro que deseas eliminar la bodega?"
            onConfirm={() => deleteBodega(bodegaId)}
        >
            <Button
                variant="ghost"
                size="sm"
                className="h-8 cursor-pointer w-8 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                title="Eliminar bodega"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </DeleteConfirmationModal>
    )
}