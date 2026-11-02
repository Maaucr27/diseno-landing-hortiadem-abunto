import { Droplets, ExternalLink, Pencil, Sun } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { DeletePlantButton } from './delete-plant-button'
import { InlineNumberField } from './inline-number-field'
import { PlantFormDialog, type EditablePlant } from './plant-form-dialog'
import { adminGhostButton } from './styles'

function EditButton({ plant }: { plant: EditablePlant }) {
  return (
    <PlantFormDialog
      plant={plant}
      trigger={
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Editar ${plant.name}`}
          className={`size-9 ${adminGhostButton}`}
        >
          <Pencil className="size-4" aria-hidden="true" />
        </Button>
      }
    />
  )
}

function PlantIdentity({ plant }: { plant: EditablePlant }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={plant.image}
        alt={plant.imageAlt}
        width={48}
        height={48}
        loading="lazy"
        className="size-12 shrink-0 rounded-xl border border-white/15 object-cover"
      />
      <div className="min-w-0">
        <p className="truncate font-medium text-emerald-50">{plant.name}</p>
        <p className="truncate text-xs text-emerald-100/60 italic">{plant.scientificName}</p>
      </div>
    </div>
  )
}

function CareTags({ plant }: { plant: EditablePlant }) {
  return (
    <ul className="flex flex-wrap gap-1.5 text-xs text-emerald-100/85">
      <li className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-1">
        <Droplets className="size-3" aria-hidden="true" />
        {plant.water}
      </li>
      <li className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-1">
        <Sun className="size-3" aria-hidden="true" />
        {plant.light}
      </li>
    </ul>
  )
}

function PriceField({ plant }: { plant: EditablePlant }) {
  return (
    <InlineNumberField
      key={`price-${plant.id}-${plant.price}`}
      id={plant.id}
      field="price"
      value={plant.price}
      prefix="$"
      placeholder="Consulta"
      label={`Precio de ${plant.name}`}
    />
  )
}

function StockField({ plant }: { plant: EditablePlant }) {
  return (
    <InlineNumberField
      key={`stock-${plant.id}-${plant.stock}`}
      id={plant.id}
      field="stock"
      value={plant.stock}
      label={`Stock de ${plant.name}`}
    />
  )
}

export function PlantsTable({ plants }: { plants: EditablePlant[] }) {
  if (plants.length === 0) {
    return (
      <div className="glass-green rounded-3xl p-10 text-center text-emerald-100/80">
        Aún no hay plantas en el catálogo. Agrega la primera con el botón &quot;Nueva planta&quot;.
      </div>
    )
  }

  return (
    <>
      <div className="glass-green hidden overflow-hidden rounded-3xl md:block">
        <table className="w-full text-left text-sm text-emerald-50">
          <caption className="sr-only">Inventario de plantas</caption>
          <thead>
            <tr className="border-b border-white/10 text-xs tracking-wide text-emerald-100/60 uppercase">
              <th scope="col" className="px-5 py-3.5 font-medium">
                Planta
              </th>
              <th scope="col" className="px-3 py-3.5 font-medium">
                Categoría
              </th>
              <th scope="col" className="px-3 py-3.5 font-medium">
                Cuidados
              </th>
              <th scope="col" className="px-3 py-3.5 font-medium">
                Precio
              </th>
              <th scope="col" className="px-3 py-3.5 font-medium">
                Stock
              </th>
              <th scope="col" className="px-3 py-3.5 font-medium">
                Orden
              </th>
              <th scope="col" className="px-5 py-3.5 text-right font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {plants.map((plant) => (
              <tr key={plant.id} className="transition-colors hover:bg-white/5">
                <td className="max-w-64 px-5 py-3">
                  <PlantIdentity plant={plant} />
                </td>
                <td className="px-3 py-3 text-emerald-100/85">{plant.category}</td>
                <td className="max-w-56 px-3 py-3">
                  <CareTags plant={plant} />
                </td>
                <td className="px-3 py-3">
                  <PriceField plant={plant} />
                </td>
                <td className="px-3 py-3">
                  <StockField plant={plant} />
                </td>
                <td className="px-3 py-3 tabular-nums text-emerald-100/70">{plant.sortOrder}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/producto/${plant.id}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Ver ficha de ${plant.name}`}
                      title="Ver ficha de producto en vivo"
                      className={`inline-flex size-9 items-center justify-center rounded-lg border border-white/10 ${adminGhostButton}`}
                    >
                      <ExternalLink className="size-4" aria-hidden="true" />
                    </Link>
                    <EditButton plant={plant} />
                    <DeletePlantButton id={plant.id} name={plant.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col gap-3 md:hidden">
        {plants.map((plant) => (
          <li key={plant.id} className="glass-green flex flex-col gap-4 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <PlantIdentity plant={plant} />
              <span className="shrink-0 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-xs text-emerald-100/85">
                {plant.category}
              </span>
            </div>
            <CareTags plant={plant} />
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div className="flex gap-3">
                <label className="flex flex-col gap-1 text-xs text-emerald-100/60">
                  Precio
                  <PriceField plant={plant} />
                </label>
                <label className="flex flex-col gap-1 text-xs text-emerald-100/60">
                  Stock
                  <StockField plant={plant} />
                </label>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/producto/${plant.id}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Ver ficha de ${plant.name}`}
                  title="Ver ficha en vivo"
                  className={`inline-flex size-9 items-center justify-center rounded-lg border border-white/10 ${adminGhostButton}`}
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                </Link>
                <EditButton plant={plant} />
                <DeletePlantButton id={plant.id} name={plant.name} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
