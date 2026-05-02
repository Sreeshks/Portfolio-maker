# Full-Stack Portfolio System

A complete full-stack portfolio system consisting of a robust backend API, an admin dashboard, and a stunning public portfolio website with 3 unique switchable templates.


## Architecture Diagram

```mermaid
graph TD;
    User((User / Visitor)) -->|Views| Portfolio[Portfolio Website (React)]
    Admin((Admin)) -->|Manages| Dashboard[Admin Dashboard (React)]
    Portfolio -->|Fetches Data| API[Backend API (Express)]
    Dashboard -->|CRUD Data| API
    API -->|Reads/Writes| DB[(PostgreSQL / SQLite)]
```

## Prerequisites
- **Node.js** (v18+)
- **npm** or **yarn**
- **Git**

## Local Setup Guide

Follow these steps to run the full system locally.

### 1. Backend Setup

The backend uses SQLite by default for easy local development.

```bash
cd backend
npm install

# Copy environment variables
cp .env.example .env

# Generate Prisma Client, push schema, and seed the database
npm run setup

# Start the dev server
npm run dev
```
The backend API will run at `http://localhost:5000`.

*Demo Credentials for Admin Panel:*
- **Email:** `admin@portfolio.com`
- **Password:** `admin123`

### 2. Admin Dashboard Setup

```bash
cd admin
npm install

# Copy environment variables
cp .env.example .env

# Start the dev server
npm run dev
```
The Admin Dashboard will run at `http://localhost:5174`.

### 3. Portfolio Frontend Setup

```bash
cd portfolio
npm install

# Copy environment variables
cp .env.example .env

# Start the dev server
npm run dev
```
The Portfolio Website will run at `http://localhost:5173`.

---

## Environment Variables Documented

### Backend (`backend/.env`)
| Variable | Description |
|---|---|
| `DATABASE_URL` | Prisma DB connection string (default: `"file:./dev.db"`) |
| `JWT_SECRET` | Secret key for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiration time (e.g., `7d`) |
| `PORT` | Server port (default: `5000`) |
| `NODE_ENV` | Environment (`development` or `production`) |
| `CORS_ORIGINS` | Comma-separated allowed origins |
| `MAX_FILE_SIZE` | Max file upload size in bytes (e.g., `5242880` for 5MB) |

### Admin Dashboard (`admin/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | URL of the backend API (`http://localhost:5000`) |
| `VITE_PORTFOLIO_URL` | URL of the portfolio for previews (`http://localhost:5173`) |

### Portfolio Website (`portfolio/.env`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | URL of the backend API (`http://localhost:5000`) |

---

## API Endpoint Reference

All endpoints are prefixed with `/api`. Protected endpoints require a valid JWT `Bearer <token>` in the Authorization header.

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Login admin and get JWT | Public |
| GET | `/auth/me` | Verify token | Protected |
| GET | `/profile` | Get profile info | Public |
| PUT | `/profile` | Update profile info | Protected |
| GET | `/projects` | Get all projects | Public |
| POST | `/projects` | Create a project | Protected |
| PUT | `/projects/:id` | Update a project | Protected |
| DELETE | `/projects/:id` | Delete a project | Protected |
| GET | `/skills` | Get all skills | Public |
| POST | `/skills` | Create a skill | Protected |
| GET | `/experience` | Get all experience | Public |
| GET | `/education` | Get all education | Public |
| GET | `/testimonials`| Get approved testimonials | Public |
| POST | `/testimonials`| Submit new testimonial | Public |
| PUT | `/testimonials/:id` | Approve/Reject/Edit | Protected |
| GET | `/settings` | Get theme/template settings | Public |
| PUT | `/settings` | Update theme/template settings | Protected |
| POST | `/upload/image`| Upload file/image | Protected |
| POST | `/contact` | Submit contact message | Public |
| GET | `/messages` | Get contact messages | Protected |

---

## How to Add a New Portfolio Template

1. **Create the Template File:**
   Create a new file in `portfolio/src/templates/TemplateName.jsx`.
   It receives `data` as a prop containing all profile, project, and settings data.

2. **Register the Template in App.jsx:**
   Open `portfolio/src/App.jsx`.
   Import your template: `import TemplateName from './templates/TemplateName';`
   Add it to the render logic:
   ```jsx
   {settings.activeTemplate === 'my_new_template' && <TemplateName data={data} />}
   ```

3. **Add to Admin Dashboard Picker:**
   Open `admin/src/pages/TemplateTheme.jsx`.
   Add your template to the `TEMPLATES` array:
   ```js
   {
     id: 'my_new_template',
     name: 'My New Template',
     description: 'Description of how it looks.',
     colors: ['#fff', '#000'],
     preview: 'linear-gradient(...)'
   }
   ```
   *That's it! You can now select it live from the admin dashboard.*

---

## Deployment Guide

### Backend (Render or Railway)
1. In `backend/prisma/schema.prisma`, change the provider to `"postgresql"`.
2. Push your code to GitHub.
3. On Render/Railway, create a new PostgreSQL database.
4. Create a new Web Service connecting to your backend directory.
5. Set `DATABASE_URL` to your PostgreSQL connection string.
6. Set `JWT_SECRET`, `CORS_ORIGINS` (with your Vercel frontend URLs), and `NODE_ENV=production`.
7. Set build command: `npm install && npm run db:generate && npm run db:push`
8. Set start command: `npm start`

### Admin Dashboard (Vercel)
1. Connect your repo to Vercel and set the Root Directory to `admin`.
2. Set Environment Variables: `VITE_API_URL` to your deployed backend URL.
3. Deploy!

### Portfolio Website (Vercel)
1. Connect your repo to Vercel and set the Root Directory to `portfolio`.
2. Set Environment Variables: `VITE_API_URL` to your deployed backend URL.
3. Deploy!
