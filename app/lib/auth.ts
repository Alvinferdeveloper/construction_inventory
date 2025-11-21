import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { createAuthMiddleware, customSession } from "better-auth/plugins";
import prisma from "@/app/lib/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "mysql",
    }),
    hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-in/email") {
                const { email } = ctx.body as { email: string };
                const user = await prisma.user.findUnique({
                    where: { email },
                    select: { isActive: true },
                });
                if (user && user.isActive === false) {
                    throw new Error("Tu cuenta está desactivada.");
                }
            }
        }),
    },
    user: {
        additionalFields: {
            phone: { type: "string", required: false, input: true },
            direction: { type: "string", required: false, input: true },
            isActive: { type: "boolean", required: false, input: false },
            identification: { type: "string", required: true, input: true },
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
                        rol: "",
                        isDefaultPassword: false
                    },
                    session
                };
            }

            return {
                user: {
                    ...user,
                    rol: userWithRole.rol.nombre,
                    isDefaultPassword: userWithRole.isDefaultPassword // Include isDefaultPassword
                },
                session
            };
        })
    ]
});