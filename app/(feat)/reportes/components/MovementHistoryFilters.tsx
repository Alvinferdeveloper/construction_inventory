"use client"

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/app/(feat)/components/shared/date-picker";
import { MovimientoTipo } from "@prisma/client";
import { X } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MovementHistoryFiltersProps {
    bodegas: { id: number; nombre: string }[];
    materials: { id: number; nombre: string }[];
}

export default function MovementHistoryFilters({ bodegas, materials }: MovementHistoryFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Initialize state from search params
    const [dateFrom, setDateFrom] = useState<Date | undefined>(searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined);
    const [dateTo, setDateTo] = useState<Date | undefined>(searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined);
    const [tipo, setTipo] = useState<string>(searchParams.get('tipo') || '');
    const [bodegaId, setBodegaId] = useState<string>(searchParams.get('bodegaId') || '');
    const [materialId, setMaterialId] = useState<string>(searchParams.get('materialId') || '');

    const handleGenerateReport = () => {
        const params = new URLSearchParams(searchParams);
        params.set('report', 'movement_history');
        if (dateFrom) params.set('dateFrom', dateFrom.toISOString()); else params.delete('dateFrom');
        if (dateTo) params.set('dateTo', dateTo.toISOString()); else params.delete('dateTo');
        if (tipo) params.set('tipo', tipo); else params.delete('tipo');
        if (bodegaId) params.set('bodegaId', bodegaId); else params.delete('bodegaId');
        if (materialId) params.set('materialId', materialId); else params.delete('materialId');
        router.push(`/reportes?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setDateFrom(undefined);
        setDateTo(undefined);
        setTipo('');
        setBodegaId('');
        setMaterialId('');
        router.push('/reportes?report=movement_history');
    }

    return (
        <Card className="p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <DatePicker date={dateFrom} setDate={setDateFrom} placeholder="Desde" />
                <DatePicker date={dateTo} setDate={setDateTo} placeholder="Hasta" />
                <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger><SelectValue placeholder="Tipo de Mov." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value={MovimientoTipo.entrada}>Entrada</SelectItem>
                        <SelectItem value={MovimientoTipo.salida}>Salida</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={bodegaId} onValueChange={setBodegaId}>
                    <SelectTrigger><SelectValue placeholder="Bodega" /></SelectTrigger>
                    <SelectContent>
                        {bodegas.map(b => <SelectItem key={b.id} value={String(b.id)}>{b.nombre}</SelectItem>)}
                    </SelectContent>
                </Select>
                <Select value={materialId} onValueChange={setMaterialId}>
                    <SelectTrigger><SelectValue placeholder="Material" /></SelectTrigger>
                    <SelectContent>
                        {materials.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.nombre}</SelectItem>)}
                    </SelectContent>
                </Select>
                <div className="flex gap-2">
                    <Button onClick={handleGenerateReport} className="w-full">Generar</Button>
                    <Button onClick={handleClearFilters} variant="ghost" size="icon" title="Limpiar filtros">
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}
