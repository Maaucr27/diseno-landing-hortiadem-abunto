'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { updatePlantQuickField } from '@/app/actions/admin'
import { Input } from '@/components/ui/input'
import { adminInput } from './styles'

type Props = {
  id: string
  field: 'price' | 'stock'
  value: number | null
  label: string
  prefix?: string
  placeholder?: string
}

export function InlineNumberField({ id, field, value, label, prefix, placeholder }: Props) {
  const original = value === null ? '' : String(value)
  const [draft, setDraft] = useState(original)
  const [pending, startTransition] = useTransition()

  function commit() {
    if (draft === original) return

    startTransition(async () => {
      const result = await updatePlantQuickField(id, field, draft)
      if (!result.ok) {
        toast.error(result.error)
        setDraft(original)
        return
      }
      toast.success('Guardado')
    })
  }

  return (
    <div className="relative w-24">
      {prefix ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-emerald-100/60"
        >
          {prefix}
        </span>
      ) : null}
      <Input
        type="number"
        inputMode="numeric"
        min={0}
        step={1}
        value={draft}
        aria-label={label}
        placeholder={placeholder}
        disabled={pending}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur()
        }}
        className={`${adminInput} h-9 tabular-nums ${prefix ? 'pl-6' : ''}`}
      />
    </div>
  )
}
