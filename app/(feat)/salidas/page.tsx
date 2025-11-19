import { auth } from "@/app/lib/auth";
import { ROLES } from "@/app/lib/constants/roles";
import { ArrowRightLeft } from "lucide-react";
import SalidasTable from "@/app/(feat)/salidas/components/salidas-table";
import Paginate from "@/app/(feat)/components/shared/Pagination";
import { getSalidas } from "@/app/lib/queries/salidas";
import { headers } from "next/headers";

export default async function SalidasPage({ searchParams }: { searchParams: { page?: string } }) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    const user = session?.user;
    const currentPage = Number(searchParams?.page) || 1;

    const isBodeguero = user?.rol === ROLES.BODEGUERO;
    const userId = isBodeguero ? user.id : undefined;

    const { data, totalPages } = await getSalidas({ page: currentPage, userId });

    const title = isBodeguero ? "Mis Salidas" : "Historial de Salidas";
    const description = isBodeguero
        ? "Historial de salidas de materiales de tus bodegas."
        : "Todas las salidas de materiales registradas en el sistema.";

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
                <SalidasTable salidas={data} />
                <Paginate totalPages={totalPages} />
            </div>
        </div>
    );
}
