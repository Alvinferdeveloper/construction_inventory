import prisma from "@/app/lib/prisma"
export default async function getBodegas() {
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
    });
    return bodegas
}
