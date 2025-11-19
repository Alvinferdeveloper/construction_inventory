"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface WarehouseSelectorProps {
    bodegas: { id: number; nombre: string }[];
    selectedBodegaId?: string;
}

export default function WarehouseSelector({ bodegas, selectedBodegaId }: WarehouseSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleValueChange = (bodegaId: string) => {
        const params = new URLSearchParams(searchParams);
        if (bodegaId) {
            params.set('bodegaId', bodegaId);
        } else {
            params.delete('bodegaId');
        }
        router.replace(`/inventario?${params.toString()}`);
    };

    return (
        <div className="max-w-xs">
            <Select onValueChange={handleValueChange} defaultValue={selectedBodegaId && !isNaN(Number(selectedBodegaId)) ? selectedBodegaId : ""}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una bodega" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    {bodegas.map((bodega) => (
                        <SelectItem key={bodega.id} value={String(bodega.id)}>
                            {bodega.nombre}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}
