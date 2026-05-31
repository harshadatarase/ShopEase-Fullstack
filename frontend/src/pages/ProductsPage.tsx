import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

interface Product {
  id: number
  title: string
  description: string
  brand: string
  imageUrl: string
  price: { amount: number; currency: string }
  stockQuantity: number
  category: { id: number; name: string }  // ← Add this
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [added, setAdded] = useState<number | null>(null)
  const { addItem, totalItems } = useCart()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedCategory, setSelectedCategory] = useState('All')
const categories = ['All', ...new Set(products.map(p => p.category?.name).filter(Boolean))]

  useEffect(() => {
    productAPI.getAll()
      .then(res => setProducts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const filtered = products.filter(p => {
  const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ?? true
  const matchCategory = selectedCategory === 'All' || p.category?.name === selectedCategory
  return matchSearch && matchCategory
})
  const handleAdd = (product: Product) => {
    addItem(product)
    setAdded(product.id)
    setTimeout(() => setAdded(null), 1500)
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: '#0D3D3A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <p style={{ color: '#F5A623', fontSize: '1.5rem', fontFamily: 'Syne' }}>
        Loading...
      </p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>

{/* Navbar */}
<nav style={{
  background: '#0D3D3A',
  padding: '1rem 2rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  position: 'sticky',
  top: 0,
  zIndex: 100
}}>
  {/* Logo */}
  <div onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
    <span style={{ color: '#F5A623', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Shop</span>
    <span style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Ease</span>
  </div>

  {/* Right Side */}
  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
    <button
      onClick={() => navigate('/')}
      style={{
        background: 'transparent', border: 'none',
        color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
        fontSize: '0.9rem', fontFamily: 'Syne'
      }}
    >
      Home
    </button>

    <button
      onClick={() => navigate('/search')}
      style={{
        background: 'transparent',
        border: '2px solid rgba(255,255,255,0.3)',
        borderRadius: '50px', padding: '0.5rem 1.2rem',
        color: '#fff', cursor: 'pointer',
        fontSize: '0.85rem', fontFamily: 'Syne'
      }}
    >
      🔍 Search
    </button>

    {user ? (
  <>
    <button
      onClick={() => navigate('/orders')}
      style={{
        background: 'transparent', border: 'none',
        color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
        fontSize: '0.9rem', fontFamily: 'Syne'
      }}
    >
      My Orders
    </button>
    <button
      onClick={() => navigate('/profile')}
      style={{
        background: 'transparent',
        border: '2px solid rgba(255,255,255,0.4)',
        borderRadius: '50px', padding: '0.5rem 1.2rem',
        color: '#fff', cursor: 'pointer',
        fontSize: '0.85rem', fontFamily: 'Syne'
      }}
    >
      👤 {user.name}
    </button>
  </>
) : (
  <button
    onClick={() => navigate('/login')}
    style={{
      background: 'transparent',
      border: '2px solid rgba(255,255,255,0.4)',
      borderRadius: '50px', padding: '0.5rem 1.2rem',
      color: '#fff', cursor: 'pointer',
      fontSize: '0.85rem', fontFamily: 'Syne'
    }}
  >
    Login
  </button>
)}

    <button
      onClick={() => navigate('/cart')}
      style={{
        background: '#F5A623', border: 'none',
        borderRadius: '50px', padding: '0.6rem 1.4rem',
        fontWeight: 600, fontSize: '1rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: '8px',
        fontFamily: 'Syne', color: '#0D3D3A'
      }}
    >
      🛒 Cart
      {totalItems > 0 && (
        <span style={{
          background: '#0D3D3A', color: '#F5A623',
          borderRadius: '50%', width: '24px', height: '24px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 700
        }}>
          {totalItems}
        </span>
      )}
    </button>
  </div>
</nav>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0D3D3A 0%, #1a6b65 100%)',
        padding: '3rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          color: '#F5A623',
          fontSize: '3rem',
          fontWeight: 800,
          margin: 0,
          fontFamily: 'Syne'
        }}>
          Find What You Love
        </h1>
        <p style={{
          color: 'rgba(255,255,255,0.7)',
          marginTop: '0.5rem',
          fontSize: '1.1rem'
        }}>
          {products.length} products available
        </p>

        {/* Search */}
        <div style={{ maxWidth: '500px', margin: '1.5rem auto 0' }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.9rem 1.5rem',
              borderRadius: '50px',
              border: 'none',
              fontSize: '1rem',
              outline: 'none',
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.95)'
            }}
          />
        </div>
      </div>
{/* Category Tabs */}
<div style={{
  maxWidth: '1200px',
  margin: '1.5rem auto 0',
  padding: '0 1.5rem',
  display: 'flex',
  gap: '0.8rem',
  flexWrap: 'wrap'
}}>
  {categories.map(cat => (
    <button
      key={cat}
      onClick={() => setSelectedCategory(cat)}
      style={{
        padding: '0.5rem 1.2rem',
        borderRadius: '50px',
        border: '2px solid',
        borderColor: selectedCategory === cat ? '#0D3D3A' : '#e8e4dc',
        background: selectedCategory === cat ? '#0D3D3A' : '#fff',
        color: selectedCategory === cat ? '#F5A623' : '#666',
        fontWeight: selectedCategory === cat ? 700 : 500,
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontFamily: 'Syne',
        transition: 'all 0.2s'
      }}
    >
      {cat === 'All' ? '🛍️ All' :
       cat === 'Mobiles' ? '📱 Mobiles' :
       cat === 'Laptops' ? '💻 Laptops' :
       cat === 'Audio' ? '🎧 Audio' :
       cat === 'Tablets' ? '📱 Tablets' :
       cat === 'Accessories' ? '🖥️ Accessories' :
       cat === 'Cameras' ? '📷 Cameras' :
       cat === 'Wearables' ? '⌚ Wearables' : cat}
    </button>
  ))}
</div>
      {/* Products Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '2rem auto',
        padding: '0 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1.5rem'
      }}>
        {filtered.map(product => (
          <div
            key={product.id}
            style={{
              background: '#fff',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'   
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'
            }}
            onClick={() => navigate(`/product/${product.id}`)}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
            }}
          >
            {/* Image Area */}
            <div style={{
              height: '180px',
              overflow: 'hidden',
              position: 'relative',
              background: '#e8f4f3'
            }}>
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={e =>
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'
                  }
                  onMouseLeave={e =>
                    (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'
                  }
                  onError={e =>
                    (e.currentTarget as HTMLImageElement).src =
                      'https://via.placeholder.com/400x180?text=No+Image'
                  }
                />
              ) : (
                <div style={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '4rem'
                }}>📦</div>
              )}
              {product.stockQuantity === 0 && (
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: '#ff4444',
                  color: '#fff',
                  fontSize: '0.7rem',
                  padding: '4px 10px',
                  borderRadius: '50px',
                  fontWeight: 600
                }}>
                  Out of Stock
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '1.2rem' }}>
              <p style={{
                color: '#0D3D3A',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                margin: '0 0 4px'
              }}>
                {product.brand || 'General'}
              </p>

              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                margin: '0 0 6px',
                color: '#1a1a1a',
                fontFamily: 'Syne'
              }}>
                {product.title}
              </h2>

              <p style={{
                fontSize: '0.85rem',
                color: '#888',
                margin: '0 0 1rem',
                lineHeight: 1.4,
                height: '2.4em',
                overflow: 'hidden'
              }}>
                {product.description}
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem'
              }}>
                <span style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#0D3D3A',
                  fontFamily: 'Syne'
                }}>
                  ₹{Number(product.price?.amount).toLocaleString('en-IN')}
                </span>
                <span style={{
                  fontSize: '0.75rem',
                  color: '#2d9e75',
                  background: '#e8f7f0',
                  padding: '4px 10px',
                  borderRadius: '50px',
                  fontWeight: 500
                }}>
                  {product.stockQuantity} left
                </span>
              </div>

              <button
                disabled={product.stockQuantity === 0}
                onClick={() => handleAdd(product)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: added === product.id
                    ? '#2d9e75'
                    : product.stockQuantity === 0
                      ? '#ddd'
                      : '#F5A623',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer',
                  color: added === product.id ? '#fff' : '#0D3D3A',
                  transition: 'all 0.3s',
                  fontFamily: 'Syne'
                }}
              >
                {added === product.id
                  ? '✓ Added!'
                  : product.stockQuantity === 0
                    ? 'Out of Stock'
                    : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}