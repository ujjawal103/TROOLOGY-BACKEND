# Troology Project Management System

A full-stack MERN Project Management System built with secure authentication, role-based authorization, project assignment, file uploads, and dashboard analytics.

## Live Demo

### Frontend

https://troology-frontend.vercel.app/login

### Backend

https://troology-backend.onrender.com

---

# Features

## Authentication & Security

* JWT-based Authentication
* Secure Login System
* Protected Routes
* Role-Based Authorization
* Token Validation Middleware
* Unauthorized Access Prevention

---

## Admin Features

### Dashboard

* Total Users
* Total Projects
* Pending Projects
* In Progress Projects
* Completed Projects
* Projects Ending Soon

### User Management

* Create User
* View All Users
* Update User Details
* Change User Role
* Delete User

### Project Management

* Create Project
* View All Projects
* Update Project
* Delete Project
* Assign Multiple Users
* Upload Project Attachments
* View Project Details
* Track Project Status

---

## User Features

### My Projects

* View Assigned Projects
* View Project Details
* Update Project Status
* Access Project Attachments

### Profile

* View Profile
* Update First Name
* Update Last Name

---

## File Uploads

* Cloudinary Integration
* Image Upload Support
* PDF Upload Support
* Multiple Attachment Support
* Attachment Validation

---

## Validations

### Backend Validations

Implemented using Express Validator.

Examples:

* Required Fields Validation
* Email Validation
* Password Length Validation
* MongoDB ObjectId Validation
* Date Validation
* Project Status Validation
* User Role Validation

### Frontend Validations

* Field Level Error Display
* API Error Handling
* Toast Notifications
* User-Friendly Validation Messages

---

# Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Tailwind CSS
* React Hot Toast

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT
* Express Validator
* Multer
* Cloudinary

## Deployment

### Frontend

* Vercel

### Backend

* Render

### Database

* MongoDB Atlas

---

# API Overview

## Auth Routes

| Method | Endpoint     |
| ------ | ------------ |
| POST   | /auth/login  |
| POST   | /auth/logout |
| GET    | /auth/me     |

---

## User Routes

| Method | Endpoint             |
| ------ | -------------------- |
| POST   | /user                |
| GET    | /user                |
| GET    | /user/:id            |
| PUT    | /user/:id            |
| DELETE | /user/:id            |
| PATCH  | /user/role/:id       |
| PUT    | /user/profile/update |

---

## Project Routes

| Method | Endpoint            |
| ------ | ------------------- |
| POST   | /project            |
| GET    | /project            |
| GET    | /project/:id        |
| PUT    | /project/:id        |
| DELETE | /project/:id        |
| PATCH  | /project/status/:id |

---

## Dashboard Routes

| Method | Endpoint         |
| ------ | ---------------- |
| GET    | /dashboard/stats |

---

# Project Structure

## Backend

```text
backend/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── cloudinary/
├── utils/
└── server.js
```

## Frontend

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   ├── context/
│   ├── routes/
│   └── assets/
└── public/
```

---

# Environment Variables

## Backend

```env
PORT=

MONGO_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Frontend

```env
VITE_BASE_URL=
```

---

# Testing

All APIs have been tested using Postman.

Tested Scenarios:

* Authentication Flow
* Protected Routes
* Admin Access
* User Access
* CRUD Operations
* File Uploads
* Validation Errors
* Authorization Checks
* Status Updates
* Profile Updates

---

# Security Implementations

* JWT Authentication
* Role-Based Access Control
* Request Validation
* Protected APIs
* Input Sanitization
* Secure Password Storage
* Unauthorized Route Protection

---

# Future Improvements

* Search & Filtering
* Project Comments
* Real-Time Notifications
* Activity Logs
* Team Management
* Email Notifications

---

# Author

**Ujjawal Kumar Jaiswal**

BCA Graduate | MERN Stack Developer

GitHub: https://github.com/your-github-username
