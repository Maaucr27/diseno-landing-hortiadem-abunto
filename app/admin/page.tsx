import { redirect } from 'next/navigation'
import { Plus } from 'lucide-react'
import { AdminHeader } from '@/components/admin/admin-header'
import { InventoryStats } from '@/components/admin/inventory-stats'
import { PlantFormDialog } from '@/components/admin/plant-form-dialog'
import { PlantsTable } from '@/components/admin/plants-table'
import { adminPrimaryButton } from '@/components/admin/styles'
import { Button } from '@/components/ui/button'
import { getAdminUser } from '@/lib/admin'
import { getAdminPlants } from '@/lib/queries'

export default async function AdminPage() {
  const admin = await getAdminUser()
  if (!admin) redirect('/')

  const plants = await getAdminPlants()

  return (
    <>
      <AdminHeader name={admin.name} />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-3 pt-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-medium text-balance text-emerald-50 sm:text-5xl">
              Inventario
            </h1>
            <p className="mt-1 text-emerald-100/70">
              Administra las plantas del catálogo de Abunto.
            </p>
          </div>
          <PlantFormDialog
            trigger={
              <Button type="button" size="lg" className={adminPrimaryButton}>
                <Plus className="size-4" aria-hidden="true" />
                Nueva planta
              </Button>
            }
          />
        </div>

        <InventoryStats plants={plants} />
        <PlantsTable plants={plants} />
      </main>
    </>
  )
}
