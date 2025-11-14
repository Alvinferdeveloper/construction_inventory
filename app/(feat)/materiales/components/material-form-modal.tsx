"use client"

import { useState, type ReactNode, useTransition } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Dialog, DialogTrigger, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useActionState } from "react"

export interface Material {
  id: number
  nombre: string
  unidad_medida: string
  categoriaId: number
}

interface CreateMaterialState {
  nombre: string
  unidad_medida: string
  categoriaId: number
  success: boolean
  message: string
  id?: number
}

interface MaterialActionData {
  id?: number
  nombre: string
  unidad_medida: string
  categoriaId: number
}

// Tipo flexible que acepta tanto createMaterial como updateMaterial
// Acepta cualquier función que tenga una firma compatible con las acciones
// Esto permite usar tanto createMaterial (sin id) como updateMaterial (con id requerido)
type MaterialAction = (
  prevState: CreateMaterialState,
  data: { nombre: string; unidad_medida: string; categoriaId: number } & ({ id?: number } | { id: number })
) => Promise<CreateMaterialState>

interface MaterialFormModalProps {
  children: ReactNode
  categorias: { id: number; nombre: string }[]
  action: MaterialAction
  initialData?: Material
  title: string
  description: string
  submitText: string
}

// Unidades de medida comunes en construcción
const UNIDADES_MEDIDA = [
  { value: "kg", label: "Kilogramos (kg)" },
  { value: "g", label: "Gramos (g)" },
  { value: "ton", label: "Toneladas (ton)" },
  { value: "m", label: "Metros (m)" },
  { value: "cm", label: "Centímetros (cm)" },
  { value: "m²", label: "Metros cuadrados (m²)" },
  { value: "m³", label: "Metros cúbicos (m³)" },
  { value: "L", label: "Litros (L)" },
  { value: "unidad", label: "Unidades" },
  { value: "par", label: "Pares" },
  { value: "caja", label: "Cajas" },
  { value: "bolsa", label: "Bolsas" },
  { value: "rollo", label: "Rollos" },
  { value: "tubo", label: "Tubos" },
  { value: "placa", label: "Placas" },
] as const

const materialSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  unidad_medida: z.string().min(1, { message: "Debes seleccionar una unidad de medida" }),
    categoria: z.string().min(1,{ message: "Debes seleccionar una categoría" }),
  id: z.number().optional(),
})

export type MaterialForm = z.infer<typeof materialSchema>

const INITIAL_VALUES: CreateMaterialState = {
  nombre: "",
  unidad_medida: "",
  categoriaId: 0,
  success: false,
  message: "",
}

export default function MaterialFormModal({
  children,
  categorias,
  action,
  initialData,
  title,
  description,
  submitText,
}: MaterialFormModalProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<MaterialForm>({
    resolver: zodResolver(materialSchema),
    defaultValues: initialData
      ? { ...initialData, categoria: initialData.categoriaId.toString() }
      : { nombre: "", unidad_medida: "", categoria: "" },
  })

  const [state, formAction] = useActionState<CreateMaterialState, MaterialActionData | (MaterialActionData & { id: number })>(
    action as MaterialAction,
    INITIAL_VALUES
  )

  const resetForm = (data?: Material) => {
    reset(
      data
        ? { ...data, categoria: data.categoriaId.toString() }
        : { nombre: "", unidad_medida: "", categoria: "", id: undefined }
    )
  }

  const onSubmit = (data: MaterialForm) => {
    startTransition(() => {
      const dataToSubmit: MaterialActionData | (MaterialActionData & { id: number }) = initialData?.id
        ? {
            id: initialData.id,
            nombre: data.nombre,
            unidad_medida: data.unidad_medida,
            categoriaId: parseInt(data.categoria),
          }
        : {
            nombre: data.nombre,
            unidad_medida: data.unidad_medida,
            categoriaId: parseInt(data.categoria),
          }
      formAction(dataToSubmit)
    })
  }

  // El modal se cierra automáticamente cuando hay éxito (estado derivado)
  const isOpen = open && !state.success

  // Mostrar el error directamente del estado, sin necesidad de estado local separado
  const displayError = state.success ? "" : state.message

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      resetForm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            <div>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {initialData && <input type="hidden" {...register("id")} value={initialData.id} />}

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre del Material</Label>
            <Input
              id="nombre"
              placeholder="Ej: Cemento, Arena, Ladrillos"
              {...register("nombre")}
              aria-invalid={!!errors.nombre}
            />
            {errors.nombre && <p className="text-red-500 text-xs">{errors.nombre.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unidad_medida">Unidad de Medida</Label>
            <Controller
              name="unidad_medida"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar unidad de medida" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIDADES_MEDIDA.map((unidad) => (
                      <SelectItem key={unidad.value} value={unidad.value}>
                        {unidad.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.unidad_medida && <p className="text-red-500 text-xs">{errors.unidad_medida.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Controller
              name="categoria"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria.id} value={categoria.id.toString()}>
                        {categoria.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoria && <p className="text-red-500 text-xs">{errors.categoria.message}</p>}
          </div>

          {displayError && (
            <div className="mt-1 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
              {displayError}
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={isPending}>
              {isPending ? "Guardando..." : submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
