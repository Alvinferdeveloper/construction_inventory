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
                                <TableRow className="border-b border-border bg-muted/60 hover:bg-muted/60">
                                    <TableHead className="font-semibold text-foreground py-3">Material</TableHead>
                                    <TableHead className="font-semibold text-foreground py-3">Unidad</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right py-3">Stock Actual</TableHead>
                                    <TableHead className="font-semibold text-foreground text-right py-3">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id} className="border-b border-border/50 hover:bg-primary/5 transition-colors duration-150">
                                        <TableCell className="font-medium text-foreground py-3.5">{item.material.nombre}</TableCell>
                                        <TableCell className="text-muted-foreground py-3.5">{item.material.unidad_medida}</TableCell>
                                        <TableCell className="text-foreground font-semibold text-right py-3.5">
                                            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                                {item.stock_actual}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right py-3.5">
                                            <div className="flex justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-9 cursor-pointer hover:bg-blue-500/10 hover:text-blue-500 px-3 text-muted-foreground transition-colors duration-150"
                                                    title="Generar Requisa"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </React.Fragment>
                    ))}
                </Table>
            )}
        </Card>
    );
}
