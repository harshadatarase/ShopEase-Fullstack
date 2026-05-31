import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  const {
    orderId,
    paymentId,
    amount,
    items
  } = location.state || {}

  useEffect(() => {
    // Redirect if no order data
    if (!orderId) {
      navigate('/')
      return
    }
    setTimeout(() => setVisible(true), 100)
  }, [orderId])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7F4EF',
      display: 'flex',
      flexDirection: 'column'
    }}>

      {/* Navbar */}
      <nav style={{
        background: '#0D3D3A',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{
            color: '#F5A623',
            fontSize: '1.8rem',
            fontWeight: 800,
            fontFamily: 'Syne'
          }}>Shop</span>
          <span style={{
            color: '#fff',
            fontSize: '1.8rem',
            fontWeight: 800,
            fontFamily: 'Syne'
          }}>Ease</span>
        </div>
      </nav>

      <div style={{
        maxWidth: '650px',
        margin: '3rem auto',
        padding: '0 1.5rem',
        width: '100%',
        opacity: visible ? 1 : 0,
        transform: visible
          ? 'translateY(0)'
          : 'translateY(20px)',
        transition: 'all 0.5s ease'
      }}>

        {/* Success Card */}
        <div style={{
          background: '#fff',
          borderRadius: '20px',
          padding: '2.5rem',
          textAlign: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          marginBottom: '1.5rem'
        }}>
          {/* Success Icon */}
          <div style={{
            width: '80px',
            height: '80px',
            background: '#e8f7f0',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            margin: '0 auto 1.5rem'
          }}>
            ✅
          </div>

          <h1 style={{
            fontFamily: 'Syne',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#0D3D3A',
            margin: '0 0 0.5rem'
          }}>
            Order Confirmed!
          </h1>

          <p style={{
            color: '#888',
            fontSize: '1rem',
            margin: '0 0 2rem'
          }}>
            Thank you for shopping with ShopEase 🎉
          </p>

          {/* Order Details */}
          <div style={{
            background: '#F7F4EF',
            borderRadius: '14px',
            padding: '1.5rem',
            textAlign: 'left'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.6rem 0',
              borderBottom: '1px solid #e8e4dc'
            }}>
              <span style={{ color: '#888' }}>Order ID</span>
              <span style={{
                fontWeight: 700,
                color: '#0D3D3A',
                fontFamily: 'Syne'
              }}>#{orderId}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.6rem 0',
              borderBottom: '1px solid #e8e4dc'
            }}>
              <span style={{ color: '#888' }}>Payment ID</span>
              <span style={{
                fontWeight: 600,
                color: '#0D3D3A',
                fontSize: '0.85rem'
              }}>{paymentId}</span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.6rem 0',
              borderBottom: '1px solid #e8e4dc'
            }}>
              <span style={{ color: '#888' }}>Status</span>
              <span style={{
                background: '#e8f7f0',
                color: '#2d9e75',
                padding: '4px 12px',
                borderRadius: '50px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                Payment Successful
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.6rem 0'
            }}>
              <span style={{ color: '#888' }}>Total Paid</span>
              <span style={{
                fontWeight: 800,
                color: '#0D3D3A',
                fontSize: '1.3rem',
                fontFamily: 'Syne'
              }}>
                ₹{Number(amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        {/* Items Ordered */}
        {items && items.length > 0 && (
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            padding: '1.5rem',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            marginBottom: '1.5rem'
          }}>
            <h2 style={{
              fontFamily: 'Syne',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#0D3D3A',
              margin: '0 0 1rem'
            }}>
              Items Ordered
            </h2>

            {items.map((item: any) => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.8rem 0',
                borderBottom: '1px solid #f0ece4'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    background: '#e8f4f3',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem'
                  }}>📦</div>
                  <div>
                    <p style={{
                      margin: 0,
                      fontWeight: 600,
                      color: '#1a1a1a',
                      fontFamily: 'Syne'
                    }}>{item.title}</p>
                    <p style={{
                      margin: '2px 0 0',
                      fontSize: '0.8rem',
                      color: '#888'
                    }}>Qty: {item.quantity}</p>
                  </div>
                </div>
                <span style={{
                  fontWeight: 700,
                  color: '#0D3D3A',
                  fontFamily: 'Syne'
                }}>
                  ₹{(item.amount * item.quantity)
                    .toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              flex: 1,
              padding: '1rem',
              background: '#0D3D3A',
              border: 'none',
              borderRadius: '12px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'Syne'
            }}
          >
            Continue Shopping
          </button>

          <button
            onClick={() => window.print()}
            style={{
              flex: 1,
              padding: '1rem',
              background: '#F5A623',
              border: 'none',
              borderRadius: '12px',
              color: '#0D3D3A',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              fontFamily: 'Syne'
            }}
          >
            🖨️ Print Receipt
          </button>
        </div>
      </div>
    </div>
  )
}