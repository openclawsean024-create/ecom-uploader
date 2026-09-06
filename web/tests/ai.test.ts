import { describe, it, expect } from 'vitest'
import { generateAIDescription, generateAITags } from '../src/lib/ai'

describe('AI helper (no React)', () => {
  it('generates 3 description variants', () => {
    const descs = generateAIDescription({ title: 'X', category: '美妝' })
    expect(descs.length).toBe(3)
  })
  it('generates 5+ tags for beauty category', () => {
    const tags = generateAITags({ title: '美妝保濕噴霧', category: '美妝保養' })
    expect(tags.length).toBeGreaterThanOrEqual(5)
  })
})
