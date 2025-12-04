# FitFusion - Complete Codebase Explanation

## Project Overview

FitFusion is a full-stack fitness tracking application that connects fitness trainers with clients, allowing users to log workouts, track nutrition, manage exercise templates, and find certified trainers. The application uses a modern MERN stack architecture with role-based access control.

---

## System Architecture

```
Frontend (React + Vite) 
    ↓ HTTP Requests (Axios)
Backend API (Node.js + Express)
    ↓ Mongoose ODM
MongoDB Database
```

### Data Flow:
1. **User interacts** with React frontend
2. **Axios** sends HTTP requests to Express backend
3. **Express routes** handle requests and call controllers
4. **Controllers** interact with MongoDB via Mongoose models
5. **Response** sent back to frontend
6. **React components** update UI based on response

---

## Backend Architecture

### 1. **Server Entry Point** (`server/index.js`)
- Initializes Express app
- Connects to MongoDB using `connectDB()`
- Sets up middleware (CORS, JSON parsing, static file serving)
- Registers all route handlers
- Starts server on port 5000

### 2. **Database Models** (`server/models/`)

#### **User Model** (`User.js`)
- **Fields:**
  - Basic: `name`, `email`, `password`, `role` (client/trainer/admin)
  - Profile: `profilePicture`, `bio`, `phone`, `dateOfBirth`
  - Physical: `height`, `weight`, `goalWeight`, `bodyType`
  - Fitness: `fitnessGoals[]`, `activityLevel`
  - Trainer-specific: `trainerInfo` (specialization, certifications, experience, hourlyRate, availability, location, socialMedia)
  - Client-specific: `clientInfo` (currentTrainer, workoutPreference, dietaryRestrictions)
  - Privacy: `isProfilePublic`, `showContactInfo`

#### **Workout Model** (`Workout.js`)
- **Fields:** `user` (ref), `title`, `date`, `duration`, `notes`
- **Relationships:** Belongs to User

#### **Exercise Model** (`Exercise.js`)
- **Fields:** `workout` (ref), `name`, `sets`, `reps`, `weight`
- **Relationships:** Belongs to Workout

#### **WorkoutTemplate Model** (`WorkoutTemplate.js`)
- **Fields:** `name`, `description`, `category`, `difficulty`, `duration`, `daysPerWeek`, `exercises[]`, `createdBy` (ref), `isPublic`, `timesUsed`
- **Relationships:** Created by User

#### **DietEntry Model** (`DietEntry.js`)
- **Fields:** `user` (ref), `date`, `name`, `calories`, `protein`, `carbs`, `fats`
- **Relationships:** Belongs to User

### 3. **Controllers** (`server/controllers/`)

#### **authController.js**
- `register()`: Creates new user, hashes password with bcrypt, generates JWT token
- `login()`: Validates credentials, returns JWT token
- `getUser()`: Returns current authenticated user

#### **workoutController.js**
- `createWorkout()`: Creates workout for authenticated user
- `getWorkouts()`: Gets paginated workouts with search/sort/filter
- `getWorkout()`: Gets single workout by ID (with authorization check)
- `updateWorkout()`: Updates workout (only owner can update)
- `deleteWorkout()`: Deletes workout (only owner can delete)

#### **exerciseController.js**
- `createExercise()`: Adds exercise to workout (verifies workout ownership)
- `getExercises()`: Gets all exercises for a workout
- `updateExercise()`: Updates exercise (checks workout ownership)
- `deleteExercise()`: Deletes exercise (checks workout ownership)

#### **workoutTemplateController.js**
- `getTemplates()`: Gets public templates with optional category/difficulty filter
- `getTemplate()`: Gets single template by ID
- `createTemplate()`: Creates new template (linked to creator)
- `useTemplate()`: Increments template usage counter

#### **dietController.js**
- `createEntry()`: Creates diet entry (meal) for a specific date
- `getEntries()`: Gets all meals for a specific date (defaults to today)
- `deleteEntry()`: Deletes diet entry (with ownership check)

#### **profileController.js**
- `getProfile()`: Gets current user's profile
- `updateProfile()`: Updates user profile (excludes password/email/role)
- `uploadProfilePicture()`: Handles file upload using Multer, saves to `/uploads`
- `getTrainers()`: Gets all public trainers
- `getTrainerProfile()`: Gets specific trainer profile

#### **adminController.js**
- All CRUD operations for Users, Workouts, Exercises
- Only accessible to users with `role: 'admin'`
- Includes: `getAllUsers()`, `createUser()`, `updateUser()`, `deleteUser()`, etc.

### 4. **Routes** (`server/routes/`)

All routes are organized by feature:

- `/api/auth` - Authentication routes (public)
- `/api/workouts` - Workout CRUD (authenticated)
- `/api/exercises` - Exercise CRUD (authenticated)
- `/api/templates` - Workout template operations (authenticated)
- `/api/diet` - Diet entry operations (authenticated)
- `/api/profile` - User profile operations (authenticated)
- `/api/admin` - Admin operations (admin only)

