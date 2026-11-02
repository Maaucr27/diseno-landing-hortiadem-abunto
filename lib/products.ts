export type WaterLevel = 'Riego escaso' | 'Riego moderado' | 'Riego semanal'
export type LightLevel = 'Sol directo' | 'Luz brillante' | 'Luz filtrada'

export type Product = {
  id: string
  name: string
  scientificName: string
  category: string
  description: string
  image: string
  imageAlt: string
  water: WaterLevel
  light: LightLevel
  price: number | null
  action: 'add' | 'inquire'
}

export const products: Product[] = [
  {
    id: 'rosa-del-desierto',
    name: 'Rosa del Desierto',
    scientificName: 'Adenium obesum',
    category: 'Caudiciforme',
    description:
      'Tronco escultórico y floración rosa intensa. Un ejemplar joven de caudex marcado.',
    image: '/images/rosa-del-desierto.png',
    imageAlt: 'Rosa del desierto con flores rosas en maceta de terracota',
    water: 'Riego escaso',
    light: 'Sol directo',
    price: 48,
    action: 'add',
  },
  {
    id: 'astrophytum',
    name: 'Cacto Astrophytum',
    scientificName: 'Astrophytum asterias',
    category: 'Cacto de colección',
    description:
      'El “cacto erizo de mar” de cuerpo ribeteado y motas blancas. Pieza de coleccionista.',
    image: '/images/astrophytum.png',
    imageAlt: 'Cacto Astrophytum redondo con motas blancas en maceta de cerámica',
    water: 'Riego escaso',
    light: 'Luz brillante',
    price: 36,
    action: 'add',
  },
  {
    id: 'orquidea',
    name: 'Orquídea Phalaenopsis',
    scientificName: 'Phalaenopsis amabilis',
    category: 'Orquídea',
    description:
      'Vara larga con flores blancas de pétalo sedoso, en maceta transparente para ver las raíces.',
    image: '/images/orquidea.png',
    imageAlt: 'Orquídea blanca Phalaenopsis en maceta de vidrio',
    water: 'Riego semanal',
    light: 'Luz filtrada',
    price: null,
    action: 'inquire',
  },
  {
    id: 'echeveria',
    name: 'Echeveria Perla',
    scientificName: 'Echeveria elegans',
    category: 'Suculenta',
    description:
      'Roseta compacta en tonos azul verdoso con destellos rosados. Ideal para interior luminoso.',
    image: '/images/echeveria.png',
    imageAlt: 'Suculenta Echeveria en maceta de piedra moteada',
    water: 'Riego moderado',
    light: 'Luz brillante',
    price: 18,
    action: 'add',
  },
]
