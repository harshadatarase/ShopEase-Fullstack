import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { productAPI } from '../services/api'
import axios from 'axios'

interface Product {
  id: number
  title: string
  description: string
  brand: string
  imageUrl: string
  price: { amount: number; currency: string }
  stockQuantity: number
}

const emptyForm = {
  title: '',
  description: '',
  brand: '',
  imageUrl: '',
  amount: '',
  currency: 'INR',
  stockQuantity: '',
  categoryId: ''  // ← Add this
}

export default function AdminPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products')
  const [categories, setCategories] = useState<{id: number, name: string}[]>([])

  const fetchProducts = () => {
    productAPI.getAll()
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false))
  }
useEffect(() => {
  fetchProducts()
  axios.get('/api/categories').then(res => setCategories(res.data))
}, [])

  const handleSave = async () => {
    setSaving(true)
    try {
     const payload = {
  title: form.title,
  description: form.description,
  brand: form.brand,
  imageUrl: form.imageUrl,
  price: {
    amount: parseFloat(form.amount),
    currency: form.currency
  },
  stockQuantity: parseInt(form.stockQuantity),
  category: form.categoryId ? { id: parseInt(form.categoryId) } : null  // ← Add this
}

      if (editId) {
        await axios.put(`/api/products/${editId}`, payload)
        alert('✅ Product updated!')
      } else {
        await axios.post('/api/products', payload)
        alert('✅ Product added!')
      }

      setShowForm(false)
      setForm(emptyForm)
      setEditId(null)
      fetchProducts()
    } catch (err) {
      alert('❌ Failed to save product!')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product: Product) => {
    setForm({
      title: product.title,
      description: product.description || '',
      brand: product.brand || '',
      imageUrl: product.imageUrl || '',
      amount: product.price?.amount?.toString() || '',
      currency: product.price?.currency || 'INR',
      stockQuantity: product.stockQuantity?.toString() || '',
      categoryId: product.category?.id?.toString() || ''
    })
    setEditId(product.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await axios.delete(`/api/products/${id}`)
      alert('✅ Product deleted!')
      fetchProducts()
    } catch (err) {
      alert('❌ Failed to delete!')
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '0.7rem 1rem',
    borderRadius: '8px',
    border: '2px solid #e8e4dc',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box' as const,
    marginTop: '4px'
  }

  const labelStyle = {
    display: 'block' as const,
    fontWeight: 600,
    color: '#0D3D3A',
    fontSize: '0.85rem',
    marginBottom: '2px'
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>

      {/* Navbar */}
      <nav style={{
        background: '#0D3D3A',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ color: '#F5A623', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Shop</span>
          <span style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Ease</span>
          <span style={{
            background: '#F5A623',
            color: '#0D3D3A',
            fontSize: '0.7rem',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '50px',
            marginLeft: '8px',
            verticalAlign: 'middle'
          }}>ADMIN</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
            👋 {user?.name}
          </span>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'transparent',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '50px',
              padding: '0.4rem 1rem',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '0.85rem'
            }}
          >
            View Shop
          </button>
          <button
            onClick={() => { logout(); navigate('/login') }}
            style={{
              background: '#F5A623',
              border: 'none',
              borderRadius: '50px',
              padding: '0.4rem 1rem',
              color: '#0D3D3A',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem' }}>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {[
            { label: 'Total Products', value: products.length, icon: '📦' },
            { label: 'In Stock', value: products.filter(p => p.stockQuantity > 0).length, icon: '✅' },
            { label: 'Out of Stock', value: products.filter(p => p.stockQuantity === 0).length, icon: '❌' },
            { label: 'Total Value', value: `₹${products.reduce((s, p) => s + (p.price?.amount || 0), 0).toLocaleString('en-IN')}`, icon: '💰' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '1.2rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}>
              <p style={{ fontSize: '1.8rem', margin: '0 0 4px' }}>{stat.icon}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0D3D3A', fontFamily: 'Syne' }}>
                {stat.value}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#888', margin: '2px 0 0' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            fontFamily: 'Syne',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#0D3D3A',
            margin: 0
          }}>
            Product Management
          </h2>
          <button
            onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm) }}
            style={{
              background: '#F5A623',
              border: 'none',
              borderRadius: '10px',
              padding: '0.7rem 1.5rem',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'Syne',
              fontSize: '0.95rem',
              color: '#0D3D3A'
            }}
          >
            + Add Product
          </button>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
            border: '2px solid #F5A623'
          }}>
            <h3 style={{
              fontFamily: 'Syne',
              color: '#0D3D3A',
              margin: '0 0 1.5rem',
              fontSize: '1.2rem'
            }}>
              {editId ? '✏️ Edit Product' : '➕ Add New Product'}
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              <div>
                <label style={labelStyle}>Title *</label>
                <input
                  style={inputStyle}
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Product title"
                />
              </div>
              <div>
                <label style={labelStyle}>Brand</label>
                <input
                  style={inputStyle}
                  value={form.brand}
                  onChange={e => setForm({ ...form, brand: e.target.value })}
                  placeholder="Brand name"
                />
              </div>
              <div>
                <label style={labelStyle}>Price (₹) *</label>
                <input
                  style={inputStyle}
                  type="number"
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label style={labelStyle}>Stock Quantity *</label>
                <input
                  style={inputStyle}
                  type="number"
                  value={form.stockQuantity}
                  onChange={e => setForm({ ...form, stockQuantity: e.target.value })}
                  placeholder="0"
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Description</label>
                <input
                  style={inputStyle}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Product description"
                />
              </div>
              <div>
  <label style={labelStyle}>Category *</label>
  <select
    style={{...inputStyle, background: '#fff'}}
    value={form.categoryId}
    onChange={e => setForm({ ...form, categoryId: e.target.value })}
  >
    <option value="">Select Category</option>
    {categories.map(cat => (
      <option key={cat.id} value={cat.id}>{cat.name}</option>
    ))}
  </select>
