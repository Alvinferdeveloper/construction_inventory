import { getAllBodegas } from "@/app/lib/queries/bodegas"; // Assuming this gives enough detail
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExportToExcel } from "./ExportToExcel";
import prisma from "@/app/lib/prisma";

export default async function BodegaReport() {
    // A more detailed query is needed for the report
    const bodegas = await prisma.bodega.findMany({
        where: { deletedAt: null },
        include: { responsable: { select: { name: true, email: true } } }
    });

    const formattedDataForExport = bodegas.map(bodega => ({
        ID: bodega.id,
        Nombre: bodega.nombre,
        Ubicación: bodega.ubicacion,
        Responsable: bodega.responsable.name,
        "Email Responsable": bodega.responsable.email,
    }));

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Reporte de Bodegas</h2>
                <ExportToExcel data={formattedDataForExport} fileName="reporte_bodegas" />
            </div>
            <Card className="overflow-hidden border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Ubicación</TableHead>
                            <TableHead>Responsable</TableHead>
                            <TableHead>Email Responsable</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {bodegas.map((bodega) => (
                            <TableRow key={bodega.id}>
                                <TableCell>{bodega.nombre}</TableCell>
                                <TableCell>{bodega.ubicacion}</TableCell>
                                <TableCell>{bodega.responsable.name}</TableCell>
                                <TableCell>{bodega.responsable.email}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