### 5. **Middleware** (`server/middleware/`)

#### **auth.js** (JWT Authentication)
- Extracts token from `x-auth-token` header
- Verifies JWT using `JWT_SECRET`
- Attaches user info to `req.user`
- Protects routes from unauthorized access

#### **upload.js** (Multer Configuration)
- Handles file uploads (profile pictures)
- Saves files to `/uploads` directory
- Limits file size and type

---

## Frontend Architecture

### 1. **Entry Point** (`client/src/main.jsx`)
- Renders React app into DOM
- Wraps app in `StrictMode` for development warnings

### 2. **App Component** (`client/src/App.jsx`)
- Sets up React Router with all routes
- Wraps app in `AuthProvider` and `LoaderProvider`
- Defines `PrivateRoute` component for protected routes
- Routes:
  - `/` - LandingPage (public)
  - `/login`, `/register` - Auth pages (public)
  - `/dashboard` - User dashboard (protected)
  - `/workouts/*` - Workout management (protected)
  - `/templates` - Workout templates (protected)
  - `/diet` - Nutrition tracking (protected)
  - `/trainers` - Trainer directory (protected)
  - `/profile` - User profile (protected)
  - `/admin` - Admin panel (admin only)

### 3. **Context Providers**

#### **AuthContext** (`context/AuthContext.jsx`)
- Manages user authentication state
- Provides `user`, `login()`, `register()`, `logout()`, `loading`
- Stores JWT token in localStorage
- Auto-loads user on app start if token exists

#### **LoaderContext** (`context/LoaderContext.jsx`)
- Manages global loading state
- Shows/hides loading spinner during API calls
- Used by API interceptor to show loaders automatically

### 4. **API Client** (`utils/api.js`)
- Axios instance configured with base URL
- Request interceptor: Adds JWT token to headers, shows loader
- Response interceptor: Hides loader, handles errors
- Handles FormData for file uploads

### 5. **Pages** (`client/src/pages/`)

#### **LandingPage.jsx** - Public landing page
#### **Login.jsx** - Login form, calls `AuthContext.login()`
#### **Register.jsx** - Registration form with role selection (client/trainer)
#### **Dashboard.jsx** - Main user dashboard
  - Lists all workouts with pagination
  - Search by title
  - Sort by date/duration
  - View/Edit/Delete buttons
#### **WorkoutManager.jsx** - Create/Edit workout form
#### **WorkoutDetails.jsx** - View workout with exercises
  - Shows workout info
  - Lists all exercises
  - Add/Edit/Delete exercises inline
#### **WorkoutTemplates.jsx** - Browse and use templates
  - Filter by category/difficulty
  - Preview template details
  - "Use Template" creates workout from template
#### **WorkoutTemplateSuccess.jsx** - Confirmation page after using template
#### **Diet.jsx** - Nutrition tracking
  - Date picker to view meals by date
  - Add meals with macros (calories, protein, carbs, fats)
  - Daily stats visualization
  - Quick-add common meals
#### **TrainerDirectory.jsx** - Browse trainers
  - Search by name/specialization/location
  - View trainer profiles with rates (in ₹)
  - Shows certifications, experience, availability
#### **Profile.jsx** - User profile management
  - Edit profile info
  - Upload profile picture
  - Update fitness goals and stats
#### **AdminPanel.jsx** - Admin dashboard
  - Manage all users
  - View/edit all workouts and exercises
  - Full CRUD operations

### 6. **Components** (`client/src/components/`)

#### **Layout.jsx** - Main layout wrapper
  - Navbar with navigation links
  - User menu with logout
  - Role-based menu items

#### **Navbar.jsx** - Navigation bar
  - Logo and navigation links
  - User authentication status
  - Responsive design

#### **Loader.jsx** - Global loading spinner
  - Shows/hides based on LoaderContext state

#### **Welcome.jsx** - Welcome message component

---

## CRUD Operations Summary

### **Users**
- **Create:** `POST /api/auth/register` (public)
- **Read:** `GET /api/auth` (authenticated), `GET /api/profile/me` (authenticated)
- **Update:** `PUT /api/profile/me` (authenticated), `PUT /api/admin/users/:id` (admin)
- **Delete:** `DELETE /api/admin/users/:id` (admin)

### **Workouts**
- **Create:** `POST /api/workouts` (authenticated)
- **Read:** `GET /api/workouts` (authenticated, with pagination/search/sort), `GET /api/workouts/:id` (authenticated)
- **Update:** `PUT /api/workouts/:id` (authenticated, owner only)
- **Delete:** `DELETE /api/workouts/:id` (authenticated, owner only)

### **Exercises**
- **Create:** `POST /api/exercises` (authenticated, requires workoutId)
- **Read:** `GET /api/exercises/:workoutId` (authenticated)
- **Update:** `PUT /api/exercises/:id` (authenticated, workout owner only)
- **Delete:** `DELETE /api/exercises/:id` (authenticated, workout owner only)

