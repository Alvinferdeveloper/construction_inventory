import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { PackageSearch } from "lucide-react";
import { getSalidas } from "@/app/lib/queries/salidas";

type SalidasPromise = ReturnType<typeof getSalidas>;
type Salidas = SalidasPromise extends Promise<{ data: infer T }> ? T : never;

interface SalidasTableProps {
    salidas: Salidas;
}

export default function SalidasTable({ salidas }: SalidasTableProps) {
    if (salidas.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center h-96 border-dashed">
                <PackageSearch className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-foreground">No hay salidas registradas</h2>
                <p className="text-muted-foreground">No se han registrado salidas de material que coincidan con tu búsqueda.</p>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden border border-border">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50">
                        <TableHead>Fecha</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Bodega</TableHead>
                        <TableHead>Cantidad</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Observaciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {salidas.map(salida => (
                        <TableRow key={salida.id}>
                            <TableCell>{new Date(salida.fecha).toLocaleString()}</TableCell>
                            <TableCell className="font-medium">{salida.inventario.material.nombre}</TableCell>
                            <TableCell>{salida.inventario.bodega.nombre}</TableCell>
                            <TableCell className="font-bold text-destructive">-{salida.cantidad}</TableCell>
                            <TableCell>{salida.usuario.name}</TableCell>
                            <TableCell className="text-muted-foreground">{salida.observaciones || 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}