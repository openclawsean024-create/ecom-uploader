// Mock AI 文案生成器(實際上會接 LLM,Sprint 2 之後才考慮)
import type { Product } from './types'

export function generateAIDescription(p: Partial<Product>): string[] {
  const category = p.category || '商品'
  const title = p.title || '產品'
  return [
    `✨【${title}】${category}類別的明星商品,品質保證,口碑推薦`,
    `<p><strong>${title}</strong>讓你生活更有質感,精心挑選的${category},送禮自用兩相宜。</p><p>✓ 嚴選材質 / ✓ 快速出貨 / ✓ 售後保障</p>`,
    `<h3>${title} 產品特色</h3><ul><li>品質保證</li><li>CP 值高</li><li>台灣現貨 24h 出貨</li></ul>`,
  ]
}

export function generateAITags(p: Partial<Product>): string[] {
  const t = (p.title || '').toLowerCase()
  const c = (p.category || '').toLowerCase()
  const tags = new Set<string>()
  if (c.includes('美妝')) ['保養', '彩妝', '面膜'].forEach(x => tags.add(x))
  if (c.includes('居家')) ['收納', '日用', '質感'].forEach(x => tags.add(x))
  if (c.includes('3c')) ['科技', '實用', '設計'].forEach(x => tags.add(x))
  if (c.includes('食品')) ['健康', '美味', '產地直送'].forEach(x => tags.add(x))
  if (t.includes('保濕')) { tags.add('保濕'); tags.add('清爽') }
  if (t.includes('噴霧')) { tags.add('噴霧'); tags.add('噴頭') }
  while (tags.size < 5) tags.add('熱銷')
  return Array.from(tags).slice(0, 10)
}
