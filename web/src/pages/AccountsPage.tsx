import { useState } from 'react'
import { PLATFORM_LABEL, PLATFORMS } from '../lib/types'
import type { Account, Platform } from '../lib/types'
import { listAccounts, saveAccount } from '../lib/db'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState(listAccounts())
  const [name, setName] = useState('')
  const [shop, setShop] = useState('')
  const [selected, setSelected] = useState<Platform[]>([])

  function toggleP(p: Platform) {
    setSelected(s => s.includes(p) ? s.filter(x => x !== p) : [...s, p])
  }

  function add() {
    if (!name.trim() || !shop.trim()) return
    const acc: Account = {
      id: 'acc' + Date.now(), name: name.trim(), shop: shop.trim(),
      platforms: selected, enabled: true,
    }
    saveAccount(acc)
    setAccounts(listAccounts())
    setName(''); setShop(''); setSelected([])
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">多帳號管理</h1>

      <div className="border border-slate-200 rounded p-4 mb-4">
        <h2 className="font-medium mb-2">＋ 新增帳號</h2>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="賣家名字" className="w-full mb-2 px-3 py-2 border rounded" />
        <input value={shop} onChange={e => setShop(e.target.value)} placeholder="商店名稱" className="w-full mb-3 px-3 py-2 border rounded" />
        <div className="flex flex-wrap gap-2 mb-3" data-testid="platform-toggles">
          {PLATFORMS.map(p => (
            <label key={p} className={`px-2 py-1 rounded text-sm cursor-pointer ${selected.includes(p) ? 'bg-orange-500 text-white' : 'bg-slate-100'}`}>
              <input type="checkbox" checked={selected.includes(p)} onChange={() => toggleP(p)} className="hidden" />
              {PLATFORM_LABEL[p]}
            </label>
          ))}
        </div>
        <button onClick={add} className="px-4 py-2 bg-orange-500 text-white rounded">新增</button>
      </div>

      <h2 className="text-lg font-medium mb-2">目前帳號</h2>
      <div className="space-y-2" data-testid="accounts-list">
        {accounts.map(a => (
          <div key={a.id} className="border border-slate-200 rounded p-3">
            <div className="font-medium">{a.name}</div>
            <div className="text-xs text-slate-500">商店:{a.shop} · 已授權:{a.platforms.map(p => PLATFORM_LABEL[p]).join(' / ') || '(無)'}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
