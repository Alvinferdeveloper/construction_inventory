import { getLowStockMaterials } from "@/app/lib/queries/reportes";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle } from "lucide-react";
import { ExportToExcel } from "./ExportToExcel";

export default async function LowStockReport() {
    const items = await getLowStockMaterials();

    // Flatten data for export
    const formattedDataForExport = items.map(item => ({
        Bodega: item.bodega.nombre,
        Material: item.material.nombre,
        Unidad: item.material.unidad_medida,
        "Stock Mínimo": item.minStock,
        "Stock Actual": item.stock_actual,
    }));

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Reporte de Stock Bajo</h2>
                <ExportToExcel data={formattedDataForExport} fileName="reporte_stock_bajo" />
            </div>
            <Card className="overflow-hidden border border-border">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border bg-muted hover:bg-muted">
                            <TableHead className="font-semibold text-foreground">Bodega</TableHead>
                            <TableHead className="font-semibold text-foreground">Material</TableHead>
                            <TableHead className="font-semibold text-foreground">Unidad</TableHead>
                            <TableHead className="font-semibold text-foreground text-right">Stock Mínimo</TableHead>
                            <TableHead className="font-semibold text-foreground text-right">Stock Actual</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <p className="text-muted-foreground">No hay materiales con stock bajo en este momento.</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            items.map((item) => (
                                <TableRow key={item.id} className="border-b border-border hover:bg-muted/50">
                                    <TableCell className="font-medium text-foreground">{item.bodega.nombre}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.material.nombre}</TableCell>
                                    <TableCell className="text-muted-foreground">{item.material.unidad_medida}</TableCell>
                                    <TableCell className="text-foreground text-right">{item.minStock}</TableCell>
                                    <TableCell className="font-bold text-red-600 text-right flex items-center justify-end gap-2">
                                        <AlertCircle className="w-4 h-4" />
                                        {item.stock_actual}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
