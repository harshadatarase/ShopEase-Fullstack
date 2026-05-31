import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productAPI } from '../services/api'
import { useCart } from '../context/CartContext'

interface Product {
  id: number
  title: string
  description: string
  brand: string
  imageUrl: string
  price: { amount: number; currency: string }
  stockQuantity: number
}

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem, totalItems } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    productAPI.getById(Number(id))
      .then(res => setProduct(res.data))
      .catch(() => navigate('/shop'))
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    if (!product) return
    for (let i = 0; i < quantity; i++) addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '48px', height: '48px', border: '4px solid #e8e4dc', borderTop: '4px solid #F5A623', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!product) return null

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>
      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: '#0D3D3A', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ color: '#F5A623', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Shop</span>
          <span style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Ease</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => navigate('/shop')} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Syne' }}>
            ← Back to Shop
          </button>
          <button onClick={() => navigate('/cart')} style={{ background: '#F5A623', border: 'none', borderRadius: '50px', padding: '0.5rem 1.2rem', color: '#0D3D3A', cursor: 'pointer', fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            🛒 Cart {totalItems > 0 && (
              <span style={{ background: '#0D3D3A', color: '#F5A623', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>{totalItems}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div style={{ maxWidth: '1100px', margin: '1.5rem auto', padding: '0 1.5rem' }}>
        <p style={{ color: '#888', fontSize: '0.85rem', margin: 0 }}>
          <span style={{ cursor: 'pointer', color: '#0D3D3A' }} onClick={() => navigate('/')}>Home</span>
          {' → '}
          <span style={{ cursor: 'pointer', color: '#0D3D3A' }} onClick={() => navigate('/shop')}>Shop</span>
          {' → '}
          <span style={{ color: '#888' }}>{product.title}</span>
        </p>
      </div>

      {/* Product Detail */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', animation: 'fadeInUp 0.5s ease' }}>

        {/* Image */}
        <div style={{ background: '#fff', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '6rem' }}>📦</span>
          )}
        </div>

        {/* Info */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ color: '#F5A623', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.85rem', margin: '0 0 8px' }}>
            {product.brand}
          </p>

          <h1 style={{ fontFamily: 'Syne', fontSize: '2.2rem', fontWeight: 800, color: '#0D3D3A', margin: '0 0 1rem', lineHeight: 1.2 }}>
            {product.title}
          </h1>

          <p style={{ color: '#666', fontSize: '1rem', lineHeight: 1.7, margin: '0 0 1.5rem' }}>
            {product.description || 'Premium quality product. Genuine brand. Fast delivery across India.'}
          </p>

          {/* Price */}
          <div style={{ background: '#F7F4EF', borderRadius: '16px', padding: '1.2rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 4px' }}>Price</p>
            <p style={{ fontFamily: 'Syne', fontSize: '2.5rem', fontWeight: 800, color: '#0D3D3A', margin: 0 }}>
              ₹{Number(product.price?.amount).toLocaleString('en-IN')}
            </p>
            <p style={{ color: '#2d9e75', fontSize: '0.85rem', margin: '4px 0 0', fontWeight: 600 }}>
              ✅ {product.stockQuantity} units in stock
            </p>
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontWeight: 600, color: '#0D3D3A', margin: '0 0 8px', fontSize: '0.9rem' }}>Quantity</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #e8e4dc', background: '#fff', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: '#0D3D3A' }}>−</button>
              <span style={{ fontFamily: 'Syne', fontSize: '1.2rem', fontWeight: 700, color: '#0D3D3A', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #e8e4dc', background: '#fff', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700, color: '#0D3D3A' }}>+</button>
              <span style={{ color: '#888', fontSize: '0.85rem' }}>
                Total: ₹{(Number(product.price?.amount) * quantity).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              disabled={product.stockQuantity === 0}
              onClick={handleAdd}
              style={{
                flex: 1, padding: '1rem',
                background: added ? '#2d9e75' : product.stockQuantity === 0 ? '#ddd' : '#F5A623',
                border: 'none', borderRadius: '14px',
                fontWeight: 700, fontSize: '1rem',
                cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer',
                color: added ? '#fff' : '#0D3D3A',
                fontFamily: 'Syne', transition: 'all 0.3s'
              }}
            >
              {added ? '✓ Added to Cart!' : product.stockQuantity === 0 ? 'Out of Stock' : '🛒 Add to Cart'}
            </button>
            <button
              onClick={() => { handleAdd(); navigate('/cart') }}
              disabled={product.stockQuantity === 0}
              style={{ flex: 1, padding: '1rem', background: '#0D3D3A', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', color: '#fff', fontFamily: 'Syne' }}
            >
              Buy Now →
            </button>
          </div>

          {/* Features */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginTop: '1.5rem' }}>
            {[
              { icon: '🚀', text: 'Fast Delivery' },
              { icon: '🔒', text: 'Secure Payment' },
              { icon: '↩️', text: '30-Day Returns' },
              { icon: '✅', text: 'Genuine Product' },
            ].map(f => (
              <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', borderRadius: '10px', padding: '0.6rem 0.8rem' }}>
                <span>{f.icon}</span>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0D3D3A' }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}