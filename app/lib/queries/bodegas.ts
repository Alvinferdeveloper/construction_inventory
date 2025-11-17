import prisma from "@/app/lib/prisma"

const MAX_ITEMS_PER_PAGE = 7

export async function getBodegas(page: number) {
    const bodegas = await prisma.bodega.findMany({
        select: {
            id: true,
            nombre: true,
            ubicacion: true,
            responsable: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
        where: {
            deletedAt: null,
        },
        take: MAX_ITEMS_PER_PAGE,
        skip: (page - 1) * MAX_ITEMS_PER_PAGE,
    });
    return bodegas
}

export async function getBodegasPages() {
    const bodegasCount = await prisma.bodega.count({
        where: {
            deletedAt: null,
        },
    });
    return Math.ceil(bodegasCount / MAX_ITEMS_PER_PAGE)
}

export async function getAllBodegas() {
    const bodegas = await prisma.bodega.findMany({
        where: {
            deletedAt: null,
        },
        select: {
            id: true,
            nombre: true,
        }
    });
    return bodegas;
}