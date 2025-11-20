"use client"

import { useState, useTransition, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getBodegaDeleteInfo, softDeleteBodega, transferAndDeleteBodega } from "@/app/lib/actions/bodegas";
import { Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
interface DeleteBodegaFlowModalProps {
    bodegaId: number;
    bodegaNombre: string;
    children: ReactNode;
}

type DeleteInfo = Awaited<ReturnType<typeof getBodegaDeleteInfo>>;

export function DeleteBodegaFlowModal({ bodegaId, bodegaNombre, children }: DeleteBodegaFlowModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isChecking, startCheckingTransition] = useTransition();
    const [deleteInfo, setDeleteInfo] = useState<DeleteInfo | null>(null);
    const [destinationBodegaId, setDestinationBodegaId] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleOpen = async (isOpen: boolean) => {
        setOpen(isOpen);
        if (isOpen) {
            startCheckingTransition(async () => {
                const info = await getBodegaDeleteInfo(bodegaId);
                setDeleteInfo(info);
            });
        } else {
            setDeleteInfo(null);
            setDestinationBodegaId("");
            setError(null);
        }
    };

    const handleDelete = () => {
        startTransition(async () => {
            const result = await softDeleteBodega(bodegaId);
            if (result.success) {
                toast(result.message);
                handleOpen(false);
            } else {
                setError(result.message || "Ocurrió un error.");
            }
        });
    };

    const handleTransferAndDelete = () => {
        if (!destinationBodegaId) {
            setError("Debes seleccionar una bodega de destino.");
            return;
        }
        setError(null);
        startTransition(async () => {
            const result = await transferAndDeleteBodega(bodegaId, Number(destinationBodegaId));
            if (result.success) {
                toast(result.message);
                handleOpen(false);
            } else {
                setError(result.message || "Ocurrió un error en la transferencia.");
            }
        });
    };

    const isLoading = isPending || isChecking;

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar Bodega: {bodegaNombre}</DialogTitle>
                    <DialogDescription>
                        {deleteInfo?.hasStock
                            ? "Esta bodega tiene inventario y no puede ser eliminada directamente."
                            : "Confirmación para eliminar esta bodega."}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : deleteInfo?.hasStock ? (
                    // Transfer View
                    <div className="space-y-4 py-4">
                        <div className="flex items-start p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                            <p className="text-sm text-yellow-800">
                                Para eliminar <strong>{bodegaNombre}</strong>, primero debes transferir todo su inventario a otra bodega.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <label className="font-medium text-sm">Selecciona la bodega de destino:</label>
                            <Select onValueChange={setDestinationBodegaId} value={destinationBodegaId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Elegir bodega..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {deleteInfo.transferOptions.map(bodega => (
                                        <SelectItem key={bodega.id} value={String(bodega.id)}>
                                            {bodega.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => handleOpen(false)}>Cancelar</Button>
                            <Button onClick={handleTransferAndDelete} disabled={!destinationBodegaId}>
                                <ArrowRight className="w-4 h-4 mr-2" />
                                Transferir y Eliminar
                            </Button>
                        </div>
                    </div>
                ) : (
                    // Simple Delete View
                    <div className="py-4">
                        <p>¿Estás seguro que deseas eliminar la bodega <strong>{bodegaNombre}</strong>? Esta acción no se puede deshacer.</p>
                        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}
                        <div className="flex justify-end gap-2 pt-6">
                            <Button variant="outline" onClick={() => handleOpen(false)}>Cancelar</Button>
                            <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
