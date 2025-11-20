"use client"

import { startTransition, useState, type ReactNode, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, CheckCircle, Copy } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useActionState } from "react"
import { type Rol } from "@prisma/client"
import { toast } from "sonner"
import SubmitButton from "@/app/(feat)/components/shared/SubmitButton"

export interface User {
    id: string;
    name: string;
    email: string;
    rolId: number;
    phone?: string;
    direction?: string;
    identification?: string;
}

interface UserFormModalProps {
    children: ReactNode;
    roles: Rol[];
    action: (prevState: any, data: any) => Promise<any>;
    initialData?: User;
    title: string;
    description: string;
    submitText: string;
}

const userSchema = z.object({
    name: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    email: z.string().email({ message: "Debe ser un email válido" }),
    rolId: z.string().min(1, { message: "Debes seleccionar un rol" }),
    phone: z.string().optional(),
    direction: z.string().optional(),
    identification: z.string().regex(/^\d{3}-\d{6}-\d{4}[a-zA-Z]$/, {
        message: "Formato de identificación inválido",
    }),
    id: z.string().optional(),
})

export type UserForm = z.infer<typeof userSchema>

const INITIAL_VALUES = {
    name: "",
    email: "",
    rolId: "",
    phone: "",
    direction: "",
    identification: "",
    success: false,
    message: "",
    generatedPassword: undefined,
}

export default function UserFormModal({
    children,
    roles,
    action,
    initialData,
    title,
    description,
    submitText
}: UserFormModalProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<UserForm>({
        resolver: zodResolver(userSchema),
        defaultValues: initialData ? {
            ...initialData,
            rolId: String(initialData.rolId)
        } : {}
    })

    const [state, formAction, isPending] = useActionState(action, INITIAL_VALUES);

    useEffect(() => {
        if (state.success) {
            if (state.generatedPassword) {
                setShowPassword(true);
            } else {
                handleOpenChange(false)
            }
        } else {
            setError(state.message)
        }
    }, [state])

    useEffect(() => {
        if (open && initialData) {
            reset({
                ...initialData,
                rolId: String(initialData.rolId)
            });
        } else if (!open) {
            reset(INITIAL_VALUES);
            setShowPassword(false);
        }
    }, [open, initialData, reset])

    const onSubmit = async (data: UserForm) => {
        startTransition(() => {
            const dataToSubmit = initialData ? { ...data, id: initialData.id } : data;
            formAction(dataToSubmit)
        })
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            reset()
            setError("")
            setShowPassword(false);
        }
    }

    const copyPasswordToClipboard = () => {
        if (state.generatedPassword) {
            navigator.clipboard.writeText(state.generatedPassword);
            toast("Contraseña copiada")
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        <div>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {showPassword && state.generatedPassword ? (
                    <div className="space-y-4 text-center py-6">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <h3 className="text-xl font-semibold text-foreground">¡Usuario creado exitosamente!</h3>
                        <p className="text-muted-foreground">Aquí está la contraseña generada para el nuevo usuario:</p>
                        <div className="relative flex items-center max-w-sm mx-auto">
                            <Input
                                readOnly
                                value={state.generatedPassword}
                                className="pr-10 text-center font-mono text-lg"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={copyPasswordToClipboard}
                                title="Copiar contraseña"
                            >
                                <Copy className="w-4 h-4" />
                            </Button>
                        </div>
                        <p className="text-sm text-red-500">Asegúrate de guardar esta contraseña en un lugar seguro.</p>
                        <div className="pt-4">
                            <Button onClick={() => handleOpenChange(false)}>Cerrar</Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 overflow-y-auto max-h-[80vh] p-1">
                        {initialData && <input type="hidden" {...register("id")} value={initialData.id} />}

                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre Completo</Label>
                            <Input
                                id="name"
                                placeholder="Ej: John Doe"
                                {...register("name")}
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Ej: john.doe@example.com"
                                {...register("email")}
                            />
                            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="identification">Identificación</Label>
                            <Input
                                id="identification"
                                placeholder="Ej: 123456789"
                                {...register("identification")}
                            />
                            {errors.identification && <p className="text-red-500 text-xs">{errors.identification.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                placeholder="Ej: +1234567890"
                                {...register("phone")}
                            />
                            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="direction">Dirección</Label>
                            <Input
                                id="direction"
                                placeholder="Ej: 123 Main St, Anytown"
                                {...register("direction")}
                            />
                            {errors.direction && <p className="text-red-500 text-xs">{errors.direction.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rolId">Rol</Label>
                            <Controller
                                name="rolId"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roles.map((rol) => (
                                                <SelectItem key={rol.id} value={String(rol.id)}>
                                                    {rol.nombre}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.rolId && <p className="text-red-500 text-xs">{errors.rolId.message}</p>}
                        </div>
                        {error &&
                            <div className="mt-1 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </div>}
                        <div className="flex gap-2 justify-end pt-4">
                            <Button type="button" variant="outline" className="cursor-pointer" onClick={() => handleOpenChange(false)}>
                                Cancelar
                            </Button>
                            <SubmitButton text={submitText} pending={isPending} />
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}

