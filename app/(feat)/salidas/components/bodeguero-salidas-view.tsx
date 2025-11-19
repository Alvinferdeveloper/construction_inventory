import { getSalidasForBodeguero } from "@/app/lib/queries/salidas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PackageSearch, Warehouse } from "lucide-react";

interface BodegueroSalidasViewProps {
    userId: string;
}

export default async function BodegueroSalidasView({ userId }: BodegueroSalidasViewProps) {
    const salidas = await getSalidasForBodeguero(userId);

    const groupedSalidas = salidas.reduce((acc, salida) => {
        const bodegaName = salida.inventario.bodega.nombre;
        if (!acc[bodegaName]) {
            acc[bodegaName] = [];
        }
        acc[bodegaName].push(salida);
        return acc;
    }, {} as Record<string, typeof salidas>);

    if (Object.keys(groupedSalidas).length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center h-96 border-dashed">
                <PackageSearch className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-foreground">No hay salidas en tus bodegas</h2>
                <p className="text-muted-foreground">No se han registrado salidas de material en las bodegas que gestionas.</p>
            </Card>
        );
    }

    return (
        <div className="space-y-8">
            {Object.entries(groupedSalidas).map(([bodegaName, salidas]) => (
                <Card key={bodegaName}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Warehouse className="w-6 h-6 text-primary" />
                            {bodegaName}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Material</TableHead>
                                    <TableHead>Cantidad</TableHead>
                                    <TableHead>Observaciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {salidas.map(salida => (
                                    <TableRow key={salida.id}>
                                        <TableCell>{new Date(salida.fecha).toLocaleString()}</TableCell>
                                        <TableCell className="font-medium">{salida.inventario.material.nombre}</TableCell>
                                        <TableCell className="font-bold text-destructive">-{salida.cantidad}</TableCell>
                                        <TableCell className="text-muted-foreground">{salida.observaciones || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
