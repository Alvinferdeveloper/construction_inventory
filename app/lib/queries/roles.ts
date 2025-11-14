import prisma from "@/app/lib/prisma"

export async function getRoles() {
    const roles = await prisma.rol.findMany({
        where: {
            deletedAt: null,
        },
    });
    return roles;
}