</div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Image URL</label>
                <input
                  style={inputStyle}
                  value={form.imageUrl}
                  onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Image Preview */}
            {form.imageUrl && (
              <div style={{ marginTop: '1rem' }}>
                <p style={{ ...labelStyle, marginBottom: '6px' }}>Preview:</p>
                <img
                  src={form.imageUrl}
                  alt="preview"
                  style={{
                    width: '120px',
                    height: '90px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #e8e4dc'
                  }}
                  onError={e =>
                    (e.currentTarget as HTMLImageElement).style.display = 'none'
                  }
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  background: saving ? '#888' : '#0D3D3A',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '0.75rem 2rem',
                  color: '#fff',
                  fontWeight: 700,
                  cursor: saving ? 'wait' : 'pointer',
                  fontFamily: 'Syne'
                }}
              >
                {saving ? '⏳ Saving...' : editId ? '✅ Update' : '✅ Save'}
              </button>
              <button
                onClick={() => { setShowForm(false); setForm(emptyForm); setEditId(null) }}
                style={{
                  background: '#F7F4EF',
                  border: '2px solid #e8e4dc',
                  borderRadius: '10px',
                  padding: '0.75rem 2rem',
                  color: '#666',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Products Table */}
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
        ) : (
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#0D3D3A' }}>
                  {['Image', 'Title', 'Brand', 'Price', 'Stock', 'Actions'].map(h => (
                    <th key={h} style={{
                      padding: '1rem',
                      color: '#fff',
                      textAlign: 'left',
                      fontFamily: 'Syne',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => (
                  <tr key={product.id} style={{
                    background: i % 2 === 0 ? '#fff' : '#fafaf8',
                    borderBottom: '1px solid #f0ece4'
                  }}>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          style={{
                            width: '50px',
                            height: '40px',
                            objectFit: 'cover',
                            borderRadius: '6px'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '50px',
                          height: '40px',
                          background: '#e8f4f3',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>📦</div>
                      )}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 600, color: '#1a1a1a' }}>
                      {product.title}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', color: '#666' }}>
                      {product.brand || '-'}
                    </td>
                    <td style={{ padding: '0.8rem 1rem', fontWeight: 700, color: '#0D3D3A' }}>
                      ₹{Number(product.price?.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <span style={{
                        background: product.stockQuantity > 0 ? '#e8f7f0' : '#fff0f0',
                        color: product.stockQuantity > 0 ? '#2d9e75' : '#e53935',
                        padding: '4px 10px',
                        borderRadius: '50px',
                        fontSize: '0.8rem',
                        fontWeight: 600
                      }}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td style={{ padding: '0.8rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEdit(product)}
                          style={{
                            background: '#F5A623',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            color: '#0D3D3A'
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product.id, product.title)}
                          style={{
                            background: '#fff0f0',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '6px 14px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: '0.8rem',
                            color: '#e53935'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}