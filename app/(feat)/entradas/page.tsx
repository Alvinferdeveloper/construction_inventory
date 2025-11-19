import { auth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/constants/roles";
import { ArrowRightLeft } from "lucide-react";
import EntradasTable from "@/app/(feat)/entradas/components/entradas-table";
import Paginate from "@/app/(feat)/components/shared/Pagination";
import { getEntradas } from "@/app/lib/queries/entradas";
import { headers } from "next/headers";

export default async function EntradasPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const user = session?.user;
    const currentPage = Number((await searchParams)?.page) || 1;

    const isBodeguero = user?.rol === ROLES.BODEGUERO;
    const userId = isBodeguero ? user.id : undefined;

    const { data, totalPages } = await getEntradas({ page: currentPage, userId });

    const title = isBodeguero ? "Mis Entradas" : "Historial de Entradas";
    const description = isBodeguero
        ? "Historial de entradas de materiales a tus bodegas."
        : "Todas las entradas de materiales registradas en el sistema.";

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <ArrowRightLeft className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                            <p className="text-muted-foreground text-sm">{description}</p>
                        </div>
                    </div>
                </div>
                <EntradasTable entradas={data} />
                <Paginate totalPages={totalPages} />
            </div>
        </div>
    );
}
