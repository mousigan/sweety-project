# Sweety – Blood Glucose Tracker 🩸
> **Take-Home Assignment for Junior Full Stack Developer – JavaScript & AI**  
> **Company:** Kenpath  
> **Author:** Sweety Development Team

---

## 1. Project Overview

**Sweety** is a complete, production-quality, beginner-friendly full-stack blood glucose tracking web application designed with an **Apple-inspired minimalist design direction**. It empowers users with type 1, type 2, or gestational diabetes, prediabetes, or general health enthusiasts to log, monitor, and analyze their daily blood sugar levels over time.

### Key Highlights
- **Strict Color Palette:** Clean monochrome baseline (#FFFFFF, #000000, #333333, #86868B, #F5F5F7, #E5E5EA) paired with an Apple-standard blue accent (#007AFF and #EAF2FF).
- **Zero Mock Data in Production:** All dashboard metrics, charts, and reports are dynamically computed from a PostgreSQL database using Prisma ORM.
- **Strict User Isolation:** Server-side verified JWT authentication ensures users can only access, modify, and delete their own readings.
- **Robust Concurrent Validation:** Concurrency-safe transactions prevent duplicate readings for the same time slot and enforce the strict maximum of four readings per calendar day.

---

## 2. Features

### 🔐 Authentication & Security
- User registration with validation (name, email format, password minimum 6 characters, password confirmation matching).
- User login with bcrypt password hash verification (10 salt rounds; plain text passwords are never stored).
- JWT generation with secure **HTTP-only cookie** transmission (with optional Bearer token authorization fallback).
- Secure logout clearing the authentication cookie.
- Automatic session expiration and redirection handling via React Context and Axios interceptors.
- Strict server-side user isolation: requests derive user identity solely from verified JWT tokens, never trusting client-supplied IDs.

### 📊 Main Dashboard
- Dynamic time-sensitive greeting: *"Good morning, [User]"*, *"Good afternoon"*, or *"Good evening"*.
- Four calculated summary metric cards:
  1. **Average Glucose** (mg/dL)
  2. **Highest Reading** (mg/dL)
  3. **Lowest Reading** (mg/dL)
  4. **Total Readings**
- Dynamic period selector: toggle between 7, 14, 30, and 90 days.
- Interactive **Recharts** glucose trend line chart with custom tooltips and illustrative clinical reference lines (70 and 180 mg/dL).
- Recent readings table with quick View, Edit, and Delete actions.
- Quick "Add Reading" action modal.

### 📝 Glucose Reading CRUD & Business Logic
- Four strict clinical time slots:
  1. `Morning (fasting)`
  2. `After breakfast`
  3. `After lunch`
  4. `After dinner`
- Enforces exact validation rules on both frontend and backend:
  - Missing glucose value: *"Please enter a glucose value."*
  - Value range (40–600 mg/dL): *"Value must be between 40 and 600 mg/dl."*
  - Duplicate time slot check: *"You already have an [timeSlot] reading for this date."*
  - Maximum 4 readings per day: *"You can add only 4 readings per day."*
  - Future dates blocked: *"Date cannot be in the future."*
- Interactive modal for adding and updating readings with pre-populated values.
- Two-step confirmation dialog before reading deletion.
- Comprehensive date filtering (From Date to To Date) and pagination.

### 📈 Reports & Analytics
- **Daily Report:** User-selected date showing individual readings per time slot, total count, highest, lowest, and average to 1 decimal place (e.g., `Average: 126.5 mg/dL`). Displays *"No glucose readings found for this date."* when empty.
- **Month-to-Date Report:** Calculates metrics from the 1st day of the selected month through the chosen date (excluding future dates of that month).
- **Monthly Report (Previous Month):** Accurately computes metrics for the entire previous calendar month across year and month boundaries (e.g., selecting November 2026 computes October 1–31, 2026; selecting January computes December of previous year).

---

## 3. Technology Stack

### Frontend
- **React 19** with **Vite**
- **JavaScript** (ES Modules)
- **Tailwind CSS** (v3.4 with custom design tokens)
- **React Router v7** (declarative client-side routing)
- **Axios** (centralized API client with interceptors)
- **Recharts** (responsive SVG trend charts)
- **Lucide React** (Apple-style minimalist icons)
- **React Hot Toast** (elegant notification toasts)

### Backend
- **Node.js** (v26 LTS / v20+)
- **Express.js** (v5)
- **Prisma ORM** (v5 with PostgreSQL adapter)
- **JSON Web Tokens (`jsonwebtoken`)**
- **Password Hashing (`bcryptjs`)**
- **Input Validation (`express-validator`)**
- **Cookie Parser & CORS** (credentialed cookie transport)

### Database
- **PostgreSQL** (Relational database with unique composite constraints and indexes)

### Testing
- **Vitest** (Unit & Integration test runner)
- **Supertest** (Backend REST API endpoint testing)
- **React Testing Library** & **jsdom** (Frontend component and interaction tests)

---

## 4. Project Folder Structure

```
kenpath-sweety/
├── client/                     # Frontend React + Vite application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── ConfirmDialog.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── GlucoseChart.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── ReadingForm.jsx
│   │   │   ├── ReadingsTable.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── SummaryCard.jsx
│   │   ├── context/            # React context providers
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/              # Custom React hooks
│   │   │   └── useReadings.js
│   │   ├── layouts/            # Page layouts
│   │   │   ├── AppLayout.jsx
│   │   │   └── AuthLayout.jsx
│   │   ├── pages/              # Application views
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ReadingsPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   └── SettingsPage.jsx
│   │   ├── services/           # Axios API services
│   │   │   ├── api.js
│   │   │   ├── auth.service.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── reading.service.js
│   │   │   └── report.service.js
│   │   ├── test/               # Frontend component tests
│   │   │   ├── components.test.jsx
│   │   │   └── setup.js
│   │   ├── utils/              # Helper functions & constants
│   │   │   ├── constants.js
│   │   │   └── helpers.js
│   │   ├── App.jsx             # Route definitions & toasts
│   │   ├── index.css           # Tailwind CSS directives
│   │   └── main.jsx            # React root mount
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── server/                     # Backend Node.js + Express API
│   ├── prisma/
│   │   ├── migrations/         # Prisma SQL migration files
│   │   ├── schema.prisma       # Database models & constraints
│   │   └── seed.js             # 45-day realistic demo seeder
│   ├── src/
│   │   ├── config/             # Environment & Prisma client singletons
│   │   │   ├── db.js
│   │   │   └── index.js
│   │   ├── controllers/        # Request handlers
│   │   │   ├── auth.controller.js
│   │   │   ├── dashboard.controller.js
│   │   │   ├── reading.controller.js
│   │   │   └── report.controller.js
│   │   ├── middleware/         # Auth, validation & error middlewares
│   │   │   ├── authenticate.js
│   │   │   ├── errorHandler.js
│   │   │   └── validate.js
│   │   ├── routes/             # Express API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   ├── reading.routes.js
│   │   │   └── report.routes.js
│   │   ├── services/           # Core business logic layer
│   │   │   ├── auth.service.js
│   │   │   ├── dashboard.service.js
│   │   │   ├── reading.service.js
│   │   │   └── report.service.js
│   │   ├── utils/              # Error utility classes
│   │   │   └── ApiError.js
│   │   ├── validators/         # express-validator schemas
│   │   │   ├── auth.validator.js
│   │   │   └── reading.validator.js
│   │   ├── app.js              # Express app configuration
│   │   └── server.js           # Server listen & DB connection
│   ├── test/                   # Backend API test suite
│   │   └── api.test.js
│   ├── package.json
│   └── vitest.config.js
│
├── screenshots/                # Application UI screenshots
├── .env.example                # Example environment configuration
├── .gitignore
└── README.md
```

---

## 5. Prerequisites

Before installing, ensure the following are installed on your machine:
- **Node.js** (v18.0.0 or later; v20/v26 recommended)
- **npm** (v9.0.0 or later)
- **PostgreSQL** (v14.0 or later; running on `localhost:5432`)
- **Git**

---

## 6. Installation & Setup Instructions

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd kenpath-sweety
```

### Step 2: Configure Environment Variables

Create the `.env` file in `server/`:
```bash
cp .env.example server/.env
```

Ensure `server/.env` contains your PostgreSQL credentials:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sweety?schema=public"
JWT_SECRET="sweety-super-secret-jwt-key-2026"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="development"
CLIENT_URL="http://localhost:5173"
```

### Step 3: Set Up the Database & Run Migrations

1. Ensure PostgreSQL is running and create the `sweety` database (if not already created):
```sql
CREATE DATABASE sweety;
```

2. Navigate to `server/` and apply the Prisma migrations:
```bash
cd server
npm install
npx prisma migrate dev --name init
```

3. Seed the database with 45 days of realistic sample glucose data:
```bash
npm run db:seed
```

### Step 4: Install Frontend Dependencies
```bash
cd ../client
npm install
```

---

## 7. Running the Application

### Start the Backend Server
From `server/`:
```bash
npm run dev
# Or for standard start:
npm start
```
The backend API starts on **http://localhost:5000**.

### Start the Frontend Client
In a separate terminal, from `client/`:
```bash
npm run dev
```
The frontend application starts on **http://localhost:5173**. Open your browser and navigate to `http://localhost:5173`.

---

## 8. Demo Login Credentials

The seed script creates a ready-to-use demo account with 45 days of historical readings:

| Field | Value |
|-------|-------|
| **Email** | `john@example.com` |
| **Password** | `Demo@123` |

*You can also register a new account on the registration page.*

---

## 9. Running Tests

Both the frontend and backend have comprehensive Vitest test suites.

### Run Backend Tests (24 Integration & Unit Tests)
```bash
cd server
npm test
```
**Tests Covered:**
- User registration & duplicate email rejection
- Login with valid & invalid credentials
- Unauthorized endpoint protection
- Glucose reading creation with valid values
- Validation rejections: missing value, `< 40 mg/dL`, `> 600 mg/dL`, future date
- Duplicate time slot prevention
- Maximum 4 readings per day rule
- User isolation (User B cannot view, update, or delete User A's data)
- Reading updates & deletions
- Daily report calculations with 1-decimal-place averages
- Month-to-date and previous calendar month report calculations

### Run Frontend Tests (15 Component & Integration Tests)
```bash
cd client
npm test
```
**Tests Covered:**
- Base UI component rendering (Buttons, Inputs, Selects, Cards, Modals)
- Confirm dialog user cancellation and confirmation actions
- Readings table populated & empty states
- Form validation: missing fields, glucose out-of-range (`< 40` or `> 600`)
- Login and registration form validation
- Dashboard and reports page integration rendering

---

## 10. REST API Endpoint Documentation

All endpoints (except public auth) require authentication via JWT cookie or `Authorization: Bearer <token>`.

### Authentication
| Method | Endpoint | Description | Public |
|--------|----------|-------------|--------|
| `POST` | `/api/auth/register` | Register new user account | Yes |
| `POST` | `/api/auth/login` | Login user & set HTTP-only cookie | Yes |
| `POST` | `/api/auth/logout` | Clear auth cookie | Yes |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | No |

### Glucose Readings
| Method | Endpoint | Query / Body Params | Description |
|--------|----------|----------------------|-------------|
| `GET` | `/api/readings` | `page`, `limit`, `startDate`, `endDate`, `sortBy`, `sortOrder` | Get paginated readings |
| `POST` | `/api/readings` | `{ date, timeSlot, glucoseValue }` | Create new reading |
| `GET` | `/api/readings/:id` | `id` (param) | Get single reading |
| `PUT` | `/api/readings/:id` | `{ date, timeSlot, glucoseValue }` | Update reading |
| `DELETE` | `/api/readings/:id` | `id` (param) | Delete reading |

### Reports & Dashboard
| Method | Endpoint | Query Params | Description |
|--------|----------|--------------|-------------|
| `GET` | `/api/dashboard` | `days` (default 30) | Summary cards, chart points & recent logs |
| `GET` | `/api/reports/daily` | `date=YYYY-MM-DD` | Daily breakdown & 1-decimal avg |
| `GET` | `/api/reports/month-to-date` | `date=YYYY-MM-DD` | 1st of month to chosen date |
| `GET` | `/api/reports/monthly` | `date=YYYY-MM-DD` | Full previous calendar month |

---

## 11. Screenshots

The application includes an Apple-inspired minimalist design:

| Screen | Description |
|--------|-------------|
| **Dashboard** | Metrics cards, 30-day interactive Recharts trend, and recent readings |
| **Glucose Readings** | Search, filter by date range, add modal, edit, and deletion confirmation |
| **Reports** | Daily, Month-to-Date, and Previous Month statistical aggregations |
| **Authentication** | Minimalist Sign In and Registration forms with responsive validation |

*(Screenshots are saved in the [`screenshots/`](./screenshots/) directory).*

---

## 12. Architectural Assumptions & Design Decisions

1. **Date Storage & Timezones:** To prevent date shifting across timezones (e.g., UTC vs local offsets), all dates are stored as standard `DATE` types in PostgreSQL and parsed to UTC midnight strings (`YYYY-MM-DD`).
2. **Clinical Safety Disclaimer:** The target blood glucose reference bands (70 mg/dL and 180 mg/dL) shown in charts are labeled as illustrative and do not replace personalized physician guidance.
3. **Database Concurrency:** Interactive Prisma transactions (`$transaction`) are utilized for reading creation and updates so that race conditions cannot bypass the 4-reading daily limit or duplicate time-slot constraint.
4. **Token Storage:** In addition to HTTP-only cookies, the server accepts `Authorization: Bearer <token>` headers to support programmatic API testing and third-party integrations seamlessly.

---

## 13. Future Improvements

- **Export to PDF / CSV:** Add one-click export for sharing reports with endocrinologists.
- **HbA1c Estimation:** Calculate estimated HbA1c based on 90-day glucose averages ($eAG$).
- **Insulin & Carbohydrate Logging:** Correlate glucose spikes with meals and insulin doses.
- **Multi-Factor Authentication (MFA):** Add TOTP authenticator app support.

---

## 14. License
This project was developed for the **Kenpath Junior Full Stack Developer Take-Home Assignment**. Distributed under the ISC License.
