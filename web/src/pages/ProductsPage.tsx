import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { listProducts } from '../lib/db'

export default function ProductsPage() {
  const products = listProducts()
  useEffect(() => { /* refresh on mount */ }, [])

  if (products.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">我的商品</h1>
        <div className="text-center text-slate-400 py-12" data-testid="empty">目前沒有商品</div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">我的商品({products.length})</h1>
      <div className="space-y-2" data-testid="products-list">
        {products.map(p => (
          <div key={p.id} className="border border-slate-200 rounded p-3 flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-slate-500">{p.category} · 同步 {p.publishedTo.length} 平台</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>{p.status}</span>
              <Link to={`/products/${p.id}`} className="text-orange-600 text-xs hover:underline">編輯</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
