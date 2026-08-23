import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, PLATFORM_LABEL, PLATFORMS } from '../lib/types'
import type { Product, Platform } from '../lib/types'
import { generateAIDescription, generateAITags } from '../lib/ai'
import { saveProduct } from '../lib/db'

const STEPS = ['基本資訊', '商品內容', '平台同步', '完成']

export default function WizardPage() {
  const nav = useNavigate()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState<Partial<Product>>({
    title: '', category: '美妝保養', brand: '', model: '', barcode: '',
    description: '', images: [], tags: [],
    platformPricing: PLATFORMS.reduce((acc, p) => {
      acc[p] = { price: 0, cost: 0, shipping: 60, enabled: p === 'Shopee' }
      return acc
    }, {} as Product['platformPricing']),
  })
  const [aiDescs, setAiDescs] = useState<string[]>([])
  const [aiTags, setAiTags] = useState<string[]>([])
  const [selectedDesc, setSelectedDesc] = useState('')

  function update<K extends keyof Product>(key: K, value: Product[K]) {
    setDraft(d => ({ ...d, [key]: value }))
  }
  function setPrice(p: Platform, field: 'price' | 'cost' | 'shipping' | 'enabled', value: number | boolean) {
    setDraft(d => ({
      ...d,
      platformPricing: {
        ...d.platformPricing!,
        [p]: { ...d.platformPricing![p], [field]: value },
      },
    }))
  }

  function runAI() {
    if (!draft.title) return
    setAiDescs(generateAIDescription(draft))
    setAiTags(generateAITags(draft))
  }
  function pickDesc(d: string) { setSelectedDesc(d); update('description', d) }
  function toggleTag(t: string) {
    const tags = draft.tags ?? []
    update('tags', tags.includes(t) ? tags.filter(x => x !== t) : [...tags, t])
  }

  function publish() {
    if (!draft.title) { setStep(0); return }
    const id = 'p' + Date.now()
    const product: Product = {
      ...(draft as Product),
      id,
      status: 'published' as const,
      publishedTo: PLATFORMS.filter(p => draft.platformPricing![p].enabled),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as Product
    saveProduct(product)
    nav(`/products?published=${id}`)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">新增商品(4 步驟)</h1>

      <div className="flex gap-2 mb-6" data-testid="wizard-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex-1 px-3 py-2 rounded text-center text-sm ${i === step ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}>
            {i + 1}. {s}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="border border-slate-200 rounded p-4" data-testid="step-basic">
          <label className="block mb-1 text-sm">商品標題</label>
          <input value={draft.title} onChange={e => update('title', e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" data-testid="title-input" />
          <label className="block mb-1 text-sm">分類</label>
          <select value={draft.category} onChange={e => update('category', e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" data-testid="category-select">
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block mb-1 text-sm">品牌</label>
              <input value={draft.brand} onChange={e => update('brand', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 text-sm">型號</label>
              <input value={draft.model} onChange={e => update('model', e.target.value)} className="w-full px-3 py-2 border rounded" />
            </div>
          </div>
          <label className="block mb-1 text-sm">條碼</label>
          <input value={draft.barcode} onChange={e => update('barcode', e.target.value)} className="w-full mb-3 px-3 py-2 border rounded" />
          <button onClick={() => setStep(1)} className="px-4 py-2 bg-orange-500 text-white rounded" data-testid="step1-next">下一步</button>
        </div>
      )}

      {step === 1 && (
        <div className="border border-slate-200 rounded p-4" data-testid="step-content">
          <button onClick={runAI} className="px-3 py-1 bg-purple-500 text-white rounded text-sm mb-3" data-testid="run-ai">🪄 AI 文案生成</button>
          {aiDescs.length > 0 && (
            <div className="mb-3 border border-purple-200 rounded p-3 bg-purple-50" data-testid="ai-descs">
              <div className="text-xs font-medium mb-2">AI 推薦文案(點選用)</div>
              {aiDescs.map((d, i) => (
                <button key={i} onClick={() => pickDesc(d)} className="block text-left w-full mb-1 p-2 rounded bg-white hover:bg-purple-100 text-sm">
                  {selectedDesc === d ? '✓' : ' '}{d.slice(0, 50)}...
                </button>
              ))}
            </div>
          )}
          <textarea value={draft.description} onChange={e => update('description', e.target.value)} rows={6} placeholder="商品描述(HTML 支援)" className="w-full mb-3 px-3 py-2 border rounded font-mono text-sm" data-testid="description-input" />

          {aiTags.length > 0 && (
            <div className="mb-3" data-testid="ai-tags">
              <div className="text-xs font-medium mb-2">AI 標籤(點選啟用)</div>
              <div className="flex flex-wrap gap-2">
                {aiTags.map(t => (
                  <button key={t} onClick={() => toggleTag(t)}
                    className={`px-2 py-1 text-xs rounded ${draft.tags?.includes(t) ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={() => setStep(0)} className="px-4 py-2 border rounded">上一步</button>
            <button onClick={() => setStep(2)} className="px-4 py-2 bg-orange-500 text-white rounded" data-testid="step2-next">下一步</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="border border-slate-200 rounded p-4" data-testid="step-platforms">
          <p className="text-xs text-slate-500 mb-3">勾選要同步的平台 + 設定各自價格</p>
          {PLATFORMS.map(p => (
            <div key={p} className="border border-slate-100 rounded p-3 mb-2">
              <label className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={draft.platformPricing![p].enabled} onChange={e => setPrice(p, 'enabled', e.target.checked)} data-testid={`platform-${p}`} />
                <span className="font-medium">{PLATFORM_LABEL[p]}</span>
              </label>
              {draft.platformPricing![p].enabled && (
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs">售價</label>
                    <input type="number" value={draft.platformPricing![p].price} onChange={e => setPrice(p, 'price', +e.target.value)} className="w-full px-2 py-1 border rounded" data-testid={`price-${p}`} />
                  </div>
                  <div>
                    <label className="block text-xs">成本</label>
                    <input type="number" value={draft.platformPricing![p].cost} onChange={e => setPrice(p, 'cost', +e.target.value)} className="w-full px-2 py-1 border rounded" />
                  </div>
                  <div>
                    <label className="block text-xs">運費</label>
                    <input type="number" value={draft.platformPricing![p].shipping} onChange={e => setPrice(p, 'shipping', +e.target.value)} className="w-full px-2 py-1 border rounded" />
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <button onClick={() => setStep(1)} className="px-4 py-2 border rounded">上一步</button>
            <button onClick={() => setStep(3)} className="px-4 py-2 bg-orange-500 text-white rounded" data-testid="step3-next">下一步</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="border border-slate-200 rounded p-4" data-testid="step-done">
          <h2 className="text-lg font-medium mb-3">📝 草稿總覽</h2>
          <div className="text-sm space-y-1 mb-4">
            <div><strong>標題:</strong>{draft.title}</div>
            <div><strong>分類:</strong>{draft.category}</div>
            <div><strong>描述:</strong><span className="text-xs text-slate-600 ml-2" dangerouslySetInnerHTML={{ __html: draft.description ?? '' }} /></div>
            <div><strong>標籤:</strong>{(draft.tags ?? []).map(t => `#${t}`).join(' ')}</div>
            <div><strong>同步平台:</strong>{PLATFORMS.filter(p => draft.platformPricing![p].enabled).map(p => PLATFORM_LABEL[p]).join('、')}</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setStep(2)} className="px-4 py-2 border rounded">上一步</button>
            <button onClick={publish} className="px-4 py-2 bg-green-500 text-white rounded" data-testid="publish">完成上架 →</button>
          </div>
        </div>
      )}
    </div>
  )
}
