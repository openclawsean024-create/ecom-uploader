export type Platform = 'momo' | 'PChome' | 'Shopee' | 'Yahoo'
export interface Product {
  id: string; title: string; category: string; brand: string; model: string; barcode: string
  description: string; images: string[]; tags: string[]
  platformPricing: Record<Platform, { price: number; cost: number; shipping: number; enabled: boolean }>
  status: 'draft' | 'published' | 'failed'
  publishedTo: Platform[]
  createdAt: number; updatedAt: number
}
export interface Account { id: string; name: string; shop: string; platforms: Platform[]; enabled: boolean }
export const PLATFORMS: Platform[] = ['momo', 'PChome', 'Shopee', 'Yahoo']
export const PLATFORM_LABEL: Record<Platform, string> = {
  momo: 'momo 購物', PChome: 'PChome', Shopee: '蝦皮購物', Yahoo: 'Yahoo 購物中心',
}
export const CATEGORIES = ['美妝保養', '居家生活', '3C 數位', '服飾配件', '食品保健', '母嬰用品', '運動用品', '書籍文具']
