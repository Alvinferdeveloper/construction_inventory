"use client";

import type { RequisaWithDetails } from '@/app/lib/queries/requisa';
import RequisaFormModal from './requisa-form-modal';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useActionState } from 'react';
import { deleteRequisa, updateRequisa } from '@/app/lib/actions/requisas';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { Eye, Pencil, Trash2 } from 'lucide-react';

interface RequisaCardProps {
  requisa: RequisaWithDetails;
  materiales: { id: number; nombre: string; stockTotal: number; }[];
}

const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case 'aprobada':
      return 'default';
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

export default function RequisaCard({ requisa, materiales }: RequisaCardProps) {
  const [deleteState, deleteAction] = useActionState(deleteRequisa, { message: null });
  const totalMateriales = requisa.detalles.length;

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-bold">{requisa.proyecto}</CardTitle>
            <CardDescription>Requisa #{requisa.id}</CardDescription>
          </div>
          <Badge variant={getStatusVariant(requisa.estado)} className="capitalize">
            {requisa.estado.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground pt-2">
          Solicitado por {requisa.solicitante.name} el {new Date(requisa.fecha).toLocaleDateString()}
        </p>
      </CardHeader>
      <CardContent className="grow">
        <Separator className="mb-4" />
        <h4 className="text-sm font-semibold mb-2">Materiales Solicitados ({totalMateriales})</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {requisa.detalles.slice(0, 3).map((detalle) => (
            <li key={detalle.id} className="flex justify-between">
              <span>{detalle.material.nombre}</span>
              <span className="font-medium">x{detalle.cantidad}</span>
            </li>
          ))}
          {totalMateriales > 3 && (
            <li className="text-xs text-center">+ {totalMateriales - 3} más...</li>
          )}
        </ul>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3">
        <div className="flex w-full justify-end gap-2">
          <Link href={`/requisas/${requisa.id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              Ver
            </Button>
          </Link>
          {requisa.estado === 'pendiente' && (
            <>
              <RequisaFormModal
                requisaToEdit={requisa}
                action={updateRequisa}
                materiales={materiales}
                title="Editar Solicitud"
                description={`Editando la solicitud #${requisa.id} para el proyecto ${requisa.proyecto}.`}
                submitText="Guardar Cambios"
              >
                <Button variant="ghost" size="sm" className="gap-1">
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
              </RequisaFormModal>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 gap-1">
                    <Trash2 className="h-4 w-4" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará la requisa #{requisa.id} ({requisa.proyecto}).
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <form action={deleteAction}>
                      <input type="hidden" name="requisaId" value={requisa.id} />
                      <AlertDialogAction type="submit" className="bg-red-500 hover:bg-red-600 text-white">
                        Sí, eliminar
                      </AlertDialogAction>
                    </form>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
