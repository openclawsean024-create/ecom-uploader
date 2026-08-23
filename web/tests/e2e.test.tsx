import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { listProducts, listAccounts, seedDemoData } from '../src/lib/db'
import { generateAITags, generateAIDescription } from '../src/lib/ai'

function renderAt(p: string) { return render(<MemoryRouter initialEntries={[p]}><App /></MemoryRouter>) }

beforeEach(async () => {
  localStorage.clear()
  seedDemoData()
})

describe('Sprint 1 E2E - 電商上架快手', () => {
  it('總覽顯示 3 大統計區塊', () => {
    renderAt('/')
    expect(screen.getByTestId('total')).toBeInTheDocument()
    expect(screen.getByTestId('draft')).toBeInTheDocument()
    expect(screen.getByTestId('published')).toBeInTheDocument()
  })

  it('Wizard 4 步驟顯示', () => {
    renderAt('/wizard')
    const steps = screen.getByTestId('wizard-steps')
    expect(within(steps).getByText(/基本資訊/)).toBeInTheDocument()
    expect(within(steps).getByText(/商品內容/)).toBeInTheDocument()
    expect(within(steps).getByText(/平台同步/)).toBeInTheDocument()
    expect(within(steps).getByText(/完成/)).toBeInTheDocument()
  })

  it('Wizard 標題輸入→下一步', () => {
    renderAt('/wizard')
    const title = screen.getByTestId('title-input')
    fireEvent.change(title, { target: { value: '測試商品' } })
    fireEvent.click(screen.getByTestId('step1-next'))
    expect(screen.getByTestId('step-content')).toBeInTheDocument()
  })

  it('AI 標籤生成至少 5 個', () => {
    const tags = generateAITags({ title: '美妝保濕噴霧', category: '美妝保養' })
    expect(tags.length).toBeGreaterThanOrEqual(5)
  })

  it('AI 文案生成 3 段', () => {
    const descs = generateAIDescription({ title: '測試', category: '美妝' })
    expect(descs.length).toBe(3)
  })

  it('AI 標籤包含美妝關鍵字', () => {
    const tags = generateAITags({ title: '面膜', category: '美妝保養' })
    expect(tags.some((t: string) => ['保養', '面膜', '美妝'].includes(t))).toBe(true)
  })

  it('產品列表初始有 1 個 demo', () => {
    expect(listProducts().length).toBe(1)
  })

  it('帳號列表預載 2 個', () => {
    expect(listAccounts().length).toBe(2)
  })

  it('多帳號頁面顯示表單 + 清單', () => {
    renderAt('/accounts')
    expect(screen.getByTestId('platform-toggles')).toBeInTheDocument()
    expect(screen.getByTestId('accounts-list')).toBeInTheDocument()
  })

  it('平台同步頁面 4 個平台統計', () => {
    renderAt('/platforms')
    expect(screen.getByTestId('platform-stats')).toBeInTheDocument()
  })
})
