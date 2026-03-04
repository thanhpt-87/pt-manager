import { AppProvider } from '@/context/AppContext'
import AppRouter from '@/router'
import AppShell from '@/components/layout/AppShell'

export default function App() {
  return (
    <AppProvider>
      <AppShell>
        <AppRouter />
      </AppShell>
    </AppProvider>
  )
}
