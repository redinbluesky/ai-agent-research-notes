import { Outlet } from 'react-router-dom'
import AppHeader from './components/AppHeader.tsx'
import AppFooter from './components/AppFooter.tsx'

export default function App() {
  return (
    <div className="app-shell">
      <AppHeader />
      <Outlet />
      <AppFooter />
    </div>
  )
}
