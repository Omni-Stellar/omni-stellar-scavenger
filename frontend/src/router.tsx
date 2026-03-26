import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { AppShell } from '@/components/layout/AppShell'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return null
  return isAuthenticated ? (
    <AppShell>
      <Outlet />
    </AppShell>
  ) : (
    <Navigate to="/login" replace />
  )
}

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/login" replace /> },
  { path: '/login', element: <LoginPage /> },
  {
    element: <ProtectedLayout />,
    children: [
      { path: 'dashboard', element: <HomePage /> },
      { path: 'submit', element: <div>Submit Waste</div> },
      { path: 'collect', element: <div>Collect</div> },
      { path: 'incentives', element: <div>Incentives</div> },
      { path: 'transfer', element: <div>Transfer</div> },
      { path: 'history', element: <div>History</div> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
