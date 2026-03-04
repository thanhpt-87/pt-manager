import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Card, Input, Btn } from '@/components/ui'

export default function LoginPage() {
  const { isLoggedIn, login } = useAuth()
  const [email, setEmail]     = useState('pt@example.com')
  const [password, setPassword] = useState('123')
  const [error, setError]     = useState('')

  if (isLoggedIn) return <Navigate to="/dashboard" replace />

  const handleSubmit = () => {
    const ok = login(email, password)
    if (!ok) setError('Invalid credentials. Try pt@example.com / 123')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur">
            <span className="text-3xl">💪</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">PT Manager</h1>
          <p className="text-indigo-200 mt-1 text-sm">Your fitness business, organized.</p>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pt@example.com"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            {error && <p className="text-red-500 text-xs">{error}</p>}
            <Btn className="w-full" onClick={handleSubmit}>
              Sign In
            </Btn>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">Demo: pt@example.com / 123</p>
        </Card>
      </div>
    </div>
  )
}
