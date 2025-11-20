import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Boxes } from "lucide-react";
import GeneralInventoryTable from "../inventario/components/general-inventory-table";
import { Suspense } from "react";
import { TableSkeleton } from "../components/shared/table-skeleton";
import { ROLES } from "@/app/lib/constants/roles";

export default async function DisponibilidadPage() {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;

    if (!user || user.rol !== ROLES.SUPERVISOR) {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Boxes className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Consultar Disponibilidad de Materiales</h1>
                            <p className="text-muted-foreground text-sm">Verifica el stock total de materiales disponibles en todas las bodegas activas.</p>
                        </div>
                    </div>
                </div>

                <Suspense fallback={<TableSkeleton columns={5} />}>
                    <GeneralInventoryTable />
                </Suspense>
            </div>
        </div>
    );
}
