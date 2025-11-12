"use server"

import { auth } from "@/app/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";

interface SignInState {
    fields: { email: string; password: string };
    success: boolean;
    error: string;
}

export async function signIn(
    prevState: SignInState,
    formData: FormData
): Promise<SignInState> {
    const fields = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    }

    try {
        await auth.api.signInEmail({
            body: {
                email: fields.email,
                password: fields.password,
                rememberMe: true,
            },
            headers: await headers(),
        });
        return {
            fields,
            success: true,
            error: ""
        }
    } catch (error: unknown) {
        const err = error as APIError;
        if (err.status === 'UNAUTHORIZED') {
            return {
                fields,
                success: false,
                error: "credenciales invalidas"
            }
        }
        return {
            fields,
            success: false,
            error: "No se puedo procesar la solicitud"
        }
    }
}
