import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { orderAPI } from '../services/api'

interface OrderItem {
  id: number
  quantity: number
  unitPrice: { amount: number; currency: string }
  product: { id: number; title: string; imageUrl: string }
}

interface Order {
  id: number
  status: string
  totalAmount: { amount: number; currency: string }
  createdAt: string
  items: OrderItem[]
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  PENDING:    { bg: '#fef3e2', color: '#B45309' },
  PAID:       { bg: '#e8f7f0', color: '#2d9e75' },
  SHIPPED:    { bg: '#e8f0fe', color: '#3B82F6' },
  DELIVERED:  { bg: '#e8f7f0', color: '#059669' },
  CANCELLED:  { bg: '#fff0f0', color: '#e53935' },
}

export default function OrderHistoryPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    // Customer ID 3 is Harshada — later replace with dynamic ID from auth
    orderAPI.getCustomerOrders(3)
      .then(res => setOrders(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .order-card { transition: all 0.2s; }
        .order-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1) !important; }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: '#0D3D3A', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ color: '#F5A623', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Shop</span>
          <span style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Ease</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => navigate('/shop')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Syne' }}>Shop</button>
          <button onClick={() => navigate('/profile')} style={{ background: 'transparent', border: '2px solid rgba(255,255,255,0.4)', borderRadius: '50px', padding: '0.4rem 1rem', color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Syne' }}>
            👤 {user?.name}
          </button>
          <button onClick={() => navigate('/cart')} style={{ background: '#F5A623', border: 'none', borderRadius: '50px', padding: '0.5rem 1.2rem', color: '#0D3D3A', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem' }}>🛒 Cart</button>
        </div>
      </nav>

      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontFamily: 'Syne', fontSize: '2rem', fontWeight: 800, color: '#0D3D3A', margin: '0 0 0.5rem' }}>
            My Orders 📦
          </h1>
          <p style={{ color: '#888', margin: 0 }}>Track and manage all your orders</p>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{ width: '48px', height: '48px', border: '4px solid #e8e4dc', borderTop: '4px solid #F5A623', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: '4rem', margin: '0 0 1rem' }}>🛍️</p>
            <h2 style={{ fontFamily: 'Syne', color: '#0D3D3A', margin: '0 0 0.5rem' }}>No orders yet!</h2>
            <p style={{ color: '#888', margin: '0 0 1.5rem' }}>Start shopping to see your orders here</p>
            <button
              onClick={() => navigate('/shop')}
              style={{ background: '#F5A623', border: 'none', borderRadius: '50px', padding: '0.8rem 2rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne', color: '#0D3D3A', fontSize: '1rem' }}
            >
              Start Shopping →
            </button>
          </div>
        )}

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {orders.map((order, i) => {
            const statusStyle = STATUS_COLORS[order.status] || { bg: '#f0f0f0', color: '#666' }
            const isExpanded = expanded === order.id

            return (
              <div
                key={order.id}
                className="order-card"
                style={{
                  background: '#fff', borderRadius: '16px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                  animation: `fadeInUp ${0.1 + i * 0.05}s ease both`
                }}
              >
                {/* Order Header */}
                <div
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                  style={{
                    padding: '1.2rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '44px', height: '44px', background: '#F7F4EF', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
                      📦
                    </div>
                    <div>
                      <p style={{ fontFamily: 'Syne', fontWeight: 700, color: '#0D3D3A', margin: '0 0 2px', fontSize: '1rem' }}>
                        Order #{order.id}
                      </p>
                      <p style={{ color: '#888', fontSize: '0.8rem', margin: 0 }}>
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <p style={{ fontFamily: 'Syne', fontWeight: 800, color: '#0D3D3A', margin: 0, fontSize: '1.1rem' }}>
                      ₹{Number(order.totalAmount?.amount).toLocaleString('en-IN')}
                    </p>
                    <span style={{ background: statusStyle.bg, color: statusStyle.color, padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700 }}>
                      {order.status}
                    </span>
                    <span style={{ color: '#888', fontSize: '1rem' }}>{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Order Items (expanded) */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #f0ece4', padding: '1rem 1.5rem' }}>
                    {order.items?.map(item => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: '1px solid #f7f4ef' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '40px', height: '40px', background: '#e8f4f3', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                            📦
                          </div>
                          <div>
                            <p style={{ margin: 0, fontWeight: 600, color: '#1a1a1a', fontSize: '0.9rem' }}>
                              {item.product?.title || 'Product'}
                            </p>
                            <p style={{ margin: 0, color: '#888', fontSize: '0.8rem' }}>
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                        <p style={{ fontWeight: 700, color: '#0D3D3A', margin: 0, fontFamily: 'Syne' }}>
                          ₹{(Number(item.unitPrice?.amount) * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '0.8rem' }}>
                      <button
                        onClick={() => navigate('/shop')}
                        style={{ background: '#F5A623', border: 'none', borderRadius: '10px', padding: '0.6rem 1.2rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'Syne', color: '#0D3D3A', fontSize: '0.85rem' }}
                      >
                        Buy Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}