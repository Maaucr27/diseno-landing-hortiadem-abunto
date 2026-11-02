'use server'

import { getAdminUser } from '@/lib/admin'
import { sendEmail } from '@/lib/resend'

export type EmailActionResult = {
  ok: boolean
  error?: string
  message?: string
  mocked?: boolean
}

export async function sendPromotionalCampaign(formData: FormData): Promise<EmailActionResult> {
  const admin = await getAdminUser()
  if (!admin) return { ok: false, error: 'No tienes permisos de administrador.' }

  const subject = String(formData.get('subject') || '').trim()
  const title = String(formData.get('title') || '').trim()
  const message = String(formData.get('message') || '').trim()
  const promoCode = String(formData.get('promoCode') || '').trim()
  const recipient = String(formData.get('recipient') || '').trim()

  if (!subject) return { ok: false, error: 'Por favor ingresa un asunto para la campaña.' }
  if (!title) return { ok: false, error: 'Por favor ingresa un título destacado.' }
  if (!message) return { ok: false, error: 'Por favor ingresa el cuerpo del mensaje.' }

  const targetEmail = recipient || 'yasircoreassosa@gmail.com'

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #064e3b; color: #ecfdf5; margin: 0; padding: 40px 20px; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, rgba(6,78,59,0.95), rgba(4,120,87,0.95)); border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; padding: 36px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); }
          .badge { display: inline-block; background: rgba(255,255,255,0.15); color: #a7f3d0; padding: 6px 14px; border-radius: 9999px; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
          h1 { color: #ffffff; font-family: Georgia, serif; font-size: 32px; margin-top: 0; line-height: 1.2; }
          p { color: #d1fae5; font-size: 16px; line-height: 1.6; }
          .promo-box { background: rgba(255,255,255,0.1); border: 2px dashed #6ee7b7; border-radius: 16px; padding: 20px; text-align: center; margin: 28px 0; }
          .code { font-size: 24px; font-weight: bold; letter-spacing: 3px; color: #fde68a; }
          .btn { display: inline-block; background: #10b981; color: #064e3b; font-weight: bold; padding: 14px 28px; border-radius: 9999px; text-decoration: none; margin-top: 10px; }
          .footer { margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 20px; font-size: 13px; color: #a7f3d0; opacity: 0.8; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="badge">Hortiadem Abunto • Vivero Boutique</div>
          <h1>${title}</h1>
          <p>${message.replace(/\n/g, '<br/>')}</p>
          ${
            promoCode
              ? `
            <div class="promo-box">
              <p style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; color: #a7f3d0;">Tu código exclusivo de temporada:</p>
              <div class="code">${promoCode}</div>
            </div>
          `
              : ''
          }
          <div style="text-align: center; margin-top: 30px;">
            <a href="https://hortiadem.com" class="btn">Explorar el Catálogo</a>
          </div>
          <div class="footer">
            <p>Hortiadem Abunto • Rosas del Desierto, Cactos de Colección y Orquídeas.</p>
          </div>
        </div>
      </body>
    </html>
  `

  const result = await sendEmail({
    to: targetEmail,
    subject,
    html,
    text: `${title}\n\n${message}\n\nCódigo: ${promoCode}`,
  })

  if (!result.success) {
    return { ok: false, error: result.error }
  }

  return {
    ok: true,
    mocked: result.mocked,
    message: result.mocked
      ? `Campaña simulada correctamente hacia ${targetEmail}. (Configura RESEND_API_KEY para envío en producción).`
      : `¡Campaña enviada con éxito a ${targetEmail}!`,
  }
}

export async function sendReservationEmail(params: {
  customerName: string
  customerEmail?: string
  plantName: string
  sizeLabel: string
  price: number
}): Promise<EmailActionResult> {
  const { customerName, customerEmail, plantName, sizeLabel, price } = params
  const recipient = customerEmail || 'yasircoreassosa@gmail.com'

  const html = `
    <!DOCTYPE html>
    <html lang="es">
      <body style="font-family: sans-serif; background: #064e3b; color: #ecfdf5; padding: 30px;">
        <div style="max-width: 500px; margin: auto; background: #047857; padding: 25px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2);">
          <h2 style="color: #fff; margin-top: 0;">¡Reserva Recibida! 🌿</h2>
          <p>Hola <strong>${customerName || 'Amante de las plantas'}</strong>,</p>
          <p>Hemos recibido tu solicitud de reserva para:</p>
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 12px; margin: 15px 0;">
            <p style="margin: 0; font-weight: bold; font-size: 18px; color: #a7f3d0;">${plantName}</p>
            <p style="margin: 5px 0 0; color: #fff;">Presentación: ${sizeLabel}</p>
            <p style="margin: 5px 0 0; font-size: 16px; color: #fde68a;">Total: $${price} USD</p>
          </div>
          <p>Nos pondremos en contacto contigo dentro de las próximas 24 horas para coordinar la entrega o el envío protegido.</p>
          <p style="font-size: 13px; color: #a7f3d0; margin-top: 25px;">— Equipo de Hortiadem Abunto</p>
        </div>
      </body>
    </html>
  `

  const result = await sendEmail({
    to: recipient,
    subject: `Reserva confirmada: ${plantName} - Hortiadem Abunto`,
    html,
  })

  return { ok: result.success, error: result.error, mocked: result.mocked }
}
