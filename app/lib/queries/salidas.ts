import prisma from "@/app/lib/prisma";

const ITEMS_PER_PAGE = 10;

export async function getSalidas(page: number = 1) {
    const skip = (page - 1) * ITEMS_PER_PAGE;
    const salidas = await prisma.movimiento.findMany({
        where: {
            tipo: 'salida',
            deletedAt: null,
        },
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
    });

    const count = await prisma.movimiento.count({
        where: {
            tipo: 'salida',
            deletedAt: null,
        }
    });

    return {
        salidas,
        totalPages: Math.ceil(count / ITEMS_PER_PAGE)
    };
}

export async function getSalidasForBodeguero(userId: string) {
    const salidas = await prisma.movimiento.findMany({
        where: {
            tipo: 'salida',
            deletedAt: null,
            inventario: {
                bodega: {
                    responsableId: userId,
                }
            }
        },
        include: {
            inventario: {
                include: {
                    material: true,
                    bodega: true,
                }
            },
        },
        orderBy: {
            fecha: 'desc'
        }
    });
    return salidas;
}
