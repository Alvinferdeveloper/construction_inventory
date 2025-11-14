import { Pencil, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DeleteMaterial from "@/app/(feat)/materiales/components/buttons/delete-material"
import { getMateriales } from "@/app/lib/queries/materiales"
import { getCategorias } from "@/app/lib/queries/materiales"
import { updateMaterial } from "@/app/lib/actions/materiales"
import MaterialFormModal, { type Material } from "@/app/(feat)/materiales/components/material-form-modal"
import type { ComponentProps } from "react"

export default async function MaterialTable() {
    const materiales = await getMateriales()
    const categorias = await getCategorias()
    
    const getAvatarColor = (name: string) => {
        const colors = [
            "bg-blue-100 text-blue-700",
            "bg-purple-100 text-purple-700",
            "bg-pink-100 text-pink-700",
            "bg-green-100 text-green-700",
            "bg-orange-100 text-orange-700",
            "bg-red-100 text-red-700",
        ]
        const index = name.charCodeAt(0) % colors.length
        return colors[index]
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <Card className="overflow-hidden border border-border">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border bg-muted hover:bg-muted">
                        <TableHead className="font-semibold text-foreground">Material</TableHead>
                        <TableHead className="font-semibold text-foreground">Unidad de Medida</TableHead>
                        <TableHead className="font-semibold text-foreground">Categoría</TableHead>
                        <TableHead className="text-right font-semibold text-foreground">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {materiales.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <Package className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">No hay materiales registrados</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        materiales.map((material) => (
                            <TableRow key={material.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${getAvatarColor(material.nombre)}`}
                                        >
                                            {getInitials(material.nombre)}
                                        </div>
                                        <span className="font-medium text-foreground">{material.nombre}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-muted-foreground">{material.unidad_medida}</TableCell>

                                <TableCell className="text-foreground">{material.categoria.nombre}</TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <MaterialFormModal
                                            categorias={categorias}
                                            action={updateMaterial as ComponentProps<typeof MaterialFormModal>['action']}
                                            title="Editar Material"
                                            description="Editar el material"
                                            submitText="Editar Material"
                                            initialData={{
                                                id: material.id,
                                                nombre: material.nombre,
                                                unidad_medida: material.unidad_medida,
                                                categoriaId: material.categoriaId
                                            }}
                                        >
                                            <span
                                                className="h-8 flex items-center justify-center rounded-md cursor-pointer w-8 p-0 hover:bg-blue-100 hover:text-blue-700 text-muted-foreground"
                                                title="Editar material"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </span>
                                        </MaterialFormModal>

                                        <DeleteMaterial materialId={material.id} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}