import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProductsPage from './pages/ProductsPage'
import CartPage from './pages/CartPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import SearchPage from './pages/SearchPage'
import ProductDetailPage from './pages/ProductDetailPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import UserProfilePage from './pages/UserProfilePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/" />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth()
  return isAdmin ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/shop" element={
              <ProtectedRoute>
                <ProductsPage />
              </ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            } />
            <Route path="/order-confirmation" element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            } />

<Route path="/search" element={
  <ProtectedRoute>
    <SearchPage />
  </ProtectedRoute>
} />

<Route path="/product/:id" element={
  <ProtectedRoute>
    <ProductDetailPage />
  </ProtectedRoute>
} />
<Route path="/orders" element={
  <ProtectedRoute>
    <OrderHistoryPage />
  </ProtectedRoute>
} />
<Route path="/profile" element={
  <ProtectedRoute>
    <UserProfilePage />
  </ProtectedRoute>
} />

            <Route path="/admin" element={
              <AdminRoute>
                <AdminPage />
              </AdminRoute>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App