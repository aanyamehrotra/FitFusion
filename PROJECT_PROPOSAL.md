# FitFusion - Project Proposal

## 1. Project Title

**FitFusion** – A Comprehensive Fitness Tracking and Trainer-Client Connection Platform

---

## 2. Problem Statement

Fitness enthusiasts and trainers struggle with fragmented tools for managing workouts, tracking nutrition, and connecting with each other. Existing solutions are either too complex, expensive, or lack essential features like trainer-client matching and workout template sharing. **FitFusion** addresses these challenges by providing a unified platform where:

- **Clients** can log workouts, track nutrition, use pre-built workout templates, and find certified trainers
- **Trainers** can showcase their expertise, set hourly rates, and manage their public profiles
- **All users** benefit from a simple, elegant interface that works seamlessly across devices

The platform eliminates the need for multiple apps, scattered notes, and manual tracking, creating a centralized hub for all fitness-related activities.

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Pages   │  │ Context  │  │  Axios   │  │  Router  │  │
│  │          │  │ Providers│  │  Client  │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└───────────────────────────┬───────────────────────────────────┘
                            │ HTTP/REST API
                            │ (JSON, JWT Auth)
┌───────────────────────────▼───────────────────────────────────┐
│              Backend API (Node.js + Express)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Routes  │  │Controllers│ │Middleware│  │   Auth   │  │
│  │          │  │           │ │          │  │   JWT    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└───────────────────────────┬───────────────────────────────────┘
                            │ Mongoose ODM
┌───────────────────────────▼───────────────────────────────────┐
│              Database (MongoDB)                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Users   │  │ Workouts │  │Exercises │  │  Diet    │  │
│  │ Templates│  │          │  │          │  │ Entries │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Stack Details:

**Frontend:** React.js (v19.2.0) with React Router (v7.9.6) for page navigation, Vite (v7.2.4) as build tool

**Backend:** Node.js + Express.js (v5.2.1) REST API

**Database:** MongoDB (non-relational) with Mongoose ODM (v9.0.0)

**Authentication:** JWT-based login/signup with bcryptjs password hashing

**Hosting:**
- Frontend → Vercel/Netlify
- Backend → Render/Railway
- Database → MongoDB Atlas / Local MongoDB

---

## 4. Key Features

| Category | Features |
|----------|----------|
| **Authentication & Authorization** | User registration (client/trainer), login, logout, JWT-based authentication, role-based access control (client/trainer/admin), protected routes |
| **CRUD Operations** | **Workouts:** Create, read, update, delete workout sessions<br>**Exercises:** Add, view, edit, remove exercises within workouts<br>**Diet Entries:** Log meals with macros, view by date, delete entries<br>**Workout Templates:** Create, browse, and use pre-built workout templates<br>**User Profiles:** Update profile information, upload profile pictures |
| **Frontend Routing** | Pages: Landing, Login, Register, Dashboard, Workout Details, Workout Manager, Workout Templates, Diet Tracker, Trainer Directory, Profile, Admin Panel |
| **Pagination** | Workout list pagination with configurable page size (default 10), displays total pages and current page, navigation controls (Prev/Next) |
| **Searching** | Search workouts by title (case-insensitive regex matching), search trainers by name/specialization/location |
| **Sorting** | Sort workouts by date (newest/oldest first), sort by duration (ascending/descending), sort trainers by experience |
| **Filtering** | Filter workout templates by category (push/pull/legs/full_body/etc.) and difficulty (beginner/intermediate/advanced), filter diet entries by date, filter trainers by public profile status |
| **Date-based Tracking** | View diet entries for any selected date via date picker, daily nutrition stats calculated from meals for selected date, workout history organized by date |
| **Template System** | Browse public workout templates, preview template details (exercises, sets, reps), create workout from template with one click, track template usage statistics |
| **Trainer-Client Connection** | Trainer directory with search functionality, view trainer profiles (rates in ₹, certifications, experience, availability), public/private profile settings |
| **File Upload** | Upload profile pictures (Multer middleware), automatic deletion of old profile pictures, file storage in `/uploads` directory |
| **Admin Panel** | Full CRUD operations for all users, manage all workouts and exercises, view system-wide statistics (admin role only) |
| **Hosting** | Deploy frontend to Vercel/Netlify, deploy backend to Render/Railway, database on MongoDB Atlas or local MongoDB |

---

