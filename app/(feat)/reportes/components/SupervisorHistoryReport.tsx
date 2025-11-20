import { getReceivedMaterialsHistory, getReceivedMaterialsHistoryPages } from "@/app/lib/queries/historial";
import HistoryTable from "@/app/(feat)/historial-materiales/components/history-table";
import Paginate from "@/app/(feat)/components/shared/Pagination";
import HistoryFilters from "@/app/(feat)/historial-materiales/components/HistoryFilters";
import { getMateriales } from "@/app/lib/queries/materiales";
import { ExportToExcel } from "./ExportToExcel";

interface SupervisorHistoryReportProps {
    userId: string;
    searchParams: {
        page?: string;
        dateFrom?: string;
        dateTo?: string;
        materialId?: string;
    }
}

export default async function SupervisorHistoryReport({ userId, searchParams }: SupervisorHistoryReportProps) {
    const currentPage = Number(searchParams?.page) || 1;
    const materialId = searchParams?.materialId ? Number(searchParams.materialId) : undefined;
    const { dateFrom, dateTo } = searchParams;

    const materials = await getMateriales();
    const totalPages = await getReceivedMaterialsHistoryPages({ userId, dateFrom, dateTo, materialId });
    const history = await getReceivedMaterialsHistory({ userId, page: currentPage, dateFrom, dateTo, materialId });

    const formattedDataForExport = history.map(item => ({
        "ID Requisa": item.requisa.id,
        Proyecto: item.requisa.proyecto,
        Material: item.material.nombre,
        Cantidad: item.cantidad,
        "Bodega de Origen": item.bodega?.nombre || 'N/A',
        "Fecha de Aprobación": new Date(item.movimiento?.fecha || '').toLocaleDateString(),
    }));

    return (
         <div>
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-2xl font-bold text-foreground">Historial de Materiales Recibidos</h2>
                 <ExportToExcel data={formattedDataForExport} fileName="reporte_historial_recibidos" />
            </div>

            <HistoryFilters materials={materials} />
            <HistoryTable history={history} />
            <Paginate totalPages={totalPages} />
        </div>
    );
}
