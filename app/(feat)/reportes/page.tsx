import { FileText, Layers, History, Users, Warehouse, Package } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import LowStockReport from "@/app/(feat)/reportes/components/LowStockReport";
import MovementHistoryReport from "@/app/(feat)/reportes/components/MovementHistoryReport";
import UserReport from "@/app/(feat)/reportes/components/UserReport";
import BodegaReport from "@/app/(feat)/reportes/components/BodegaReport";
import MaterialReport from "@/app/(feat)/reportes/components/MaterialReport";
import { TableSkeleton } from "@/app/(feat)/components/shared/table-skeleton";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {

    const activeReport = (await searchParams)?.report;

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
