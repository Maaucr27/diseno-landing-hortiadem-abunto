import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY

export const resend = apiKey ? new Resend(apiKey) : null

export const DEFAULT_FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || 'Hortiadem Abunto <onboarding@resend.dev>'

export type SendEmailOptions = {
  to: string | string[]
  subject: string
  html: string
  text?: string
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  if (!resend) {
    console.warn('[AI Studio Resend] RESEND_API_KEY not configured. Email logged to console:')
    console.info({ to, subject })
    return {
      success: true,
      id: `mock_email_${Date.now()}`,
      mocked: true,
      message: 'Correo simulado (configura RESEND_API_KEY en .env para envío real).',
    }
  }

  try {
    const data = await resend.emails.send({
      from: DEFAULT_FROM_EMAIL,
      to,
      subject,
      html,
      text,
    })

    return {
      success: true,
      id: data.data?.id,
      mocked: false,
    }
  } catch (err: any) {
    console.error('[AI Studio Resend] Error enviando correo:', err)
    return {
      success: false,
      error: err?.message || 'Error desconocido al enviar correo.',
    }
  }
}
