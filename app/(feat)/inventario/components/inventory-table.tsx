import { getInventoryByBodega } from "@/app/lib/queries/inventario";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PackageSearch, Warehouse } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { FileText } from 'lucide-react';
import React from "react";

interface InventoryTableProps {
    bodegaId?: number;
}

export default async function InventoryTable({ bodegaId }: InventoryTableProps) {
    if (!bodegaId || isNaN(bodegaId)) {
        return (
            <Card className="flex flex-col items-center justify-center py-16 border-dashed bg-linear-to-b from-background to-muted/30">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                    <Warehouse className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Selecciona una bodega</h2>
                <p className="text-muted-foreground text-center max-w-xs">Elige una bodega para ver su inventario.</p>
            </Card>
        );
    }

    const inventory = await getInventoryByBodega(bodegaId);

    // Group inventory by category
    const groupedInventory = inventory.reduce((acc, item) => {
        const categoryName = item.material.categoria.nombre;
        if (!acc[categoryName]) {
            acc[categoryName] = [];
        }
        acc[categoryName].push(item);
        return acc;
    }, {} as Record<string, typeof inventory>);


    return (
        <Card className="overflow-hidden border border-border shadow-sm">
            {Object.keys(groupedInventory).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 bg-linear-to-b from-background to-muted/20">
                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                        <PackageSearch className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2 text-center">No hay materiales</h2>
                    <p className="text-muted-foreground text-center max-w-sm">Aún no se han registrado materiales en el inventario de esta bodega.</p>
                </div>
            ) : (
                <Table>
                    {Object.entries(groupedInventory).map(([category, items]) => (
                        <React.Fragment key={category}>
                            <TableHeader>
                                <TableRow className="bg-linear-to-r from-primary/5 to-primary/0 border-b-2 border-primary/20 hover:bg-linear-to-r hover:from-primary/10 hover:to-primary/5">
                                    <TableHead colSpan={4} className="font-bold text-primary text-base py-4">
                                        {category}
                                    </TableHead>
                                </TableRow>
                                <TableRow className="border-b border-border bg-muted hover:bg-muted">
                                    <TableHead className="font-semibold text-foreground">Material</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Stock Actual</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Stock Mín.</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Stock Máx.</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => {
                                    const isBelowMin = item.stock_actual < item.minStock;
                                    const isAboveMax = item.maxStock !== null && item.stock_actual > item.maxStock;
                                    let stockColor = "text-foreground";
                                    if (isBelowMin) stockColor = "text-red-500";
                                    if (isAboveMax) stockColor = "text-amber-500";

                                    return (
                                        <TableRow key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                            <TableCell className="font-medium text-foreground">{item.material.nombre}</TableCell>
                                            <TableCell className={`text-foreground font-bold text-right ${stockColor}`}>{item.stock_actual}</TableCell>
                                            <TableCell className="text-muted-foreground text-right">{item.minStock}</TableCell>
                                            <TableCell className="text-muted-foreground text-right">{item.maxStock ?? 'N/A'}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 cursor-pointer w-8 p-0 hover:bg-blue-100 hover:text-blue-700 text-muted-foreground"
                                                        title="Generar Requisa"
                                                    >
                                                        <FileText className="w-4 h-4" />
                                                    </Button>
                                                    {/* Placeholder for future actions */}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </React.Fragment>
                    ))}
                </Table>
            )}
        </Card>
    );
}
