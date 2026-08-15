# Full-Stack Task Management Application

A learning-focused full-stack task manager where users can register/login and manage personal tasks.

## Features

- User registration and login with JWT-based authentication
- Secure password hashing with bcrypt
- Task CRUD operations (create, read, update, delete)
- Mark tasks as completed/active
- Task filtering (All, Active, Completed)
- Per-user task isolation (users only access their own tasks)
- Responsive React UI with plain CSS
- Basic backend API tests for auth and task flows

## Technologies Used

### Frontend
- React (Vite)
- Plain CSS

### Backend
- Node.js
- Express
- JWT (`jsonwebtoken`)
- bcrypt (`bcryptjs`)

### Database
- MongoDB
- Mongoose

### Testing
- Jest
- Supertest
- mongodb-memory-server

## Folder Structure

```text
.
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── .env.example
│   └── package.json
└── README.md
```

## Installation

### 1) Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and configure:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=replace-with-a-strong-secret
CLIENT_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Run Locally

### Start backend

```bash
cd backend
npm run dev
```

### Start frontend

```bash
cd frontend
npm run dev
```

Frontend default URL: `http://localhost:5173`  
Backend default URL: `http://localhost:5000`

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Tasks (authenticated)
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

## Testing

Run backend API tests:

```bash
cd backend
npm test
```
