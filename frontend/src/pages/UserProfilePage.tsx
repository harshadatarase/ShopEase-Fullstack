import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UserProfilePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: '#0D3D3A', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ color: '#F5A623', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Shop</span>
          <span style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Ease</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => navigate('/shop')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Syne' }}>Shop</button>
          <button onClick={() => navigate('/orders')} style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '50px', padding: '0.4rem 1rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Syne' }}>My Orders</button>
          <button onClick={() => navigate('/cart')} style={{ background: '#F5A623', border: 'none', borderRadius: '50px', padding: '0.5rem 1.2rem', color: '#0D3D3A', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>🛒 Cart</button>
        </div>
      </nav>

      <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1.5rem', animation: 'fadeInUp 0.5s ease' }}>

        {/* Profile Card */}
        <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', marginBottom: '1.5rem' }}>

          {/* Cover */}
          <div style={{ background: 'linear-gradient(135deg, #0D3D3A, #1a6b65)', height: '120px', position: 'relative' }} />

          {/* Avatar */}
          <div style={{ padding: '0 2rem 2rem', position: 'relative' }}>
            <div style={{
              width: '80px', height: '80px',
              background: '#F5A623',
              borderRadius: '50%',
              border: '4px solid #fff',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem', fontWeight: 800,
              color: '#0D3D3A', fontFamily: 'Syne',
              marginTop: '-40px', marginBottom: '1rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
            }}>
              {user?.name?.[0] || '?'}
            </div>

            <h1 style={{ fontFamily: 'Syne', fontSize: '1.8rem', fontWeight: 800, color: '#0D3D3A', margin: '0 0 4px' }}>
              {user?.name}
            </h1>
            <p style={{ color: '#888', margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
              {user?.email}
            </p>

            {/* Role Badge */}
            <span style={{
              background: user?.role === 'admin' ? '#fef3e2' : '#e8f4f3',
              color: user?.role === 'admin' ? '#B45309' : '#0D3D3A',
              padding: '4px 16px', borderRadius: '50px',
              fontSize: '0.8rem', fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: '0.08em'
            }}>
              {user?.role === 'admin' ? '🔧 Admin' : '👤 Customer'}
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: '1.1rem', fontWeight: 700, color: '#0D3D3A', margin: '0 0 1rem' }}>
            Quick Actions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { icon: '📦', label: 'My Orders', path: '/orders' },
              { icon: '🛍️', label: 'Continue Shopping', path: '/shop' },
              { icon: '🔍', label: 'Search Products', path: '/search' },
              ...(user?.role === 'admin' ? [{ icon: '🔧', label: 'Admin Panel', path: '/admin' }] : []),
            ].map(action => (
              <div
                key={action.label}
                onClick={() => navigate(action.path)}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: '1rem', padding: '0.9rem 1rem',
                  borderRadius: '12px', cursor: 'pointer',
                  transition: 'background 0.2s',
                  background: '#F7F4EF'
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = '#e8f4f3'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = '#F7F4EF'}
              >
                <span style={{ fontSize: '1.3rem' }}>{action.icon}</span>
                <span style={{ fontWeight: 600, color: '#0D3D3A', fontSize: '0.95rem' }}>{action.label}</span>
                <span style={{ marginLeft: 'auto', color: '#888' }}>→</span>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div style={{ background: '#fff', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: '1.1rem', fontWeight: 700, color: '#0D3D3A', margin: '0 0 1rem' }}>
            Account Info
          </h2>
          {[
            { label: 'Full Name', value: user?.name },
            { label: 'Email', value: user?.email },
            { label: 'Role', value: user?.role === 'admin' ? 'Administrator' : 'Customer' },
            { label: 'Member Since', value: '2026' },
          ].map(info => (
            <div key={info.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0', borderBottom: '1px solid #f0ece4' }}>
              <span style={{ color: '#888', fontSize: '0.9rem' }}>{info.label}</span>
              <span style={{ fontWeight: 600, color: '#0D3D3A', fontSize: '0.9rem' }}>{info.value}</span>
            </div>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%', padding: '1rem',
            background: '#fff', border: '2px solid #ff4444',
            borderRadius: '16px', fontWeight: 700,
            fontSize: '1rem', cursor: 'pointer',
            fontFamily: 'Syne', color: '#ff4444',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#ff4444'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#fff'
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = '#fff'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#ff4444'
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}