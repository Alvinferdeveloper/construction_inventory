import { getRequisaById } from '@/app/lib/queries/requisa';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Package, Building, User, Calendar } from 'lucide-react';

interface DetalleRequisaPageProps {
  params: Promise<{
    id: string;
  }>;
}

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'aprobada':
    case 'en_proceso':
      return 'default';
    case 'completada':
      return 'outline';
    case 'rechazada':
      return 'destructive';
    case 'pendiente':
    default:
      return 'secondary';
  }
};

export default async function DetalleRequisaPage({ params: paramsPromise }: DetalleRequisaPageProps) {
  const params = await paramsPromise;
  console.log(`[DEBUG] Cargando detalle para requisa ID: ${params.id}`);
  const id = Number(params.id);
  if (isNaN(id)) {
    notFound();
  }

  const requisa = await getRequisaById(id);
  console.log('[DEBUG] Datos de la requisa obtenidos:', JSON.stringify(requisa, null, 2));

  if (!requisa) {
    notFound();
  }

  return (
    <div className="p-4 md:p-8">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Detalle de la Requisa #{requisa.id}</CardTitle>
              <CardDescription>Información completa de la solicitud de materiales.</CardDescription>
            </div>
            <Badge variant={getStatusVariant(requisa.estado)} className="capitalize text-lg px-4 py-1">
              {requisa.estado.replace('_', ' ')}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span><span className="font-semibold text-foreground">Proyecto:</span> {requisa.proyecto}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <span><span className="font-semibold text-foreground">Solicitante:</span> {requisa.solicitante.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span><span className="font-semibold text-foreground">Fecha:</span> {new Date(requisa.fecha).toLocaleDateString()}</span>
            </div>
          </div>

          <Separator />

          <h3 className="text-lg font-semibold my-4">Materiales Asignados</h3>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Bodega Asignada</TableHead>
                  <TableHead>Descripción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requisa.detalles.map((detalle) => (
                  <TableRow key={detalle.id}>
                    <TableCell className="font-medium">{detalle.material.nombre}</TableCell>
                    <TableCell>{detalle.cantidad} {detalle.material.unidad_medida}</TableCell>
                    <TableCell>
                      {detalle.bodega ? (
                        <Badge variant="outline">{detalle.bodega.nombre}</Badge>
                      ) : (
                        <Badge variant="destructive">Sin asignar</Badge>
                      )}
                    </TableCell>
                    <TableCell>{detalle.descripcion || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
