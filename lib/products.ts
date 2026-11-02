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
