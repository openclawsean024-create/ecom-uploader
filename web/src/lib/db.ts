import type { Product, Account } from './types'
import { PLATFORMS } from './types'
const KEY = 'ecom-uploader:db'
const CURR_KEY = 'ecom-uploader:currentAccount'
interface DBSchema { products: Product[]; accounts: Account[]; currentAccountId: string }
function read(): DBSchema {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) { const p = JSON.parse(raw); if (p && Array.isArray(p.products)) return p }
  } catch { /* localStorage may be unavailable (SSR, private mode) */ }
  const defaultAccounts: Account[] = [
    { id: 'acc1', name: '王小明 個人賣家', shop: '生活選物', platforms: ['momo', 'Shopee', 'Yahoo'], enabled: true },
    { id: 'acc2', name: '美妝精緻選物店', shop: 'beauty_pick', platforms: ['momo', 'PChome', 'Shopee', 'Yahoo'], enabled: true },
  ]
  return { products: [], accounts: defaultAccounts, currentAccountId: 'acc1' }
}
function write(db: DBSchema) { try { localStorage.setItem(KEY, JSON.stringify(db)) } catch { /* localStorage may be unavailable */ } }

export function seedDemoData() {
  const db = read()
  if (db.products.length > 0) return
  db.products.push({
    id: 'p1', title: '美妝級保濕噴霧 100ml', category: '美妝保養', brand: 'AquaBeauty', model: 'AB-100', barcode: '4711234567890',
    description: '<p>深層保濕,妝前妝後皆可使用</p>',
    images: [], tags: ['保濕', '噴霧', '美妝', '清爽'],
    platformPricing: PLATFORMS.reduce((acc, p) => {
      acc[p] = { price: 299, cost: 80, shipping: 60, enabled: ['momo', 'Shopee'].includes(p) }
      return acc
    }, {} as Product['platformPricing']),
    status: 'draft', publishedTo: [],
    createdAt: Date.now(), updatedAt: Date.now(),
  })
  write(db)
}

export function getDB(): DBSchema { return read() }

export function listProducts(accountId?: string): Product[] {
  const all = read().products
  return accountId ? all : all
}
export function getProduct(id: string): Product | undefined {
  return read().products.find(p => p.id === id)
}
export function saveProduct(p: Product) {
  const db = read(); const i = db.products.findIndex(x => x.id === p.id)
  if (i >= 0) db.products[i] = p; else db.products.push(p)
  write(db)
}
export function updateProductStatus(id: string, status: Product['status']) {
  const db = read(); const p = db.products.find(x => x.id === id)
  if (p) { p.status = status; p.updatedAt = Date.now(); write(db) }
}

export function listAccounts(): Account[] { return read().accounts }
export function getCurrentAccountId(): string {
  try { return localStorage.getItem(CURR_KEY) ?? read().currentAccountId } catch { return read().currentAccountId }
}
export function setCurrentAccountId(id: string) { try { localStorage.setItem(CURR_KEY, id) } catch { /* localStorage may be unavailable */ } }


export function saveAccount(a: Account) {
  const db = read(); const i = db.accounts.findIndex(x => x.id === a.id)
  if (i >= 0) db.accounts[i] = a; else db.accounts.push(a)
  write(db)
}

