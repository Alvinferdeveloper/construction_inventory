import { getInventoryForBodeguero } from "@/app/lib/queries/inventario";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LogIn, PackageSearch, Warehouse } from "lucide-react";

interface BodegueroInventoryViewProps {
    userId: string;
}

export default async function BodegueroInventoryView({ userId }: BodegueroInventoryViewProps) {
    const bodegas = await getInventoryForBodeguero(userId);

    if (bodegas.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center h-96 border-dashed">
                <Warehouse className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-foreground">No tienes bodegas asignadas</h2>
                <p className="text-muted-foreground">No eres responsable de ninguna bodega en este momento.</p>
            </Card>
        );
    }

    return (
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
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bodega.inventario.map(item => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-medium">{item.material.nombre}</TableCell>
                                            <TableCell>{item.material.categoria.nombre}</TableCell>
                                            <TableCell>{item.material.unidad_medida}</TableCell>
                                            <TableCell className="font-bold text-right">{item.stock_actual}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 cursor-pointer w-8 p-0 hover:bg-green-100 hover:text-green-700 text-muted-foreground"
                                                    title="Registrar Entrada"
                                                >
                                                    <LogIn className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
