'use client'

import { useState, useTransition } from 'react'
import { Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deletePlant } from '@/app/actions/admin'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { adminGhostButton } from './styles'

export function DeletePlantButton({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function confirmDelete() {
    startTransition(async () => {
      const result = await deletePlant(id)
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      toast.success(`${name} eliminada`)
      setOpen(false)
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Eliminar ${name}`}
            className="size-9 rounded-full border-red-300/25 bg-red-500/10 text-red-100 transition-all duration-200 hover:bg-red-500/25 hover:text-white active:scale-[0.96]"
          />
        }
      >
        <Trash2 className="size-4" aria-hidden="true" />
      </AlertDialogTrigger>
      <AlertDialogContent className="glass-green-strong rounded-3xl border-white/20 text-emerald-50">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-2xl font-medium">
            ¿Eliminar {name}?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-emerald-100/75">
            Se borrará del catálogo y de los favoritos de los clientes. Esta acción no se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={adminGhostButton} disabled={pending}>
            Cancelar
          </AlertDialogCancel>
          <Button
            type="button"
            onClick={confirmDelete}
            disabled={pending}
            className="rounded-full bg-red-600/90 text-white transition-all duration-200 hover:bg-red-600 active:scale-[0.96]"
          >
            {pending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Sí, eliminar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