## 5. Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React.js (v19.2.0), React Router DOM (v7.9.6), Axios (v1.13.2), TailwindCSS (v3.4.0), Framer Motion (v12.23.25), Vite (v7.2.4) |
| **Backend** | Node.js, Express.js (v5.2.1), Mongoose (v9.0.0) |
| **Database** | MongoDB (non-relational) |
| **Authentication** | JWT (jsonwebtoken v9.0.2), bcryptjs (v3.0.3) |
| **File Upload** | Multer (v2.0.2) |
| **Hosting** | Vercel/Netlify (Frontend), Render/Railway (Backend), MongoDB Atlas (Database) |

---

## 6. API Overview

### Authentication APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/register` | POST | Register new user (client/trainer) | Public |
| `/api/auth/login` | POST | Authenticate user and get JWT token | Public |
| `/api/auth` | GET | Get current authenticated user | Authenticated |

### Workout APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/workouts` | GET | Get all workouts (with pagination, search, sort) | Authenticated |
| `/api/workouts` | POST | Create new workout | Authenticated |
| `/api/workouts/:id` | GET | Get single workout by ID | Authenticated (owner only) |
| `/api/workouts/:id` | PUT | Update workout | Authenticated (owner only) |
| `/api/workouts/:id` | DELETE | Delete workout | Authenticated (owner only) |

### Exercise APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/exercises` | POST | Create exercise for a workout | Authenticated |
| `/api/exercises/:workoutId` | GET | Get all exercises for a workout | Authenticated |
| `/api/exercises/:id` | PUT | Update exercise | Authenticated (workout owner only) |
| `/api/exercises/:id` | DELETE | Delete exercise | Authenticated (workout owner only) |

### Workout Template APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/templates` | GET | Get all public templates (with category/difficulty filters) | Authenticated |
| `/api/templates/:id` | GET | Get single template by ID | Authenticated |
| `/api/templates` | POST | Create new workout template | Authenticated |
| `/api/templates/:id/use` | POST | Mark template as used (increment counter) | Authenticated |

### Diet APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/diet` | GET | Get diet entries for a specific date (query: `?date=YYYY-MM-DD`) | Authenticated |
| `/api/diet` | POST | Create new diet entry (meal) | Authenticated |
| `/api/diet/:id` | DELETE | Delete diet entry | Authenticated (owner only) |

### Profile APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/profile/me` | GET | Get current user's profile | Authenticated |
| `/api/profile/me` | PUT | Update user profile | Authenticated |
| `/api/profile/me/picture` | POST | Upload profile picture | Authenticated |
| `/api/profile/trainers` | GET | Get all public trainers | Authenticated |
| `/api/profile/trainers/:id` | GET | Get specific trainer profile | Authenticated |

### Admin APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/admin/users` | GET | Get all users | Admin only |
| `/api/admin/users` | POST | Create new user | Admin only |
| `/api/admin/users/:id` | PUT | Update user | Admin only |
| `/api/admin/users/:id` | DELETE | Delete user | Admin only |
| `/api/admin/workouts` | GET | Get all workouts | Admin only |
| `/api/admin/workouts` | POST | Create workout for any user | Admin only |
| `/api/admin/workouts/:id` | PUT | Update any workout | Admin only |
| `/api/admin/workouts/:id` | DELETE | Delete any workout | Admin only |
| `/api/admin/exercises` | GET | Get all exercises | Admin only |
| `/api/admin/exercises` | POST | Create exercise | Admin only |
| `/api/admin/exercises/:id` | PUT | Update exercise | Admin only |
| `/api/admin/exercises/:id` | DELETE | Delete exercise | Admin only |

---

## 7. Database Schema

