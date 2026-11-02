'use client'

import { useState, useTransition, type FormEvent, type ReactElement, type ReactNode } from 'react'
import { Info, Layers, Loader2, Sparkles, Sprout } from 'lucide-react'
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
  details?: string | null
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
  const [activeTab, setActiveTab] = useState<'basic' | 'detail' | 'care'>('basic')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const isEdit = Boolean(plant)

  // Parse existing details if available
  let parsedDetails: any = null
  if (plant?.details) {
    try {
      parsedDetails = JSON.parse(plant.details)
    } catch {
      // ignore
    }
  }

  // Pre-generate sizes text representation
  const defaultSizesRaw =
    parsedDetails?.sizes
      ?.map(
        (s: any) =>
          `${s.label || ''} | ${s.price ?? ''} | ${s.description || ''} | ${s.stock || 'Disponible'}`,
      )
      .join('\n') || ''

  // Pre-generate extra gallery images
  const defaultGalleryUrls =
    parsedDetails?.gallery
      ?.slice(1)
      ?.map((img: any) => img.src)
      ?.join('\n') || ''

  const categories =
    plant && !(CATEGORY_OPTIONS as readonly string[]).includes(plant.category as any)
      ? [plant.category, ...CATEGORY_OPTIONS]
      : [...CATEGORY_OPTIONS]

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next) {
      setError(null)
      setActiveTab('basic')
    }
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
      toast.success(isEdit ? 'Planta y ficha técnica actualizadas' : 'Planta agregada al catálogo')
      handleOpenChange(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={trigger} />
      <DialogContent className="glass-green-strong max-h-[92dvh] gap-5 overflow-y-auto rounded-3xl border-white/20 p-5 text-emerald-50 sm:max-w-3xl sm:p-7">
        <DialogHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <DialogTitle className="font-serif text-2xl font-medium text-emerald-50">
              {isEdit && plant ? `Editar: ${plant.name}` : 'Nueva planta'}
            </DialogTitle>
            {isEdit && plant ? (
              <a
                href={`/producto/${plant.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-emerald-300 underline hover:text-white"
              >
                Ver ficha en vivo →
              </a>
            ) : null}
          </div>
          <DialogDescription className="text-emerald-100/70">
            {isEdit
              ? 'Edita la información del catálogo y todos los campos de la ficha técnica de producto.'
              : 'Completa los datos del catálogo y personaliza la ficha técnica completa.'}
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex rounded-2xl border border-white/10 bg-white/5 p-1 text-xs sm:text-sm">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-medium transition-all ${
              activeTab === 'basic'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-100/70 hover:text-white'
            }`}
          >
            <Sprout className="size-3.5" />
            Catálogo General
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('detail')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-medium transition-all ${
              activeTab === 'detail'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-100/70 hover:text-white'
            }`}
          >
            <Sparkles className="size-3.5" />
            Ficha & Galería
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('care')}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 font-medium transition-all ${
              activeTab === 'care'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-100/70 hover:text-white'
            }`}
          >
            <Layers className="size-3.5" />
            Cuidados & Envíos
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {plant ? <input type="hidden" name="id" value={plant.id} /> : null}

          {/* TAB 1: BASIC INFO */}
          <div className={activeTab === 'basic' ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}>
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
              <FormField id="price" label="Precio base" hint="Vacío = a consulta">
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
              label="Imagen Principal (URL)"
              hint="URL https o ruta como /images/rosa-del-desierto.png"
              className="sm:col-span-2"
            >
              <Input
                id="image"
                name="image"
                required
                defaultValue={plant?.image}
                placeholder="https://... o /images/..."
                className={adminInput}
              />
            </FormField>

            <FormField id="description" label="Descripción de la tarjeta" className="sm:col-span-2">
              <Textarea
                id="description"
                name="description"
                required
                maxLength={600}
                defaultValue={plant?.description}
                className={adminTextarea}
                placeholder="Breve reseña botánica que se muestra en la tarjeta del catálogo."
              />
            </FormField>

            <FormField
              id="sortOrder"
              label="Orden de catálogo"
              hint="Menor número aparece primero"
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

          {/* TAB 2: FICHA TÉCNICA & PRESENTACIONES */}
          <div className={activeTab === 'detail' ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}>
            <FormField
              id="badge"
              label="Insignia / Badge"
              hint="Ej: Edición Coleccionista, Joya Botánica, Pieza Única"
            >
              <Input
                id="badge"
                name="badge"
                defaultValue={parsedDetails?.badge || ''}
                placeholder="Edición Coleccionista"
                className={adminInput}
              />
            </FormField>

            <FormField
              id="galleryUrls"
              label="Galería de fotos adicionales"
              hint="Una URL por línea para la galería interactiva"
              className="sm:col-span-2"
            >
              <Textarea
                id="galleryUrls"
                name="galleryUrls"
                defaultValue={defaultGalleryUrls}
                placeholder="https://ejemplo.com/foto-caudex.jpg&#10;https://ejemplo.com/foto-flor.jpg"
                className={`${adminTextarea} h-20 text-xs font-mono`}
              />
            </FormField>

            <FormField
              id="summary"
              label="Resumen botánico destacado"
              hint="Texto principal visible en grande en la cabecera de la ficha"
              className="sm:col-span-2"
            >
              <Textarea
                id="summary"
                name="summary"
                defaultValue={parsedDetails?.summary || ''}
                placeholder="Flores de un carmesí aterciopelado sobre un caudex escultórico..."
                className={adminTextarea}
              />
            </FormField>

            <FormField
              id="sizesRaw"
              label="Presentaciones / Tamaños de Compra"
              hint="Formato por línea: Nombre | Precio | Descripción | Stock"
              className="sm:col-span-2"
            >
              <Textarea
                id="sizesRaw"
                name="sizesRaw"
                defaultValue={defaultSizesRaw}
                placeholder="Maceta 6 pulg | 48 | Ejemplar joven, caudex en formación | Disponible&#10;Maceta 8 pulg | 86 | Caudex marcado y ramificación | Pocas unidades&#10;Ejemplar Adulto | 180 | Planta de 5 años, floración abundante | Pieza única"
                className={`${adminTextarea} h-28 text-xs font-mono`}
              />
            </FormField>
          </div>

          {/* TAB 3: CUIDADOS & SECCIONES */}
          <div className={activeTab === 'care' ? 'grid gap-4 sm:grid-cols-2' : 'hidden'}>
            <FormField
              id="careLightDetail"
              label="Consejo de Luz del Vivero"
              hint="Se muestra al desplegar la tarjeta de Luz"
            >
              <Input
                id="careLightDetail"
                name="careLightDetail"
                defaultValue={
                  parsedDetails?.care?.find((c: any) => c.key === 'light')?.detail || ''
                }
                placeholder="Necesita al menos 6 horas de sol directo..."
                className={adminInput}
              />
            </FormField>

            <FormField
              id="careWaterDetail"
              label="Consejo de Riego del Vivero"
              hint="Se muestra al desplegar la tarjeta de Riego"
            >
              <Input
                id="careWaterDetail"
                name="careWaterDetail"
                defaultValue={
                  parsedDetails?.care?.find((c: any) => c.key === 'water')?.detail || ''
                }
                placeholder="Riega en profundidad y espera a que el sustrato seque..."
                className={adminInput}
              />
            </FormField>

            <FormField
              id="careSubstrateDetail"
              label="Consejo de Sustrato"
              hint="Tipo de mezcla recomendada"
            >
              <Input
                id="careSubstrateDetail"
                name="careSubstrateDetail"
                defaultValue={
                  parsedDetails?.care?.find((c: any) => c.key === 'substrate')?.detail || ''
                }
                placeholder="Mezcla de pumita, arena gruesa y drenaje extremo..."
                className={adminInput}
              />
            </FormField>

            <FormField
              id="careDifficultyDetail"
              label="Consejo de Dificultad"
              hint="Nivel y sugerencia de mantenimiento"
            >
              <Input
                id="careDifficultyDetail"
                name="careDifficultyDetail"
                defaultValue={
                  parsedDetails?.care?.find((c: any) => c.key === 'difficulty')?.detail || ''
                }
                placeholder="Perdona descuidos ocasionales. Evitar encharcamientos..."
                className={adminInput}
              />
            </FormField>

            <FormField
              id="historyText"
              label="Historia y Cuidados (Sección Acordeón)"
              hint="Separa párrafos con doble salto de línea"
              className="sm:col-span-2"
            >
              <Textarea
                id="historyText"
                name="historyText"
                defaultValue={
                  parsedDetails?.sections
                    ?.find((s: any) => s.id === 'historia')
                    ?.paragraphs?.join('\n\n') || ''
                }
                placeholder="La rosa del desierto nace en las regiones áridas...&#10;&#10;Para que florezca, abónala con..."
                className={adminTextarea}
              />
            </FormField>

            <FormField
              id="shippingText"
              label="Envíos y Garantía (Sección Acordeón)"
              hint="Separa párrafos con doble salto de línea"
              className="sm:col-span-2"
            >
              <Textarea
                id="shippingText"
                name="shippingText"
                defaultValue={
                  parsedDetails?.sections
                    ?.find((s: any) => s.id === 'envios')
                    ?.paragraphs?.join('\n\n') || ''
                }
                placeholder="Enviamos cada planta en caja rígida...&#10;&#10;Garantía de llegada de 15 días..."
                className={adminTextarea}
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
              {isEdit ? 'Guardar planta y ficha técnica' : 'Agregar planta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
