import prisma from "@/app/lib/prisma";

const ITEMS_PER_PAGE = 10;

interface GetSalidasParams {
    page?: number;
    userId?: string;
}

export async function getSalidas({ page = 1, userId }: GetSalidasParams) {
    const skip = (page - 1) * ITEMS_PER_PAGE;

    const whereClause = {
        tipo: 'salida' as const,
        deletedAt: null,
        ...(userId && {
            inventario: {
                bodega: {
                    responsableId: userId,
                }
            }
        })
    };

    const [data, count] = await prisma.$transaction([
        prisma.movimiento.findMany({
            where: whereClause,
            include: {
                inventario: {
                    include: {
                        material: true,
                        bodega: true,
                    }
                },
                usuario: {
                    select: {
                        name: true,
                    }
                }
            },
            orderBy: {
                fecha: 'desc'
            },
            take: ITEMS_PER_PAGE,
            skip: skip,
        }),
        prisma.movimiento.count({ where: whereClause })
    ]);

    return {
        data,
        totalPages: Math.ceil(count / ITEMS_PER_PAGE)
    };
}
