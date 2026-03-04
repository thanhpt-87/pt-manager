import { Routes, Route, Navigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'

import LoginPage       from '@/pages/auth/LoginPage'
import DashboardPage   from '@/pages/dashboard/DashboardPage'
import ClientsListPage from '@/pages/clients/ClientsListPage'
import ClientDetailPage from '@/pages/clients/ClientDetailPage'
import CreateContractPage from '@/pages/clients/CreateContractPage'
import CalendarPage    from '@/pages/calendar/CalendarPage'
import ContractsPage   from '@/pages/contracts/ContractsPage'
import ReportsPage     from '@/pages/reports/ReportsPage'
import ClientPortalPage from '@/pages/portal/ClientPortalPage'

/** Wrap private routes — redirect to /login if not authenticated */
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { state } = useApp()
  return state.isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/client/:id" element={<ClientPortalPage />} />

      {/* Protected */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
      <Route path="/clients" element={<PrivateRoute><ClientsListPage /></PrivateRoute>} />
      <Route path="/clients/new" element={<PrivateRoute><CreateContractPage /></PrivateRoute>} />
      <Route path="/clients/:id" element={<PrivateRoute><ClientDetailPage /></PrivateRoute>} />
      <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
      <Route path="/contracts" element={<PrivateRoute><ContractsPage /></PrivateRoute>} />
      <Route path="/reports" element={<PrivateRoute><ReportsPage /></PrivateRoute>} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
