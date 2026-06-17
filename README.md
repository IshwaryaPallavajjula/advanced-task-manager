# Advanced Task Manager — MERN Stack

A production-ready full-stack task management application built with MongoDB, Express.js, React.js, and Node.js.

## Features

### Authentication
- JWT-based authentication with bcrypt password hashing
- Register, login, logout
- Protected routes (frontend + backend)
- Profile management

### Task Management
- Full CRUD: Create, Read, Update, Delete tasks
- Status workflow: Pending → In Progress → Completed
- Priority levels: Low, Medium, High
- Due date tracking with overdue indicators

### Filtering, Sorting & Search
- Filter by status and priority
- Sort by newest, oldest, due date, priority, or status
- Full-text search by title/description
- Server-side pagination (configurable page size)

### UI/UX
- Material UI with custom blue theme
- Dark mode (persisted to localStorage)
- Responsive layout with collapsible sidebar
- Skeleton loading states
- Toast notifications
- Confirmation dialogs for destructive actions

### Security
- Helmet.js headers
- CORS protection
- Rate limiting (100 req/15min general, 20 req/15min for auth)
- NoSQL injection sanitization (mongo-sanitize)
- Input validation (express-validator + frontend validation)
- JWT verification on every protected route

---

## Project Structure

```
advanced-task-manager/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Register, login, profile
│   │   └── taskController.js    # CRUD + stats + filtering
│   ├── middleware/
│   │   ├── auth.js              # JWT protect middleware
│   │   └── error.js             # Global error handler
│   ├── models/
│   │   ├── User.js              # User schema (bcrypt, toJSON)
│   │   └── Task.js              # Task schema (indexes)
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── validators/
│   │   ├── authValidator.js
│   │   └── taskValidator.js
│   ├── .env.example
│   ├── render.yaml              # Render deployment config
│   └── server.js                # Express app entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── ConfirmDialog.js
    │   │   ├── FilterSortBar.js
    │   │   ├── LoadingSpinner.js
    │   │   ├── Navbar.js
    │   │   ├── PaginationComponent.js
    │   │   ├── PriorityBadge.js
    │   │   ├── ProtectedRoute.js
    │   │   ├── SearchBar.js
    │   │   ├── Sidebar.js
    │   │   ├── StatusBadge.js
    │   │   ├── TaskCard.js          # With skeleton variant
    │   │   └── TaskForm.js
    │   ├── context/
    │   │   └── AuthContext.js       # Global auth state
    │   ├── hooks/
    │   │   └── useTasks.js          # Custom hook with params
    │   ├── layouts/
    │   │   └── AppLayout.js         # Navbar + Sidebar shell
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── Dashboard.js         # Stats + recent tasks
    │   │   ├── AllTasks.js          # Grid + filter/sort/paginate
    │   │   ├── CreateTask.js
    │   │   ├── EditTask.js
    │   │   ├── Profile.js
    │   │   └── NotFound.js
    │   ├── services/
    │   │   └── api.js               # Axios instance + interceptors
    │   ├── utils/
    │   │   └── theme.js             # MUI light + dark themes
    │   ├── App.js                   # Router + providers
    │   └── index.js
    ├── .env.example
    └── vercel.json
```

---

## REST API Reference

### Auth Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Create account |
| POST | `/api/auth/login` | Public | Login & get JWT |
| GET | `/api/auth/me` | Private | Get current user |
| PUT | `/api/auth/profile` | Private | Update name |

### Task Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tasks` | Private | List tasks (filter/sort/paginate) |
| GET | `/api/tasks/stats` | Private | Dashboard counts |
| GET | `/api/tasks/:id` | Private | Single task |
| POST | `/api/tasks` | Private | Create task |
| PUT | `/api/tasks/:id` | Private | Update task |
| DELETE | `/api/tasks/:id` | Private | Delete task |

### Query Parameters for `GET /api/tasks`

| Param | Values | Example |
|-------|--------|---------|
| `page` | number | `?page=2` |
| `limit` | number (max 50) | `?limit=10` |
| `status` | Pending, In Progress, Completed | `?status=Pending` |
| `priority` | Low, Medium, High | `?priority=High` |
| `search` | string | `?search=meeting` |
| `sort` | newest, oldest, dueDate, priority, status | `?sort=dueDate` |

### Error Response Format
```json
{
  "success": false,
  "message": "Task title is required"
}
```

---

## Local Development Setup

### Prerequisites
- Node.js >= 18
- MongoDB Atlas account (free tier works)

### 1. Clone & install

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Fill in MONGODB_URI and JWT_SECRET in .env

# Frontend
cd ../frontend
npm install
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api
```

### 2. Start development servers

```bash
# Terminal 1 — backend (port 5000)
cd backend
npm run dev

# Terminal 2 — frontend (port 3000)
cd frontend
npm start
```

---

## Deployment

### Backend → Render

1. Push `backend/` to a GitHub repository
2. Create a new **Web Service** on [render.com](https://render.com)
3. Connect the repo, set:
   - Build Command: `npm install`
   - Start Command: `node server.js`
4. Add environment variables:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — strong random string
   - `CORS_ORIGIN` — your Vercel frontend URL
   - `NODE_ENV` — `production`

### Frontend → Vercel

1. Push `frontend/` to a GitHub repository
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variable:
   - `REACT_APP_API_URL` — your Render backend URL + `/api`
4. Deploy — Vercel handles the build automatically

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6 |
| UI Library | Material UI 5 |
| HTTP Client | Axios |
| Backend | Node.js, Express 4 |
| Database | MongoDB Atlas, Mongoose 8 |
| Auth | JWT, bcryptjs |
| Validation | express-validator |
| Security | Helmet, CORS, express-rate-limit, mongo-sanitize |
| Notifications | notistack |
| Deployment | Vercel (frontend), Render (backend) |
