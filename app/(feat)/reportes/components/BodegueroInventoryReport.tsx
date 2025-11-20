import { getInventoryForBodeguero } from "@/app/lib/queries/inventario";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Warehouse, PackageSearch } from "lucide-react";
import { ExportToExcel } from "./ExportToExcel";

interface BodegueroInventoryReportProps {
    userId: string;
}

export default async function BodegueroInventoryReport({ userId }: BodegueroInventoryReportProps) {
    const bodegas = await getInventoryForBodeguero(userId);

    const formattedDataForExport = bodegas.flatMap(bodega => 
        bodega.inventario.map(item => ({
            Bodega: bodega.nombre,
            Material: item.material.nombre,
            Categoría: item.material.categoria.nombre,
            "Unidad de Medida": item.material.unidad_medida,
            "Stock Actual": item.stock_actual,
            "Stock Mínimo": item.minStock,
        }))
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Reporte de Inventario Actual</h2>
                <ExportToExcel data={formattedDataForExport} fileName="reporte_inventario_actual" />
            </div>

            <div className="space-y-8">
                {bodegas.map(bodega => (
                    <Card key={bodega.id}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Warehouse className="w-6 h-6 text-primary" />
                                {bodega.nombre}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {bodega.inventario.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <PackageSearch className="w-12 h-12 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">Esta bodega no tiene materiales registrados.</p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Material</TableHead>
                                            <TableHead>Categoría</TableHead>
                                            <TableHead>Unidad</TableHead>
                                            <TableHead className="text-right">Stock Actual</TableHead>
                                            <TableHead className="text-right">Stock Mínimo</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {bodega.inventario.map(item => (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">{item.material.nombre}</TableCell>
                                                <TableCell>{item.material.categoria.nombre}</TableCell>
                                                <TableCell>{item.material.unidad_medida}</TableCell>
                                                <TableCell className="font-bold text-right">{item.stock_actual}</TableCell>
                                                <TableCell className="text-right">{item.minStock}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
