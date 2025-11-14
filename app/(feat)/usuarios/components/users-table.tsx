import { Package, Pencil, Trash2, UserCheck, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getUsers } from "@/app/lib/queries/users" // This will be created later
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface UsersTableProps {
    currentPage: number
}

export default async function UsersTable({ currentPage }: UsersTableProps) {
    const users = await getUsers(currentPage) // This will be created later

    const getAvatarColor = (name: string) => {
        const colors = [
            "bg-blue-100 text-blue-700",
            "bg-purple-100 text-purple-700",
            "bg-pink-100 text-pink-700",
            "bg-green-100 text-green-700",
            "bg-orange-100 text-orange-700",
            "bg-red-100 text-red-700",
        ]
        const index = name.charCodeAt(0) % colors.length
        return colors[index]
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <Card className="overflow-hidden border border-border">
            <Table>
                <TableHeader>
                    <TableRow className="border-b border-border bg-muted hover:bg-muted">
                        <TableHead className="font-semibold text-foreground">Usuario</TableHead>
                        <TableHead className="font-semibold text-foreground">Email</TableHead>
                        <TableHead className="font-semibold text-foreground">Rol</TableHead>
                        <TableHead className="font-semibold text-foreground">Estado</TableHead>
                        <TableHead className="text-right font-semibold text-foreground">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                <div className="flex flex-col items-center justify-center">
                                    <Package className="w-8 h-8 text-muted-foreground mb-2" />
                                    <p className="text-muted-foreground">No hay usuarios registrados</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.image || ""} alt={user.name || "User Avatar"} />
                                            <AvatarFallback className={`${getAvatarColor(user.name || "U")}`}>
                                                {getInitials(user.name || "U")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-foreground">{user.name}</span>
                                    </div>
                                </TableCell>

                                <TableCell className="text-muted-foreground">{user.email}</TableCell>

                                <TableCell className="text-foreground">{user.rol.nombre}</TableCell>

                                <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                        {user.isActive ? "Activo" : "Inactivo"}
                                    </span>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        {/* Placeholder for Edit User Modal */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 cursor-pointer w-8 p-0 hover:bg-blue-100 hover:text-blue-700 text-muted-foreground"
                                            title="Editar usuario"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Button>

                                        {/* Placeholder for Activate/Deactivate User Button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className={`h-8 cursor-pointer w-8 p-0 ${user.isActive ? "hover:bg-red-100 hover:text-red-700" : "hover:bg-green-100 hover:text-green-700"} text-muted-foreground`}
                                            title={user.isActive ? "Desactivar usuario" : "Activar usuario"}
                                        >
                                            {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                        </Button>

                                        {/* Placeholder for Delete User Button */}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 cursor-pointer w-8 p-0 hover:bg-destructive/10 hover:text-destructive text-muted-foreground"
                                            title="Eliminar usuario"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}
