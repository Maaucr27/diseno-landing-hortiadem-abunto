'use server'

import { eq, max } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getAdminUser } from '@/lib/admin'
import { db } from '@/lib/db'
import { favorites, plants } from '@/lib/db/schema'
import {
  createInMemoryPlant,
  deleteInMemoryPlant,
  getInMemoryAdminPlants,
  updateInMemoryPlant,
} from '@/lib/db/memory-store'
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
  details?: string | null
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

  // Detailed presentation fields
  const badge = field(formData, 'badge')
  const summary = field(formData, 'summary')
  const galleryRaw = field(formData, 'galleryUrls')
  const sizesRaw = field(formData, 'sizesRaw')
  const careLightDetail = field(formData, 'careLightDetail')
  const careWaterDetail = field(formData, 'careWaterDetail')
  const careSubstrate = field(formData, 'careSubstrate')
  const careSubstrateDetail = field(formData, 'careSubstrateDetail')
  const careDifficulty = field(formData, 'careDifficulty')
  const careDifficultyDetail = field(formData, 'careDifficultyDetail')
  const historyText = field(formData, 'historyText')
  const careGuideText = field(formData, 'careGuideText')
  const shippingText = field(formData, 'shippingText')
  const detailsJsonRaw = field(formData, 'detailsJson')

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
  if (!(WATER_OPTIONS as readonly string[]).includes(water as any)) {
    return { error: 'Selecciona la frecuencia de riego.' }
  }
  if (!(LIGHT_OPTIONS as readonly string[]).includes(light as any)) {
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

  // Construct details object
  let details: string | null = null
  if (detailsJsonRaw) {
    try {
      JSON.parse(detailsJsonRaw)
      details = detailsJsonRaw
    } catch {
      // ignore
    }
  }

  if (!details) {
    const detailsObj: Record<string, any> = {}
    if (badge) detailsObj.badge = badge
    if (summary) detailsObj.summary = summary

    // Gallery
    const extraImages = galleryRaw
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
    detailsObj.gallery = [
      {
        id: 'principal',
        src: image,
        alt: field(formData, 'imageAlt') || name,
        label: 'Vista Principal',
      },
      ...extraImages.map((src, idx) => ({
        id: `img-${idx + 1}`,
        src,
        alt: `${name} vista ${idx + 2}`,
        label: `Foto ${idx + 2}`,
      })),
    ]

    // Sizes
    if (sizesRaw) {
      const parsedSizes = sizesRaw
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line, idx) => {
          const parts = line.split('|').map((p) => p.trim())
          const label = parts[0] || `Presentación ${idx + 1}`
          const sizePrice = parts[1] ? Number(parts[1]) || 0 : (price ?? 0)
          const desc = parts[2] || 'Ejemplar cultivado en vivero'
          const stockLabel = parts[3] || 'Disponible'
          return { id: `size-${idx + 1}`, label, price: sizePrice, description: desc, stock: stockLabel }
        })
      if (parsedSizes.length > 0) detailsObj.sizes = parsedSizes
    }

    // Care items
    const careItems = [
      {
        key: 'light',
        title: 'Luz',
        value: light,
        detail:
          careLightDetail ||
          (light === 'Sol directo'
            ? 'Requiere al menos 6 horas de sol directo al día.'
            : 'Luz filtrada brillante.'),
      },
      {
        key: 'water',
        title: 'Riego',
        value: water,
        detail:
          careWaterDetail ||
          (water === 'Riego escaso'
            ? 'Regar cuando el sustrato esté 100% seco.'
            : 'Riego moderado equilibrado.'),
      },
      {
        key: 'substrate',
        title: 'Sustrato',
        value: careSubstrate || 'Mineral y aireado',
        detail: careSubstrateDetail || 'Mezcla porosa con excelente drenaje.',
      },
      {
        key: 'difficulty',
        title: 'Dificultad',
        value: careDifficulty || 'Media - Fácil',
        detail: careDifficultyDetail || 'Apta para cultivo en maceta con buenos cuidados.',
      },
    ]
    detailsObj.care = careItems

    // Sections
    const sections = []
    if (historyText) {
      sections.push({
        id: 'historia',
        title: 'Historia y Cuidados',
        paragraphs: historyText.split('\n\n').map((p) => p.trim()).filter(Boolean),
      })
    }
    if (careGuideText) {
      sections.push({
        id: 'riego',
        title: 'Guía de Riego',
        paragraphs: careGuideText.split('\n\n').map((p) => p.trim()).filter(Boolean),
      })
    }
    if (shippingText) {
      sections.push({
        id: 'envios',
        title: 'Envíos y Garantía',
        paragraphs: shippingText.split('\n\n').map((p) => p.trim()).filter(Boolean),
      })
    }
    if (sections.length > 0) detailsObj.sections = sections

    if (Object.keys(detailsObj).length > 0) {
      details = JSON.stringify(detailsObj)
    }
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
      details,
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
  let taken = new Set<string>()

  if (process.env.DATABASE_URL) {
    try {
      const rows = await db.select({ id: plants.id }).from(plants)
      taken = new Set(rows.map((row: any) => row.id))
    } catch {
      taken = new Set(getInMemoryAdminPlants().map((p) => p.id))
    }
  } else {
    taken = new Set(getInMemoryAdminPlants().map((p) => p.id))
  }

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
    if (process.env.DATABASE_URL) {
      try {
        const [row] = await db.select({ value: max(plants.sortOrder) }).from(plants)
        order = (row?.value ?? 0) + 1
      } catch {
        const existing = getInMemoryAdminPlants()
        const maxOrder = existing.reduce((maxVal, p) => Math.max(maxVal, p.sortOrder), 0)
        order = maxOrder + 1
      }
    } else {
      const existing = getInMemoryAdminPlants()
      const maxOrder = existing.reduce((maxVal, p) => Math.max(maxVal, p.sortOrder), 0)
      order = maxOrder + 1
    }
  }

  const newPlantRecord = {
    id,
    ...data,
    sortOrder: order ?? 1,
    createdAt: new Date(),
  }

  if (process.env.DATABASE_URL) {
    try {
      await db.insert(plants).values(newPlantRecord)
    } catch (err) {
      console.warn('[AI Studio] Database insert failed, saving to memory store:', err)
      createInMemoryPlant(newPlantRecord)
    }
  } else {
    createInMemoryPlant(newPlantRecord)
  }

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
  const updates = sortOrder === null ? data : { ...data, sortOrder }

  if (process.env.DATABASE_URL) {
    try {
      const updated = await db
        .update(plants)
        .set(updates)
        .where(eq(plants.id, id))
        .returning({ id: plants.id })

      if (updated.length > 0) {
        revalidateCatalog(id)
        return { ok: true }
      }
    } catch (err) {
      console.warn('[AI Studio] Database update failed, updating memory store:', err)
    }
  }

  const ok = updateInMemoryPlant(id, updates)
  if (!ok) return { ok: false, error: 'Planta no encontrada.' }
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
  let updateData: { stock?: number; price?: number | null; action?: 'add' | 'inquire' } = {}

  if (fieldName === 'stock') {
    const stock = parseInteger(value)
    if (stock === null) return { ok: false, error: 'El stock debe ser un entero positivo.' }
    updateData = { stock }
  } else if (value === '') {
    updateData = { price: null, action: 'inquire' }
  } else {
    const price = parseInteger(value)
    if (price === null) return { ok: false, error: 'El precio debe ser un entero positivo.' }
    updateData = { price, action: 'add' }
  }

  if (process.env.DATABASE_URL) {
    try {
      await db.update(plants).set(updateData).where(eq(plants.id, id))
      revalidateCatalog(id)
      return { ok: true }
    } catch (err) {
      console.warn('[AI Studio] Database quick field update failed, updating memory store:', err)
    }
  }

  updateInMemoryPlant(id, updateData)
  revalidateCatalog(id)
  return { ok: true }
}

export async function deletePlant(id: string): Promise<ActionResult> {
  if (!(await getAdminUser())) return UNAUTHORIZED

  if (process.env.DATABASE_URL) {
    try {
      await db.transaction(async (tx: any) => {
        await tx.delete(favorites).where(eq(favorites.plantId, id))
        await tx.delete(plants).where(eq(plants.id, id))
      })
      revalidateCatalog(id)
      return { ok: true }
    } catch (err) {
      console.warn('[AI Studio] Database delete failed, deleting from memory store:', err)
    }
  }

  deleteInMemoryPlant(id)
  revalidateCatalog(id)
  return { ok: true }
}
