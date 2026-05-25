# Smart Vaccine & Ointment Management System

A futuristic full-stack healthcare platform for managing vaccines, ointments, appointments, reminders, inventory, and analytics.

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, React Router DOM, Axios, React Three Fiber, Drei, Recharts
- Backend: Laravel, Sanctum, MongoDB via `jenssegers/mongodb`

## Repository Layout

- `frontend/` - React dashboard and public UI
- `backend/` - Laravel REST API with MongoDB models

## Features

- Role-based authentication for admin and user
- Vaccine and ointment inventory CRUD
- Appointment booking with conflict prevention
- Reminder and notification endpoints
- Analytics for dashboard charts and alerts
- 3D futuristic dashboard visuals

## Setup

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Environment Variables

### Frontend `.env`

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### Backend `.env`

```env
APP_NAME="Smart Vaccine & Ointment Management System"
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
DB_CONNECTION=mongodb
DB_HOST=127.0.0.1
DB_PORT=27017
DB_DATABASE=smart_vaccine_ointment
DB_USERNAME=
DB_PASSWORD=
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
MAIL_MAILER=log
```

## API Highlights

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/forgot-password`
- `GET /api/v1/me`
- `GET /api/v1/vaccines`
- `POST /api/v1/appointments`
- `GET /api/v1/dashboard/analytics`

## Notes

This scaffold includes the core application structure and implementation files needed to complete the product. Run the backend and frontend installs to fetch framework dependencies before production use.
