# 🏍️ Motoshop Backend (Express.js + MongoDB)

## 1. Project Overview

**Motoshop Backend** হলো একটি প্রোডাকশন-রেডি, স্কেলেবল RESTful API সার্ভার, যা বাইক বিক্রির জন্য ই-কমার্স প্ল্যাটফর্মের ব্যাকএন্ড হিসেবে কাজ করে।
এখানে JWT ভিত্তিক অথেন্টিকেশন, RBAC, SSLCommerz পেমেন্ট, অর্ডার ট্র্যাকিং, রিভিউ, উইশলিস্ট, কার্ট, নোটিফিকেশন, রিপোর্টিং, এবং ক্লিন MVC আর্কিটেকচার ফলো করা হয়েছে।

**Tech Stack:**

- **Node.js** (CommonJS)
- **Express.js**
- **MongoDB** (Mongoose ODM)
- **JWT** (Authentication)
- **RBAC** (Role-based Access Control)
- **SSLCommerz** (Payment Gateway)
- **Nodemailer** (Email Notification)
- **dotenv, Helmet, CORS, express-rate-limit** (Security & Config)
- **Swagger/OpenAPI** (API Docs)

---

## 2. Project Folder Structure Explanation

```
server/
│
├── server.js                # Main entry point
├── swagger.json             # Swagger/OpenAPI docs
├── /routes                  # API route definitions
├── /controllers             # Route handler logic
├── /models                  # Mongoose data models
├── /services                # Business logic (e.g., payment, email)
├── /middlewares             # Custom Express middlewares
├── /config                  # DB, payment, and other configs
└── .env.example             # Environment variable template
```

| Folder         | Purpose                                                       |
| -------------- | ------------------------------------------------------------- |
| `/routes`      | API endpoint definitions (maps URLs to controllers)           |
| `/controllers` | Contains business logic for each route                        |
| `/models`      | Mongoose schemas/models for MongoDB collections               |
| `/services`    | External integrations/business logic (e.g., payment, email)   |
| `/middlewares` | Custom Express middlewares (auth, error handling, RBAC, etc.) |
| `/config`      | Database, payment, and other configuration files              |

---

## 3. Setup Instructions

### 3.1 Local Setup

```bash
git clone <repo-url>
cd motoshop-3.0/server
npm install
```

### 3.2 Configure Environment Variables

`.env` ফাইল তৈরি করুন (নিচের উদাহরণ দেখুন):

