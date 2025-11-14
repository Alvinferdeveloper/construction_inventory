import { Package, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import MaterialTable from "./components/material-table"
import MaterialFormModal from "./components/material-form-modal"
import { getCategorias } from "@/app/lib/queries/materiales"
import { createMaterial } from "@/app/lib/actions/materiales"

export default async function MaterialesPage() {
    const categorias = await getCategorias()
    
    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Package className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Materiales</h1>
                            <p className="text-muted-foreground text-sm">Gestiona todos los materiales de construcción</p>
                        </div>
                    </div>
                    <MaterialFormModal 
                        categorias={categorias} 
                        action={createMaterial} 
                        title="Nuevo Material" 
                        description="Agregar un nuevo material" 
                        submitText="Agregar Material"
                    >
                        <Button className="gap-2 cursor-pointer">
                            <Plus className="w-4 h-4" />
                            Nuevo Material
                        </Button>
                    </MaterialFormModal>
                </div>
                <MaterialTable />
            </div>
        </div>
    )
}