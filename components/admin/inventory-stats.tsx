import { Boxes, DollarSign, PackageX, Sprout } from 'lucide-react'

type Plant = { price: number | null; stock: number }

export function InventoryStats({ plants }: { plants: Plant[] }) {
  const units = plants.reduce((sum, plant) => sum + plant.stock, 0)
  const value = plants.reduce((sum, plant) => sum + (plant.price ?? 0) * plant.stock, 0)
  const outOfStock = plants.filter((plant) => plant.stock === 0).length

  const stats = [
    { label: 'Plantas en catálogo', value: plants.length.toString(), icon: Sprout },
    { label: 'Unidades en stock', value: units.toLocaleString('es'), icon: Boxes },
    { label: 'Valor del inventario', value: `$${value.toLocaleString('es')}`, icon: DollarSign },
    { label: 'Agotadas', value: outOfStock.toString(), icon: PackageX },
  ]

  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map(({ label, value, icon: Icon }) => (
        <div key={label} className="glass-green rounded-2xl p-4 text-emerald-50 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <dt className="text-xs text-emerald-100/70 sm:text-sm">{label}</dt>
            <Icon className="size-4 shrink-0 text-emerald-200" aria-hidden="true" />
          </div>
          <dd className="mt-2 font-serif text-3xl font-medium tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  )
}
