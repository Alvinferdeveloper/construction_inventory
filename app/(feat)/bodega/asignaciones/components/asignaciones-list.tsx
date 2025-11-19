"use client";

import type { DetalleRequisaForBodeguero } from '@/app/lib/queries/requisa';
import { useActionState } from 'react';
import { aprobarDetalle } from '@/app/lib/actions/requisas';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';

interface AsignacionesListProps {
  detalles: DetalleRequisaForBodeguero[];
  bodegueroId: string;
}


function AsignacionRow({ detalle, bodegueroId }: { detalle: DetalleRequisaForBodeguero, bodegueroId: string }) {
  const [state, action] = useActionState(aprobarDetalle, { message: null });

  return (
    <TableRow>
      <TableCell>
        <Badge variant="secondary">#{detalle.requisa.id}</Badge>
      </TableCell>
      <TableCell className="font-medium">{detalle.requisa.proyecto}</TableCell>
      <TableCell>{detalle.material.nombre}</TableCell>
      <TableCell>
        <span className="font-bold text-primary">{detalle.cantidad}</span> {detalle.material.unidad_medida}
      </TableCell>
      <TableCell>{detalle.requisa.solicitante.name}</TableCell>
      <TableCell>{new Date(detalle.requisa.fecha).toLocaleDateString()}</TableCell>
      <TableCell className="text-right">
        <div className="flex gap-2 justify-end">
          <form action={action}>
            <input type="hidden" name="detalleRequisaId" value={detalle.id} />
            <input type="hidden" name="bodegueroId" value={bodegueroId} />
            <Button type="submit" variant="outline" size="sm" className="gap-1 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700">
              <Check className="h-4 w-4" />
              Aprobar
            </Button>
          </form>
          <Button variant="outline" size="sm" className="gap-1 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700">
            <X className="h-4 w-4" />
            Rechazar
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default function AsignacionesList({ detalles, bodegueroId }: AsignacionesListProps) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Requisa ID</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead>Material</TableHead>
            <TableHead>Cantidad Asignada</TableHead>
            <TableHead>Solicitante</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {detalles.map((detalle) => (
            <AsignacionRow key={detalle.id} detalle={detalle} bodegueroId={bodegueroId} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
