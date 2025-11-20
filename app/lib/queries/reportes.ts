import prisma from "@/app/lib/prisma";
import { MovimientoTipo } from "@prisma/client";

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
}

export async function getMovementHistory({
    page,
    dateFrom,
    dateTo,
    tipo,
    bodegaId,
    materialId
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
