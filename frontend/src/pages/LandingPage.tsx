import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

const features = [
  { icon: '🚀', title: 'Lightning Fast Delivery', desc: 'From our warehouse to your doorstep in 2-3 days across India' },
  { icon: '🔒', title: 'Bank-Grade Security', desc: 'Powered by Razorpay — UPI, Cards, Netbanking, all secured' },
  { icon: '↩️', title: 'Zero Hassle Returns', desc: '30-day no-questions-asked return policy on everything' },
  { icon: '🎧', title: '24/7 Live Support', desc: 'Real humans, not bots. We\'re always here for you' },
]

const categories = [
  { icon: '📱', name: 'Phones', color: '#e8f4f3' },
  { icon: '💻', name: 'Laptops', color: '#fef3e2' },
  { icon: '🎧', name: 'Audio', color: '#f3e8f4' },
  { icon: '⌚', name: 'Wearables', color: '#e8f0fe' },
  { icon: '📷', name: 'Cameras', color: '#fce8e8' },
  { icon: '🖥️', name: 'Accessories', color: '#e8fce8' },
]

const testimonials = [
  { name: 'Priya S.', city: 'Mumbai', text: 'I was skeptical at first, but ShopEase blew my mind. Got my iPhone in 2 days — pristine condition!', rating: 5 },
  { name: 'Rahul M.', city: 'Bangalore', text: 'Best prices I\'ve found online. No hidden charges, genuine products. This is my go-to store now.', rating: 5 },
  { name: 'Anita K.', city: 'Delhi', text: 'The Razorpay checkout was so smooth. Paid via UPI in seconds. Will definitely shop again!', rating: 4 },
]

