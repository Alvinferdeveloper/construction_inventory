"use client"

import { startTransition, useState, type ReactNode } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Warehouse } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createBodega } from "@/app/lib/actions/bodegas"
import { useActionState } from "react"
import { useEffect } from "react"

interface CreateBodegaModalProps {
    children: ReactNode
    bodegueros: { id: string; name: string }[]
}

const bodegaSchema = z.object({
    nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
    ubicacion: z.string().min(3, { message: "La ubicación debe tener al menos 3 caracteres" }),
    responsable: z.string({ message: "Debes seleccionar un responsable" })
})

export type BodegaForm = z.infer<typeof bodegaSchema>

const INITIAL_VALUES = {
    nombre: "",
    ubicacion: "",
    responsable: "",
    success: true,
    message: ""
}

export default function CreateBodegaModal({ children, bodegueros }: CreateBodegaModalProps) {
    const [open, setOpen] = useState(false);
    const [error, setError] = useState("")
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<BodegaForm>({
        resolver: zodResolver(bodegaSchema),
    })
    const [state, formAction] = useActionState(createBodega, INITIAL_VALUES);

    useEffect(() => {
        if (state.success) {
            setOpen(false)
        }
        else {
            setError(state.message)
        }
    }, [state])

    const onSubmit = async (data: BodegaForm) => {
        startTransition(() => {
            formAction(data)
        })
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            reset()
            setError("")
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <Warehouse className="w-5 h-5 text-primary" />
                        <div>
                            <DialogTitle>Nueva Bodega</DialogTitle>
                            <DialogDescription>Crea una nueva bodega ingresando los datos requeridos</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre">Nombre de la Bodega</Label>
                        <Input
                            id="nombre"
                            placeholder="Ej: Bodega Central"
                            {...register("nombre")}
                        />
                        {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="ubicacion">Ubicación</Label>
                        <Input
                            id="ubicacion"
                            placeholder="Ej: Zona Industrial Norte"
                            {...register("ubicacion")}
                        />
                        {errors.ubicacion && <p className="text-red-500 text-xs">{errors.ubicacion.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="responsable">Responsable</Label>
                        <Controller
                            name="responsable"
                            control={control}
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar responsable" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bodegueros.map((bodeguero: any) => (
                                            <SelectItem key={bodeguero.id} value={bodeguero.id}>
                                                {bodeguero.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.responsable && <p className="text-red-500 text-xs">{errors.responsable.message}</p>}
                    </div>
                    {error &&
                        <div className="mt-1 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {error}
                        </div>}
                    <div className="flex gap-2 justify-end pt-4">
                        <Button type="button" variant="outline" className="cursor-pointer" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit" className="cursor-pointer">Crear Bodega</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
