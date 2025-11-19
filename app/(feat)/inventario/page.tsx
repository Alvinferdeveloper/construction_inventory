import { Boxes } from "lucide-react";
import { getAllBodegas } from "@/app/lib/queries/bodegas";
import WarehouseSelector from "./components/warehouse-selector";
import InventoryTable from "./components/inventory-table";
import { Suspense } from "react";
import { TableSkeleton } from "../components/shared/table-skeleton";
import GeneralInventoryTable from "./components/general-inventory-table";
import { auth } from "@/app/lib/auth";
import BodegueroInventoryView from "./components/bodeguero-inventory-view";
import { ROLES } from "@/app/lib/constants/roles";
import { headers } from "next/headers";

export default async function InventoryPage({ searchParams }: { searchParams: Promise<{ bodegaId?: string }> }) {
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
                            <Boxes className="w-8 h-8 text-primary" />
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Mi Inventario</h1>
                                <p className="text-muted-foreground text-sm">Gestiona el stock de tus bodegas asignadas.</p>
                            </div>
                        </div>
                    </div>
                    <Suspense fallback={<TableSkeleton columns={5} />}>
                        <BodegueroInventoryView userId={user.id} />
                    </Suspense>
                </div>
            </div>
        );
    }

    // Standard view for other roles
    const bodegas = await getAllBodegas();
    const params = await searchParams;
    const selectedBodegaId = params.bodegaId;
    const isGeneralView = !selectedBodegaId || isNaN(Number(selectedBodegaId));

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Boxes className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Inventario General</h1>
                            <p className="text-muted-foreground text-sm">Consulta el stock de materiales por bodega.</p>
                        </div>
                    </div>
                </div>

                <WarehouseSelector bodegas={bodegas} selectedBodegaId={selectedBodegaId} />

                <div className="mt-8">
                    <Suspense fallback={<TableSkeleton columns={5} />}>
                        {isGeneralView ? (
                            <GeneralInventoryTable />
                        ) : (
                            <InventoryTable bodegaId={Number(selectedBodegaId)} />
                        )}
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
