import prisma from "@/app/lib/prisma";
import { DetalleRequisaEstado, MovimientoTipo } from "@prisma/client";

const ITEMS_PER_PAGE = 15;

export async function getLowStockMaterials() {
    const lowStockItems = await prisma.inventario.findMany({
        where: {
            stock_actual: {
                lte: prisma.inventario.fields.minStock
            },
            minStock: {
                gt: 0
            },
            bodega: {
                deletedAt: null
            }
        },
        include: {
            material: {
                select: {
                    nombre: true,
                    unidad_medida: true,
                }
            },
            bodega: {
                select: {
                    nombre: true
                }
            }
        },
        orderBy: [
            { bodega: { nombre: 'asc' } },
            { material: { nombre: 'asc' } },
        ]
    });
    return lowStockItems;
}

interface MovementHistoryFilters {
    page: number;
    dateFrom?: string;
    dateTo?: string;
    tipo?: MovimientoTipo;
    bodegaId?: number;
    materialId?: number;
    bodegaIds?: number[];
}

export async function getMovementHistory({
    page,
    dateFrom,
    dateTo,
    tipo,
    bodegaId,
    materialId,
    bodegaIds
}: MovementHistoryFilters) {

    const whereClause: any = {
        inventario: {}
    };

    if (dateFrom) {
        whereClause.fecha = { ...whereClause.fecha, gte: new Date(dateFrom) };
    }
    if (dateTo) {
        whereClause.fecha = { ...whereClause.fecha, lte: new Date(dateTo) };
    }
    if (tipo) {
        whereClause.tipo = tipo;
    }
    if (bodegaId) {
        whereClause.inventario.bodegaId = bodegaId;
    }
    if (materialId) {
        whereClause.inventario.materialId = materialId;
    }
    if (bodegaIds && bodegaIds.length > 0) {
        whereClause.inventario.bodegaId = { in: bodegaIds };
    }

    const [movements, totalMovements] = await prisma.$transaction([
        prisma.movimiento.findMany({
            where: whereClause,
            include: {
                usuario: {
                    select: { name: true }
                },
                inventario: {
                    include: {
                        material: { select: { nombre: true } },
                        bodega: { select: { nombre: true } }
                    }
                }
            },
            orderBy: {
                fecha: 'desc'
            },
            skip: (page - 1) * ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
        }),
        prisma.movimiento.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalMovements / ITEMS_PER_PAGE);

    return { movements, totalPages };
}

interface RequisitionDetailsFilters {
    page: number;
    userId: string;
    estado?: DetalleRequisaEstado;
}

export async function getRequisitionDetailsForBodeguero({
    page,
    userId,
    estado,
}: RequisitionDetailsFilters) {
    const whereClause: any = {
        bodega: {
            responsableId: userId,
        },
    };

    if (estado) {
        whereClause.estado = estado;
    }

    const [details, totalDetails] = await prisma.$transaction([
        prisma.detalleRequisa.findMany({
            where: whereClause,
            include: {
                requisa: {
                    select: { proyecto: true, solicitante: { select: { name: true } } }
                },
                material: {
                    select: { nombre: true }
                }
            },
            orderBy: {
                requisa: {
                    fecha: 'desc'
                }
            },
            skip: (page - 1) * ITEMS_PER_PAGE,
            take: ITEMS_PER_PAGE,
        }),
        prisma.detalleRequisa.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalDetails / ITEMS_PER_PAGE);

    return { details, totalPages };
}

export async function getMaterialUsageByProject(userId: string) {
    const approvedDetails = await prisma.detalleRequisa.findMany({
        where: {
            requisa: {
                solicitanteId: userId,
            },
            estado: 'aprobado',
        },
        select: {
            cantidad: true,
            requisa: {
                select: {
                    proyecto: true,
                }
            },
            material: {
                select: {
                    nombre: true,
                    unidad_medida: true,
                }
            }
        }
    });

    // Group and aggregate in code
    const report = approvedDetails.reduce((acc, detail) => {
        const project = detail.requisa.proyecto;
        const material = detail.material.nombre;

        if (!acc[project]) {
            acc[project] = {};
        }
        if (!acc[project][material]) {
            acc[project][material] = {
                cantidad: 0,
                unidad: detail.material.unidad_medida
            };
        }
        acc[project][material].cantidad += detail.cantidad;

        return acc;
    }, {} as Record<string, Record<string, { cantidad: number; unidad: string }>>);

    return report;
}

