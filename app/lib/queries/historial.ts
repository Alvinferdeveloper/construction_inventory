import prisma from "@/app/lib/prisma";

const ITEMS_PER_PAGE = 10;

interface HistoryFilters {
    userId: string;
    page?: number;
    dateFrom?: string;
    dateTo?: string;
    materialId?: number;
}

const buildHistoryWhereClause = ({ userId, dateFrom, dateTo, materialId }: Omit<HistoryFilters, 'page'>) => {
    const whereClause: any = {
        requisa: {
            solicitanteId: userId,
        },
        estado: 'aprobado',
        movimiento: {
            isNot: null,
        },
    };

    if (materialId) {
        whereClause.materialId = materialId;
    }

    if (dateFrom || dateTo) {
        whereClause.movimiento = {
            isNot: null,
            fecha: {}
        };
        if (dateFrom) {
            whereClause.movimiento.fecha.gte = new Date(dateFrom);
        }
        if (dateTo) {
            whereClause.movimiento.fecha.lte = new Date(dateTo);
        }
    }
    return whereClause;
}

export async function getReceivedMaterialsHistory({ userId, page = 1, dateFrom, dateTo, materialId }: HistoryFilters) {
    
    const where = buildHistoryWhereClause({ userId, dateFrom, dateTo, materialId });

    const history = await prisma.detalleRequisa.findMany({
        where,
        select: {
            id: true,
            cantidad: true,
            movimiento: {
                select: {
                    fecha: true,
                }
            },
            requisa: {
                select: {
                    id: true,
                    proyecto: true,
                }
            },
            material: {
                select: {
                    nombre: true,
                }
            },
            bodega: {
                select: {
                    nombre: true,
                }
            }
        },
        orderBy: {
            movimiento: {
                fecha: 'desc'
            }
        },
        skip: (page - 1) * ITEMS_PER_PAGE,
        take: ITEMS_PER_PAGE,
    });
    return history;
}

export async function getReceivedMaterialsHistoryPages({ userId, dateFrom, dateTo, materialId }: Omit<HistoryFilters, 'page'>) {
    const where = buildHistoryWhereClause({ userId, dateFrom, dateTo, materialId });
    const count = await prisma.detalleRequisa.count({
        where
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
}
