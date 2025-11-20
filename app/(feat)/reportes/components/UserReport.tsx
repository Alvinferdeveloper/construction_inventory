import { getUsers } from "@/app/lib/queries/users"; // Assuming this query can be reused and modified to fetch all users
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExportToExcel } from "./ExportToExcel";

export default async function UserReport() {
    const users = await getUsers(1);

    const formattedDataForExport = users.map(user => ({
        ID: user.id,
        Nombre: user.name,
        Email: user.email,
        Rol: user.rol.nombre,
        Estado: user.isActive ? "Activo" : "Inactivo",
    }));

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Reporte de Usuarios</h2>
                <ExportToExcel data={formattedDataForExport} fileName="reporte_usuarios" />
            </div>
            <Card className="overflow-hidden border border-border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rol</TableHead>
                            <TableHead>Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.rol.nombre}</TableCell>
                                <TableCell>{user.isActive ? "Activo" : "Inactivo"}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
