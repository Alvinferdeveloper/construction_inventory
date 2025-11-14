import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { customSession } from "better-auth/plugins";
import prisma from "@/app/lib/prisma";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    user: {
        additionalFields: {
            phone: { type: "string", required: true, input: true },
            direction: { type: "string", required: true, input: true },
            identification: { type: "string", required: true, input: true },
            estado: { type: "boolean", required: true, input: true },
            rolId: { type: "number", required: true, input: true },
            rol: { type: "string", required: false, input: false },
        }
    },
    emailAndPassword: {
        enabled: true,
    },
    plugins: [
        customSession(async ({ user, session }) => {
            const userWithRole = await prisma.user.findUnique({
                where: { id: user.id },
                include: {
                    rol: true,
                },
            });

            if (!userWithRole) {
                return {
                    user: {
                        ...user,
                        rol: ""
                    },
                    session
                };
            }

            return {
                user: {
                    ...user,
                    rol: userWithRole.rol.nombre
                },
                session
            };
        })
    ]
});