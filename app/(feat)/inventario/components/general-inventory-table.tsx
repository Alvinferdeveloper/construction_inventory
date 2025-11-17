import { getGeneralInventory } from "@/app/lib/queries/inventario";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import { PackageSearch, TrendingUp } from 'lucide-react';

export default async function GeneralInventoryTable() {
    const materials = await getGeneralInventory();

    // Process data to aggregate stock
    const processedMaterials = materials.map(material => {
        const totalStock = material.inventario.reduce((sum, inv) => sum + inv.stock_actual, 0);
        const stockDistribution = material.inventario
            .filter(inv => inv.stock_actual > 0)
            .map(inv => `${inv.bodega.nombre}: ${inv.stock_actual}`)
            .join(', ');

        return {
            ...material,
            totalStock,
            stockDistribution: stockDistribution || "Sin stock",
        };
    });

    return (
        <Card className="overflow-hidden border border-border/50 shadow-sm">
            {processedMaterials.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 gap-3">
                    <div className="p-3 bg-muted rounded-full">
                        <PackageSearch className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-lg font-semibold text-foreground">No hay materiales registrados</h2>
                        <p className="text-sm text-muted-foreground mt-1">Aún no se han agregado materiales al sistema.</p>
                    </div>
                </div>
            ) : (
                <Table>
                    <TableHeader>
                        <TableRow className="border-b border-border/50 bg-muted/40 hover:bg-muted/40">
                            <TableHead className="font-semibold text-foreground text-sm">Material</TableHead>
                            <TableHead className="font-semibold text-foreground text-sm">Categoría</TableHead>
                            <TableHead className="font-semibold text-foreground text-sm">Unidad</TableHead>
                            <TableHead className="font-semibold text-foreground text-sm text-right">Stock Total</TableHead>
                            <TableHead className="font-semibold text-foreground text-sm">Distribución</TableHead>
                            <TableHead className="font-semibold text-foreground text-sm text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {processedMaterials.map((material) => (
                            <TableRow
                                key={material.id}
                                className="border-b border-border/30 hover:bg-muted/30 transition-colors duration-200"
                            >
                                <TableCell className="font-medium text-foreground py-4">
                                    {material.nombre}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm py-4">
                                    {material.categoria.nombre}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm py-4">
                                    {material.unidad_medida}
                                </TableCell>
                                <TableCell className="py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-semibold text-sm">
                                            {material.totalStock}
                                        </span>
                                        {material.totalStock > 0 && (
                                            <TrendingUp className="w-4 h-4 text-primary" />
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground text-xs py-4 max-w-xs">
                                    <div className="line-clamp-2">{material.stockDistribution}</div>
                                </TableCell>
                                <TableCell className="text-right py-4">
                                    <div className="flex justify-end">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 cursor-pointer hover:bg-blue-500/10 hover:text-blue-500 text-muted-foreground transition-colors duration-150"
                                            title="Generar Requisa"
                                        >
                                            <FileText className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </Card>
    );
}
