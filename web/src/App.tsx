import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import WizardPage from './pages/WizardPage'
import ProductsPage from './pages/ProductsPage'
import PlatformsPage from './pages/PlatformsPage'
import AccountsPage from './pages/AccountsPage'
import './lib/bootstrap'
export default function App() {
  return <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/wizard" element={<WizardPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/platforms" element={<PlatformsPage />} />
      <Route path="/accounts" element={<AccountsPage />} />
    </Routes>
  </Layout>
}
