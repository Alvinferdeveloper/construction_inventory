import prisma from "@/app/lib/prisma";
import { ROLES } from "@/app/lib/constants/roles";

export function getBodegueros() {
    return prisma.user.findMany({
        where: {
            rol:{
                nombre: ROLES.BODEGUERO
            }
        }
    })
}
