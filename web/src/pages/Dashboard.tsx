import { Link } from 'react-router-dom'
import { listProducts } from '../lib/db'

export default function Dashboard() {
  const products = listProducts()
  const draft = products.filter(p => p.status === 'draft').length
  const published = products.filter(p => p.status === 'published').length

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">商品總覽</h1>
      <p className="text-sm text-slate-500 mb-6">商品 / 文案 / 圖片一次整理好</p>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="border border-slate-200 rounded p-4">
          <div className="text-xs text-slate-500">全部</div>
          <div className="text-3xl font-bold" data-testid="total">{products.length}</div>
        </div>
        <div className="border border-slate-200 rounded p-4">
          <div className="text-xs text-slate-500">草稿</div>
          <div className="text-3xl font-bold text-orange-600" data-testid="draft">{draft}</div>
        </div>
        <div className="border border-slate-200 rounded p-4">
          <div className="text-xs text-slate-500">已上架</div>
          <div className="text-3xl font-bold text-green-600" data-testid="published">{published}</div>
        </div>
      </div>

      <Link to="/wizard" className="inline-block px-4 py-2 bg-orange-500 text-white rounded mb-6" data-testid="cta-wizard">
        + 新增商品(4 步驟)
      </Link>
    </div>
  )
}
