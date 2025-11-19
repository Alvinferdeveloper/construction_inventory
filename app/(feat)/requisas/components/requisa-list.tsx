import type { RequisaWithDetails } from '@/app/lib/queries/requisa';
import RequisaCard from './requisa-card';
import { PackageSearch } from 'lucide-react';

interface RequisaListProps {
  requisas: RequisaWithDetails[];
  materiales: { id: number; nombre: string; stockTotal: number; }[];
}

export default function RequisaList({ requisas, materiales }: RequisaListProps) {
  console.log('DATOS RECIBIDOS EN REQUISA LIST:', JSON.stringify(requisas, null, 2));
  if (requisas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 p-12 text-center">
        <PackageSearch className="w-12 h-12 text-muted-foreground/80" />
        <h3 className="mt-4 text-lg font-semibold text-foreground">No has creado ninguna solicitud</h3>
        <p className="mt-2 text-sm text-muted-foreground">Haz clic en "Nueva Solicitud" para empezar.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {requisas.map((requisa) => (
        <RequisaCard key={requisa.id} requisa={requisa} materiales={materiales} />
      ))}
    </div>
  );
}
