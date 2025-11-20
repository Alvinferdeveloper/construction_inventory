import { getRequisitionDetailsForBodeguero } from "@/app/lib/queries/reportes";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Paginate from "@/app/(feat)/components/shared/Pagination";
import { Badge } from "@/components/ui/badge";
import { ExportToExcel } from "./ExportToExcel";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DetalleRequisaEstado } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface BodegueroRequisitionReportProps {
    userId: string;
    searchParams: {
        page?: string;
        estado?: string;
    }
}

export default async function BodegueroRequisitionReport({ userId, searchParams }: BodegueroRequisitionReportProps) {

    const page = Number(searchParams.page) || 1;
    const estado = searchParams.estado as DetalleRequisaEstado | undefined;

    const { details, totalPages } = await getRequisitionDetailsForBodeguero({
        page,
        userId,
        estado,
    });

    const formattedDataForExport = details.map(d => ({
        "ID Detalle": d.id,
        Proyecto: d.requisa.proyecto,
        Solicitante: d.requisa.solicitante.name,
        Material: d.material.nombre,
        Cantidad: d.cantidad,
        Estado: d.estado,
    }));

    const getStatusVariant = (status: DetalleRequisaEstado) => {
        switch (status) {
            case 'aprobado': return 'secondary';
            case 'rechazado': return 'destructive';
            case 'pendiente': return 'default';
            default: return 'secondary';
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Reporte de Solicitudes Asignadas</h2>
                <ExportToExcel data={formattedDataForExport} fileName={`reporte_solicitudes_${estado || 'todas'}`} />
            </div>

            <Card className="p-4 mb-6">
                <div className="flex items-center gap-4">
                    <p className="text-sm font-medium">Filtrar por estado:</p>
                    <div className="flex gap-2">
                        <Button asChild variant={!estado ? 'default' : 'outline'} size="sm">
                            <Link href="/reportes?report=my_requisitions">Todas</Link>
                        </Button>
                        <Button asChild variant={estado === 'pendiente' ? 'default' : 'outline'} size="sm">
                            <Link href="/reportes?report=my_requisitions&estado=pendiente">Pendiente</Link>
                        </Button>
                        <Button asChild variant={estado === 'aprobado' ? 'default' : 'outline'} size="sm">
                            <Link href="/reportes?report=my_requisitions&estado=aprobado">Aprobado</Link>
                        </Button>
                        <Button asChild variant={estado === 'rechazado' ? 'default' : 'outline'} size="sm">
                            <Link href="/reportes?report=my_requisitions&estado=rechazado">Rechazado</Link>
                        </Button>
                    </div>
                </div>
            </Card>

            <Card className="overflow-hidden border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Proyecto</TableHead>
                            <TableHead>Solicitante</TableHead>
                            <TableHead>Material</TableHead>
                            <TableHead className="text-right">Cantidad</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {details.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-48 text-center">
                                    <p className="text-muted-foreground">No se encontraron solicitudes para los filtros seleccionados.</p>
                                </TableCell>
                            </TableRow>
                        ) : (
                            details.map((d) => (
                                <TableRow key={d.id}>
                                    <TableCell>{d.requisa.proyecto}</TableCell>
                                    <TableCell>{d.requisa.solicitante.name}</TableCell>
                                    <TableCell>{d.material.nombre}</TableCell>
                                    <TableCell className="text-right font-bold">{d.cantidad}</TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusVariant(d.estado)}>{d.estado}</Badge>
                                    </TableCell>
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
