import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold">🛒 電商上架快手</Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:underline">總覽</Link>
            <Link to="/wizard" className="hover:underline text-orange-600" data-testid="nav-wizard">+ 新增商品</Link>
            <Link to="/products" className="hover:underline">我的商品</Link>
            <Link to="/platforms" className="hover:underline">平台同步</Link>
            <Link to="/accounts" className="hover:underline">多帳號</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="border-t border-slate-200 py-4 text-center text-xs text-slate-500">電商上架快手 · Sprint 1 · Mock AI 生成</footer>
    </div>
  )
}
