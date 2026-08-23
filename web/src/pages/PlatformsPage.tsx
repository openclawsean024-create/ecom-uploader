import { Link } from 'react-router-dom'
import { PLATFORM_LABEL, PLATFORMS } from '../lib/types'
import { listAccounts, getCurrentAccountId, setCurrentAccountId, listProducts } from '../lib/db'

export default function PlatformsPage() {
  const accountId = getCurrentAccountId()
  const accounts = listAccounts()
  const current = accounts.find(a => a.id === accountId)
  const products = listProducts().filter(p =>
    p.platformPricing && Object.values(p.platformPricing).some(pr => pr.enabled)
  )

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">平台同步</h1>
      <div className="border border-slate-200 rounded p-4 mb-4">
        <div className="text-xs mb-1">當前帳號</div>
        <select
          value={accountId}
          onChange={e => setCurrentAccountId(e.target.value)}
          className="px-2 py-1 border rounded text-sm"
          data-testid="account-select"
        >
          {accounts.map(a => <option key={a.id} value={a.id}>{a.name} ({a.shop})</option>)}
        </select>
        {current && <div className="mt-2 text-xs">已啟用平台:{current.platforms.map(p => PLATFORM_LABEL[p]).join(' / ')}</div>}
      </div>

      <h2 className="text-lg font-medium mb-2">各平台商品統計</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4" data-testid="platform-stats">
        {PLATFORMS.map(p => {
          const count = products.filter(pr =>
            pr.platformPricing && pr.platformPricing[p]?.enabled
          ).length
          return (
            <div key={p} className="border border-slate-200 rounded p-3 text-center" data-testid={`stat-${p}`}>
              <div className="text-xs text-slate-500">{PLATFORM_LABEL[p]}</div>
              <div className="text-2xl font-bold">{count}</div>
            </div>
          )
        })}
      </div>

      <Link to="/wizard" className="text-orange-600 text-sm hover:underline">+ 新增商品(從 wizard 設定多平台)</Link>
    </div>
  )
}
