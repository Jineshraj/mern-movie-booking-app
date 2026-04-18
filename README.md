# 🎬 CineVerse — Full Stack MERN Movie Booking App

> A production-ready movie ticket booking platform built with the MERN stack, featuring real payment integration, seat selection, admin panel, and JWT authentication.

---

## 📌 Project Overview

CineVerse is a full-stack web application I built to consolidate and showcase everything I learned about modern web development using the **MERN stack** (MongoDB, Express.js, React, Node.js).

The project covers the complete lifecycle of a real-world application — from designing the database schema and building REST APIs, to creating a responsive React frontend with routing, authentication, and a live payment gateway integration using **Razorpay**.

---

## ✨ Features

### 🎥 User-Facing Frontend (`/front-end` — Port 5175)
- **Home Page** — Hero banner video, Featured Movies section, Latest News, Upcoming Releases
- **Movies Page** — Browse all 48+ movies with category filters (Action, Horror, Comedy, Adventure)
- **Movie Details Page** — IST-timezone-aware showtime grouping, trailer modal (YouTube embed), cast, director, producer, synopsis
- **Seat Selector** — Row-based grid (Standard A–C / Recliner D–E), dynamic pricing (1.5× for recliners), real-time seat availability from localStorage
- **Razorpay Payment** — Full Razorpay Checkout modal integration with HMAC-SHA256 signature verification
- **Bookings Page** — Booking history with scannable QR codes per ticket
- **Login / Signup** — JWT-based auth wired to real backend API, form validation, password visibility toggle
- **Releases Page** — Upcoming movies with release dates, clickable cards
- **Responsive Design** — Works on mobile, tablet, and desktop

### 🛠️ Admin Panel (`/admin` — Port 5174)
- **Dashboard** — Live stat cards: Total Movies, Bookings, Revenue, Unique Users
- **Inventory** — View all movies from DB, add new movies via modal form, delete movies
- **Bookings** — Full bookings table with payment status badges, user email, seats, amount
- **Dark Cinema UI** — Glassmorphism cards, red accent theme, Cinzel serif font

### ⚙️ Backend API (`/backend` — Port 5000)
- **REST API** built with Express.js
- **MongoDB Atlas** cloud database with Mongoose ODM
- **JWT Authentication** — Protected routes with middleware
- **Razorpay Order Creation** — Server-side price calculation (anti-tamper)
- **HMAC-SHA256 Payment Verification** — Cryptographic signature validation
- **CORS** — Explicitly whitelisted for ports 5173–5176
- **Nodemon** — Hot-reload during development

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Lucide Icons |
| **Styling** | Tailwind CSS (utility-first via `dummyStyles.js` abstraction) |
| **State** | React `useState` + `useMemo` + `useEffect` |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB Atlas + Mongoose |
| **Auth** | JSON Web Tokens (JWT) + bcrypt |
| **Payments** | Razorpay (Indian payment gateway) |
| **Admin UI** | React + Vite (separate app) |
| **Dev Tools** | Nodemon, Vite HMR |

---

## 📂 Project Structure

