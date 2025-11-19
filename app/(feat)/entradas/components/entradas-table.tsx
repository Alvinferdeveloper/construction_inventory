import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { PackageSearch } from "lucide-react";
import { getEntradas } from "@/app/lib/queries/entradas";

type EntradasPromise = ReturnType<typeof getEntradas>;
type Entradas = EntradasPromise extends Promise<{ data: infer T }> ? T : never;

interface EntradasTableProps {
    entradas: Entradas;
}

export default function EntradasTable({ entradas }: EntradasTableProps) {
    if (entradas.length === 0) {
        return (
            <Card className="flex flex-col items-center justify-center h-96 border-dashed">
                <PackageSearch className="w-16 h-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold text-foreground">No hay entradas registradas</h2>
                <p className="text-muted-foreground">No se han registrado entradas de material que coincidan con tu búsqueda.</p>
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
                    {entradas.map(entrada => (
                        <TableRow key={entrada.id}>
                            <TableCell>{new Date(entrada.fecha).toLocaleString()}</TableCell>
                            <TableCell className="font-medium">{entrada.inventario.material.nombre}</TableCell>
                            <TableCell>{entrada.inventario.bodega.nombre}</TableCell>
                            <TableCell className="font-bold text-green-600">+{entrada.cantidad}</TableCell>
                            <TableCell>{entrada.usuario.name}</TableCell>
                            <TableCell className="text-muted-foreground">{entrada.observaciones || 'N/A'}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
}