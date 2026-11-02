import { db } from '@/lib/db'
import { plants } from '@/lib/db/schema'
import { getInMemoryAdminPlants, getInMemoryPlantById } from '@/lib/db/memory-store'
import { eq } from 'drizzle-orm'

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

export const INITIAL_PLANT_DETAILS: Record<string, PlantDetail> = {
  'rosa-del-desierto-red-velvet': {
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
  'astrophytum-asterias': {
    slug: 'astrophytum-asterias',
    name: 'Astrophytum Asterias',
    scientificName: 'Astrophytum asterias',
    badge: 'Joya Botánica',
    summary:
      'Cacto estrella sin espinas con punteado blanco característico. Una de las especies más fascinantes para coleccionistas de cactos geométricos.',
    gallery: [
      {
        id: 'principal',
        src: '/images/astrophytum.png',
        alt: 'Astrophytum asterias en maceta',
        label: 'Vista General',
      },
      {
        id: 'detalle',
        src: '/images/astrophytum.png',
        alt: 'Detalle de los estigmas y costillas del Astrophytum',
        label: 'Detalle Botánico',
      },
    ],
    sizes: [
      {
        id: 'maceta-3',
        label: 'Maceta 3.5 pulg',
        description: 'Ejemplar de 3 años, diámetro aprox. 5 cm.',
        price: 35,
        stock: 'Disponible',
      },
      {
        id: 'maceta-5',
        label: 'Maceta 5 pulg',
        description: 'Ejemplar maduro, forma de estrella bien definida.',
        price: 58,
        stock: 'Pocas unidades',
      },
      {
        id: 'coleccion',
        label: 'Ejemplar Floración',
        description: 'Planta desarrollada con botones florales amarillos.',
        price: 95,
        stock: 'Pieza única',
      },
    ],
    care: [
      {
        key: 'light',
        title: 'Luz',
        value: 'Sol directo filtrado',
        detail: 'Requiere sol abundante con ligera protección en las horas de mayor insolación veraniega.',
      },
      {
        key: 'water',
        title: 'Riego',
        value: 'Muy escaso / Cada 15 días',
        detail: 'Solo regar cuando el sustrato esté 100% seco. Suspender riegos en invierno.',
      },
      {
        key: 'substrate',
        title: 'Sustrato',
        value: 'Mineral 85%',
        detail: 'Pumita, tezontle y arena sílice. Drenaje inmediato imprescindible.',
      },
      {
        key: 'difficulty',
        title: 'Dificultad',
        value: 'Intermedia',
        detail: 'Sensible al exceso de humedad. Agradece maceta de barro con buen drenaje.',
      },
    ],
    sections: [
      {
        id: 'historia',
        title: 'Historia y Cuidados',
        paragraphs: [
          'Originario de los matorrales áridos de México y Texas, el Astrophytum asterias es célebre por su parecido a un erizo de mar o a una cúpula estelar.',
          'En nuestro vivero los reproducimos desde semilla seleccionada para garantizar ejemplares fuertes con el característico moteado blanco aterciopelado.',
        ],
      },
      {
        id: 'riego',
        title: 'Guía de Riego',
        paragraphs: [
          'Riega solo en época cálida. Durante el reposo invernal mantén completamente seco en lugar ventilado.',
        ],
      },
      {
        id: 'envios',
        title: 'Envíos y Garantía',
        paragraphs: [
          'Embalaje de máxima seguridad con raíces protegidas en sustrato seco. Garantía de entrega perfecta.',
        ],
      },
    ],
  },
  'echeveria-laui': {
    slug: 'echeveria-laui',
    name: 'Echeveria Laui',
    scientificName: 'Echeveria laui',
    badge: 'Pruina Plateada',
    summary:
      'Reconocida mundialmente como una de las suculentas más elegantes por su gruesa capa de pruina blanco-azulada que la protege del sol.',
    gallery: [
      {
        id: 'principal',
        src: '/images/echeveria.png',
        alt: 'Echeveria laui con roseta compacta',
        label: 'Roseta',
      },
    ],
    sizes: [
      {
        id: 'maceta-4',
        label: 'Maceta 4 pulg',
        description: 'Roseta compacta de 7 a 9 cm de diámetro.',
        price: 28,
        stock: 'Disponible',
      },
      {
        id: 'maceta-6',
        label: 'Maceta 6 pulg',
        description: 'Ejemplar desarrollado con pruina intacta.',
        price: 45,
        stock: 'Pocas unidades',
      },
    ],
    care: [
      {
        key: 'light',
        title: 'Luz',
        value: 'Luz muy brillante',
        detail: 'Luz filtrada intensa o sol de mañana para mantener la pruina y tono rosado.',
      },
      {
        key: 'water',
        title: 'Riego',
        value: 'Moderado por inmersión',
        detail: 'Evita mojar el centro de la roseta para no retirar la pruina protectora.',
      },
      {
        key: 'substrate',
        title: 'Sustrato',
        value: 'Sustrato suculentas 60% mineral',
        detail: 'Tierra negra mezclada con perlita gruesa y grava volcánica.',
      },
      {
        key: 'difficulty',
        title: 'Dificultad',
        value: 'Fácil - Media',
        detail: 'Cuidar de no tocar sus hojas para no manchar la cera natural.',
      },
    ],
    sections: [
      {
        id: 'historia',
        title: 'Historia y Cuidados',
        paragraphs: [
          'Nativa de los acantilados de Oaxaca, México, la Echeveria laui produce flores en tonos durazno y hojas carnosas simétricas.',
        ],
      },
      {
        id: 'envios',
        title: 'Envíos y Garantía',
        paragraphs: [
          'Se empaca con algodón protector para preservar la pruina intacta durante el transporte.',
        ],
      },
    ],
  },
  'orquidea-phalaenopsis-silvestre': {
    slug: 'orquidea-phalaenopsis-silvestre',
    name: 'Orquídea Phalaenopsis Silvestre',
    scientificName: 'Phalaenopsis aphrodite',
    badge: 'Floración Selecta',
    summary:
      'Flores elegantes de larga duración sobre vara floral arqueada. Ideal para interiores luminosos con buena ventilación.',
    gallery: [
      {
        id: 'principal',
        src: '/images/orquidea.png',
        alt: 'Orquídea Phalaenopsis en flor',
        label: 'Floración',
      },
    ],
    sizes: [
      {
        id: 'vara-simple',
        label: 'Vara Simple en Flor',
        description: 'Planta con 6 a 8 flores abiertas y botones por abrir.',
        price: 45,
        stock: 'Disponible',
      },
      {
        id: 'doble-vara',
        label: 'Doble Vara Floral',
        description: 'Espécimen de exposición con abundante floración.',
        price: 75,
        stock: 'Bajo pedido',
      },
    ],
    care: [
      {
        key: 'light',
        title: 'Luz',
        value: 'Luz filtrada indirecta',
        detail: 'Cerca de una ventana con cortina delgada. Nunca sol directo sobre las hojas.',
      },
      {
        key: 'water',
        title: 'Riego',
        value: 'Semanal por inmersión',
        detail: 'Sumergir maceta 10 minutos cuando las raíces se vean plateadas.',
      },
      {
        key: 'substrate',
        title: 'Sustrato',
        value: 'Corteza de pino y musgo sphagnum',
        detail: 'Aireación óptima para permitir la fotosíntesis de las raíces.',
      },
      {
        key: 'difficulty',
        title: 'Dificultad',
        value: 'Media',
        detail: 'Responde excelentemente a la humedad ambiental y ventilación suave.',
      },
    ],
    sections: [
      {
        id: 'historia',
        title: 'Historia y Cuidados',
        paragraphs: [
          'Las orquídeas mariposa son epífitas tropicales conocidas por sus flores que pueden mantenerse frescas hasta por tres meses continuos.',
        ],
      },
    ],
  },
}

export function buildDefaultPlantDetail(plant: {
  id: string
  name: string
  scientificName: string
  category: string
  description: string
  image: string
  imageAlt?: string
  water: string
  light: string
  price: number | null
  stock: number
}): PlantDetail {
  const basePrice = plant.price ?? 45
  const badge =
    plant.category === 'Rosa del Desierto'
      ? 'Edición Coleccionista'
      : plant.category === 'Cacto'
        ? 'Joya Botánica'
        : plant.category === 'Suculenta'
          ? 'Colección Exclusiva'
          : 'Floración Selecta'

  return {
    slug: plant.id,
    name: plant.name,
    scientificName: plant.scientificName,
    badge,
    summary: plant.description,
    gallery: [
      {
        id: 'principal',
        src: plant.image,
        alt: plant.imageAlt || plant.name,
        label: 'Vista Principal',
      },
      {
        id: 'detalle',
        src: plant.image,
        alt: `Detalle de ${plant.name}`,
        label: 'Detalle de Hojas y Flor',
      },
    ],
    sizes:
      plant.price === null
        ? [
            {
              id: 'a-consulta',
              label: 'Ejemplar de Colección',
              description: 'Disponible bajo reserva previa coordinada con el vivero.',
              price: 0,
              stock: `${plant.stock} en vivero`,
            },
          ]
        : [
            {
              id: 'estandar',
              label: 'Tamaño Estándar (6 pulg)',
              description: 'Ejemplar sano y aclimatado listo para tu colección.',
              price: basePrice,
              stock: plant.stock > 0 ? `${plant.stock} disponibles` : 'A pedido',
            },
            {
              id: 'grande',
              label: 'Ejemplar Mayor (8 pulg)',
              description: 'Planta de mayor edad y porte escultórico desarrollado.',
              price: Math.round(basePrice * 1.6),
              stock: 'Pocas unidades',
            },
          ],
    care: [
      {
        key: 'light',
        title: 'Luz',
        value: plant.light,
        detail:
          plant.light === 'Sol directo'
            ? 'Requiere al menos 6 horas de sol directo al día para mantener su vigor.'
            : 'Ubicar en espacio con luz brillante abundante evitando sol quemante directo.',
      },
      {
        key: 'water',
        title: 'Riego',
        value: plant.water,
        detail:
          plant.water === 'Riego escaso'
            ? 'Regar en profundidad y esperar a que el sustrato esté 100% seco antes de volver a regar.'
            : 'Mantener humedad equilibrada dejando secar las capas superiores.',
      },
      {
        key: 'substrate',
        title: 'Sustrato',
        value: 'Sustrato aireado de alto drenaje',
        detail: 'Mezcla formulada con pumita, grava y materia orgánica de lenta descomposición.',
      },
      {
        key: 'difficulty',
        title: 'Dificultad',
        value: 'Fácil a Intermedio',
        detail: 'Perdona olvidos de riego ocasionales. Evitar encharcamientos prolongados.',
      },
    ],
    sections: [
      {
        id: 'historia',
        title: 'Historia y Cuidados',
        paragraphs: [
          `${plant.name} (${plant.scientificName}) es cultivada en nuestro vivero con luz natural y sustrato artesanal.`,
          plant.description,
        ],
      },
      {
        id: 'riego',
        title: 'Guía de Riego',
        paragraphs: [
          `Frecuencia recomendada: ${plant.water}. Es fundamental comprobar con un palillo de madera que el fondo de la maceta no esté saturado de agua antes de volver a hidratar.`,
        ],
      },
      {
        id: 'envios',
        title: 'Envíos y Garantía',
        paragraphs: [
          'Enviamos cada ejemplar en embalaje reforzado con cepellón protegido. Garantía de entrega saludable en 48 horas.',
        ],
      },
    ],
  }
}

export const plantDetails: PlantDetail[] = Object.values(INITIAL_PLANT_DETAILS)

export async function getPlantDetail(slug: string): Promise<PlantDetail | null> {
  // 1. Try finding in database if configured
  if (process.env.DATABASE_URL) {
    try {
      const [row] = await db
        .select()
        .from(plants)
        .where(eq(plants.id, slug))
        .limit(1)

      if (row) {
        if (row.details) {
          try {
            const parsed = JSON.parse(row.details)
            return {
              ...buildDefaultPlantDetail(row),
              ...parsed,
              slug: row.id,
              name: row.name,
              scientificName: row.scientificName,
            }
          } catch {
            // fallback if JSON parse fails
          }
        }

        // If exists in static predefined details, use that as base
        if (INITIAL_PLANT_DETAILS[slug]) {
          return {
            ...INITIAL_PLANT_DETAILS[slug],
            name: row.name,
            scientificName: row.scientificName,
            summary: row.description,
          }
        }

        return buildDefaultPlantDetail(row)
      }
    } catch (err) {
      console.warn('[AI Studio] Database getPlantDetail error:', err)
    }
  }

  // 2. Try in-memory store
  const inMemory = getInMemoryPlantById(slug)
  if (inMemory) {
    if (inMemory.details) {
      try {
        const parsed = JSON.parse(inMemory.details)
        return {
          ...buildDefaultPlantDetail(inMemory),
          ...parsed,
          slug: inMemory.id,
          name: inMemory.name,
          scientificName: inMemory.scientificName,
        }
      } catch {
        // fallback
      }
    }
    if (INITIAL_PLANT_DETAILS[slug]) {
      return {
        ...INITIAL_PLANT_DETAILS[slug],
        name: inMemory.name,
        scientificName: inMemory.scientificName,
        summary: inMemory.description,
      }
    }
    return buildDefaultPlantDetail(inMemory)
  }

  // 3. Fallback to predefined details map
  if (INITIAL_PLANT_DETAILS[slug]) {
    return INITIAL_PLANT_DETAILS[slug]
  }

  return null
}