```
mern-movie-app/
│
├── backend/                    # Express.js REST API
│   ├── config/
│   │   └── db.js               # MongoDB Atlas connection
│   ├── controllers/
│   │   ├── bookingController.js # Razorpay order + payment verification
│   │   ├── movieController.js   # CRUD for movies
│   │   └── userController.js    # Register, Login
│   ├── middleware/
│   │   └── auth.js             # JWT protect + adminProtect middleware
│   ├── models/
│   │   ├── bookingModel.js     # Booking schema
│   │   ├── movieModel.js       # Movie schema (title, genre, slots, basePrice)
│   │   └── userModel.js        # User schema (fullName, email, password hash)
│   ├── routes/
│   │   ├── bookingRouter.js    # /api/bookings
│   │   ├── movieRouter.js      # /api/movies
│   │   └── userRouter.js       # /api/users
│   ├── .env                    # Environment variables (not committed)
│   ├── server.js               # Express app entry point + CORS config
│   └── package.json
│
├── front-end/                  # React user app (Vite)
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   ├── dummyStyles.js  # Single source of truth for all classNames
│   │   │   ├── dummymdata.js   # 48 movies (IDs 7–48) with slots, cast, crew
│   │   │   ├── dummymoviedata.js # 6 featured movies (IDs 1–6)
│   │   │   └── dummyrdata.js   # 10 upcoming releases with dates
│   │   ├── components/
│   │   │   ├── Banner.jsx      # Hero section with video bg
│   │   │   ├── Movies.jsx      # Featured movies (home)
│   │   │   ├── MoviesPage.jsx  # Full catalogue with filters
│   │   │   ├── Navbar.jsx      # Auth-aware navigation
│   │   │   ├── LoginPage.jsx   # JWT login flow
│   │   │   ├── SignupPage.jsx  # Registration with validation
│   │   │   ├── BookingsPage.jsx # Booking history + QR codes
│   │   │   └── ReleasedPage.jsx # Upcoming releases
│   │   ├── pages/
│   │   │   ├── MovieDetailsPage.jsx # Showtime selector, trailer, cast
│   │   │   └── SeatSelector.jsx     # Seat grid + Razorpay checkout
│   │   └── App.jsx             # React Router routes
│   ├── index.html              # Razorpay SDK script tag
│   └── package.json
│
├── admin/                      # React admin panel (Vite — separate app)
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx      # Sidebar with NavLink active states
│   │   └── pages/
│   │       ├── Dashboard.jsx   # Stat cards fetched from API
│   │       ├── ListMovie.jsx   # Inventory table + add/delete modal
│   │       └── BookingsAdmin.jsx # All bookings with status badges
│   └── package.json
│
├── .gitignore                  # Excludes node_modules, .env, dist/
└── README.md
```

---

## 🔐 API Endpoints

### Users
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/users/register` | Public | Create account |
| POST | `/api/users/login` | Public | Login, returns JWT |

### Movies
| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/movies` | Public | Get all movies |
| POST | `/api/movies` | Admin | Add a movie |
| DELETE | `/api/movies/:id` | Admin | Delete a movie |

### Bookings
| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/bookings` | Private | Create Razorpay order + booking |
| POST | `/api/bookings/verify` | Private | Verify payment signature |
| GET | `/api/bookings/mybookings` | Private | User's own bookings |
| GET | `/api/bookings/all` | Admin | All bookings (admin only) |

---

## 💳 Payment Flow (Razorpay)

```
User selects seats → clicks "Confirm Booking"
        │
        ▼
SeatSelector saves to localStorage (instant fallback)
        │
        ▼
POST /api/bookings (with JWT)
  → Server calculates price server-side (prevents manipulation)
  → razorpay.orders.create() → returns orderId, amount, keyId
        │
        ▼
window.Razorpay(options).open()  ← Razorpay checkout modal
  User pays with test card: 4111 1111 1111 1111
        │
        ▼
handler() called with razorpay_order_id, payment_id, signature
        │
        ▼
POST /api/bookings/verify
  → HMAC-SHA256: crypto.createHmac("sha256", KEY_SECRET)
                       .update(orderId + "|" + paymentId)
                       .digest("hex")
  → Compare with razorpay_signature
  → booking.paymentStatus = "paid" → saved to MongoDB
        │
        ▼
Redirect to /bookings → QR code generated ✅
```

---

## 🔑 Authentication Flow

```
Signup → POST /api/users/register
  → password hashed with bcrypt (10 rounds)
  → User saved to MongoDB

Login → POST /api/users/login
  → bcrypt.compare(password, hash)
  → jwt.sign({ id, email }, JWT_SECRET, { expiresIn: "7d" })
  → Token stored in localStorage as cine_token + cine_auth object

Protected routes → middleware/auth.js
  → jwt.verify(token, JWT_SECRET)
  → req.user = decoded user
  → adminProtect checks req.user.isAdmin
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (free tier works)
- Razorpay account (free, test mode)

