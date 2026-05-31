import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { cartAPI, orderAPI, paymentAPI } from '../services/api'
import { useState } from 'react'

const SESSION_ID = 'guest-session-001'
const CUSTOMER_ID = 3

export default function CartPage() {
  const { items, removeItem, totalPrice, totalItems, clearCart } = useCart()
  const navigate = useNavigate()
  const [paying, setPaying] = useState(false)
  const [step, setStep] = useState('')

 const handleCheckout = async () => {
  setPaying(true)
  try {
    // Step 1 - Sync cart to Redis
    setStep('Syncing cart...')
    for (const item of items) {
      await cartAPI.addItem(SESSION_ID, item.id, item.quantity)
    }

    // Step 2 - Create order in DB
    setStep('Creating order...')
    const orderRes = await orderAPI.createOrder(
      SESSION_ID, CUSTOMER_ID, totalPrice
    )
    const match = orderRes.data.match(/ID:\s*(\d+)/)
    const orderId = match ? parseInt(match[1]) : null
    if (!orderId) throw new Error('Could not get order ID')

    // Step 3 - Create Razorpay order
    setStep('Initiating payment...')
    const payRes = await paymentAPI.createPaymentOrder(orderId)
    const razorpayOrder = typeof payRes.data === 'string'
      ? JSON.parse(payRes.data)
      : payRes.data

    // Step 4 - Open Razorpay Popup
    setPaying(false)
    setStep('')

    const options = {
      key: 'rzp_test_Spy1rVEdPRL2Vn',
      amount: razorpayOrder.amount,
      currency: 'INR',
      name: 'ShopEase',
      description: `Order #${orderId}`,
      order_id: razorpayOrder.id,
    handler: function (response: any) {
  clearCart()
  navigate('/order-confirmation', {
    state: {
      orderId,
      paymentId: response.razorpay_payment_id,
      amount: totalPrice,
      items: items
    }
  })
},
      prefill: {
        name: 'Harshada Tarase',
        email: 'harshada@nextafield.com',
        contact: '9999999999'
      },
      theme: {
        color: '#0D3D3A'
      },
      modal: {
        ondismiss: function() {
          alert('Payment cancelled!')
        }
      }
    }

    // @ts-ignore
    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (err: any) {
    console.error('Checkout error:', err)
    const errMsg = typeof err.response?.data === 'string'
      ? err.response.data
      : JSON.stringify(err.response?.data || err.message)
    alert(`❌ ${errMsg}`)
    setPaying(false)
    setStep('')
  }
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
        </div>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'transparent',
            border: '2px solid #F5A623',
            borderRadius: '50px',
            padding: '0.5rem 1.2rem',
            color: '#F5A623',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'Syne'
          }}
        >
          ← Back to Shop
        </button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1.5rem' }}>
        <h1 style={{
          fontFamily: 'Syne',
          fontSize: '2rem',
          fontWeight: 800,
          color: '#0D3D3A',
          marginBottom: '1.5rem'
        }}>
          Your Cart 🛒
        </h1>

        {items.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            background: '#fff',
            borderRadius: '16px'
          }}>
            <p style={{ fontSize: '3rem' }}>🛍️</p>
            <p style={{ color: '#888', fontSize: '1.1rem' }}>Your cart is empty</p>
            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: '1rem',
                background: '#F5A623',
                border: 'none',
                borderRadius: '50px',
                padding: '0.7rem 2rem',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'Syne',
                fontSize: '1rem'
              }}
            >
              Shop Now
            </button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {items.map(item => (
                <div key={item.id} style={{
                  background: '#fff',
                  borderRadius: '14px',
                  padding: '1.2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: '#e8f4f3',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.8rem'
                    }}>📦</div>
                    <div>
                      <p style={{
                        fontWeight: 700,
                        margin: 0,
                        fontFamily: 'Syne',
                        color: '#1a1a1a'
                      }}>{item.title}</p>
                      <p style={{
                        color: '#888',
                        margin: '4px 0 0',
                        fontSize: '0.9rem'
                      }}>Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{
                      fontWeight: 700,
                      fontSize: '1.2rem',
                      color: '#0D3D3A',
                      margin: 0,
                      fontFamily: 'Syne'
                    }}>
                      ₹{(item.amount * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ff4444',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        marginTop: '4px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div style={{
              background: '#0D3D3A',
              borderRadius: '16px',
              padding: '1.5rem',
              marginTop: '1.5rem',
              color: '#fff'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '1.4rem',
                fontWeight: 700,
                fontFamily: 'Syne',
                borderTop: '1px solid rgba(255,255,255,0.2)',
                paddingTop: '0.8rem',
                marginTop: '0.8rem'
              }}>
                <span>Total</span>
                <span style={{ color: '#F5A623' }}>
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Step indicator */}
              {step && (
                <p style={{
                  color: '#F5A623',
                  textAlign: 'center',
                  margin: '1rem 0 0',
                  fontSize: '0.9rem',
                  animation: 'pulse 1s infinite'
                }}>
                  ⏳ {step}
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={paying}
                style={{
                  width: '100%',
                  marginTop: '1.2rem',
                  padding: '1rem',
                  background: paying ? '#888' : '#F5A623',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  cursor: paying ? 'wait' : 'pointer',
                  fontFamily: 'Syne',
                  color: '#0D3D3A',
                  transition: 'all 0.3s'
                }}
              >
                {paying ? `⏳ ${step}` : 'Proceed to Pay 💳'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}