# Task Management System Documentation

A full-stack task management application built with Laravel, Vue.js, Inertia.js, and real-time WebSocket updates using Pusher.

## Features

- ✅ Create, read, update tasks
- ✅ Real-time status updates via WebSockets
- ✅ Automatic fallback to polling when WebSocket fails
- ✅ Search and pagination
- ✅ Task categorization and priority levels
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe Vue 3 with TypeScript
- ✅ State management with Pinia

## Tech Stack

**Backend:**
- Laravel 11
- PHP 8.1+
- MySQL/PostgreSQL
- Pusher for WebSocket broadcasting

**Frontend:**
- Vue.js 3 with Composition API
- TypeScript
- Inertia.js for SPA-like experience
- Pinia for state management
- Tailwind CSS for styling
- Vite for build tooling

## Prerequisites

- PHP 8.1 or higher
- Composer
- Node.js 18+ and npm
- MySQL or PostgreSQL database
- Pusher account (for real-time features)

## Installation

### 1. Clone and Setup Laravel

```bash
# Clone the repository
git clone <repository-url>
cd task-management-system

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 2. Database Configuration

Edit your `.env` file with your database credentials:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

### 3. Pusher Configuration (Required for Real-time Features)

**Create a Pusher Account:**
1. Go to [https://pusher.com](https://pusher.com)
2. Sign up for a free account
3. Create a new app
4. Get your app credentials from the dashboard

**Update your `.env` file:**

```env
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_HOST=
PUSHER_PORT=443
PUSHER_SCHEME=https
PUSHER_APP_CLUSTER=your_cluster
```

### 4. Run Database Migrations and Seeders

```bash
# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed
```

### 5. Install Frontend Dependencies

```bash
# Install Node.js dependencies
npm install

# Build assets for development
npm run dev

# Or build for production
npm run build
```

## Development

### Starting the Development Server

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite Dev Server:**
```bash
npm run dev
```

**Terminal 3 - Queue Worker (for broadcasting):**
```bash
php artisan queue:work
```

Your application will be available at `http://localhost:8000`

## Project Structure

### Backend Structure

```
app/
├── Events/
│   └── TaskStatusUpdated.php     # WebSocket event
├── Http/
│   └── Controllers/
│       └── TaskController.php    # Main controller
├── Models/
│   ├── Task.php
│   ├── Category.php
│   └── Priority.php
└── Services/
    └── TaskService.php           # Business logic

database/
├── migrations/                   # Database schema
└── seeders/                     # Sample data
    ├── CategorySeeder.php
    ├── PrioritySeeder.php
    └── TaskSeeder.php

routes/
├── web.php                      # Web routes
└── channels.php                 # Broadcasting channels
```

### Frontend Structure

```
resources/js/
├── Components/
│   ├── TaskList.vue             # Task listing component
│   ├── TaskStatusDropdown.vue   # Status update component
│   └── TaskForm.vue             # Task creation form
├── Pages/
│   └── Home.vue                 # Main page
├── Store/
│   └── taskStore.ts             # Pinia store
├── Types/
│   └── index.ts                 # TypeScript types
├── app.ts                       # Main Vue app
└── bootstrap.js                 # Pusher configuration
```

## API Endpoints

### Tasks API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get paginated tasks with search |
| POST | `/api/tasks` | Create new task |
| PATCH | `/api/tasks/{id}/status` | Update task status |
| GET | `/api/tasks/updates` | Get recent updates (polling fallback) |

### Request/Response Examples

**Create Task:**
```json
POST /api/tasks
{
  "title": "Implement authentication",
  "description": "Create login system",
  "due_date": "2024-12-31",
  "category_id": 1,
  "priority_id": 2
}
```

**Update Status:**
```json
PATCH /api/tasks/1/status
{
  "status": "completed"
}
```

## Real-time Features

### WebSocket Implementation

The application uses Pusher for real-time updates with automatic fallback:

1. **Primary**: WebSocket connection via Pusher
2. **Fallback**: HTTP polling every 3 seconds
3. **Local Development**: Automatic polling (WebSocket disabled)

### Broadcasting Events

- `TaskStatusUpdated` event broadcasts to `tasks` channel
- Automatic reconnection handling
- Optimistic UI updates with error recovery

## Database Schema

### Tasks Table
```sql
id              bigint (primary key)
title           varchar(255)
description     text
due_date        date
status          enum('pending', 'in_progress', 'completed', 'cancelled')
category_id     bigint (foreign key)
priority_id     bigint (foreign key)
created_at      timestamp
updated_at      timestamp
```

### Categories Table
```sql
id          bigint (primary key)
name        varchar(255)
created_at  timestamp
updated_at  timestamp
```

### Priorities Table
```sql
id          bigint (primary key)
level       enum('low', 'medium', 'high', 'urgent')
created_at  timestamp
updated_at  timestamp
```

## Configuration

### Broadcasting Configuration

The app automatically detects the environment and adjusts real-time behavior:

- **Production**: Uses Pusher WebSockets
- **Local Development**: Uses polling fallback
- **Connection Loss**: Automatic fallback to polling

### Environment Variables

Key environment variables for the application:

```env
# Application
APP_NAME="Task Management"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_management
DB_USERNAME=root
DB_PASSWORD=

# Broadcasting (Pusher)
BROADCAST_DRIVER=pusher
PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=us2

# Queue (for broadcasting)
QUEUE_CONNECTION=database
```

**Quick Start Summary:**
1. Install dependencies: `composer install && npm install`
2. Configure database and Pusher in `.env`
3. Run migrations: `php artisan migrate --seed`
4. Start servers: `php artisan serve` + `npm run dev` + `php artisan queue:work`
5. Visit `http://localhost:8000`
