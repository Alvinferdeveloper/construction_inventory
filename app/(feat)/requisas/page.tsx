import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/app/lib/auth';
import { getRequisasForSupervisor, getMaterialesWithStock } from '@/app/lib/queries/requisa';
import { createRequisa } from '@/app/lib/actions/requisas';

import { Plus, PackageSearch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import RequisaFormModal from './components/requisa-form-modal';
import RequisaList from './components/requisa-list';

export default async function RequisasPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect('/login');
  }

  const [requisas, materiales] = await Promise.all([
    getRequisasForSupervisor(),
    getMaterialesWithStock(),
  ]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <PackageSearch className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Mis Solicitudes</h1>
            <p className="text-muted-foreground text-sm">Crea y gestiona tus solicitudes de materiales.</p>
          </div>
        </div>
        <RequisaFormModal
          action={createRequisa}
          materiales={materiales}
          title="Nueva Solicitud"
          description="Crear una nueva solicitud de materiales."
          submitText="Crear Solicitud"
        >
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Nueva Solicitud
          </Button>
        </RequisaFormModal>
      </div>

      <RequisaList requisas={requisas} materiales={materiales} />
    </div>
  );
}
