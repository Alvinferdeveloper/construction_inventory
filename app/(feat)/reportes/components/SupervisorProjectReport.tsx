import { getMaterialUsageByProject } from "@/app/lib/queries/reportes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FolderGit, PackageSearch } from "lucide-react";
import { ExportToExcel } from "./ExportToExcel";

interface SupervisorProjectReportProps {
    userId: string;
}

export default async function SupervisorProjectReport({ userId }: SupervisorProjectReportProps) {
    const reportData = await getMaterialUsageByProject(userId);
    const projects = Object.entries(reportData);

    const formattedDataForExport = projects.flatMap(([projectName, materials]) => 
        Object.entries(materials).map(([materialName, data]) => ({
            Proyecto: projectName,
            Material: materialName,
            "Cantidad Usada": data.cantidad,
            Unidad: data.unidad,
        }))
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-foreground">Reporte de Uso de Materiales por Proyecto</h2>
                <ExportToExcel data={formattedDataForExport} fileName="reporte_uso_materiales" />
            </div>

            <div className="space-y-8">
                {projects.length === 0 ? (
                     <Card>
                        <CardContent className="h-48 flex flex-col items-center justify-center">
                            <PackageSearch className="w-12 h-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No hay datos de uso de materiales para mostrar.</p>
                        </CardContent>
                    </Card>
                ) : (
                    projects.map(([projectName, materials]) => (
                        <Card key={projectName}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FolderGit className="w-6 h-6 text-primary" />
                                    {projectName}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Material</TableHead>
                                            <TableHead className="text-right">Cantidad Total Usada</TableHead>
                                            <TableHead>Unidad</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Object.entries(materials).map(([materialName, data]) => (
                                            <TableRow key={materialName}>
                                                <TableCell className="font-medium">{materialName}</TableCell>
                                                <TableCell className="text-right font-bold">{data.cantidad}</TableCell>
                                                <TableCell>{data.unidad}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