### User Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  role: String (enum: 'client', 'trainer', 'admin'),
  profilePicture: String,
  bio: String,
  phone: String,
  dateOfBirth: Date,
  height: Number,
  weight: Number,
  goalWeight: Number,
  bodyType: String,
  fitnessGoals: [String],
  activityLevel: String,
  trainerInfo: {
    specialization: [String],
    certifications: [String],
    experience: Number,
    hourlyRate: Number, // in ₹ (rupees)
    availability: String,
    location: String,
    socialMedia: Object
  },
  clientInfo: {
    currentTrainer: ObjectId (ref: User),
    workoutPreference: String,
    dietaryRestrictions: [String]
  },
  isProfilePublic: Boolean,
  showContactInfo: Boolean
}
```

### Workout Collection
```javascript
{
  user: ObjectId (ref: User, required),
  title: String (required),
  date: Date (default: now),
  duration: Number, // in minutes
  notes: String
}
```

### Exercise Collection
```javascript
{
  workout: ObjectId (ref: Workout, required),
  name: String (required),
  sets: Number (required),
  reps: Number (required),
  weight: Number // in kg
}
```

### WorkoutTemplate Collection
```javascript
{
  name: String (required),
  description: String,
  category: String (enum: 'push', 'pull', 'legs', 'upper', 'lower', 'full_body', 'cardio', 'custom'),
  difficulty: String (enum: 'beginner', 'intermediate', 'advanced'),
  duration: Number, // in minutes
  daysPerWeek: Number,
  exercises: [{
    name: String,
    sets: Number,
    reps: Number,
    weight: Number,
    restTime: Number,
    notes: String
  }],
  createdBy: ObjectId (ref: User),
  isPublic: Boolean,
  timesUsed: Number
}
```

### DietEntry Collection
```javascript
{
  user: ObjectId (ref: User, required),
  date: Date (required),
  name: String (required),
  calories: Number,
  protein: Number, // in grams
  carbs: Number, // in grams
  fats: Number // in grams
}
```

---

## 8. Security Features

1. **Password Security:** All passwords hashed using bcryptjs with salt rounds (10)
2. **JWT Authentication:** Secure token-based authentication with expiration (7 days)
3. **Authorization:** Every protected route verifies user ownership before operations
4. **Input Validation:** Server-side validation for required fields and data types
5. **CORS Protection:** Configured to allow only frontend origin
6. **Environment Variables:** Sensitive data (JWT_SECRET, MONGO_URI) stored in `.env` file
7. **Role-Based Access:** Admin-only routes protected with role checks
8. **File Upload Security:** Multer middleware validates file types and sizes

---

## 9. User Roles & Permissions

### Client (Trainee)
- Create, read, update, delete own workouts
- Add exercises to own workouts
- Log diet entries
- Browse and use workout templates
- View trainer directory
- Update own profile

### Trainer
- All client permissions
- Public profile visible in trainer directory
- Set hourly rate (in ₹)
- Add certifications and specializations
- Manage trainer-specific information

### Admin
- All client and trainer permissions
- Full CRUD access to all users
- Manage all workouts and exercises
- System-wide administration

---

## 10. Key Functionalities

### Workout Management
- Create workout sessions with title, date, duration, and notes
- Add multiple exercises to each workout (sets, reps, weight)
- Edit workout details and exercises
- Delete workouts and exercises
- View workout history with pagination
- Search workouts by title
- Sort workouts by date or duration

### Nutrition Tracking
- Log meals with name, calories, protein, carbs, and fats
- View meals for any selected date via date picker
- Calculate daily nutrition stats (calories, macros)
- Quick-add common meals
- Delete meal entries
- Set and track daily nutrition goals

### Workout Templates
- Browse pre-built workout templates
- Filter by category (push/pull/legs/etc.) and difficulty
- Preview template details before using
- Create workout from template with one click
- Template usage statistics tracked

### Trainer-Client Connection
- Trainer directory with search functionality
- View trainer profiles with rates (in ₹), certifications, experience
- Filter trainers by specialization and location
- Public/private profile settings

### Profile Management
- Update personal information
- Upload profile pictures
- Set fitness goals and physical stats
- Manage trainer-specific information (for trainers)

---

## 11. Future Enhancements

- Real-time chat between trainers and clients
- Workout scheduling and calendar integration
- Progress photos and body measurements tracking
- Social features (follow trainers, share workouts)
- Mobile app (React Native)
- Payment integration for trainer bookings
- Video call integration for virtual training sessions
- Advanced analytics and progress visualization

---

## 12. Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build command: `cd client && npm run build`
2. Output directory: `client/dist`
3. Environment variables: `VITE_API_URL` (backend URL)

### Backend Deployment (Render/Railway)
1. Start command: `cd server && npm start`
2. Environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
3. Build command: Not required (Node.js runtime)

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGO_URI` in backend environment variables

---

## 13. Testing Credentials

### Admin
- Email: `admin@fitfusion.com`
- Password: `admin123`

### Trainee (Client)
- Email: `rahul.trainee@fitfusion.com`
- Password: `client123`

### Trainer
- Email: `arjun.trainer@fitfusion.com`
- Password: `trainer123`
- Hourly Rate: ₹1500/hour

---

## 14. Project Structure

```
FitFusion/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/        # React Context providers
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions (API client)
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json
├── server/                 # Backend Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware (auth, upload)
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── scripts/            # Seed scripts
│   ├── uploads/            # Uploaded files
│   ├── index.js            # Server entry point
│   └── package.json
└── README.md
```

---

This proposal outlines a comprehensive fitness tracking platform that addresses real-world needs while demonstrating proficiency in full-stack development, database design, authentication, and modern web technologies.

