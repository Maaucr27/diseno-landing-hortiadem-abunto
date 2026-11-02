'use client'

import { useState, useTransition, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Mail, Send, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { sendPromotionalCampaign } from '@/app/actions/email'
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
import { Textarea } from '@/components/ui/textarea'
import { adminGhostButton, adminInput, adminPrimaryButton, adminTextarea } from './styles'

export function EmailCampaignDialog() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      setError(null)
      const res = await sendPromotionalCampaign(formData)
      if (!res.ok) {
        setError(res.error || 'Ocurrió un error al enviar el correo.')
        return
      }

      toast.success(res.message || 'Campaña enviada con éxito.', {
        description: res.mocked
          ? 'Simulación completada. Agrega RESEND_API_KEY en tu .env para envíos reales.'
          : 'Correo entregado mediante la API de Resend.',
      })
      setOpen(false)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="border-emerald-500/40 bg-emerald-900/60 text-emerald-100 backdrop-blur-md hover:bg-emerald-800/80 hover:text-white"
          >
            <Mail className="size-4 text-emerald-300" aria-hidden="true" />
            Campaña Resend
          </Button>
        }
      />
      <DialogContent className="glass-green-strong max-h-[90dvh] gap-5 overflow-y-auto rounded-3xl border-white/20 p-5 text-emerald-50 sm:max-w-xl sm:p-7">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
              <Mail className="size-4" />
            </span>
            <DialogTitle className="font-serif text-2xl font-medium text-emerald-50">
              Campaña de Correo (Resend)
            </DialogTitle>
          </div>
          <DialogDescription className="text-emerald-100/70">
            Envía boletines, novedades del catálogo o promociones con la identidad visual de
            Hortiadem Abunto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="recipient" className="text-emerald-50">
              Destinatario (Email de prueba)
            </Label>
            <Input
              id="recipient"
              name="recipient"
              type="email"
              defaultValue="yasircoreassosa@gmail.com"
              placeholder="cliente@ejemplo.com"
              className={adminInput}
            />
            <p className="text-xs text-emerald-100/60">
              Ingresa el correo al que enviarás este mensaje o prueba.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="subject" className="text-emerald-50">
              Asunto del correo
            </Label>
            <Input
              id="subject"
              name="subject"
              required
              defaultValue="🌸 Nuevas Rosas del Desierto en Hortiadem Abunto"
              placeholder="Asunto llamativo para tus clientes"
              className={adminInput}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title" className="text-emerald-50">
              Título destacado
            </Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue="¡La floración de otoño ha comenzado en nuestro vivero!"
              placeholder="Encabezado del correo"
              className={adminInput}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="message" className="text-emerald-50">
              Mensaje principal
            </Label>
            <Textarea
              id="message"
              name="message"
              required
              rows={4}
              defaultValue={`Nos alegra presentarte nuestros nuevos ejemplares seleccionados de Rosa del Desierto 'Red Velvet' y cactos de colección.\n\nCada ejemplar cuenta con caudex desarrollado y garantía de 15 días.`}
              placeholder="Redacta las novedades o promociones..."
              className={adminTextarea}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="promoCode" className="text-emerald-50">
              Código Promocional (Opcional)
            </Label>
            <Input
              id="promoCode"
              name="promoCode"
              defaultValue="ABUNTO10"
              placeholder="Ej: ABUNTO15"
              className={adminInput}
            />
          </div>

          {error && <p className="text-sm font-medium text-red-300">{error}</p>}

          <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className={adminGhostButton}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={pending} className={adminPrimaryButton}>
              {pending ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="size-4" aria-hidden="true" />
              )}
              Enviar correo con Resend
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
