'use server'

import { eq, max } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getAdminUser } from '@/lib/admin'
import { db } from '@/lib/db'
import { favorites, plants } from '@/lib/db/schema'
import { LIGHT_OPTIONS, WATER_OPTIONS } from '@/lib/plant-options'

export type ActionResult = { ok: true } | { ok: false; error: string }

const UNAUTHORIZED: ActionResult = { ok: false, error: 'No tienes permisos para esta acción.' }

function field(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function parseInteger(raw: string) {
  if (!/^\d+$/.test(raw)) return null
  const value = Number(raw)
  return Number.isSafeInteger(value) && value <= 1_000_000 ? value : null
}

function isValidImage(url: string) {
  if (url.startsWith('/') && !url.startsWith('//')) return true
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' || parsed.protocol === 'http:'
  } catch {
    return false
  }
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

type PlantInput = {
  name: string
  scientificName: string
  category: string
  description: string
  image: string
  imageAlt: string
  water: string
  light: string
  price: number | null
  stock: number
  action: 'add' | 'inquire'
  sortOrder: number | null
}

function parsePlant(formData: FormData): { data: PlantInput } | { error: string } {
  const name = field(formData, 'name')
  const scientificName = field(formData, 'scientificName')
  const category = field(formData, 'category')
  const description = field(formData, 'description')
  const image = field(formData, 'image')
  const water = field(formData, 'water')
  const light = field(formData, 'light')
  const priceRaw = field(formData, 'price')
  const stockRaw = field(formData, 'stock')
  const sortRaw = field(formData, 'sortOrder')

  if (!name || name.length > 80) return { error: 'Ingresa un nombre común (máx. 80 caracteres).' }
  if (!scientificName || scientificName.length > 120) {
    return { error: 'Ingresa el nombre científico.' }
  }
  if (!category || category.length > 60) return { error: 'Selecciona una categoría.' }
  if (!description || description.length > 600) {
    return { error: 'Escribe una descripción (máx. 600 caracteres).' }
  }
  if (!isValidImage(image)) {
    return { error: 'La imagen debe ser una URL https o una ruta que empiece con /.' }
  }
  if (!(WATER_OPTIONS as readonly string[]).includes(water)) {
    return { error: 'Selecciona la frecuencia de riego.' }
  }
  if (!(LIGHT_OPTIONS as readonly string[]).includes(light)) {
    return { error: 'Selecciona la exposición de luz.' }
  }

  let price: number | null = null
  if (priceRaw) {
    price = parseInteger(priceRaw)
    if (price === null) return { error: 'El precio debe ser un número entero positivo.' }
  }

  const stock = stockRaw ? parseInteger(stockRaw) : 0
  if (stock === null) return { error: 'El stock debe ser un número entero positivo.' }

  let sortOrder: number | null = null
  if (sortRaw) {
    sortOrder = parseInteger(sortRaw)
    if (sortOrder === null) return { error: 'El orden debe ser un número entero positivo.' }
  }

  return {
    data: {
      name,
      scientificName,
      category,
      description,
      image,
      imageAlt: field(formData, 'imageAlt') || name,
      water,
      light,
      price,
      stock,
      action: price === null ? 'inquire' : 'add',
      sortOrder,
    },
  }
}

function revalidateCatalog(id?: string) {
  revalidatePath('/')
  revalidatePath('/admin')
  if (id) revalidatePath(`/producto/${id}`)
}

async function uniqueId(name: string) {
  const base = slugify(name) || 'planta'
  const rows = await db.select({ id: plants.id }).from(plants)
  const taken = new Set(rows.map((row) => row.id))
  if (!taken.has(base)) return base

  let suffix = 2
  while (taken.has(`${base}-${suffix}`)) suffix += 1
  return `${base}-${suffix}`
}

export async function createPlant(formData: FormData): Promise<ActionResult> {
  if (!(await getAdminUser())) return UNAUTHORIZED

  const parsed = parsePlant(formData)
  if ('error' in parsed) return { ok: false, error: parsed.error }

  const { sortOrder, ...data } = parsed.data
  const id = await uniqueId(data.name)

  let order = sortOrder
  if (order === null) {
    const [row] = await db.select({ value: max(plants.sortOrder) }).from(plants)
    order = (row?.value ?? 0) + 1
  }

  await db.insert(plants).values({ id, ...data, sortOrder: order })
  revalidateCatalog(id)
  return { ok: true }
}

export async function updatePlant(formData: FormData): Promise<ActionResult> {
  if (!(await getAdminUser())) return UNAUTHORIZED

  const id = field(formData, 'id')
  if (!id) return { ok: false, error: 'Planta no encontrada.' }

  const parsed = parsePlant(formData)
  if ('error' in parsed) return { ok: false, error: parsed.error }

  const { sortOrder, ...data } = parsed.data
  const updated = await db
    .update(plants)
    .set(sortOrder === null ? data : { ...data, sortOrder })
    .where(eq(plants.id, id))
    .returning({ id: plants.id })

  if (updated.length === 0) return { ok: false, error: 'Planta no encontrada.' }
  revalidateCatalog(id)
  return { ok: true }
}

export async function updatePlantQuickField(
  id: string,
  fieldName: 'price' | 'stock',
  raw: string,
): Promise<ActionResult> {
  if (!(await getAdminUser())) return UNAUTHORIZED

  const value = raw.trim()

  if (fieldName === 'stock') {
    const stock = parseInteger(value)
    if (stock === null) return { ok: false, error: 'El stock debe ser un entero positivo.' }
    await db.update(plants).set({ stock }).where(eq(plants.id, id))
  } else if (value === '') {
    await db.update(plants).set({ price: null, action: 'inquire' }).where(eq(plants.id, id))
  } else {
    const price = parseInteger(value)
    if (price === null) return { ok: false, error: 'El precio debe ser un entero positivo.' }
    await db.update(plants).set({ price, action: 'add' }).where(eq(plants.id, id))
  }

  revalidateCatalog(id)
  return { ok: true }
}

export async function deletePlant(id: string): Promise<ActionResult> {
  if (!(await getAdminUser())) return UNAUTHORIZED

  await db.transaction(async (tx) => {
    await tx.delete(favorites).where(eq(favorites.plantId, id))
    await tx.delete(plants).where(eq(plants.id, id))
  })

  revalidateCatalog(id)
  return { ok: true }
}
