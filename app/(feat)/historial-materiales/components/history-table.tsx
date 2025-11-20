import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type getReceivedMaterialsHistory } from "@/app/lib/queries/historial";
import { Package } from "lucide-react";

interface HistoryTableProps {
    history: Awaited<ReturnType<typeof getReceivedMaterialsHistory>>;
}

export default function HistoryTable({ history }: HistoryTableProps) {
    return (
        <Card className="overflow-hidden border border-border">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border bg-muted hover:bg-muted">
                        <TableHead className="font-semibold text-foreground">Proyecto</TableHead>
                        <TableHead className="font-semibold text-foreground">Material</TableHead>
                        <TableHead className="font-semibold text-foreground text-right">Cantidad</TableHead>
                        <TableHead className="font-semibold text-foreground">Bodega de Origen</TableHead>
                        <TableHead className="font-semibold text-foreground">Fecha de Aprobación</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-48 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <Package className="w-10 h-10 text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No tienes materiales recibidos en tu historial.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        history.map((item) => (
                            <TableRow key={item.id} className="border-b border-border hover:bg-muted/50">
                                <TableCell className="font-medium text-foreground">
                                    {item.requisa.proyecto}
                                    <span className="block text-xs text-muted-foreground">ID Requisa: {item.requisa.id}</span>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{item.material.nombre}</TableCell>
                                <TableCell className="font-bold text-foreground text-right">{item.cantidad}</TableCell>
                                <TableCell className="text-muted-foreground">{item.bodega?.nombre || 'N/A'}</TableCell>
                                <TableCell className="text-muted-foreground">{new Date(item.movimiento?.fecha || '').toLocaleDateString()}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    );
}
