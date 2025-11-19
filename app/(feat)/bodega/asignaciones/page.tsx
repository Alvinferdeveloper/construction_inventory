import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/app/lib/auth';
import { getDetallesForBodeguero } from '@/app/lib/queries/requisa';

import { ClipboardList } from 'lucide-react';

import AsignacionesList from './components/asignaciones-list';

export default async function AsignacionesPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id || session.user.rol !== 'BODEGUERO') {
    // Si no es bodeguero, o no hay sesión, redirigir
    redirect('/');
  }

  const detallesAsignados = await getDetallesForBodeguero();

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mis Asignaciones Pendientes</h1>
            <p className="text-muted-foreground text-sm">Materiales que debes aprobar y despachar.</p>
          </div>
        </div>
      </div>

      {/* Aquí irá la lista de asignaciones. Por ahora, un placeholder. */}
      {detallesAsignados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
          <h3 className="mt-4 text-lg font-semibold text-foreground">No tienes asignaciones pendientes</h3>
          <p className="mt-2 text-sm text-muted-foreground">Cuando un supervisor solicite materiales de tus bodegas, aparecerán aquí.</p>
        </div>
      ) : (
        <AsignacionesList detalles={detallesAsignados} bodegueroId={session.user.id} />
      )}
    </div>
  );
}
