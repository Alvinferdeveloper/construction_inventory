import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { History } from "lucide-react";
import { getReceivedMaterialsHistory, getReceivedMaterialsHistoryPages } from "@/app/lib/queries/historial";
import HistoryTable from "./components/history-table";
import Paginate from "@/app/(feat)/components/shared/Pagination";
import { Suspense } from "react";
import { TableSkeleton } from "@/app/(feat)/components/shared/table-skeleton";
import HistoryFilters from "./components/HistoryFilters";
import { getMateriales } from "@/app/lib/queries/materiales";

export default async function HistoryPage({ searchParams }: { searchParams: { page?: string; dateFrom?: string; dateTo?: string; materialId?: string; } }) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
        redirect('/login');
    }

    const currentPage = Number(searchParams?.page) || 1;
    const materialId = searchParams?.materialId ? Number(searchParams.materialId) : undefined;
    const { dateFrom, dateTo } = searchParams;

    const materials = await getMateriales();
    const totalPages = await getReceivedMaterialsHistoryPages({ userId: session.user.id, dateFrom, dateTo, materialId });
    const history = await getReceivedMaterialsHistory({ userId: session.user.id, page: currentPage, dateFrom, dateTo, materialId });

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <History className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Historial de Materiales Recibidos</h1>
                            <p className="text-muted-foreground text-sm">Un registro de todos los materiales que has recibido.</p>
                        </div>
                    </div>
                </div>

                <HistoryFilters materials={materials} />

                <Suspense fallback={<TableSkeleton columns={5} />}>
                    <HistoryTable history={history} />
                </Suspense>

                <Paginate totalPages={totalPages} />
            </div>
        </div>
    );
}
