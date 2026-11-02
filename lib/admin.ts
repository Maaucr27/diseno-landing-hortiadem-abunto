import 'server-only'
import { cache } from 'react'
import { currentUser, type User } from '@clerk/nextjs/server'

function authorizedEmails() {
  return (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean)
}

function isAdmin(user: User) {
  if (user.publicMetadata?.role === 'admin') return true

  const allowed = authorizedEmails()
  if (allowed.length === 0) return false

  return user.emailAddresses.some(
    (address) =>
      address.verification?.status === 'verified' &&
      allowed.includes(address.emailAddress.toLowerCase()),
  )
}

export const getAdminUser = cache(async () => {
  const user = await currentUser()
  if (!user || !isAdmin(user)) return null

  return {
    id: user.id,
    name: user.firstName ?? user.username ?? 'Administrador',
  }
})
