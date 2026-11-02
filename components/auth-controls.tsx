'use client'

import { Show, SignInButton, UserButton } from '@clerk/nextjs'

export function AuthControls() {
  return (
    <>
      <Show when="signed-out">
        <SignInButton mode="modal">
          <button
            type="button"
            className="glass-green inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-emerald-50 backdrop-blur-md transition-all duration-200 hover:bg-white/20 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-200"
          >
            Iniciar Sesión
          </button>
        </SignInButton>
      </Show>
      <Show when="signed-in">
        <UserButton appearance={{ elements: { avatarBox: 'size-9' } }} />
      </Show>
    </>
  )
}
