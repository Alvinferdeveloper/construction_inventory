"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { type ReactNode, useState, useEffect } from "react";
import { useActionState, startTransition } from "react";
import { createEntrada, type EntradaFormState } from "@/app/lib/actions/movimientos";

interface EntradaFormModalProps {
    inventarioId: number;
    materialNombre: string;
    children: ReactNode;
}

const entradaSchema = z.object({
    inventarioId: z.number(),
    cantidad: z.coerce.number({ message: "La cantidad debe ser un número." }).int().positive({ message: "La cantidad debe ser un número positivo." }),
    observaciones: z.string().optional(),
});

export type EntradaForm = z.output<typeof entradaSchema>;

const INITIAL_STATE: EntradaFormState = {
    success: false,
    message: "",
};

export default function EntradaFormModal({ inventarioId, materialNombre, children }: EntradaFormModalProps) {
    const [open, setOpen] = useState(false);
    const [formState, formAction] = useActionState(createEntrada, INITIAL_STATE);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<z.input<typeof entradaSchema>, any, EntradaForm>({
        resolver: zodResolver(entradaSchema),
        defaultValues: {
            inventarioId,
        },
    });

    useEffect(() => {
        if (formState.success) {
            setOpen(false);
        }
    }, [formState]);

    const handleOpenChange = (isOpen: boolean) => {
        if (!isOpen) {
            reset();
        }
        setOpen(isOpen);
    };

    const handleSubmitForm = (data: EntradaForm) => {
        startTransition(() => {
            formAction({
                ...data,
                inventarioId,
            });
        });
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Registrar Entrada: {materialNombre}</DialogTitle>
                    <DialogDescription>
                        Ingresa la cantidad de material que está entrando a la bodega.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
                    <input type="hidden" name="inventarioId" value={inventarioId} />

                    <div className="space-y-2">
                        <Label htmlFor="cantidad">Cantidad</Label>
                        <Input
                            id="cantidad"
                            type="number"
                            placeholder="Ej: 100"
                            {...register("cantidad")}
                        />
                        {errors.cantidad && <p className="text-red-500 text-xs">{errors.cantidad.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
                        <Textarea
                            id="observaciones"
                            placeholder="Ej: Material recibido del proveedor X."
                            {...register("observaciones")}
                        />
                    </div>

                    {!formState.success && formState.message && (
                        <div className="mt-1 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                            {formState.message}
                        </div>
                    )}

                    <div className="flex gap-2 justify-end pt-4">
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Cancelar
                        </Button>
                        <Button type="submit">Registrar Entrada</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