```env
PORT=5000
MONGODB_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here
SSLCOMMERZ_STORE_ID=your_store_id_here
SSLCOMMERZ_STORE_PASSWORD=your_store_password_here
CLIENT_URL=http://localhost:3000
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### 3.3 Run the Server

**Development (with nodemon):**

```bash
npm run dev
```

**Production:**

```bash
npm start
```

---

## 4. API Authentication & RBAC

- **JWT (JSON Web Token) ভিত্তিক অথেন্টিকেশন।**
- রেজিস্ট্রেশন/লগইন সফল হলে, সার্ভার থেকে একটি JWT টোকেন পাওয়া যাবে।
- এই টোকেন ক্লায়েন্টকে `Authorization: Bearer <token>` হেডারে পাঠাতে হবে প্রোটেক্টেড রুটে এক্সেসের জন্য।
- **RBAC:** ইউজার, অ্যাডমিন, সুপার-অ্যাডমিন রোলভিত্তিক পারমিশন।

**Example:**

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## 5. API Endpoints Documentation (v1)

### 5.1 Auth Routes

**POST /api/v1/auth/register**
নতুন ইউজার রেজিস্ট্রেশন
**Request:**

```json
{
  "name": "Rahim",
  "email": "rahim@example.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "665f1c...",
    "name": "Rahim",
    "email": "rahim@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

**POST /api/v1/auth/login**
**Request:**

```json
{
  "email": "rahim@example.com",
  "password": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "665f1c...",
    "name": "Rahim",
    "email": "rahim@example.com",
    "isAdmin": false,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
}
```

**POST /api/v1/auth/forgot-password**
**Request:**

```json
{ "email": "rahim@example.com" }
```

**Response:**

```json
{
  "success": true,
  "message": "If that email is registered, a reset link has been sent."
}
```

**POST /api/v1/auth/reset-password**
**Request:**

```json
{ "token": "reset-token", "password": "newpassword" }
```

**Response:**

```json
{ "success": true, "message": "Password reset successful" }
```

### 5.2 User Management

**PUT /api/v1/users/:id/block**
**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{ "success": true, "message": "User blocked" }
```

**PUT /api/v1/users/:id/unblock**
**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{ "success": true, "message": "User unblocked" }
```

### 5.3 Product, Category, Brand

**GET /api/v1/bikes**
**Response:**

```json
{
  "success": true,
  "bikes": [
    {
      "_id": "665f1c...",
      "name": "Yamaha R15",
      "brand": { "_id": "...", "name": "Yamaha" },
      "category": { "_id": "...", "name": "Sports" },
      "price": 450000,
      "stock": 10,
      "image": "base64string",
      "description": "A great sports bike"
    }
  ]
}
```

**POST /api/v1/bikes**
**Headers:** `Authorization: Bearer <admin-token>`
**Request:**

```json
{
  "name": "Yamaha R15",
  "brand": "665f1c...",
  "category": "665f1d...",
  "price": 450000,
  "stock": 10,
  "image": "base64string",
  "description": "A great sports bike"
}
```

**Response:** (নতুন বাইক অবজেক্ট)

**GET /api/v1/categories**
**Response:**

```json
{
  "success": true,
  "categories": [
    { "_id": "665f1d...", "name": "Sports", "description": "Sports bikes" }
  ]
}
```

**POST /api/v1/categories**
**Headers:** `Authorization: Bearer <admin-token>`
**Request:**

```json
{ "name": "Commuter", "description": "Commuter bikes" }
```

**Response:** (নতুন ক্যাটাগরি অবজেক্ট)

**GET /api/v1/brands**
**Response:**

```json
{
  "success": true,
  "brands": [
    { "_id": "665f1e...", "name": "Yamaha", "description": "Japanese brand" }
  ]
}
```

**POST /api/v1/brands**
**Headers:** `Authorization: Bearer <admin-token>`
**Request:**

```json
{ "name": "Honda", "description": "Japanese brand" }
```

**Response:** (নতুন ব্র্যান্ড অবজেক্ট)

### 5.4 Promo Codes

**GET /api/v1/promocodes**
**Response:**

```json
{
  "success": true,
  "promos": [
    {
      "_id": "665f1f...",
      "code": "NEWUSER",
      "discountType": "percent",
      "discountValue": 10
    }
  ]
}
```

**POST /api/v1/promocodes/validate**
**Request:**

```json
{ "code": "NEWUSER", "orderTotal": 1000 }
```

**Response:**

```json
{
  "success": true,
  "discount": 100,
  "promo": {
    "_id": "665f1f...",
    "code": "NEWUSER",
    "discountType": "percent",
    "discountValue": 10
  }
}
```

### 5.5 Orders

**POST /api/v1/orders**
**Headers:** `Authorization: Bearer <token>`
**Request:**

```json
{
  "bikes": [{ "bike": "665f1c...", "qty": 1 }],
  "totalPrice": 450000,
  "promoCode": "NEWUSER"
}
```

**Response:**

```json
{
  "success": true,
  "order": { "_id": "665f20...", "status": "pending", ... },
  "paymentUrl": "https://sandbox.sslcommerz.com/..."
}
```

**PUT /api/v1/orders/:id/status**
**Headers:** `Authorization: Bearer <admin-token>`
**Request:**

```json
{ "status": "shipped", "note": "Shipped via courier" }
```

**Response:** (আপডেটেড অর্ডার অবজেক্ট)

**GET /api/v1/orders/:id/timeline**
**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{
  "success": true,
  "timeline": [
    {
      "status": "pending",
      "note": "Order placed",
      "date": "2024-06-30T12:00:00Z"
    },
    {
      "status": "shipped",
      "note": "Shipped via courier",
      "date": "2024-07-01T10:00:00Z"
    }
  ]
}
```

### 5.6 Review & Rating

**GET /api/v1/reviews/bike/:bikeId**
**Response:**

```json
{
  "success": true,
  "reviews": [
    {
      "_id": "665f21...",
      "user": { "_id": "...", "name": "Rahim" },
      "rating": 5,
      "comment": "Great bike!"
    }
  ]
}
```

**POST /api/v1/reviews**
**Headers:** `Authorization: Bearer <token>`
**Request:**

```json
{ "bike": "665f1c...", "rating": 5, "comment": "Great bike!" }
```

**Response:** (নতুন রিভিউ অবজেক্ট)

### 5.7 Wishlist & Cart

**GET /api/v1/wishlist**
**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{
  "success": true,
  "wishlist": {
    "user": "665f1b...",
    "bikes": ["665f1c...", "665f1d..."]
  }
}
```

**POST /api/v1/wishlist/add**
**Headers:** `Authorization: Bearer <token>`
**Request:**

```json
{ "bikeId": "665f1c..." }
```

**Response:** (আপডেটেড উইশলিস্ট অবজেক্ট)

**GET /api/v1/cart**
**Headers:** `Authorization: Bearer <token>`
**Response:**

```json
{
  "success": true,
  "cart": {
    "user": "665f1b...",
    "items": [{ "bike": "665f1c...", "qty": 1 }]
  }
}
```

### 5.8 Reporting & Analytics

**GET /api/v1/reports/dashboard**
**Headers:** `Authorization: Bearer <admin-token>`
**Response:**

```json
{
  "success": true,
  "totalOrders": 100,
  "totalSales": 5000000,
  "totalUsers": 200
}
```

**GET /api/v1/reports/sales?period=daily**
**Headers:** `Authorization: Bearer <admin-token>`
**Response:**

```json
{
  "success": true,
  "report": [{ "date": "2024-06-30", "totalSales": 100000, "orderCount": 10 }]
}
```

---

## 6. Order Status Tracking & Timeline

- অর্ডার স্ট্যাটাস: pending, paid, shipped, delivered, cancelled, refunded
- প্রতিটি স্ট্যাটাস চেঞ্জ টাইমলাইনে সংরক্ষিত হয়
- `/api/v1/orders/:id/timeline` দিয়ে অর্ডার টাইমলাইন দেখা যায়

---

## 7. Review & Rating System

- ইউজার বাইকের জন্য একবারই রিভিউ দিতে পারবে
- বাইকের গড় রেটিং ও রিভিউ কাউন্ট পাওয়া যাবে

---

## 8. Security & Best Practices

- Helmet, CORS, Rate Limiting, Input Validation
- Error Handling Middleware
- Sensitive config via dotenv

---

## 9. Extensibility

- Clean MVC structure
- Future features: payment webhooks, admin panel, push notifications, ইত্যাদি

---

## 10. API Documentation

- Swagger UI: `/api-docs`
- অথবা swagger.json ফাইল দেখুন

---

## 11. Example .env Variables Documentation

| Variable Name               | Description                 | Example Value         |
| --------------------------- | --------------------------- | --------------------- |
| `PORT`                      | Server port                 | 5000                  |
| `MONGODB_URI`               | MongoDB connection string   | mongodb+srv://...     |
| `JWT_SECRET`                | JWT token secret            | your_jwt_secret       |
| `SSLCOMMERZ_STORE_ID`       | SSLCommerz store ID         | your_store_id         |
| `SSLCOMMERZ_STORE_PASSWORD` | SSLCommerz store password   | your_store_password   |
| `CLIENT_URL`                | Allowed frontend URL (CORS) | http://localhost:3000 |
| `SMTP_HOST`                 | SMTP server host            | smtp.example.com      |
| `SMTP_PORT`                 | SMTP server port            | 587                   |
| `SMTP_USER`                 | SMTP username               | your_smtp_user        |
| `SMTP_PASS`                 | SMTP password               | your_smtp_password    |

---

## 12. Automated Testing (Jest + Supertest)

- টেস্ট ফাইলগুলো `server/tests/` ফোল্ডারে সংরক্ষিত
- **Jest** ফ্রেমওয়ার্ক ও **Supertest** দিয়ে API টেস্ট করা হয়
- **mongodb-memory-server** দিয়ে ইন-মেমরি MongoDB টেস্ট ডেটাবেস
- সকল মেজর রুটের জন্য `.test.js` ফাইল (auth, bike, order, review, report)
- টেস্টে success/failure, টোকেন হ্যান্ডলিং, মকড এক্সটার্নাল সার্ভিস, ক্লিনআপ ইত্যাদি কভার করা হয়েছে

### টেস্ট রান করার নিয়ম

```bash
npm install
npm test
```

### কভারেজ রিপোর্ট

```bash
npx jest --coverage
```

### কাস্টম টেস্ট এনভায়রনমেন্ট

- `.env.test` ফাইল তৈরি করুন (নমুনা: `.env.example`)
- টেস্ট রান করলে স্বয়ংক্রিয়ভাবে ইন-মেমরি ডেটাবেস ও ক্লিন এনভায়রনমেন্ট ব্যবহৃত হয়

---

## ✨ Happy Coding!

কোনো প্রশ্ন থাকলে বা কাস্টমাইজেশন লাগলে জানাবেন।
