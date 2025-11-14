import { Pencil, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import DeleteBodega from "@/app/(feat)/bodegas/components/buttons/DeleteBodega"
import { getBodegas } from "@/app/lib/queries/bodegas"
import { getBodegueros } from "@/app/lib/queries/bodegueros"
import { updateBodega } from "@/app/lib/actions/bodegas"
import BodegaFormModal from "@/app/(feat)/bodegas/components/bodega-form-modal"

interface BodegasTableProps {
    currentPage: number
}

export default async function BodegasTable({ currentPage }: BodegasTableProps) {
    const bodegas = await getBodegas(currentPage)
    const bodegueros = await getBodegueros()

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
                        <TableHead className="font-semibold text-foreground">Bodega</TableHead>
                        <TableHead className="font-semibold text-foreground">Ubicación</TableHead>
                        <TableHead className="font-semibold text-foreground">Responsable</TableHead>
                        <TableHead className="font-semibold text-foreground">Email</TableHead>
                        <TableHead className="text-right font-semibold text-foreground">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {bodegas.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <Package className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">No hay bodegas registradas</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        bodegas.map((bodega) => (
                            <TableRow key={bodega.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm ${getAvatarColor(bodega.nombre)}`}
                                        >
                                            {getInitials(bodega.nombre)}
                                        </div>
                                        <span className="font-medium text-foreground">{bodega.nombre}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-muted-foreground">{bodega.ubicacion}</TableCell>

                                <TableCell className="text-foreground">{bodega.responsable.name}</TableCell>

                                <TableCell className="text-muted-foreground text-sm">{bodega.responsable.email}</TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <BodegaFormModal
                                            bodegueros={bodegueros}
                                            action={updateBodega}
                                            title="Editar Bodega"
                                            description="Editar la bodega"
                                            submitText="Editar Bodega"
                                            initialData={{
                                                id: bodega.id,
                                                nombre: bodega.nombre,
                                                ubicacion: bodega.ubicacion,
                                                responsableId: bodega.responsable.id
                                            }}
                                        >
                                            <Button
                                                className="h-8  bg-transparent flex items-center justify-center rounded-md cursor-pointer w-8 p-0 hover:bg-blue-100 hover:text-blue-700 text-muted-foreground"
                                                title="Editar bodega"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </Button>
                                        </BodegaFormModal>

                                        <DeleteBodega bodegaId={bodega.id} />
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
