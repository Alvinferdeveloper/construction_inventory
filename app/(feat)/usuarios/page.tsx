import { Users, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import UsersTable from "@/app/(feat)/usuarios/components/users-table"
import Paginate from "@/app/(feat)/components/shared/Pagination"
import { getUsersPages } from "@/app/lib/queries/users"

export default async function UsersPage({ searchParams }: { searchParams: { page?: string } }) {
    const totalPages = await getUsersPages()
    const currentPage = Number(searchParams.page) || 1;

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Usuarios</h1>
                            <p className="text-muted-foreground text-sm">Gestiona todos los usuarios del sistema</p>
                        </div>
                    </div>
                    {/* Placeholder for Add User Modal/Button */}
                    <Button className="gap-2 cursor-pointer">
                        <Plus className="w-4 h-4" />
                        Nuevo Usuario
                    </Button>
                </div>
                <UsersTable currentPage={currentPage} />
                <Paginate totalPages={totalPages} />
            </div>
        </div>
    )
}