### 1. Clone the repo
```bash
git clone https://github.com/Jineshraj/mern-movie-booking-app.git
cd mern-movie-booking-app
```

### 2. Configure environment variables
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_here
RAZORPAY_KEY_ID=rzp_test_xxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
```
> Get Razorpay test keys at: **razorpay.com → Dashboard → Settings → API Keys**

### 3. Install dependencies
```bash
# Backend
cd backend && npm install

# Frontend
cd ../front-end && npm install

# Admin
cd ../admin && npm install
```

### 4. Run all three servers

```bash
# Terminal 1 — Backend (with hot-reload)
cd backend
npm run dev

# Terminal 2 — Frontend
cd front-end
npm run dev

# Terminal 3 — Admin Panel
cd admin
npm run dev
```

| App | URL |
|---|---|
| Frontend | http://localhost:5175 |
| Backend API | http://localhost:5000 |
| Admin Panel | http://localhost:5174 |

---

## 🧪 Test Credentials

### Razorpay Test Payment
| Field | Value |
|---|---|
| Card Number | `4111 1111 1111 1111` |
| Expiry | Any future date |
| CVV | Any 3 digits |
| UPI | `success@razorpay` |

---

## 💡 What I Learned Building This

### Backend & APIs
- Designing RESTful APIs with Express.js and proper route separation
- MongoDB schema design with Mongoose — relationships, population, indexes
- Secure password storage with **bcrypt** hashing
- Stateless authentication using **JWT** (JSON Web Tokens)
- Writing middleware for route protection and role-based access
- Environment variable management with `dotenv`
- `nodemon` for efficient development workflow

### Frontend
- React component architecture — separation of concerns, reusability
- **React Router v6** — dynamic routes (`/movie/:id`, `/seat/:id/:slot`), nested layouts, scroll restoration
- State management with `useState`, `useEffect`, `useMemo`
- URL param decoding for showtime data across page navigations
- `localStorage` as a persistence layer for bookings and auth state
- Timezone-aware date formatting using `Intl.DateTimeFormat` (IST)
- Conditional rendering, form validation, optimistic UI updates

### Payment Integration
- Understanding **Razorpay's order-based payment flow**
- Server-side price calculation to prevent client-side tampering
- **HMAC-SHA256 cryptographic signature verification** for webhook-style payment confirmation
- Loading third-party SDKs via `<script>` tags and using `window.Razorpay`

### Full Stack Patterns
- CORS configuration for multi-port development environments
- Data normalisation across multiple data sources (`dummymdata` + `dummymoviedata` merged via `ALL_MOVIES`)
- Dual-app architecture (separate frontend + admin Vite apps hitting the same API)
- Git workflow — `.gitignore` best practices (never commit `.env`, `node_modules`, `dist/`)

---

## 📸 Key Pages

| Page | Description |
|---|---|
| `/` | Home — banner, featured movies, news feed |
| `/movies` | Full catalogue with genre filters |
| `/movie/:id` | Details, showtimes, trailer, cast |
| `/seat/:id/:slot` | Seat grid + Razorpay payment |
| `/bookings` | My tickets with QR codes |
| `/login` | JWT login |
| `/signup` | Account creation |
| `/releases` | Upcoming movies |

---

## 🌐 Deployment Notes

- **Backend**: Deploy to Railway, Render, or any Node.js host. Set all `.env` vars in the platform's environment settings.
- **Frontend / Admin**: Run `npm run build` and deploy the `dist/` folder to Vercel, Netlify, or any static host.
- **MongoDB**: Already on Atlas cloud — no changes needed.
- **Razorpay**: Switch from `rzp_test_` to `rzp_live_` keys for production.

---

## 👤 Author

**Jineshraj**
- GitHub: [@Jineshraj](https://github.com/Jineshraj)
- Project: [mern-movie-booking-app](https://github.com/Jineshraj/mern-movie-booking-app)

---

> *Built as a learning project to master the MERN stack end-to-end — from database design to payment gateway integration.*
