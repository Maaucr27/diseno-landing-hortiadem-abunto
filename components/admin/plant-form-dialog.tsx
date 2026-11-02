'use client'

import { useState, useTransition, type FormEvent, type ReactElement, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { createPlant, updatePlant } from '@/app/actions/admin'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CATEGORY_OPTIONS, LIGHT_OPTIONS, WATER_OPTIONS } from '@/lib/plant-options'
import {
  adminGhostButton,
  adminInput,
  adminPrimaryButton,
  adminSelectContent,
  adminSelectTrigger,
  adminTextarea,
} from './styles'

export type EditablePlant = {
  id: string
  name: string
  scientificName: string
  category: string
  description: string
  image: string
  imageAlt: string
  water: string
  light: string
  price: number | null
  stock: number
  sortOrder: number
}

type Props = { plant?: EditablePlant; trigger: ReactElement }

function FormField({
  id,
  label,
  hint,
  className,
  children,
}: {
  id: string
  label: string
  hint?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ''}`}>
      <Label htmlFor={id} className="text-emerald-50">
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-emerald-100/60">{hint}</p> : null}
    </div>
  )
}

export function PlantFormDialog({ plant, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const isEdit = Boolean(plant)

  const categories =
    plant && !(CATEGORY_OPTIONS as readonly string[]).includes(plant.category)
      ? [plant.category, ...CATEGORY_OPTIONS]
      : [...CATEGORY_OPTIONS]

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) setError(null)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await (isEdit ? updatePlant(formData) : createPlant(formData))
      if (!result.ok) {
        setError(result.error)
        return
      }
      toast.success(isEdit ? 'Planta actualizada' : 'Planta agregada al catálogo')
      handleOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="glass-green-strong max-h-[90dvh] gap-5 overflow-y-auto rounded-3xl border-white/20 p-5 text-emerald-50 sm:max-w-2xl sm:p-7">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl font-medium text-emerald-50">
            {isEdit ? 'Editar planta' : 'Nueva planta'}
          </DialogTitle>
          <DialogDescription className="text-emerald-100/70">
            {isEdit
              ? 'Los cambios se publican de inmediato en el catálogo.'
              : 'Completa los datos para publicarla en el catálogo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {plant ? <input type="hidden" name="id" value={plant.id} /> : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="name" label="Nombre común">
              <Input
                id="name"
                name="name"
                required
                maxLength={80}
                defaultValue={plant?.name}
                placeholder="Rosa del Desierto"
                className={adminInput}
              />
            </FormField>
            <FormField id="scientificName" label="Nombre científico">
              <Input
                id="scientificName"
                name="scientificName"
                required
                maxLength={120}
                defaultValue={plant?.scientificName}
                placeholder="Adenium obesum"
                className={`${adminInput} italic`}
              />
            </FormField>

            <FormField id="category" label="Categoría">
              <Select name="category" required defaultValue={plant?.category}>
                <SelectTrigger id="category" className={adminSelectTrigger}>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className={adminSelectContent}>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <div className="grid grid-cols-2 gap-4">
              <FormField id="price" label="Precio" hint="Vacío = a consulta">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  defaultValue={plant?.price ?? ''}
                  placeholder="48"
                  className={adminInput}
                />
              </FormField>
              <FormField id="stock" label="Stock">
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={1}
                  defaultValue={plant?.stock ?? 0}
                  className={adminInput}
                />
              </FormField>
            </div>

            <FormField id="water" label="Riego (frecuencia)">
              <Select name="water" required defaultValue={plant?.water}>
                <SelectTrigger id="water" className={adminSelectTrigger}>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className={adminSelectContent}>
                  {WATER_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>
            <FormField id="light" label="Luz (exposición)">
              <Select name="light" required defaultValue={plant?.light}>
                <SelectTrigger id="light" className={adminSelectTrigger}>
                  <SelectValue placeholder="Selecciona" />
                </SelectTrigger>
                <SelectContent className={adminSelectContent}>
                  {LIGHT_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormField>

            <FormField
              id="image"
              label="Imagen URL"
              hint="URL https o ruta local, por ejemplo /images/planta.png"
              className="sm:col-span-2"
            >
              <Input
                id="image"
                name="image"
                required
                defaultValue={plant?.image}
                placeholder="https://..."
                className={adminInput}
              />
            </FormField>

            <FormField id="description" label="Descripción" className="sm:col-span-2">
              <Textarea
                id="description"
                name="description"
                required
                maxLength={600}
                defaultValue={plant?.description}
                className={adminTextarea}
              />
            </FormField>

            <FormField
              id="sortOrder"
              label="Orden de despliegue"
              hint="Menor aparece primero. Vacío = al final"
            >
              <Input
                id="sortOrder"
                name="sortOrder"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                defaultValue={plant?.sortOrder}
                className={adminInput}
              />
            </FormField>
            <FormField id="imageAlt" label="Texto alternativo de la imagen">
              <Input
                id="imageAlt"
                name="imageAlt"
                defaultValue={plant?.imageAlt}
                placeholder="Opcional"
                className={adminInput}
              />
            </FormField>
          </div>

          <p role="alert" aria-live="polite" className="min-h-5 text-sm text-red-200">
            {error}
          </p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className={adminGhostButton}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending} className={adminPrimaryButton}>
              {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              {isEdit ? 'Guardar cambios' : 'Agregar planta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
