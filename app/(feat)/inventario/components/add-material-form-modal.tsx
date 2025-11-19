"use client"

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type ReactNode, useState, useEffect } from "react";
import { useActionState, startTransition } from "react";
import { addMaterialToBodega, type EntradaFormState } from "@/app/lib/actions/movimientos";

interface AddMaterialFormModalProps {
    bodegaId: number;
    unassignedMaterials: { id: number; nombre: string }[];
    children: ReactNode;
}

const addMaterialSchema = z.object({
    bodegaId: z.number(),
    materialId: z.number().min(1, { message: "Debe seleccionar un material." }),
    cantidad: z.coerce.number({ message: "La cantidad debe ser un número." }).int().positive({ message: "La cantidad debe ser un número positivo." }),
    observaciones: z.string().optional(),
});

export type AddMaterialForm = z.output<typeof addMaterialSchema>;

const INITIAL_STATE: EntradaFormState = {
    success: false,
    message: "",
};

export default function AddMaterialFormModal({ bodegaId, unassignedMaterials, children }: AddMaterialFormModalProps) {
    const [open, setOpen] = useState(false);
    const [formState, formAction] = useActionState(addMaterialToBodega, INITIAL_STATE);

    const { control, register, handleSubmit, formState: { errors }, reset } = useForm<z.input<typeof addMaterialSchema>, any, AddMaterialForm>({
        resolver: zodResolver(addMaterialSchema),
        defaultValues: {
            bodegaId,
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

    const onSubmit = (data: AddMaterialForm) => {
        startTransition(() => {
            formAction({
                ...data,
            });
        });
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Agregar Nuevo Material a Bodega</DialogTitle>
                    <DialogDescription>
                        Seleccione un material de la lista para agregarlo al inventario de esta bodega.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="hidden" name="bodegaId" value={bodegaId} />

                    <div className="space-y-2">
                        <Label htmlFor="materialId">Material</Label>
                        <Controller
                            name="materialId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    onValueChange={(val) => field.onChange(Number(val))}
                                    value={field.value !== undefined ? String(field.value) : undefined}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar material" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {unassignedMaterials.map((material) => (
                                            <SelectItem key={material.id} value={material.id.toString()}>
                                                {material.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.materialId && <p className="text-red-500 text-xs">{errors.materialId.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="cantidad">Cantidad Inicial</Label>
                        <Input
                            id="cantidad"
                            type="number"
                            placeholder="Ej: 50"
                            {...register("cantidad", { valueAsNumber: true })}
                        />
                        {errors.cantidad && <p className="text-red-500 text-xs">{errors.cantidad.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones (Opcional)</Label>
                        <Textarea
                            id="observaciones"
                            placeholder="Ej: Stock inicial."
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
                        <Button type="submit">Agregar Material</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
