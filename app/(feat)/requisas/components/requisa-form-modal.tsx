"use client";

import { useEffect, useState, type ReactNode } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { useActionState } from 'react';

import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PackageSearch, Plus, Trash2 } from 'lucide-react';
import SubmitButton from '@/app/(feat)/components/shared/SubmitButton';
import { State, createRequisa, updateRequisa } from '@/app/lib/actions/requisas';
import type { RequisaWithDetails } from '@/app/lib/queries/requisa';




type MaterialWithStock = {
  id: number;
  nombre: string;
  stockTotal: number;
};

interface RequisaFormModalProps {
  children: ReactNode;
  action: (prevState: State, formData: FormData) => Promise<State>;
  materiales: MaterialWithStock[];
  title: string;
  description: string;
  submitText: string;
  requisaToEdit?: RequisaWithDetails; 
}

const INITIAL_STATE: State = { message: null, errors: {} };

export default function RequisaFormModal({
  children,
  action,
  materiales,
  title,
  description,
  submitText,
  requisaToEdit,
}: RequisaFormModalProps) {
  const [open, setOpen] = useState(false);
  const [formState, formAction, isPending] = useActionState(action, INITIAL_STATE);

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      proyecto: requisaToEdit?.proyecto || '',
      materiales: requisaToEdit?.detalles.map(d => ({ materialId: String(d.materialId), cantidad: d.cantidad })) || [{ materialId: '', cantidad: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'materiales',
  });

  

  
  useEffect(() => {
    if (formState.message?.includes('exitosamente')) {
      setOpen(false);
      reset({ proyecto: '', materiales: [{ materialId: '', cantidad: 1 }] });
    }
  }, [formState, reset]);

  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <PackageSearch className="w-5 h-5 text-primary" />
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          {requisaToEdit && <input type="hidden" name="requisaId" value={requisaToEdit.id} />}
          <div className="space-y-2">
            <Label htmlFor="proyecto">Nombre del Proyecto</Label>
            <Controller
              name="proyecto"
              control={control}
              render={({ field }) => (
                <Input id="proyecto" placeholder="Ej: Construcción Edificio Central" {...field} />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Materiales</Label>
            {fields.map((field, index) => {
              return (
                <div key={field.id} className="flex items-end gap-2 p-2 border rounded-md">
                  <div className="flex-1">
                    <Label htmlFor={`materiales.${index}.materialId`} className="text-xs text-muted-foreground">Material</Label>
                    <Select {...register(`materiales.${index}.materialId`)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materiales.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                                      </div>
                  <div className="w-24">
                     <Label htmlFor={`materiales.${index}.cantidad`} className="text-xs text-muted-foreground">Cantidad</Label>
                    <Input type="number" min="1" {...register(`materiales.${index}.cantidad`)} />
                                      </div>
                  <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
            <Button type="button" variant="outline" size="sm" onClick={() => append({ materialId: '', cantidad: 1 })}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Material
            </Button>
                      </div>

          {formState.message && !formState.message.includes('exitosamente') && (
            <div className="mt-1 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formState.message}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <SubmitButton text={submitText} pending={isPending} />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