### **Workout Templates**
- **Create:** `POST /api/templates` (authenticated)
- **Read:** `GET /api/templates` (authenticated, with filters), `GET /api/templates/:id` (authenticated)
- **Update:** N/A (templates are immutable)
- **Delete:** N/A (only usage tracking)

### **Diet Entries**
- **Create:** `POST /api/diet` (authenticated)
- **Read:** `GET /api/diet?date=YYYY-MM-DD` (authenticated)
- **Update:** N/A (meals are immutable, delete and recreate)
- **Delete:** `DELETE /api/diet/:id` (authenticated, owner only)

### **Profile**
- **Read:** `GET /api/profile/me` (authenticated)
- **Update:** `PUT /api/profile/me` (authenticated)
- **Upload Picture:** `POST /api/profile/me/picture` (authenticated, multipart/form-data)

---

## Key Features & Logic

### 1. **Authentication Flow**
1. User registers/logs in → Backend validates credentials
2. Backend generates JWT token → Frontend stores in localStorage
3. All subsequent requests include token in `x-auth-token` header
4. Middleware verifies token → Attaches user to request
5. Frontend checks token on load → Auto-login if valid

### 2. **Authorization Logic**
- **User-level:** Users can only access their own data (workouts, exercises, diet entries)
- **Role-based:** Admin can access all data, trainers have public profiles
- **Ownership checks:** Controllers verify `workout.user === req.user.id` before operations

### 3. **Pagination**
- Workouts endpoint supports `page` and `limit` query params
- Returns `totalPages` and `currentPage` for UI pagination
- Default: 10 items per page

### 4. **Search**
- Workouts can be searched by title using `search` query param
- Uses MongoDB regex for case-insensitive matching

### 5. **Sorting**
- Workouts can be sorted by `date`, `duration`, `-date`, `-duration`
- Uses MongoDB `.sort()` with field name (negative for descending)

### 6. **Filtering**
- Templates filtered by `category` and `difficulty` query params
- Diet entries filtered by `date` query param
- Trainers filtered by `isProfilePublic: true`

### 7. **Template Usage Flow**
1. User browses templates → Filters by category/difficulty
2. Clicks "Use Template" → Creates workout from template
3. Backend increments `timesUsed` counter
4. Frontend creates workout + exercises → Redirects to success page
5. Success page shows confirmation → Button to go to dashboard

### 8. **Date-based Diet Tracking**
- Each meal entry has a `date` field
- Frontend date picker allows selecting any date
- Backend queries meals for selected date range (start of day to end of day)
- Daily stats calculated from meals for that date

### 9. **File Upload**
- Multer middleware handles profile picture uploads
- Files saved to `/uploads` directory
- Old profile picture deleted when new one uploaded
- File path stored in User model

### 10. **Error Handling**
- Controllers use try-catch blocks
- Returns appropriate HTTP status codes (400, 401, 403, 404, 500)
- Frontend displays error messages from API responses
- Network errors show user-friendly messages

---

## Security Features

1. **Password Hashing:** bcryptjs with salt rounds (10)
2. **JWT Tokens:** Secure token-based authentication
3. **Authorization Checks:** Every protected route verifies user ownership
4. **Input Validation:** Server-side validation for required fields
5. **CORS:** Configured to allow frontend origin only
6. **Environment Variables:** Sensitive data (JWT_SECRET, MONGO_URI) in .env

---

## Database Relationships

```
User (1) ──< (Many) Workout
User (1) ──< (Many) DietEntry
User (1) ──< (Many) WorkoutTemplate
Workout (1) ──< (Many) Exercise
```

---

## State Management

- **React Context API:** For global state (auth, loader)
- **Local State:** useState for component-specific state
- **No Redux:** Simple state management without external library

---

## Styling

- **TailwindCSS:** Utility-first CSS framework
- **Custom CSS Variables:** For theme colors (primary, accent, secondary)
- **Framer Motion:** For animations and transitions
- **Glass Morphism:** Modern UI design with glass-card effects

---

## Development Workflow

1. **Backend:** `cd server && npm start` (or `npm run dev` with nodemon)
2. **Frontend:** `cd client && npm run dev` (Vite dev server)
3. **Database:** MongoDB running locally or MongoDB Atlas
4. **Environment:** `.env` file in server directory with MONGO_URI and JWT_SECRET

---

## API Response Format

### Success Response:
```json
{
  "data": {...},
  "workouts": [...],
  "totalPages": 5,
  "currentPage": 1
}
```

### Error Response:
```json
{
  "msg": "Error message here"
}
```

---

## Key Dependencies

### Backend:
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `multer` - File upload handling
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

### Frontend:
- `react` - UI library
- `react-router-dom` - Routing
- `axios` - HTTP client
- `framer-motion` - Animations
- `tailwindcss` - CSS framework
- `vite` - Build tool and dev server

---

This architecture provides a scalable, maintainable, and secure fitness tracking platform with role-based access control and comprehensive CRUD operations.

