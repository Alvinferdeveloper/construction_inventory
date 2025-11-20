import prisma from "@/app/lib/prisma";

const ITEMS_PER_PAGE = 10;

export async function getReceivedMaterialsHistory(userId: string, page: number) {
    const history = await prisma.detalleRequisa.findMany({
        where: {
            requisa: {
                solicitanteId: userId,
            },
            estado: 'aprobado',
        },
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

export async function getReceivedMaterialsHistoryPages(userId: string) {
    const count = await prisma.detalleRequisa.count({
        where: {
            requisa: {
                solicitanteId: userId,
            },
            estado: 'aprobado',
            movimiento: {
                isNot: null
            }
        }
    });

    return Math.ceil(count / ITEMS_PER_PAGE);
}
