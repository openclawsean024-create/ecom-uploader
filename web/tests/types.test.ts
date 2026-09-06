import { describe, it, expect } from 'vitest'
import { PLATFORMS, PLATFORM_LABEL, CATEGORIES } from '../src/lib/types'

describe('lib/types', () => {
  it('PLATFORMS has 4 entries', () => {
    expect(PLATFORMS).toHaveLength(4)
    expect(PLATFORMS).toEqual(['momo', 'PChome', 'Shopee', 'Yahoo'])
  })
  it('PLATFORM_LABEL has all 4 keys', () => {
    for (const p of PLATFORMS) {
      expect(PLATFORM_LABEL[p]).toBeTruthy()
    }
  })
  it('CATEGORIES has 8 entries', () => {
    expect(CATEGORIES).toHaveLength(8)
  })
})
