import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '',
    email: '', password: '', confirm: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignup = () => {
    if (!form.firstName || !form.email || !form.password) {
      setError('Please fill all required fields!')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match!')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters!')
      return
    }

    setLoading(true)
    setTimeout(() => {
      alert(`✅ Account created for ${form.firstName}!\n\nYou can now login with your credentials.`)
      navigate('/login')
      setLoading(false)
    }, 1000)
  }

  const inputStyle = {
    width: '100%',
    padding: '0.8rem 1rem',
    borderRadius: '10px',
    border: '2px solid #e8e4dc',
    fontSize: '1rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border 0.2s'
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
        maxWidth: '460px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: '2.5rem', fontWeight: 800, margin: 0 }}>
            <span style={{ color: '#F5A623' }}>Shop</span>
            <span style={{ color: '#0D3D3A' }}>Ease</span>
          </h1>
          <p style={{ color: '#888', marginTop: '0.5rem' }}>Create your free account</p>
        </div>

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
          }}>❌ {error}</div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#0D3D3A', fontSize: '0.85rem', marginBottom: '4px' }}>
              First Name *
            </label>
            <input
              style={inputStyle}
              placeholder="Harshada"
              value={form.firstName}
              onChange={e => setForm({ ...form, firstName: e.target.value })}
              onFocus={e => e.target.style.border = '2px solid #0D3D3A'}
              onBlur={e => e.target.style.border = '2px solid #e8e4dc'}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#0D3D3A', fontSize: '0.85rem', marginBottom: '4px' }}>
              Last Name
            </label>
            <input
              style={inputStyle}
              placeholder="Tarase"
              value={form.lastName}
              onChange={e => setForm({ ...form, lastName: e.target.value })}
              onFocus={e => e.target.style.border = '2px solid #0D3D3A'}
              onBlur={e => e.target.style.border = '2px solid #e8e4dc'}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#0D3D3A', fontSize: '0.85rem', marginBottom: '4px' }}>
            Email *
          </label>
          <input
            style={inputStyle}
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onFocus={e => e.target.style.border = '2px solid #0D3D3A'}
            onBlur={e => e.target.style.border = '2px solid #e8e4dc'}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#0D3D3A', fontSize: '0.85rem', marginBottom: '4px' }}>
            Password *
          </label>
          <input
            style={inputStyle}
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            onFocus={e => e.target.style.border = '2px solid #0D3D3A'}
            onBlur={e => e.target.style.border = '2px solid #e8e4dc'}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontWeight: 600, color: '#0D3D3A', fontSize: '0.85rem', marginBottom: '4px' }}>
            Confirm Password *
          </label>
          <input
            style={inputStyle}
            type="password"
            placeholder="Repeat password"
            value={form.confirm}
            onChange={e => setForm({ ...form, confirm: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleSignup()}
            onFocus={e => e.target.style.border = '2px solid #0D3D3A'}
            onBlur={e => e.target.style.border = '2px solid #e8e4dc'}
          />
        </div>

        <button
          onClick={handleSignup}
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
            color: '#0D3D3A'
          }}
        >
          {loading ? '⏳ Creating account...' : 'Create Account →'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '1rem', color: '#888', fontSize: '0.9rem' }}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#0D3D3A', cursor: 'pointer', fontWeight: 700 }}
          >
            Sign In
          </span>
        </p>

        <p style={{ textAlign: 'center', marginTop: '0.5rem' }}>
          <span
            onClick={() => navigate('/')}
            style={{ color: '#888', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            ← Back to Home
          </span>
        </p>
      </div>
    </div>
  )
}