"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/app/(feat)/components/shared/date-picker";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface HistoryFiltersProps {
    materials: { id: number; nombre: string }[];
}

export default function HistoryFilters({ materials }: HistoryFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [dateFrom, setDateFrom] = useState<Date | undefined>(searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined);
    const [dateTo, setDateTo] = useState<Date | undefined>(searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined);
    const [materialId, setMaterialId] = useState<string>(searchParams.get('materialId') || '');

    const handleApplyFilters = () => {
        const params = new URLSearchParams(searchParams);
        if (dateFrom) params.set('dateFrom', dateFrom.toISOString()); else params.delete('dateFrom');
        if (dateTo) params.set('dateTo', dateTo.toISOString()); else params.delete('dateTo');
        if (materialId) params.set('materialId', materialId); else params.delete('materialId');
        params.set('page', '1'); // Reset to first page on new filter
        router.push(`/historial-materiales?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setDateFrom(undefined);
        setDateTo(undefined);
        setMaterialId('');
        router.push('/historial-materiales');
    }

    return (
        <Card className="p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <DatePicker date={dateFrom} setDate={setDateFrom} placeholder="Desde" />
                <DatePicker date={dateTo} setDate={setDateTo} placeholder="Hasta" />
                <Select value={materialId} onValueChange={setMaterialId}>
                    <SelectTrigger><SelectValue placeholder="Filtrar por material..." /></SelectTrigger>
                    <SelectContent>
                        {materials.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nombre}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Button onClick={handleApplyFilters} className="w-full">Aplicar Filtros</Button>
                <Button onClick={handleClearFilters} variant="ghost" className="w-full">
                    <X className="w-4 h-4 mr-2" />
                    Limpiar
                </Button>
            </div>
        </Card>
    );
}
