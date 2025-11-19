import { ROLES } from "@/app/lib/constants/roles";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/(feat)/components/shared/table-skeleton";
import { ArrowRightLeft } from "lucide-react";
import SalidasTable from "@/app/(feat)/salidas/components/salidas-table";
import BodegueroSalidasView from "@/app/(feat)/salidas/components/bodeguero-salidas-view";
import Paginate from "@/app/(feat)/components/shared/Pagination";
import { getSalidas } from "@/app/lib/queries/salidas";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export default async function SalidasPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const user = session?.user;

    if (user?.rol === ROLES.BODEGUERO) {
        return (
            <div className="min-h-screen bg-background p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <ArrowRightLeft className="w-8 h-8 text-primary" />
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Mis Salidas</h1>
                                <p className="text-muted-foreground text-sm">Historial de salidas de materiales de tus bodegas.</p>
                            </div>
                        </div>
                    </div>
                    <Suspense fallback={<TableSkeleton columns={4} />}>
                        <BodegueroSalidasView userId={user.id} />
                    </Suspense>
                </div>
            </div>
        );
    }

    const currentPage = Number((await searchParams)?.page) || 1;
    const { salidas, totalPages } = await getSalidas(currentPage);

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <ArrowRightLeft className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Historial de Salidas</h1>
                            <p className="text-muted-foreground text-sm">Todas las salidas de materiales registradas en el sistema.</p>
                        </div>
                    </div>
                </div>
                <Suspense fallback={<TableSkeleton columns={5} />}>
                    <SalidasTable salidas={salidas} />
                </Suspense>
                <Paginate totalPages={totalPages} />
            </div>
        </div>
    );
}
