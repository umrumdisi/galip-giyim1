export const CATEGORIES = [
  { id: '1', name: 'Pantolon' },
  { id: '2', name: 'Tişört' },
  { id: '3', name: 'Gömlek' },
  { id: '4', name: 'Ceket' },
  { id: '5', name: 'Mont' },
  { id: '6', name: 'Şort' },
  { id: '7', name: 'Şapka' },
  { id: '8', name: 'Ayakkabı' }
] as const

export type CategoryType = typeof CATEGORIES[number] 