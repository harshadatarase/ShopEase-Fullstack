import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

export const productAPI = {
  getAll: () => api.get('/products'),
  getById: (id: number) => api.get(`/products/${id}`),
}

export const cartAPI = {
  getCart: (sessionId: string) =>
    api.get(`/cart?sessionId=${sessionId}&isAnonymous=true`),
  addItem: (sessionId: string, productId: number, quantity: number) =>
    api.post(`/cart/add?sessionId=${sessionId}&productId=${productId}&quantity=${quantity}&isAnonymous=true`),
  removeItem: (sessionId: string, productId: number) =>
    api.delete(`/cart/remove?sessionId=${sessionId}&productId=${productId}&isAnonymous=true`)
}

export const orderAPI = {
  createOrder: (sessionId: string, customerId: number, total: number) =>
    api.post(`/orders/create?sessionId=${sessionId}&customerId=${customerId}&total=${total}&isAnonymous=true`),
  getCustomerOrders: (customerId: number) =>
    api.get(`/orders/customer/${customerId}`),
  getOrder: (orderId: number) =>
    api.get(`/orders/${orderId}`)
}

export const paymentAPI = {
  createPaymentOrder: (orderId: number) =>
    api.post(`/payment/create-order?orderId=${orderId}`)
}

export const searchAPI = {
  search: (q: string, params?: any) =>
    api.get(`/search?q=${q}`, { params }),
  suggest: (q: string) =>
    api.get(`/search/suggest?q=${q}`)
}

export default api