const stats = [
  { value: '10K+', label: 'Products' },
  { value: '50K+', label: 'Customers' },
  { value: '4.8★', label: 'Rating' },
  { value: '99%', label: 'Satisfaction' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { user, isAdmin, logout } = useAuth()
  const [showAccessPopup, setShowAccessPopup] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)

  const heroWords = ['Smarter.', 'Faster.', 'Better.']

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % heroWords.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleShopNow = () => {
    if (!user) {
      setShowAccessPopup(true)
    } else {
      navigate('/shop')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245,166,35,0.5); }
          50% { box-shadow: 0 0 0 14px rgba(245,166,35,0); }
        }
        @keyframes slideWord {
          0% { opacity: 0; transform: translateY(20px); }
          15% { opacity: 1; transform: translateY(0); }
          75% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-20px); }
        }
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .hover-lift { transition: transform 0.25s, box-shadow 0.25s; }
        .hover-lift:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(0,0,0,0.14) !important; }
        .cat-card { transition: all 0.3s ease; cursor: pointer; }
        .cat-card:hover { transform: translateY(-8px) scale(1.05); box-shadow: 0 16px 40px rgba(0,0,0,0.12); }
        .feature-card { transition: all 0.3s ease; border: 2px solid transparent; }
        .feature-card:hover { transform: translateY(-4px); border-color: #F5A623 !important; }
      `}</style>

      {/* Access Required Popup */}
      {showAccessPopup && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '28px',
            padding: '2.5rem',
            maxWidth: '420px',
            width: '90%',
            textAlign: 'center',
            animation: 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: '0 32px 100px rgba(0,0,0,0.35)'
          }}>
            {/* Icon */}
            <div style={{
              width: '90px', height: '90px',
              background: 'linear-gradient(135deg, #0D3D3A, #1a6b65)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.8rem',
              margin: '0 auto 1.5rem',
              animation: 'pulse 2s infinite'
            }}>🔐</div>

            <h2 style={{
              fontFamily: 'Syne',
              fontSize: '1.9rem',
              fontWeight: 800,
              color: '#0D3D3A',
              margin: '0 0 0.75rem'
            }}>
              Login Required!
            </h2>

            <p style={{
              color: '#666',
              fontSize: '1rem',
              lineHeight: 1.7,
              margin: '0 0 1rem'
            }}>
              Join <strong style={{ color: '#0D3D3A' }}>50,000+</strong> happy shoppers across India.
              <br />Create a free account to unlock the store!
            </p>

            <div style={{
              background: 'linear-gradient(135deg, #fef3e2, #fde8b8)',
              borderRadius: '12px',
              padding: '0.9rem',
              margin: '0 0 1.5rem',
              fontSize: '0.9rem',
              color: '#8B5E00',
              fontWeight: 600,
              border: '1px solid #F5A623'
            }}>
              🎁 New users get <strong>₹200 OFF</strong> on first order!
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button
                onClick={() => navigate('/signup')}
                style={{
                  background: '#F5A623',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '1rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'Syne',
                  color: '#0D3D3A',
                  animation: 'pulse 2s infinite'
                }}
              >
                🚀 Create Free Account
              </button>

              <button
                onClick={() => { setShowAccessPopup(false); navigate('/login') }}
                style={{
                  background: '#0D3D3A',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '1rem',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  fontFamily: 'Syne',
                  color: '#fff'
                }}
              >
                Already have an account? Login
              </button>

              <button
                onClick={() => setShowAccessPopup(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#bbb',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  padding: '0.3rem'
                }}
              >
                Maybe later ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav style={{
        background: '#0D3D3A',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 24px rgba(0,0,0,0.25)'
      }}>
        <div style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ color: '#F5A623', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Shop</span>
          <span style={{ color: '#fff', fontSize: '1.8rem', fontWeight: 800, fontFamily: 'Syne' }}>Ease</span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {user ? (
            <>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>👋 {user.name}</span>
              {isAdmin && (
                <button onClick={() => navigate('/admin')} style={{
                  background: 'transparent', border: '2px solid #F5A623',
                  borderRadius: '50px', padding: '0.4rem 1rem',
                  color: '#F5A623', cursor: 'pointer',
                  fontFamily: 'Syne', fontWeight: 600, fontSize: '0.85rem'
                }}>🔧 Admin</button>
              )}
              <button onClick={() => navigate('/shop')} style={{
                background: '#F5A623', border: 'none',
                borderRadius: '50px', padding: '0.5rem 1.4rem',
                color: '#0D3D3A', cursor: 'pointer',
                fontFamily: 'Syne', fontWeight: 700, fontSize: '0.9rem'
              }}>Shop Now →</button>
              <button onClick={() => logout()} style={{
                background: 'transparent', border: '2px solid rgba(255,255,255,0.3)',
                borderRadius: '50px', padding: '0.4rem 1rem',
                color: '#fff', cursor: 'pointer', fontSize: '0.85rem'
              }}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={{
                background: 'transparent', border: '2px solid rgba(255,255,255,0.4)',
                borderRadius: '50px', padding: '0.5rem 1.2rem',
                color: '#fff', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Syne'
              }}>Login</button>
              <button onClick={() => navigate('/signup')} style={{
                background: '#F5A623', border: 'none',
                borderRadius: '50px', padding: '0.5rem 1.2rem',
                color: '#0D3D3A', cursor: 'pointer',
                fontSize: '0.9rem', fontFamily: 'Syne', fontWeight: 700
              }}>Sign Up Free ✨</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0D3D3A 0%, #1a6b65 55%, #0a2e2b 100%)',
        padding: '7rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(245,166,35,0.08)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: '30%', left: '5%', width: '60px', height: '60px', background: 'rgba(245,166,35,0.15)', borderRadius: '50%', animation: 'float 3s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', top: '20%', right: '8%', width: '40px', height: '40px', background: 'rgba(255,255,255,0.08)', borderRadius: '50%', animation: 'float 4s ease-in-out infinite' }} />

        <div style={{
          display: 'inline-block',
          background: 'rgba(245,166,35,0.15)',
          border: '1px solid rgba(245,166,35,0.4)',
          borderRadius: '50px',
          padding: '0.4rem 1.2rem',
          color: '#F5A623',
          fontSize: '0.85rem',
          fontWeight: 700,
          letterSpacing: '0.12em',
          marginBottom: '1.5rem',
          animation: 'fadeInUp 0.5s ease both'
        }}>
          🇮🇳 PROUDLY MADE FOR INDIA
        </div>

        <h1 style={{
          color: '#fff',
          fontSize: '4.5rem',
          fontWeight: 800,
          margin: '0 0 0.5rem',
          fontFamily: 'Syne',
          lineHeight: 1.1,
          animation: 'fadeInUp 0.6s ease both'
        }}>
          Shop{' '}
          <span key={heroIndex} style={{
            color: '#F5A623',
            display: 'inline-block',
            animation: 'slideWord 2s ease',
            minWidth: '220px'
          }}>
            {heroWords[heroIndex]}
          </span>
        </h1>

        <h2 style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: '1.8rem',
          fontWeight: 400,
          margin: '0 0 1.5rem',
          fontFamily: 'Syne',
          animation: 'fadeInUp 0.7s ease both'
        }}>
          Your ultimate shopping destination
        </h2>

        <p style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: '1.1rem',
          maxWidth: '520px',
          margin: '0 auto 3rem',
          lineHeight: 1.7,
          animation: 'fadeInUp 0.8s ease both'
        }}>
          Discover thousands of genuine products at unbeatable prices.
          Fast delivery. Secure payments. Zero compromises.
        </p>

        <div style={{
          display: 'flex', gap: '1rem',
          justifyContent: 'center', flexWrap: 'wrap',
          animation: 'fadeInUp 0.9s ease both'
        }}>
          <button
            onClick={handleShopNow}
            className="hover-lift"
            style={{
              background: '#F5A623', border: 'none',
              borderRadius: '50px', padding: '1.1rem 2.8rem',
              fontWeight: 700, fontSize: '1.1rem',
              cursor: 'pointer', fontFamily: 'Syne',
              color: '#0D3D3A',
              boxShadow: '0 8px 32px rgba(245,166,35,0.5)',
              animation: 'pulse 2s infinite'
            }}
          >
            🛍️ Start Shopping
          </button>
          {!user && (
            <button
              onClick={() => navigate('/signup')}
              className="hover-lift"
              style={{
                background: 'transparent',
                border: '2px solid rgba(255,255,255,0.5)',
                borderRadius: '50px', padding: '1.1rem 2.8rem',
                fontWeight: 600, fontSize: '1.1rem',
                cursor: 'pointer', fontFamily: 'Syne', color: '#fff'
              }}
            >
              Create Free Account →
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          gap: '3rem', marginTop: '4rem', flexWrap: 'wrap',
          animation: 'fadeInUp 1s ease both'
        }}>
          {stats.map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ color: '#F5A623', fontSize: '2.2rem', fontWeight: 800, margin: 0, fontFamily: 'Syne' }}>{stat.value}</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', margin: '4px 0 0' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Marquee */}
      <div style={{ background: '#F5A623', padding: '0.9rem 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-block', animation: 'marquee 20s linear infinite' }}>
          {[...Array(2)].flatMap(() =>
            ['📱 Latest Smartphones', '💻 Premium Laptops', '🎧 Pro Audio', '⌚ Smart Watches', '📷 DSLR Cameras', '🖥️ Accessories', '🎮 Gaming Gear', '🏠 Home & Living'].map((item, i) => (
              <span key={`${item}-${i}`} style={{ margin: '0 2rem', fontWeight: 700, color: '#0D3D3A', fontSize: '0.9rem', fontFamily: 'Syne' }}>
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* Categories */}
      <div style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#F5A623', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>EXPLORE</p>
          <h2 style={{ fontFamily: 'Syne', fontSize: '2.5rem', fontWeight: 800, color: '#0D3D3A', margin: 0 }}>Shop by Category</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1.2rem' }}>
          {categories.map(cat => (
            <div key={cat.name} className="cat-card" onClick={handleShopNow} style={{
              background: cat.color, borderRadius: '20px',
              padding: '2rem 1rem', textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}>
              <p style={{ fontSize: '3rem', margin: '0 0 10px' }}>{cat.icon}</p>
              <p style={{ fontWeight: 700, color: '#0D3D3A', margin: 0, fontFamily: 'Syne', fontSize: '1rem' }}>{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ background: '#F7F4EF', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ color: '#F5A623', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>WHY US</p>
            <h2 style={{ fontFamily: 'Syne', fontSize: '2.5rem', fontWeight: 800, color: '#0D3D3A', margin: 0 }}>
              Why 50,000+ Indians<br />Choose ShopEase
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {features.map(f => (
              <div key={f.title} className="feature-card hover-lift" style={{
                background: '#fff', borderRadius: '20px',
                padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
              }}>
                <div style={{
                  width: '60px', height: '60px',
                  background: 'linear-gradient(135deg, #0D3D3A, #1a6b65)',
                  borderRadius: '16px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', marginBottom: '1rem'
                }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'Syne', color: '#0D3D3A', margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 700 }}>{f.title}</h3>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div style={{ padding: '5rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ color: '#F5A623', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.85rem', margin: '0 0 0.5rem' }}>TESTIMONIALS</p>
          <h2 style={{ fontFamily: 'Syne', fontSize: '2.5rem', fontWeight: 800, color: '#0D3D3A', margin: 0 }}>
            Real People.<br />Real Stories.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {testimonials.map((t, i) => (
            <div key={t.name} className="hover-lift" style={{
              background: i === 1 ? '#0D3D3A' : '#fff',
              borderRadius: '20px', padding: '2rem',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: i === 1 ? 'none' : '1px solid #f0ece4'
            }}>
              <p style={{ color: '#F5A623', fontSize: '1.3rem', margin: '0 0 1rem' }}>
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </p>
              <p style={{ color: i === 1 ? 'rgba(255,255,255,0.85)' : '#444', margin: '0 0 1.5rem', lineHeight: 1.7, fontStyle: 'italic', fontSize: '0.95rem' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '42px', height: '42px', background: '#F5A623',
                  borderRadius: '50%', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#0D3D3A',
                  fontWeight: 800, fontSize: '1rem', fontFamily: 'Syne'
                }}>{t.name[0]}</div>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: i === 1 ? '#fff' : '#0D3D3A', fontSize: '0.9rem', fontFamily: 'Syne' }}>{t.name}</p>
                  <p style={{ margin: 0, color: i === 1 ? 'rgba(255,255,255,0.5)' : '#888', fontSize: '0.8rem' }}>{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #0D3D3A 0%, #1a6b65 100%)',
        padding: '5rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '250px', height: '250px', background: 'rgba(245,166,35,0.08)', borderRadius: '50%' }} />
        <p style={{ color: '#F5A623', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: '0.85rem', margin: '0 0 1rem' }}>
          LIMITED TIME OFFER 🔥
        </p>
        <h2 style={{ color: '#fff', fontFamily: 'Syne', fontSize: '3rem', fontWeight: 800, margin: '0 0 1rem', lineHeight: 1.2 }}>
          New Users Get<br /><span style={{ color: '#F5A623' }}>₹200 Off</span> First Order!
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1.1rem', margin: '0 0 2.5rem' }}>
          Join 50,000+ happy customers. No credit card required.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/signup')} className="hover-lift" style={{
            background: '#F5A623', border: 'none', borderRadius: '50px',
            padding: '1.1rem 2.8rem', fontWeight: 700, fontSize: '1.1rem',
            cursor: 'pointer', fontFamily: 'Syne', color: '#0D3D3A',
            boxShadow: '0 8px 32px rgba(245,166,35,0.4)'
          }}>
            🚀 Claim My ₹200 Off
          </button>
          <button onClick={handleShopNow} className="hover-lift" style={{
            background: 'transparent', border: '2px solid rgba(255,255,255,0.4)',
            borderRadius: '50px', padding: '1.1rem 2.8rem',
            fontWeight: 600, fontSize: '1.1rem',
            cursor: 'pointer', fontFamily: 'Syne', color: '#fff'
          }}>
            Browse Products
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#0a2e2b', padding: '2.5rem 2rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '1rem' }}>
          <span style={{ color: '#F5A623', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Syne' }}>Shop</span>
          <span style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Syne' }}>Ease</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.3)', margin: 0, fontSize: '0.85rem' }}>
          © 2026 ShopEase — Built with ❤️ in India · Privacy · Terms · Support
        </p>
      </footer>
    </div>
  )
}