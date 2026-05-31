import { useEffect, useState, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { searchAPI } from '../services/api'
import { useCart } from '../context/CartContext'

interface ProductDoc {
  id: string
  title: string
  description: string
  brand: string
  price: number
  currency: string
  stockQuantity: number
  categoryName: string
}

interface SearchResult {
  products: ProductDoc[]
  totalHits: number
  brandCounts: Record<string, number>
  categoryCounts: Record<string, number>
}

export default function SearchPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { addItem, totalItems } = useCart()

  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [results, setResults] = useState<SearchResult | null>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [added, setAdded] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [sortBy, setSortBy] = useState('relevance')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const suggestTimer = useRef<any>(null)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      doSearch(q)
    }
  }, [])

  const doSearch = async (q: string, params?: any) => {
    if (!q.trim()) return
    setLoading(true)
    setShowSuggestions(false)
    try {
      const res = await searchAPI.search(q, {
        sortBy,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        brand: selectedBrand || undefined,
        ...params
      })
      setResults(res.data)
      setSearchParams({ q })
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (val: string) => {
    setQuery(val)
    clearTimeout(suggestTimer.current)
    if (val.length > 1) {
      suggestTimer.current = setTimeout(async () => {
        try {
          const res = await searchAPI.suggest(val)
          setSuggestions(res.data)
          setShowSuggestions(true)
        } catch {}
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleAdd = (product: ProductDoc) => {
    addItem({
      id: parseInt(product.id),
      title: product.title,
      price: { amount: product.price, currency: product.currency },
      stockQuantity: product.stockQuantity
    })
    setAdded(product.id)
    setTimeout(() => setAdded(null), 1500)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .result-card { transition: all 0.25s ease; }
        .result-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.1) !important; }
        .suggest-item:hover { background: #e8f4f3 !important; }
        .filter-btn:hover { background: #0D3D3A !important; color: #fff !important; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        background: '#0D3D3A', padding: '1rem 2rem',
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
      }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ color: '#F5A623', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Shop</span>
          <span style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Ease</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => navigate('/shop')} style={{
            background: 'transparent', border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: '50px', padding: '0.4rem 1rem',
            color: '#fff', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Syne'
          }}>← Shop</button>
          <button onClick={() => navigate('/cart')} style={{
            background: '#F5A623', border: 'none', borderRadius: '50px',
            padding: '0.5rem 1.2rem', color: '#0D3D3A', cursor: 'pointer',
            fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            🛒 Cart {totalItems > 0 && (
              <span style={{
                background: '#0D3D3A', color: '#F5A623',
                borderRadius: '50%', width: '20px', height: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700
              }}>{totalItems}</span>
            )}
          </button>
        </div>
      </nav>

      {/* Search Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0D3D3A 0%, #1a6b65 100%)',
        padding: '3rem 2rem', textAlign: 'center'
      }}>
        <h1 style={{
          color: '#fff', fontFamily: 'Syne',
          fontSize: '2.5rem', fontWeight: 800,
          margin: '0 0 0.5rem'
        }}>
          🔍 Search Products
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 1.5rem' }}>
          Powered by Elasticsearch — find anything instantly
        </p>

        {/* Search Box */}
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              value={query}
              onChange={e => handleInputChange(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doSearch(query)}
              placeholder="Search for iPhone, Samsung, Sony..."
              style={{
                flex: 1, padding: '1rem 1.5rem',
                borderRadius: '50px', border: 'none',
                fontSize: '1rem', outline: 'none',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
              }}
            />
            <button
              onClick={() => doSearch(query)}
              style={{
                background: '#F5A623', border: 'none',
                borderRadius: '50px', padding: '1rem 1.8rem',
                fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Syne', color: '#0D3D3A',
                fontSize: '1rem', whiteSpace: 'nowrap'
              }}
            >
              Search →
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '110%', left: 0, right: 0,
              background: '#fff', borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              overflow: 'hidden', zIndex: 200,
              animation: 'fadeInUp 0.2s ease'
            }}>
              {suggestions.map((s, i) => (
                <div
                  key={i}
                  className="suggest-item"
                  onClick={() => { setQuery(s); doSearch(s); setShowSuggestions(false) }}
                  style={{
                    padding: '0.8rem 1.5rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    borderBottom: i < suggestions.length - 1 ? '1px solid #f0ece4' : 'none',
                    display: 'flex', alignItems: 'center', gap: '10px',
                    fontSize: '0.95rem', color: '#333'
                  }}
                >
                  <span style={{ color: '#F5A623' }}>🔍</span> {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1.5rem', display: 'flex', gap: '1.5rem' }}>

        {/* Sidebar Filters */}
        {results && (
          <div style={{ width: '260px', flexShrink: 0 }}>

            {/* Sort */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: 'Syne', color: '#0D3D3A', margin: '0 0 1rem', fontSize: '1rem' }}>
                Sort By
              </h3>
              {[
                { value: 'relevance', label: '⭐ Relevance' },
                { value: 'price_asc', label: '💰 Price: Low to High' },
                { value: 'price_desc', label: '💎 Price: High to Low' },
                { value: 'stock', label: '📦 In Stock First' },
              ].map(opt => (
                <div
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); doSearch(query, { sortBy: opt.value }) }}
                  style={{
                    padding: '0.6rem 0.8rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: sortBy === opt.value ? 700 : 400,
                    background: sortBy === opt.value ? '#0D3D3A' : 'transparent',
                    color: sortBy === opt.value ? '#F5A623' : '#555',
                    marginBottom: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>

            {/* Price Filter */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontFamily: 'Syne', color: '#0D3D3A', margin: '0 0 1rem', fontSize: '1rem' }}>
                Price Range (₹)
              </h3>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '0.8rem' }}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  style={{ width: '50%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e8e4dc', fontSize: '0.85rem', outline: 'none' }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  style={{ width: '50%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e8e4dc', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
              <button
                className="filter-btn"
                onClick={() => doSearch(query)}
                style={{
                  width: '100%', padding: '0.6rem',
                  background: '#F5A623', border: 'none',
                  borderRadius: '8px', fontWeight: 700,
                  cursor: 'pointer', fontSize: '0.85rem',
                  color: '#0D3D3A', fontFamily: 'Syne',
                  transition: 'all 0.2s'
                }}
              >
                Apply Filter
              </button>
            </div>

            {/* Brand Filter */}
            {Object.keys(results.brandCounts).length > 0 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '1.2rem', marginBottom: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ fontFamily: 'Syne', color: '#0D3D3A', margin: '0 0 1rem', fontSize: '1rem' }}>
                  Brands
                </h3>
                <div
                  onClick={() => { setSelectedBrand(''); doSearch(query, { brand: '' }) }}
                  style={{
                    padding: '0.5rem 0.8rem', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '0.85rem',
                    background: selectedBrand === '' ? '#0D3D3A' : 'transparent',
                    color: selectedBrand === '' ? '#F5A623' : '#555',
                    marginBottom: '4px', fontWeight: selectedBrand === '' ? 700 : 400
                  }}
                >
                  All Brands
                </div>
                {Object.entries(results.brandCounts).map(([brand, count]) => (
                  <div
                    key={brand}
                    onClick={() => { setSelectedBrand(brand); doSearch(query, { brand }) }}
                    style={{
                      padding: '0.5rem 0.8rem', borderRadius: '8px',
                      cursor: 'pointer', fontSize: '0.85rem',
                      background: selectedBrand === brand ? '#0D3D3A' : 'transparent',
                      color: selectedBrand === brand ? '#F5A623' : '#555',
                      marginBottom: '4px', fontWeight: selectedBrand === brand ? 700 : 400,
                      display: 'flex', justifyContent: 'space-between'
                    }}
                  >
                    <span>{brand}</span>
                    <span style={{ opacity: 0.6 }}>({count})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Results */}
        <div style={{ flex: 1 }}>
          {loading && (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <div style={{
                width: '48px', height: '48px',
                border: '4px solid #e8e4dc',
                borderTop: '4px solid #F5A623',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p style={{ color: '#888' }}>Searching...</p>
            </div>
          )}

          {!loading && !results && (
            <div style={{ textAlign: 'center', padding: '4rem' }}>
              <p style={{ fontSize: '4rem', margin: '0 0 1rem' }}>🔍</p>
              <h2 style={{ fontFamily: 'Syne', color: '#0D3D3A', margin: '0 0 0.5rem' }}>
                Search for anything
              </h2>
              <p style={{ color: '#888' }}>Try "iPhone", "Samsung", "Sony"...</p>
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                {['iPhone', 'Samsung', 'Sony', 'Apple', 'Laptop'].map(term => (
                  <span
                    key={term}
                    onClick={() => { setQuery(term); doSearch(term) }}
                    style={{
                      background: '#fff', border: '2px solid #e8e4dc',
                      borderRadius: '50px', padding: '0.4rem 1rem',
                      cursor: 'pointer', fontSize: '0.9rem',
                      color: '#0D3D3A', fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {term}
                  </span>
                ))}
              </div>
            </div>
          )}

          {!loading && results && (
            <>
              {/* Results Header */}
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: '1.2rem'
              }}>
                <p style={{ color: '#0D3D3A', fontWeight: 700, fontFamily: 'Syne', margin: 0 }}>
                  {results.totalHits > 0
                    ? `Found ${results.totalHits} result${results.totalHits > 1 ? 's' : ''} for "${query}"`
                    : `No results for "${query}"`}
                </p>
              </div>

              {results.products.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: '#fff', borderRadius: '16px' }}>
                  <p style={{ fontSize: '3rem' }}>😕</p>
                  <h3 style={{ fontFamily: 'Syne', color: '#0D3D3A' }}>No products found</h3>
                  <p style={{ color: '#888' }}>Try a different search term</p>
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '1.2rem'
                }}>
                  {results.products.map((product, i) => (
                    <div
                      key={product.id}
                      className="result-card"
                      style={{
                        background: '#fff', borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        animation: `fadeInUp ${0.1 + i * 0.05}s ease both`
                      }}
                    >
                      {/* Image */}
                      <div style={{
                        height: '160px',
                        background: 'linear-gradient(135deg, #e8f4f3, #d4ede9)',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'center', fontSize: '3.5rem',
                        position: 'relative'
                      }}>
                        📦
                        {product.stockQuantity === 0 && (
                          <div style={{
                            position: 'absolute', top: '10px', right: '10px',
                            background: '#ff4444', color: '#fff',
                            fontSize: '0.7rem', padding: '3px 8px',
                            borderRadius: '50px', fontWeight: 600
                          }}>Out of Stock</div>
                        )}
                      </div>

                      {/* Content */}
                      <div style={{ padding: '1rem' }}>
                        <p style={{ color: '#F5A623', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                          {product.brand}
                        </p>
                        <h3 style={{ fontFamily: 'Syne', fontSize: '1rem', fontWeight: 700, margin: '0 0 4px', color: '#1a1a1a' }}>
                          {product.title}
                        </h3>
                        <p style={{ fontSize: '0.8rem', color: '#888', margin: '0 0 0.8rem', lineHeight: 1.4, height: '2.2em', overflow: 'hidden' }}>
                          {product.description}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                          <span style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0D3D3A', fontFamily: 'Syne' }}>
                            ₹{Number(product.price).toLocaleString('en-IN')}
                          </span>
                          <span style={{
                            fontSize: '0.7rem', color: '#2d9e75',
                            background: '#e8f7f0', padding: '3px 8px',
                            borderRadius: '50px', fontWeight: 500
                          }}>
                            {product.stockQuantity} left
                          </span>
                        </div>
                        <button
                          disabled={product.stockQuantity === 0}
                          onClick={() => handleAdd(product)}
                          style={{
                            width: '100%', padding: '0.65rem',
                            background: added === product.id ? '#2d9e75' : product.stockQuantity === 0 ? '#ddd' : '#F5A623',
                            border: 'none', borderRadius: '10px',
                            fontWeight: 700, fontSize: '0.9rem',
                            cursor: product.stockQuantity === 0 ? 'not-allowed' : 'pointer',
                            color: added === product.id ? '#fff' : '#0D3D3A',
                            transition: 'all 0.3s', fontFamily: 'Syne'
                          }}
                        >
                          {added === product.id ? '✓ Added!' : product.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}