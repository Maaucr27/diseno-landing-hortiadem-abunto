import type { LightLevel, Product, WaterLevel } from '@/lib/products'

export type DbPlant = {
  id: string
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
  sortOrder: number
  details?: string | null
  createdAt: Date
}

const DEFAULT_PLANTS: DbPlant[] = [
  {
    id: 'rosa-del-desierto-red-velvet',
    name: "Rosa del Desierto 'Red Velvet'",
    scientificName: 'Adenium obesum',
    category: 'Rosa del Desierto',
    description:
      'Caudex grueso y flores aterciopeladas de un rojo intenso. Ejemplar de colección cultivado a pleno sol.',
    image: '/images/rosa-del-desierto.png',
    imageAlt: "Rosa del desierto 'Red Velvet' en floración",
    water: 'Riego escaso',
    light: 'Sol directo',
    price: 48,
    stock: 12,
    action: 'add',
    sortOrder: 1,
    createdAt: new Date('2026-01-01'),
  },
  {
    id: 'astrophytum-asterias',
    name: 'Astrophytum Asterias',
    scientificName: 'Astrophytum asterias',
    category: 'Cacto',
    description:
      'Cacto estrella sin espinas con punteado blanco característico. Pieza botánica de crecimiento lento.',
    image: '/images/astrophytum.png',
    imageAlt: 'Astrophytum asterias en maceta circular',
    water: 'Riego escaso',
    light: 'Sol directo',
    price: 35,
    stock: 8,
    action: 'add',
    sortOrder: 2,
    createdAt: new Date('2026-01-02'),
  },
  {
    id: 'echeveria-laui',
    name: 'Echeveria Laui',
    scientificName: 'Echeveria laui',
    category: 'Suculenta',
    description:
      'Roseta compacta recubierta de pruina blanca azulada. Una de las suculentas más codiciadas.',
    image: '/images/echeveria.png',
    imageAlt: 'Echeveria laui con hojas carnosas azul pálido',
    water: 'Riego moderado',
    light: 'Luz brillante',
    price: 28,
    stock: 15,
    action: 'add',
    sortOrder: 3,
    createdAt: new Date('2026-01-03'),
  },
  {
    id: 'orquidea-phalaenopsis-silvestre',
    name: 'Orquídea Phalaenopsis Silvestre',
    scientificName: 'Phalaenopsis aphrodite',
    category: 'Orquídea',
    description:
      'Flores elegantes de larga duración sobre vara floral arqueada. Ideal para interiores luminosos.',
    image: '/images/orquidea.png',
    imageAlt: 'Orquídea en floración con flores blancas y centro dorado',
    water: 'Riego semanal',
    light: 'Luz filtrada',
    price: null,
    stock: 5,
    action: 'inquire',
    sortOrder: 4,
    createdAt: new Date('2026-01-04'),
  },
]

// Global in-memory storage to survive hot reloads in development
const globalStore = globalThis as unknown as {
  __plantsStore?: DbPlant[]
  __favoritesStore?: Set<string> // `${userId}:${plantId}`
}

if (!globalStore.__plantsStore) {
  globalStore.__plantsStore = [...DEFAULT_PLANTS]
}
if (!globalStore.__favoritesStore) {
  globalStore.__favoritesStore = new Set<string>()
}

export function getInMemoryProducts(): Product[] {
  const plants = [...(globalStore.__plantsStore || DEFAULT_PLANTS)]
  plants.sort((a, b) => a.sortOrder - b.sortOrder)
  return plants.map((row) => ({
    id: row.id,
    name: row.name,
    scientificName: row.scientificName,
    category: row.category,
    description: row.description,
    image: row.image,
    imageAlt: row.imageAlt,
    water: row.water as WaterLevel,
    light: row.light as LightLevel,
    price: row.price,
    action: row.action === 'inquire' ? 'inquire' : 'add',
  }))
}

export function getInMemoryAdminPlants(): DbPlant[] {
  const plants = [...(globalStore.__plantsStore || DEFAULT_PLANTS)]
  return plants.sort((a, b) => {
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
    return a.name.localeCompare(b.name)
  })
}

export function getInMemoryFavorites(userId: string): string[] {
  const userFavorites: string[] = []
  const prefix = `${userId}:`
  for (const item of globalStore.__favoritesStore || []) {
    if (item.startsWith(prefix)) {
      userFavorites.push(item.slice(prefix.length))
    }
  }
  return userFavorites
}

export function toggleInMemoryFavorite(userId: string, plantId: string): boolean {
  const key = `${userId}:${plantId}`
  if (!globalStore.__favoritesStore) {
    globalStore.__favoritesStore = new Set()
  }
  if (globalStore.__favoritesStore.has(key)) {
    globalStore.__favoritesStore.delete(key)
    return false
  } else {
    globalStore.__favoritesStore.add(key)
    return true
  }
}

export function createInMemoryPlant(plant: DbPlant): void {
  if (!globalStore.__plantsStore) globalStore.__plantsStore = [...DEFAULT_PLANTS]
  globalStore.__plantsStore.push(plant)
}

export function updateInMemoryPlant(id: string, updates: Partial<DbPlant>): boolean {
  if (!globalStore.__plantsStore) globalStore.__plantsStore = [...DEFAULT_PLANTS]
  const idx = globalStore.__plantsStore.findIndex((p) => p.id === id)
  if (idx === -1) return false
  globalStore.__plantsStore[idx] = { ...globalStore.__plantsStore[idx], ...updates }
  return true
}

export function deleteInMemoryPlant(id: string): boolean {
  if (!globalStore.__plantsStore) globalStore.__plantsStore = [...DEFAULT_PLANTS]
  const initialLength = globalStore.__plantsStore.length
  globalStore.__plantsStore = globalStore.__plantsStore.filter((p) => p.id !== id)
  return globalStore.__plantsStore.length < initialLength
}

export function getInMemoryPlantById(id: string): DbPlant | undefined {
  const plants = globalStore.__plantsStore || DEFAULT_PLANTS
  return plants.find((p) => p.id === id)
}
