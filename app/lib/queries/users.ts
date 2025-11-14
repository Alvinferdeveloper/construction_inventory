import prisma from "@/app/lib/prisma"

const MAX_ITEMS_PER_PAGE = 7

export async function getUsers(page: number) {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            isActive: true,
            rol: {
                select: {
                    nombre: true,
                },
            },
        },
        where: {
            deletedAt: null,
        },
        take: MAX_ITEMS_PER_PAGE,
        skip: (page - 1) * MAX_ITEMS_PER_PAGE,
    });
    return users
}

export async function getUsersPages() {
    const usersCount = await prisma.user.count({
        where: {
            deletedAt: null,
        },
    });
    return Math.ceil(usersCount / MAX_ITEMS_PER_PAGE)
}
