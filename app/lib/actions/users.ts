"use server"
import prisma from "@/app/lib/prisma"
import { revalidatePath } from "next/cache"
import { UserForm } from "@/app/(feat)/usuarios/components/user-form-modal"
import bcrypt from "bcryptjs"
import { APIError } from "better-auth"

interface CreateUserState extends UserForm {
    success: boolean;
    message: string;
}
import crypto from "crypto";
import { auth } from "../auth"

const generateRandomPassword = (length = 12) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-="
    let password = ""

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, charset.length)
        password += charset[randomIndex]
    }

    return password
}


export async function createUser(prevState: CreateUserState, data: Omit<UserForm, "id">) {
    const {
        name,
        email,
        identification,
        rolId,
        phone,
        direction,
    } = data

    try {
        const randomPassword = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const user = await prisma.user.findFirst({
            where: {
                identification: identification
            }
        })

        if (user) {
            return {
                ...data,
                success: false,
                message: "Un usuario con la misma identificación ya existe."
            }
        }

        const response = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password: hashedPassword,
                phone,
                direction,
                identification,
                rolId: Number(rolId),
            }
        })

        revalidatePath("/usuarios")
        return {
            ...data,
            success: true,
            message: "Usuario creado exitosamente."
        }
    } catch (error) {
        if (error instanceof APIError && error.statusCode === 422) {
            return {
                ...data,
                success: false,
                message: "El email ya está en uso."
            }
        }
        return {
            ...data,
            success: false,
            message: "Error al crear el usuario."
        }
    }
}
