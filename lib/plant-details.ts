export type GalleryImage = {
  id: string
  src: string
  alt: string
  label: string
}

export type PlantSize = {
  id: string
  label: string
  description: string
  price: number
  stock: string
}

export type CareKey = 'light' | 'water' | 'substrate' | 'difficulty'

export type CareItem = {
  key: CareKey
  title: string
  value: string
  detail: string
}

export type InfoSection = {
  id: string
  title: string
  paragraphs: string[]
}

export type PlantDetail = {
  slug: string
  name: string
  scientificName: string
  badge: string
  summary: string
  gallery: GalleryImage[]
  sizes: PlantSize[]
  care: CareItem[]
  sections: InfoSection[]
}

export const plantDetails: PlantDetail[] = [
  {
    slug: 'rosa-del-desierto-red-velvet',
    name: "Rosa del Desierto 'Red Velvet'",
    scientificName: 'Adenium obesum',
    badge: 'Edición Coleccionista',
    summary:
      'Flores de un carmesí aterciopelado sobre un caudex escultórico. Una variedad selecta cultivada en el vivero, con raíz sana y floración probada.',
    gallery: [
      {
        id: 'floracion',
        src: '/images/red-velvet-floracion.png',
        alt: "Rosa del desierto 'Red Velvet' con flores carmesí en plena floración",
        label: 'Floración',
      },
      {
        id: 'caudex',
        src: '/images/red-velvet-caudex.png',
        alt: 'Caudex engrosado y raíces expuestas de una rosa del desierto',
        label: 'Raíz y caudex',
      },
      {
        id: 'tamano',
        src: '/images/red-velvet-tamano.png',
        alt: 'Rosa del desierto en maceta de 6 pulgadas junto a una mano para comparar su tamaño',
        label: 'Tamaño',
      },
      {
        id: 'maceta',
        src: '/images/rosa-del-desierto.png',
        alt: 'Rosa del desierto con flores rosas en maceta de terracota',
        label: 'En maceta',
      },
    ],
    sizes: [
      {
        id: 'maceta-6',
        label: 'Maceta 6 pulg',
        description: 'Ejemplar joven, 2 a 3 años, caudex en formación.',
        price: 48,
        stock: 'Disponible',
      },
      {
        id: 'maceta-8',
        label: 'Maceta 8 pulg',
        description: 'Caudex marcado y ramificación temprana.',
        price: 86,
        stock: 'Pocas unidades',
      },
      {
        id: 'adulto',
        label: 'Ejemplar Adulto Formado',
        description: 'Planta de 5 años o más, caudex escultórico y floración abundante.',
        price: 180,
        stock: 'Pieza única',
      },
    ],
    care: [
      {
        key: 'light',
        title: 'Luz',
        value: 'Sol directo / Alta radiación',
        detail:
          'Necesita al menos 6 horas de sol directo al día. Con menos luz, el tronco se alarga y la floración disminuye.',
      },
      {
        key: 'water',
        title: 'Riego',
        value: 'Escaso / Cada 10-12 días',
        detail:
          'Riega en profundidad y espera a que el sustrato se seque por completo. En invierno, reduce a una vez al mes.',
      },
      {
        key: 'substrate',
        title: 'Sustrato',
        value: 'Drenaje extremo / Mineral',
        detail:
          'Mezcla de pumita, arena gruesa y un poco de fibra de coco. Usa maceta con orificios y nunca platos con agua.',
      },
      {
        key: 'difficulty',
        title: 'Dificultad',
        value: 'Principiante - Fácil',
        detail:
          'Perdona descuidos ocasionales. Su único enemigo real es el exceso de agua y el frío bajo 10 °C.',
      },
    ],
    sections: [
      {
        id: 'historia',
        title: 'Historia y Cuidados',
        paragraphs: [
          'La rosa del desierto nace en las regiones áridas del este de África y la península arábiga. Allí almacena agua en su caudex, un tronco engrosado que se vuelve más escultórico con los años.',
          "La variedad 'Red Velvet' es una selección de nuestro vivero: pétalos de un rojo profundo con textura aterciopelada y garganta oscura. Cada ejemplar se cultiva desde semilla o injerto y se acompaña durante su primera floración.",
          'Para que florezca, dale sol pleno, abónala con fertilizante bajo en nitrógeno en primavera y verano, y poda ligeramente al final del invierno para estimular nuevas ramas.',
        ],
      },
      {
        id: 'riego',
        title: 'Guía de Riego',
        paragraphs: [
          'Primavera y verano: riega cada 10 a 12 días, mojando todo el sustrato y dejando escurrir el exceso. Antes de volver a regar, el sustrato debe estar completamente seco.',
          'Otoño: espacia el riego a cada 3 semanas. Cuando la planta pierda hojas, es una señal natural de descanso.',
          'Invierno: riego mínimo, una vez al mes o menos. Si el caudex se arruga ligeramente, ofrece un riego pequeño; si está firme, espera.',
        ],
      },
      {
        id: 'envios',
        title: 'Envíos y Garantía',
        paragraphs: [
          'Enviamos cada planta en caja rígida con la maceta inmovilizada, raíz protegida y hojas envueltas. Los pedidos salen de martes a jueves para evitar fines de semana en tránsito.',
          'Garantía de llegada de 15 días: si tu planta llega dañada, envíanos una foto dentro de las primeras 48 horas y la reemplazamos sin costo.',
          'Los ejemplares adultos y las piezas únicas pueden reservarse con anticipo. Escríbenos y coordinamos la entrega o la visita al vivero.',
        ],
      },
    ],
  },
]

export function getPlantDetail(slug: string) {
  return plantDetails.find((plant) => plant.slug === slug)
}
