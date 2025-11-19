import prisma from "@/app/lib/prisma";

export async function getInventoryByBodega(bodegaId: number) {
    const inventory = await prisma.inventario.findMany({
        where: {
            bodegaId: bodegaId,
            deletedAt: null,
        },
        select: {
            id: true,
            stock_actual: true,
            minStock: true,
            maxStock: true,
            material: {
                select: {
                    id: true,
                    nombre: true,
                    unidad_medida: true,
                    categoria: {
                        select: {
                            id: true,
                            nombre: true,
                        }
                    }
                }
            }
        },
        orderBy: {
            material: {
                categoria: {
                    nombre: 'asc'
                }
            }
        }
    });
    return inventory;
}

export async function getGeneralInventory() {
    const materials = await prisma.material.findMany({
        where: { deletedAt: null },
        include: {
            categoria: true,
            inventario: {
                where: { deletedAt: null },
                include: {
                    bodega: {
                        select: { nombre: true }
                    }
                }
            }
        },
        orderBy: {
            categoria: {
                nombre: 'asc'
            }
        }
    });
    return materials;
}

export async function getInventoryForBodeguero(userId: string) {
    const bodegas = await prisma.bodega.findMany({
        where: {
            responsableId: userId,
            deletedAt: null,
        },
        include: {
            inventario: {
                where: { deletedAt: null },
                select: {
                    id: true,
                    stock_actual: true,
                    minStock: true,
                    maxStock: true,
                    material: {
                        include: {
                            categoria: true
                        }
                    }
                },
                orderBy: {
                    material: {
                        nombre: 'asc'
                    }
                }
            }
        },
        orderBy: {
            nombre: 'asc'
        }
    });

    return bodegas;
}
