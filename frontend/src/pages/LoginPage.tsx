import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = () => {
    setLoading(true)
    setError('')

    setTimeout(() => {
      const success = login(email, password)
      if (success) {
        if (email === 'admin@shopease.com') {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        setError('Invalid email or password!')
      }
      setLoading(false)
    }, 800)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D3D3A 0%, #1a6b65 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontFamily: 'Syne',
            fontSize: '2.5rem',
            fontWeight: 800,
            margin: 0
          }}>
            <span style={{ color: '#F5A623' }}>Shop</span>
            <span style={{ color: '#0D3D3A' }}>Ease</span>
          </h1>
          <p style={{ color: '#888', marginTop: '0.5rem' }}>
            Sign in to continue
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#fff0f0',
            border: '1px solid #ffcdd2',
            borderRadius: '10px',
            padding: '0.8rem 1rem',
            color: '#e53935',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            ❌ {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            fontWeight: 600,
            color: '#0D3D3A',
            marginBottom: '6px',
            fontSize: '0.9rem'
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              border: '2px solid #e8e4dc',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border 0.2s'
            }}
            onFocus={e => e.target.style.border = '2px solid #0D3D3A'}
            onBlur={e => e.target.style.border = '2px solid #e8e4dc'}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{
            display: 'block',
            fontWeight: 600,
            color: '#0D3D3A',
            marginBottom: '6px',
            fontSize: '0.9rem'
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password"
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
            style={{
              width: '100%',
              padding: '0.8rem 1rem',
              borderRadius: '10px',
              border: '2px solid #e8e4dc',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border 0.2s'
            }}
            onFocus={e => e.target.style.border = '2px solid #0D3D3A'}
            onBlur={e => e.target.style.border = '2px solid #e8e4dc'}
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%',
            padding: '1rem',
            background: loading ? '#888' : '#F5A623',
            border: 'none',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1.1rem',
            cursor: loading ? 'wait' : 'pointer',
            fontFamily: 'Syne',
            color: '#0D3D3A',
            transition: 'all 0.3s'
          }}
        >
          {loading ? '⏳ Signing in...' : 'Sign In →'}
        </button>

        {/* Hint */}
        <div style={{
          marginTop: '1.5rem',
          background: '#F7F4EF',
          borderRadius: '12px',
          padding: '1rem',
          fontSize: '0.85rem',
          color: '#666'
        }}>
          <p style={{ margin: '0 0 6px', fontWeight: 600, color: '#0D3D3A' }}>
            Test Credentials:
          </p>
          <p style={{ margin: '2px 0' }}>
            🔧 Admin: admin@shopease.com / admin123
          </p>
          <p style={{ margin: '2px 0' }}>
            👤 User: harshada@nextafield.com / user123
          </p>
        </div>

        {/* Back to shop */}
        <p style={{
          textAlign: 'center',
          marginTop: '1rem',
          color: '#888',
          fontSize: '0.9rem'
        }}>
          <span
            onClick={() => navigate('/')}
            style={{ color: '#0D3D3A', cursor: 'pointer', fontWeight: 600 }}
          >
            ← Back to Shop
          </span>
        </p>
      </div>
    </div>
  )
}