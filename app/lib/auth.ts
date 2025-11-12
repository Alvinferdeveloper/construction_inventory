import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

import { PrismaClient } from "@prisma/client";
import { customSession } from "better-auth/plugins";
const prisma = new PrismaClient();
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
                return session;
            }

            return {
                ...session,
                user: userWithRole
            };
        })
    ]
});