import { getMateriales } from "@/app/lib/queries/materiales";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExportToExcel } from "./ExportToExcel";

export default async function MaterialReport() {
    const materiales = await getMateriales();

    const formattedDataForExport = materiales.map(material => ({
        ID: material.id,
        Nombre: material.nombre,
        "Unidad de Medida": material.unidad_medida,
        Categoría: material.categoria.nombre,
    }));

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Reporte de Materiales</h2>
                <ExportToExcel data={formattedDataForExport} fileName="reporte_materiales" />
            </div>
            <Card className="overflow-hidden border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Unidad de Medida</TableHead>
                            <TableHead>Categoría</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {materiales.map((material) => (
                            <TableRow key={material.id}>
                                <TableCell>{material.nombre}</TableCell>
                                <TableCell>{material.unidad_medida}</TableCell>
                                <TableCell>{material.categoria.nombre}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
