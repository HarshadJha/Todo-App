# TaskFlow — Full-Stack Todo App

> **CodeANova Full-Stack Internship Assignment**  
> A production-ready task management application built with React, Node.js, MongoDB, JWT authentication, OTP email verification, and Nodemailer.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Pages & Routes](#-pages--routes)
- [Bonus Features](#-bonus-features)
- [Screenshots](#-screenshots)

---

## ✨ Features

### Core (Required)
- **User Registration** with email OTP verification via Nodemailer
- **JWT Authentication** — secure login, persistent sessions, protected routes
- **Task CRUD** — Create, Read, Update, Delete tasks
- **Task Fields** — Title, Description, Priority (Low/Medium/High), Status (Pending/In-Progress/Completed), Due Date
- **Contact Form** — sends email via Nodemailer to the site owner

### Bonus
- **Search** tasks by title/description (debounced, 300ms)
- **Filter** by Status and Priority simultaneously
- **Sort** by Created Date, Due Date, or Priority (ascending/descending)
- **Dark / Light theme** toggle with localStorage persistence
- **Progress bar** showing overall task completion rate
- **Overdue detection** — tasks past their due date are highlighted in red
- **Responsive design** — works on mobile, tablet, and desktop

---

## 🛠 Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 18, Vite, React Router v6, Tailwind CSS   |
| HTTP      | Axios (with JWT interceptor)                    |
| Backend   | Node.js, Express.js                             |
| Database  | MongoDB Atlas + Mongoose                        |
| Auth      | JWT (jsonwebtoken), bcryptjs                    |
| Email     | Nodemailer (Gmail SMTP)                         |
| UI Icons  | Lucide React                                    |
| Toasts    | React Hot Toast                                 |

---

## 📁 Project Structure

```
todo-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB connection
│   │   ├── middleware/
│   │   │   └── auth.js            # JWT verification middleware
│   │   ├── models/
│   │   │   ├── User.js            # User schema (name, email, password, OTP)
│   │   │   └── Task.js            # Task schema (title, priority, status, dueDate)
│   │   ├── routes/
│   │   │   ├── auth.js            # POST /register, /verify-otp, /login, GET /me
│   │   │   ├── tasks.js           # GET/POST /tasks, PUT/DELETE /tasks/:id
│   │   │   └── contact.js         # POST /contact
│   │   ├── utils/
│   │   │   └── sendEmail.js       # Nodemailer helper
│   │   └── server.js              # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx          # Top navigation with dark mode toggle
    │   │   ├── Footer.jsx          # Site footer
    │   │   └── ProtectedRoute.jsx  # Auth guard for /dashboard
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state (user, token, login, logout)
    │   ├── pages/
    │   │   ├── Home.jsx            # Landing page
    │   │   ├── Signup.jsx          # Registration form
    │   │   ├── VerifyOTP.jsx       # 6-digit OTP entry
    │   │   ├── Login.jsx           # Login form
    │   │   ├── Dashboard.jsx       # Protected task manager
    │   │   └── Contact.jsx         # Contact form
    │   ├── utils/
    │   │   └── api.js              # Axios instance with JWT interceptor
    │   ├── App.jsx                 # Router setup
    │   ├── main.jsx                # React entry point
    │   └── index.css               # Tailwind + custom component classes
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and npm
- **MongoDB Atlas** account (free tier works fine)
- **Gmail account** with [App Password](https://support.google.com/accounts/answer/185833) enabled

---

### Backend Setup

```bash
# 1. Navigate to backend
cd todo-app/backend

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Then edit .env with your real values (see Environment Variables below)

# 4. Start the development server
npm run dev
# Server runs on http://localhost:5000
```

---

### Frontend Setup

```bash
# 1. Navigate to frontend (in a new terminal)
cd todo-app/frontend

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
# App runs on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔐 Environment Variables

Create `backend/.env` by copying `.env.example`:

| Variable        | Description                                      | Example                          |
|-----------------|--------------------------------------------------|----------------------------------|
| `PORT`          | Express server port                              | `5000`                           |
| `NODE_ENV`      | Environment mode                                 | `development`                    |
| `MONGO_URI`     | MongoDB Atlas connection string                  | `mongodb+srv://...`              |
| `JWT_SECRET`    | Secret key for signing JWTs (min 32 chars)       | `my_super_secret_key_abc123`     |
| `JWT_EXPIRES_IN`| JWT expiry duration                              | `7d`                             |
| `EMAIL_USER`    | Gmail address for sending emails                 | `you@gmail.com`                  |
| `EMAIL_PASS`    | Gmail App Password (16 chars, no spaces)         | `abcd efgh ijkl mnop`            |
| `CLIENT_URL`    | Frontend URL for CORS                            | `http://localhost:5173`          |

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

---

## 📡 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint        | Auth | Body                                      | Description                        |
|--------|-----------------|------|-------------------------------------------|------------------------------------|
| POST   | `/register`     | ❌   | `{ name, email, password }`               | Register + send OTP email          |
| POST   | `/verify-otp`   | ❌   | `{ email, otp }`                          | Verify 6-digit OTP, activate account |
| POST   | `/login`        | ❌   | `{ email, password }`                     | Login, returns JWT token           |
| GET    | `/me`           | ✅   | —                                         | Get current user profile           |

### Task Routes — `/api/tasks`

| Method | Endpoint     | Auth | Query Params                                      | Body                                              | Description          |
|--------|--------------|------|---------------------------------------------------|---------------------------------------------------|----------------------|
| GET    | `/`          | ✅   | `search`, `status`, `priority`, `sortBy`, `sortOrder` | —                                             | Get all user tasks   |
| POST   | `/`          | ✅   | —                                                 | `{ title, description?, priority?, status?, dueDate? }` | Create task    |
| PUT    | `/:id`       | ✅   | —                                                 | Any task fields to update                         | Update task          |
| DELETE | `/:id`       | ✅   | —                                                 | —                                                 | Delete task          |

### Contact Route — `/api/contact`

| Method | Endpoint | Auth | Body                                    | Description              |
|--------|----------|------|-----------------------------------------|--------------------------|
| POST   | `/`      | ❌   | `{ name, email, subject?, message }`    | Send contact email       |

---

## 🗺 Pages & Routes

| Path           | Component      | Protected | Description                              |
|----------------|----------------|-----------|------------------------------------------|
| `/`            | Home           | ❌        | Landing page with features overview      |
| `/signup`      | Signup         | ❌        | Registration form                        |
| `/verify-otp`  | VerifyOTP      | ❌        | 6-digit OTP verification                 |
| `/login`       | Login          | ❌        | Login form                               |
| `/dashboard`   | Dashboard      | ✅        | Task manager (redirects to /login if not authenticated) |
| `/contact`     | Contact        | ❌        | Contact form                             |

---

## 🎁 Bonus Features

### Search & Filter
The dashboard toolbar provides real-time search (debounced 300ms), status filter, priority filter, and sort controls — all applied server-side via query parameters.

### Dark Mode
Click the sun/moon icon in the header. The preference is saved to `localStorage` and applied on every page load via `document.documentElement.classList`.

### Progress Bar
A visual progress bar on the dashboard shows the percentage of completed tasks out of total tasks, updating in real time as you check tasks off.

### Overdue Detection
Tasks with a `dueDate` in the past that are not yet `Completed` are automatically flagged with a red "Overdue" badge.

---

## 🔒 Security Notes

- Passwords are hashed with **bcryptjs** (salt rounds: 12) before storage
- OTPs expire after **10 minutes** and are single-use
- JWT tokens are stored in `localStorage` and sent via `Authorization: Bearer <token>` header
- All task routes verify the JWT and scope queries to `req.user._id` — users can only access their own tasks
- CORS is restricted to `CLIENT_URL` in production

---

## 📝 Scripts

### Backend
```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Start without hot reload (production)
```

### Frontend
```bash
npm run dev      # Vite dev server with HMR
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
```

---

*Built with ❤️ for the CodeANova Full-Stack Internship Assignment*