import { FileText, Layers, History, Users, Warehouse, Package, FileCheck, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import LowStockReport from "@/app/(feat)/reportes/components/LowStockReport";
import MovementHistoryReport from "@/app/(feat)/reportes/components/MovementHistoryReport";
import UserReport from "@/app/(feat)/reportes/components/UserReport";
import BodegaReport from "@/app/(feat)/reportes/components/BodegaReport";
import MaterialReport from "@/app/(feat)/reportes/components/MaterialReport";
import { TableSkeleton } from "@/app/(feat)/components/shared/table-skeleton";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { ROLES } from "@/app/lib/constants/roles";
import { redirect } from "next/navigation";
import BodegueroMovementHistory from "./components/BodegueroMovementHistory";
import BodegueroInventoryReport from "./components/BodegueroInventoryReport";
import BodegueroRequisitionReport from "./components/BodegueroRequisitionReport";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {

    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
        redirect('/login');
    }
    const user = session.user;
    const activeReport = (await searchParams)?.report;

    // BODEGUERO VIEW
    if (user.rol === ROLES.BODEGUERO) {
        return (
             <div className="min-h-screen bg-background p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                         <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-primary" />
                            <div>
                                <h1 className="text-3xl font-bold text-foreground">Mis Reportes</h1>
                                <p className="text-muted-foreground text-sm">Informes sobre tus bodegas asignadas.</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Link href="/reportes?report=my_movements" className={`block p-6 rounded-lg border-2 transition-colors ${activeReport === 'my_movements' ? 'border-primary bg-primary/5' : 'bg-card hover:border-muted-foreground/50'}`}>
                            <div className="flex items-center gap-4">
                                <History className="w-8 h-8 text-primary" />
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Historial de Movimientos</h3>
                                    <p className="text-sm text-muted-foreground">Auditoría de tus entradas y salidas.</p>
                                </div>
                            </div>
                        </Link>
                        <Link href="/reportes?report=my_inventory" className={`block p-6 rounded-lg border-2 transition-colors ${activeReport === 'my_inventory' ? 'border-primary bg-primary/5' : 'bg-card hover:border-muted-foreground/50'}`}>
                            <div className="flex items-center gap-4">
                                <FileCheck className="w-8 h-8 text-primary" />
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Inventario Actual</h3>
                                    <p className="text-sm text-muted-foreground">Snapshot del stock en tus bodegas.</p>
                                </div>
                            </div>
                        </Link>
                         <Link href="/reportes?report=my_requisitions" className={`block p-6 rounded-lg border-2 transition-colors ${activeReport === 'my_requisitions' ? 'border-primary bg-primary/5' : 'bg-card hover:border-muted-foreground/50'}`}>
                            <div className="flex items-center gap-4">
                                <ClipboardList className="w-8 h-8 text-primary" />
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground">Reporte de Solicitudes</h3>
                                    <p className="text-sm text-muted-foreground">Todas las solicitudes asignadas a ti.</p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {activeReport === 'my_movements' && (
                        <Suspense fallback={<TableSkeleton columns={7} />}>
                            <BodegueroMovementHistory userId={user.id} searchParams={await searchParams} />
                        </Suspense>
                    )}
                    {activeReport === 'my_inventory' && (
                        <Suspense fallback={<TableSkeleton columns={5} />}>
                            <BodegueroInventoryReport userId={user.id} />
                        </Suspense>
                    )}
                    {activeReport === 'my_requisitions' && (
                        <Suspense fallback={<TableSkeleton columns={5} />}>
                            <BodegueroRequisitionReport userId={user.id} searchParams={await searchParams} />
                        </Suspense>
                    )}
                </div>
            </div>
        );
    }
    
    // ADMIN VIEW
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Centro de Reportes</h1>
                            <p className="text-muted-foreground text-sm">Selecciona un reporte para generar y visualizar los datos.</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Low Stock Report */}
                    <Link href="/reportes?report=low_stock" className={`block p-6 rounded-lg border-2 transition-colors ${activeReport === 'low_stock' ? 'border-primary bg-primary/5' : 'bg-card hover:border-muted-foreground/50'}`}>
                        <div className="flex items-center gap-4">
                            <Layers className="w-8 h-8 text-primary" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Reporte de Stock Bajo</h3>
                                <p className="text-sm text-muted-foreground">Materiales por debajo de su nivel mínimo.</p>
                            </div>
                        </div>
                    </Link>
                    {/* Movement History Report */}
                    <Link href="/reportes?report=movement_history" className={`block p-6 rounded-lg border-2 transition-colors ${activeReport === 'movement_history' ? 'border-primary bg-primary/5' : 'bg-card hover:border-muted-foreground/50'}`}>
                        <div className="flex items-center gap-4">
                            <History className="w-8 h-8 text-primary" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Historial de Movimientos</h3>
                                <p className="text-sm text-muted-foreground">Auditoría de todas las entradas y salidas.</p>
                            </div>
                        </div>
                    </Link>
                     {/* User Report */}
                    <Link href="/reportes?report=users" className={`block p-6 rounded-lg border-2 transition-colors ${activeReport === 'users' ? 'border-primary bg-primary/5' : 'bg-card hover:border-muted-foreground/50'}`}>
                        <div className="flex items-center gap-4">
                            <Users className="w-8 h-8 text-primary" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Reporte de Usuarios</h3>
                                <p className="text-sm text-muted-foreground">Lista completa de todos los usuarios.</p>
                            </div>
                        </div>
                    </Link>
                    {/* Bodega Report */}
                    <Link href="/reportes?report=bodegas" className={`block p-6 rounded-lg border-2 transition-colors ${activeReport === 'bodegas' ? 'border-primary bg-primary/5' : 'bg-card hover:border-muted-foreground/50'}`}>
                        <div className="flex items-center gap-4">
                            <Warehouse className="w-8 h-8 text-primary" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Reporte de Bodegas</h3>
                                <p className="text-sm text-muted-foreground">Lista de bodegas y sus responsables.</p>
                            </div>
                        </div>
                    </Link>
                    {/* Material Report */}
                    <Link href="/reportes?report=materials" className={`block p-6 rounded-lg border-2 transition-colors ${activeReport === 'materials' ? 'border-primary bg-primary/5' : 'bg-card hover:border-muted-foreground/50'}`}>
                        <div className="flex items-center gap-4">
                            <Package className="w-8 h-8 text-primary" />
                            <div>
                                <h3 className="text-lg font-semibold text-foreground">Reporte de Materiales</h3>
                                <p className="text-sm text-muted-foreground">Catálogo completo de todos los materiales.</p>
                            </div>
                        </div>
                    </Link>
                </div>

                {activeReport === 'low_stock' && (
                    <Suspense fallback={<TableSkeleton columns={5} />}>
                        <LowStockReport />
                    </Suspense>
                )}
                {activeReport === 'movement_history' && (
                    <Suspense fallback={<TableSkeleton columns={7} />}>
                        <MovementHistoryReport searchParams={await searchParams} />
                    </Suspense>
                )}
                {activeReport === 'users' && (
                     <Suspense fallback={<TableSkeleton columns={4} />}>
                        <UserReport />
                    </Suspense>
                )}
                {activeReport === 'bodegas' && (
                     <Suspense fallback={<TableSkeleton columns={4} />}>
                        <BodegaReport />
                    </Suspense>
                )}
                {activeReport === 'materials' && (
                     <Suspense fallback={<TableSkeleton columns={3} />}>
                        <MaterialReport />
                    </Suspense>
                )}

            </div>
        </div>
    );
}
