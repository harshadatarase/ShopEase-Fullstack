# 🛒 ShopEase — Full Stack E-Commerce Platform

<div align="center">

![ShopEase Banner](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80)

**A production-grade e-commerce platform built with Spring Boot 3 & React**

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Elasticsearch](https://img.shields.io/badge/Elasticsearch-8.x-005571?style=for-the-badge&logo=elasticsearch&logoColor=white)](https://www.elastic.co/)

</div>

---

## ✨ Features

### 🛍️ User Features
- 🔍 **Full-text Search** — Elasticsearch-powered with filters, sorting & suggestions
- 🗂️ **Category Browsing** — Browse by Electronics, Mobiles, Laptops, Audio, Tablets
- 🛒 **Smart Cart** — Redis session-based cart with TTL management
- 💳 **Secure Payments** — Razorpay integration (UPI, Cards, Netbanking)
- 📦 **Order Management** — Track all orders with status updates
- 👤 **User Profile** — Manage account and view order history
- 📄 **Product Detail** — Rich product pages with quantity selector

### 🔧 Admin Features
- ➕ **Add Products** — Create products with images, categories, pricing
- ✏️ **Edit Products** — Update product details and stock
- 🗑️ **Delete Products** — Remove products from catalog
- 📊 **Dashboard Stats** — Total products, stock levels, inventory value

### 🔐 Security
- 🔒 **Role-Based Access** — Admin and User roles
- 🛡️ **Protected Routes** — Authenticated access only
- 🔑 **JWT Ready** — Prepared for Keycloak integration (JFS-004)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│                  React Frontend                  │
│         (Vite + TypeScript + React Router)       │
└──────────────────────┬──────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────┐
│              Spring Boot Backend                 │
│                  (Port 8080)                     │
├──────────┬───────────┬──────────────────────────┤
│PostgreSQL│   Redis   │      Elasticsearch        │
│(Orders,  │  (Cart    │   (Product Search &       │
│Products) │  Cache)   │      Suggestions)         │
└──────────┴───────────┴──────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │      Razorpay API       │
          │  (Payment Processing)   │
          └─────────────────────────┘
```

---

## 🚀 Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Spring Boot 3 | REST API Framework |
| Spring Data JPA | ORM & Database Access |
| PostgreSQL | Primary Database |
| Redis | Session Cart & Caching |
| Elasticsearch 8 | Full-text Search |
| Razorpay SDK | Payment Gateway |
| Lombok | Boilerplate Reduction |
| Maven | Build Tool |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| React Router v6 | Client-side Routing |
| Axios | HTTP Client |
| Razorpay Checkout | Payment UI |

---



---

## ⚙️ Setup & Installation

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Elasticsearch 8+

### 🔧 Backend Setup

```bash
# Navigate to backend
cd backend

# Configure database in application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/shopease
spring.datasource.username=postgres
spring.datasource.password=your_password

# Add Razorpay keys
razorpay.key.id=your_key_id
razorpay.key.secret=your_key_secret

# Run the application
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### 🎨 Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on `http://localhost:5173`

---

## 📡 API Endpoints

### Products
```
GET    /api/products          # Get all products
GET    /api/products/{id}     # Get product by ID
POST   /api/products          # Create product (Admin)
PUT    /api/products/{id}     # Update product (Admin)
DELETE /api/products/{id}     # Delete product (Admin)
```

### Cart
```
POST   /api/cart/add          # Add item to cart
GET    /api/cart              # Get cart items
DELETE /api/cart/remove       # Remove item
DELETE /api/cart/clear        # Clear cart
```

### Orders
```
POST   /api/orders/create           # Create order
GET    /api/orders/{id}             # Get order
GET    /api/orders/customer/{id}    # Get customer orders
```

### Payment
```
POST   /api/payment/create-order    # Create Razorpay order
POST   /api/payment/verify          # Verify payment
```

### Search
```
GET    /api/search?q={query}        # Search products
GET    /api/search/suggest?q={query} # Get suggestions
```

---


---


---


---

---


---

<div align="center">
Built with ❤️ in India 🇮🇳
</div>