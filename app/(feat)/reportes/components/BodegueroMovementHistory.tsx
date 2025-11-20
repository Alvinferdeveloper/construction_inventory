import { getMovementHistory } from "@/app/lib/queries/reportes";
import MovementHistoryFilters from "./MovementHistoryFilters";
import { getMateriales } from "@/app/lib/queries/materiales";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Paginate from "@/app/(feat)/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { ExportToExcel } from "./ExportToExcel";
import prisma from "@/app/lib/prisma";

interface BodegueroMovementHistoryProps {
    userId: string;
    searchParams: {
        page?: string;
        dateFrom?: string;
        dateTo?: string;
        tipo?: string;
        bodegaId?: string;
        materialId?: string;
    }
}

export default async function BodegueroMovementHistory({ userId, searchParams }: BodegueroMovementHistoryProps) {
    // Fetch only the bodegas this user is responsible for
    const userBodegas = await prisma.bodega.findMany({
        where: { responsableId: userId, deletedAt: null },
        select: { id: true, nombre: true }
    });
    const userBodegaIds = userBodegas.map(b => b.id);
    
    const materials = await getMateriales();

    const page = Number(searchParams.page) || 1;
    const tipo = searchParams.tipo === 'entrada' ? 'entrada' : searchParams.tipo === 'salida' ? 'salida' : undefined;
    const bodegaId = searchParams.bodegaId ? Number(searchParams.bodegaId) : undefined;
    const materialId = searchParams.materialId ? Number(searchParams.materialId) : undefined;

    const { movements, totalPages } = await getMovementHistory({
        page,
        dateFrom: searchParams.dateFrom,
        dateTo: searchParams.dateTo,
        tipo,
        bodegaId,
        materialId,
        bodegaIds: userBodegaIds, // Pass the user's bodega IDs to scope the query
    });

    const formattedDataForExport = movements.map(mov => ({
        Fecha: new Date(mov.fecha).toLocaleString(),
        Tipo: mov.tipo,
        Material: mov.inventario.material.nombre,
        Bodega: mov.inventario.bodega.nombre,
        Cantidad: mov.cantidad,
        Usuario: mov.usuario.name,
        Observaciones: mov.observaciones,
    }));

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Historial de Movimientos de Mis Bodegas</h2>
                <ExportToExcel data={formattedDataForExport} fileName="reporte_movimientos_mis_bodegas" />
            </div>
            
            <MovementHistoryFilters bodegas={userBodegas} materials={materials} />

            <Card className="overflow-hidden border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Material</TableHead>
                            <TableHead>Bodega</TableHead>
                            <TableHead className="text-right">Cantidad</TableHead>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Observaciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movements.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-48 text-center">
                                    <p className="text-muted-foreground">No se encontraron movimientos para los filtros seleccionados.</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            movements.map((mov) => (
                                <TableRow key={mov.id}>
                                    <TableCell>{new Date(mov.fecha).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={mov.tipo === 'entrada' ? 'default' : 'destructive'}>{mov.tipo}</Badge>
                                    </TableCell>
                                    <TableCell>{mov.inventario.material.nombre}</TableCell>
                                    <TableCell>{mov.inventario.bodega.nombre}</TableCell>
                                    <TableCell className="text-right font-bold">{mov.cantidad}</TableCell>
                                    <TableCell>{mov.usuario.name}</TableCell>
                                    <TableCell>{mov.observaciones}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <Paginate totalPages={totalPages} />
        </div>
    );
}
