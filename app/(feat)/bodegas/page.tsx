import { Warehouse, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import BodegasTable from "./components/bodegas-table"
import getBodegas from "@/app/lib/queries/bodegas"

export default async function BodegasPage() {
    const bodegas = await getBodegas()

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
                    <Button className="gap-2 cursor-pointer">
                        <Plus className="w-4 h-4" />
                        Nueva Bodega
                    </Button>
                </div>
                <BodegasTable bodegas={bodegas} />
            </div>
        </div>
    )
}
