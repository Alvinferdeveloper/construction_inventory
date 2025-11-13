import { Warehouse, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import BodegasTable from "./components/bodegas-table"
import BodegaFormModal from "@/app/(feat)/bodegas/components/bodega-form-modal"
import { getBodegueros } from "@/app/lib/queries/bodegueros"
import Paginate from "@/app/(feat)/components/shared/Pagination"
import { getBodegasPages } from "@/app/lib/queries/bodegas"
import { createBodega } from "@/app/lib/actions/bodegas"

export default async function BodegasPage({ searchParams }: { searchParams: Promise<{ page: string }> }) {
    const bodegueros = await getBodegueros()
    const totalPages = await getBodegasPages()
    const params = await searchParams;
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Warehouse className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Bodegas</h1>
                            <p className="text-muted-foreground text-sm">Gestiona todas tus bodegas y sus responsables</p>
                        </div>
                    </div>
                    <BodegaFormModal bodegueros={bodegueros} action={createBodega} title="Nueva Bodega" description="Agregar una nueva bodega" submitText="Agregar Bodega">
                        <Button className="gap-2 cursor-pointer">
                            <Plus className="w-4 h-4" />
                            Nueva Bodega
                        </Button>
                    </BodegaFormModal>
                </div>
                <BodegasTable currentPage={Number(params.page) || 1} />
                <Paginate totalPages={totalPages} />
            </div>
        </div>
    )
}
