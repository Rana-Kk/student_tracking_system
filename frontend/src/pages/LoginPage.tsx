import { useState } from 'react'
import type { User } from '../types'
import { DEMO_USERS } from '../data/mockData'

interface Props {
  onLogin: (user: User) => void
}

export default function LoginPage({ onLogin }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setTimeout(() => {
      const user = DEMO_USERS.find((u) => u.email === email)
      if (user && password === 'demo') {
        onLogin(user)
      } else {
        setError('Invalid email or password. Try a demo account below.')
        setLoading(false)
      }
    }, 600)
  }

  const handleDemoLogin = (user: User) => {
    setEmail(user.email)
    setPassword('demo')
    setTimeout(() => onLogin(user), 300)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: 'var(--background)' }}
    >
      {/* Background subtle grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(29,78,216,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative w-full max-w-sm">
        {/* Logo mark */}
        <div className="text-center mb-8">
          <div
            className="inline-flex w-14 h-14 rounded-2xl items-center justify-center text-white text-2xl font-bold mb-4"
            style={{ background: 'var(--primary)', fontFamily: 'Outfit, sans-serif', boxShadow: '0 8px 24px rgba(29,78,216,0.3)' }}
          >
            L
          </div>
          <h1 className="text-2xl font-semibold" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Lexicon
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Learning Analytics Platform
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-xl p-8"
          style={{ background: 'var(--card)', border: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}
        >
          <h2 className="text-lg font-semibold mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" htmlFor="email">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@lexicon.edu"
                required
                className="w-full px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--muted)',
                  color: 'var(--foreground)',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium" htmlFor="password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs"
                  style={{ color: 'var(--primary)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Forgot password?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 rounded-lg text-sm transition-colors"
                style={{
                  border: '1px solid var(--border)',
                  background: 'var(--muted)',
                  color: 'var(--foreground)',
                  outline: 'none',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            {error && (
              <p className="text-xs rounded-lg px-3 py-2.5" style={{ background: '#FEE2E2', color: '#B91C1C' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg text-sm font-semibold transition-opacity"
              style={{
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Signing in…' : 'Log in'}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div
          className="mt-4 rounded-xl p-4"
          style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-medium mb-3" style={{ color: 'var(--muted-foreground)' }}>
            Demo accounts — click to log in instantly
          </p>
          <div className="space-y-2">
            {DEMO_USERS.map((u) => (
              <button
                key={u.id}
                onClick={() => handleDemoLogin(u)}
                className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left transition-colors"
                style={{
                  background: 'var(--secondary)',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--primary)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'transparent')}
              >
                <div>
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{u.email}</p>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
                  style={{
                    background: u.role === 'admin' ? '#DBEAFE' : u.role === 'teacher' ? '#CFFAFE' : '#F0FDF4',
                    color: u.role === 'admin' ? '#1E40AF' : u.role === 'teacher' ? '#0E7490' : '#15803D',
                  }}
                >
                  {u.role}
                </span>
              </button>
            ))}
          </div>
          <p className="text-xs mt-3 text-center" style={{ color: 'var(--muted-foreground)' }}>
            Password for all accounts: <span className="mono font-medium">demo</span>
          </p>
        </div>
      </div>
    </div>
  )
}
