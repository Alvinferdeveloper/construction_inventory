"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Key } from "lucide-react";
import { startTransition, useActionState } from "react";
import { changePassword } from "@/app/lib/actions/users";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const passwordSchema = z.object({
    oldPassword: z.string().min(1, "La contraseña actual es requerida."),
    newPassword: z.string()
        .min(8, "La nueva contraseña debe tener al menos 8 caracteres.")
        .regex(/[a-z]/, "La nueva contraseña debe contener al menos una minúscula.")
        .regex(/[A-Z]/, "La nueva contraseña debe contener al menos una mayúscula.")
        .regex(/[0-9]/, "La nueva contraseña debe contener al menos un número.")
        .regex(/[^a-zA-Z0-9]/, "La nueva contraseña debe contener al menos un carácter especial."),
    confirmNewPassword: z.string().min(1, "Confirma la nueva contraseña."),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las nuevas contraseñas no coinciden.",
    path: ["confirmNewPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export interface ChangePasswordState {
    success: boolean;
    message: string;
}

const INITIAL_STATE: ChangePasswordState = {
    success: false,
    message: "",
};

export default function ChangePasswordPage() {
    const router = useRouter();

    const [state, formAction, isPending] = useActionState<ChangePasswordState, FormData>(
        changePassword,
        INITIAL_STATE
    );

    const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordForm>({
        resolver: zodResolver(passwordSchema),
    });

    useEffect(() => {
        if (state.success) {
            toast.success(state.message);
            reset();
            router.push('/');
        } else if (state.message && state.message !== INITIAL_STATE.message) {
            toast.error(state.message);
        }
    }, [state, reset, router, toast]);

    const onSubmit = async (data: PasswordForm) => {
        const formData = new FormData();
        formData.append('oldPassword', data.oldPassword);
        formData.append('newPassword', data.newPassword);
        startTransition(() => {
            formAction(formData);
        });
    };

    return (
        <div className="min-h-screen bg-background p-8 flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Key className="w-6 h-6 text-primary" />
                        <CardTitle>Cambiar Contraseña</CardTitle>
                    </div>
                    <CardDescription>
                        Actualiza tu contraseña. Asegúrate de que sea fuerte y segura.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="oldPassword">Contraseña Actual</Label>
                            <Input
                                id="oldPassword"
                                type="password"
                                {...register("oldPassword")}
                            />
                            {errors.oldPassword && <p className="text-red-500 text-xs">{errors.oldPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">Nueva Contraseña</Label>
                            <Input
                                id="newPassword"
                                type="password"
                                {...register("newPassword")}
                            />
                            {errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmNewPassword">Confirmar Nueva Contraseña</Label>
                            <Input
                                id="confirmNewPassword"
                                type="password"
                                {...register("confirmNewPassword")}
                            />
                            {errors.confirmNewPassword && <p className="text-red-500 text-xs">{errors.confirmNewPassword.message}</p>}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full mt-4 cursor-pointer" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Cambiar Contraseña
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
