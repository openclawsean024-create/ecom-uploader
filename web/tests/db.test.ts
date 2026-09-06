import { describe, it, expect, beforeEach } from 'vitest'
import {
  listAccounts, seedDemoData, listProducts, getDB,
  saveProduct, getProduct, updateProductStatus,
  saveAccount, getCurrentAccountId, setCurrentAccountId,
} from '../src/lib/db'
import { PLATFORMS } from '../src/lib/types'
import type { Product, Account } from '../src/lib/types'

beforeEach(() => {
  localStorage.clear()
  seedDemoData()
})

describe('lib/db — schema', () => {
  it('default DB has 2 accounts', () => {
    expect(listAccounts().length).toBe(2)
  })
  it('default accounts have platforms', () => {
    for (const acc of listAccounts()) {
      expect(acc.platforms.length).toBeGreaterThan(0)
      expect(acc.enabled).toBe(true)
    }
  })
  it('seedDemoData inserts 1 demo product', () => {
    expect(listProducts().length).toBe(1)
  })
  it('demo product is in draft status', () => {
    const p = listProducts()[0]
    expect(p.status).toBe('draft')
  })
  it('currentAccountId is one of the account ids', () => {
    const curr = getCurrentAccountId()
    const ids = listAccounts().map(a => a.id)
    expect(ids).toContain(curr)
  })
})

describe('lib/db — CRUD', () => {
  it('saveProduct inserts new product', () => {
    const before = listProducts().length
    const p: Product = {
      id: 'ptest', title: 't', category: '美妝', brand: 'b', model: 'm', barcode: '471',
      description: '', images: [], tags: [],
      platformPricing: PLATFORMS.reduce((acc, x) => {
        acc[x] = { price: 0, cost: 0, shipping: 0, enabled: false }
        return acc
      }, {} as Product['platformPricing']),
      status: 'draft', publishedTo: [],
      createdAt: Date.now(), updatedAt: Date.now(),
    }
    saveProduct(p)
    expect(listProducts().length).toBe(before + 1)
  })
  it('saveProduct updates existing', () => {
    const existing = listProducts()[0]
    const updated = { ...existing, title: 'UPDATED' }
    saveProduct(updated)
    const found = getProduct(existing.id)
    expect(found?.title).toBe('UPDATED')
  })
  it('updateProductStatus changes status', () => {
    const p = listProducts()[0]
    updateProductStatus(p.id, 'published')
    expect(getProduct(p.id)?.status).toBe('published')
  })
  it('saveAccount adds new account', () => {
    const before = listAccounts().length
    const acc: Account = { id: 'a3', name: 'n', shop: 's', platforms: ['momo'], enabled: true }
    saveAccount(acc)
    expect(listAccounts().length).toBe(before + 1)
  })
  it('setCurrentAccountId persists', () => {
    const accounts = listAccounts()
    const target = accounts[1].id
    setCurrentAccountId(target)
    expect(getCurrentAccountId()).toBe(target)
  })
  it('getDB returns valid schema', () => {
    const db = getDB()
    expect(Array.isArray(db.products)).toBe(true)
    expect(Array.isArray(db.accounts)).toBe(true)
    expect(typeof db.currentAccountId).toBe('string')
  })
})
