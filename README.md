# FitFusion - AP Capstone Project

## Project Proposal

**Student Name:** Aanya Mehrotra
**Project Name:** FitFusion
**Problem Statement:** Many fitness enthusiasts struggle to track their workouts effectively, often relying on scattered notes or complex, expensive apps. There is a need for a simple, elegant, and centralized platform to log workouts, track progress, and manage exercise routines.

**Proposed Solution:** FitFusion is a web-based fitness tracking application that allows users to create, read, update, and delete workout logs and exercises. It features a minimalist, high-contrast design for ease of use during workouts and provides advanced tools to search, filter, and sort workout history.

**Technical Implementation:**
- **Frontend:** React.js (Vite) with Vanilla CSS for a custom, premium design.
- **Backend:** Node.js and Express.js REST API.
- **Database:** MongoDB for flexible data storage.
- **Authentication:** Secure JWT-based authentication and authorization.

**Key Features:**
1.  **User Authentication:** Secure registration and login using JSON Web Tokens (JWT).
2.  **Workout Management (CRUD):** Users can create, view, edit, and delete workout sessions.
3.  **Exercise Tracking (CRUD):** Users can add detailed exercises (sets, reps, weight) to each workout.
4.  **Advanced Data Fetching:**
    -   **Search:** Find workouts by title.
    -   **Sort:** Order workouts by date or duration.
    -   **Pagination:** Efficiently browse through workout history.

## Setup Instructions

1.  **Clone the repository.**
2.  **Backend Setup:**
    ```bash
    cd server
    npm install
    npm start
    ```
3.  **Frontend Setup:**
    ```bash
    cd client
    npm install
    npm run dev
    ```
4.  **Environment Variables:**
    -   Create `server/.env` with `MONGO_URI` and `JWT_SECRET`.
