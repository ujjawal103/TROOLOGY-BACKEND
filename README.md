## Postman Collection

The complete API collection used for testing is available in:

```text
postman/
```


**API Documentation**

This documentation covers all the APIs available in the backend. Each API includes examples with success and error responses.

---

## Authentication APIs

### 1. User Login
**Endpoint:** `POST /api/v1/auth/login`

**Description:** Authenticate a user (both admin and regular users) with email and password.

**Authentication Required:** No

**Role-Based:** No

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Request Validation:**
- `email` (required): Must be a valid email format
- `password` (required): Cannot be empty

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

**Error Responses:**

*Invalid Email or Password (401):*
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

*Validation Error (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Please enter a valid email",
      "param": "email",
      "location": "body"
    }
  ]
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 2. Get Current User
**Endpoint:** `GET /api/v1/auth/me`

**Description:** Retrieve the information of the currently logged-in user.

**Authentication Required:** Yes (Token required in cookie or header)

**Role-Based:** No

**Request Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

**Error Responses:**

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 3. User Logout
**Endpoint:** `POST /api/v1/auth/logout`

**Description:** Logout the currently authenticated user and clear the authentication cookie.

**Authentication Required:** Yes (Token required in cookie or header)

**Role-Based:** No

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses:**

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## User Management APIs

### 4. Create User (Admin Only)
**Endpoint:** `POST /api/user/`

**Description:** Create a new user. Only admins can create users.

**Authentication Required:** Yes

**Role-Based:** Yes (Admin only)

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane.smith@example.com",
  "password": "securepass123",
  "role": "user"
}
```

**Request Validation:**
- `firstName` (required): Minimum 2 characters
- `lastName` (required): Minimum 2 characters
- `email` (required): Valid email format
- `password` (required): Minimum 6 characters
- `role` (optional): Must be "admin" or "user"

**Success Response (201):**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

*User Already Exists (409):*
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

*Validation Error (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "First name must be at least 2 characters",
      "param": "firstName",
      "location": "body"
    }
  ]
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not Admin (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 5. Get All Users (Admin Only)
**Endpoint:** `GET /api/user/`

**Description:** Retrieve a list of all users. Only admins can access this.

**Authentication Required:** Yes

**Role-Based:** Yes (Admin only)

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "role": "admin"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane@example.com",
      "role": "user"
    }
  ]
}
```

**Error Responses:**

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not Admin (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 6. Get User by ID (Admin Only)
**Endpoint:** `GET /api/user/:id`

**Description:** Retrieve a specific user by their ID. Only admins can access this.

**Authentication Required:** Yes

**Role-Based:** Yes (Admin only)

**URL Parameters:**
- `id` (required): Valid MongoDB user ID

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

*Invalid User ID (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid user id",
      "param": "id",
      "location": "params"
    }
  ]
}
```

*User Not Found (404):*
```json
{
  "success": false,
  "message": "User not found"
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not Admin (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 7. Update User (Admin Only)
**Endpoint:** `PUT /api/user/:id`

**Description:** Update user information. Only admins can update any user's details.

**Authentication Required:** Yes

**Role-Based:** Yes (Admin only)

**URL Parameters:**
- `id` (required): Valid MongoDB user ID

**Request Body:**
```json
{
  "firstName": "Janet",
  "lastName": "Smith",
  "email": "janet.smith@example.com"
}
```

**Request Validation:**
- `firstName` (optional): Minimum 2 characters
- `lastName` (optional): Minimum 2 characters
- `email` (optional): Valid email format

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Janet",
    "lastName": "Smith",
    "email": "janet.smith@example.com",
    "role": "user"
  }
}
```

**Error Responses:**

*Email Already Exists (409):*
```json
{
  "success": false,
  "message": "Email already exists"
}
```

*Invalid User ID (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid user id",
      "param": "id",
      "location": "params"
    }
  ]
}
```

*User Not Found (404):*
```json
{
  "success": false,
  "message": "User not found"
}
```

*Validation Error (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "First name must be at least 2 characters",
      "param": "firstName",
      "location": "body"
    }
  ]
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not Admin (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 8. Delete User (Admin Only)
**Endpoint:** `DELETE /api/user/:id`

**Description:** Delete a user by ID. Only admins can delete users.

**Authentication Required:** Yes

**Role-Based:** Yes (Admin only)

**URL Parameters:**
- `id` (required): Valid MongoDB user ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**

*Invalid User ID (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid user id",
      "param": "id",
      "location": "params"
    }
  ]
}
```

*User Not Found (404):*
```json
{
  "success": false,
  "message": "User not found"
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not Admin (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 9. Change User Role (Admin Only)
**Endpoint:** `PATCH /api/user/role/:id`

**Description:** Change the role of a user. Only admins can change user roles.

**Authentication Required:** Yes

**Role-Based:** Yes (Admin only)

**URL Parameters:**
- `id` (required): Valid MongoDB user ID

**Request Body:**
```json
{
  "role": "admin"
}
```

**Request Validation:**
- `role` (required): Must be "admin" or "user"

**Success Response (200):**
```json
{
  "success": true,
  "message": "Role updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439012",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@example.com",
    "role": "admin"
  }
}
```

**Error Responses:**

*Invalid Role (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Role must be admin or user",
      "param": "role",
      "location": "body"
    }
  ]
}
```

*Invalid User ID (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid user id",
      "param": "id",
      "location": "params"
    }
  ]
}
```

*User Not Found (404):*
```json
{
  "success": false,
  "message": "User not found"
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not Admin (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 10. Update User Profile
**Endpoint:** `PUT /api/user/profile/update`

**Description:** Update the authenticated user's profile information (first name and last name only). Users can only update their own profile.

**Authentication Required:** Yes

**Role-Based:** No (All authenticated users)

**Request Body:**
```json
{
  "firstName": "Jonathan",
  "lastName": "Doe"
}
```

**Request Validation:**
- `firstName` (optional): Minimum 2 characters
- `lastName` (optional): Minimum 2 characters

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "Jonathan",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**Error Responses:**

*Validation Error (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "First name must be at least 2 characters",
      "param": "firstName",
      "location": "body"
    }
  ]
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Project Management APIs

### 11. Create Project (Admin Only)
**Endpoint:** `POST /api/project/`

**Description:** Create a new project with title, description, dates, and optional file attachments. Only admins can create projects.

**Authentication Required:** Yes

**Role-Based:** Yes (Admin only)

**Content-Type:** multipart/form-data (for file uploads)

**Request Body:**
```json
{
  "title": "Mobile App Development",
  "description": "A comprehensive mobile application for iOS and Android platforms",
  "startDate": "2024-01-15",
  "endDate": "2024-06-30",
  "status": "In-Progress",
  "assignedUsers": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"]
}
```

**Form Data for File Upload:**
- `attachments` (optional): Up to 3 files can be uploaded

**Request Validation:**
- `title` (required): Minimum 3 characters
- `description` (required): Minimum 10 characters
- `startDate` (required): Valid ISO8601 date format
- `endDate` (required): Must be after startDate
- `status` (optional): "Pending", "In-Progress", or "Completed"
- `assignedUsers` (optional): Array of valid MongoDB user IDs

**Success Response (201):**
```json
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "_id": "607f1f77bcf86cd799439020",
    "title": "Mobile App Development",
    "description": "A comprehensive mobile application for iOS and Android platforms",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-06-30T00:00:00.000Z",
    "status": "In-Progress",
    "assignedUsers": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
    "attachments": [
      {
        "url": "https://res.cloudinary.com/...",
        "publicId": "projects/abc123"
      }
    ],
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-10T10:30:00.000Z"
  }
}
```

**Error Responses:**

*End Date Before Start Date (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "End date must be after start date",
      "param": "endDate",
      "location": "body"
    }
  ]
}
```

*Too Many Files (400):*
```json
{
  "success": false,
  "message": "Maximum 3 attachments allowed"
}
```

*Validation Error (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Title must be at least 3 characters",
      "param": "title",
      "location": "body"
    }
  ]
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not Admin (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 12. Get All Projects
**Endpoint:** `GET /api/project/`

**Description:** Retrieve all projects. Admins see all projects, while regular users only see projects assigned to them.

**Authentication Required:** Yes

**Role-Based:** Yes (Role-based filtering)
- **Admin:** Sees all projects
- **User:** Sees only assigned projects

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "projects": [
    {
      "_id": "607f1f77bcf86cd799439020",
      "title": "Mobile App Development",
      "description": "A comprehensive mobile application for iOS and Android platforms",
      "startDate": "2024-01-15T00:00:00.000Z",
      "endDate": "2024-06-30T00:00:00.000Z",
      "status": "In-Progress",
      "assignedUsers": [
        {
          "_id": "507f1f77bcf86cd799439012",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@example.com",
          "role": "user"
        }
      ],
      "attachments": [],
      "createdBy": {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com"
      },
      "createdAt": "2024-01-10T10:30:00.000Z",
      "updatedAt": "2024-01-10T10:30:00.000Z"
    }
  ]
}
```

**Error Responses:**

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 13. Get Project by ID
**Endpoint:** `GET /api/project/:id`

**Description:** Retrieve a specific project by ID. Admins can view any project, while users can only view projects assigned to them.

**Authentication Required:** Yes

**Role-Based:** Yes (Role-based access control)
- **Admin:** Can view any project
- **User:** Can only view if assigned to the project

**URL Parameters:**
- `id` (required): Valid MongoDB project ID

**Success Response (200):**
```json
{
  "success": true,
  "project": {
    "_id": "607f1f77bcf86cd799439020",
    "title": "Mobile App Development",
    "description": "A comprehensive mobile application for iOS and Android platforms",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-06-30T00:00:00.000Z",
    "status": "In-Progress",
    "assignedUsers": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "firstName": "Jane",
        "lastName": "Smith",
        "email": "jane@example.com",
        "role": "user"
      }
    ],
    "attachments": [
      {
        "url": "https://res.cloudinary.com/...",
        "publicId": "projects/abc123"
      }
    ],
    "createdBy": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-10T10:30:00.000Z"
  }
}
```

**Error Responses:**

*Invalid Project ID (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid project id",
      "param": "id",
      "location": "params"
    }
  ]
}
```

*Project Not Found (404):*
```json
{
  "success": false,
  "message": "Project not found"
}
```

*Access Denied - Not Assigned (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 14. Update Project (Admin Only)
**Endpoint:** `PUT /api/project/:id`

**Description:** Update project details and optionally add new file attachments. Only admins can update projects.

**Authentication Required:** Yes

**Role-Based:** Yes (Admin only)

**Content-Type:** multipart/form-data (for file uploads)

**URL Parameters:**
- `id` (required): Valid MongoDB project ID

**Request Body:**
```json
{
  "title": "Updated Project Title",
  "description": "Updated project description with new details",
  "startDate": "2024-01-15",
  "endDate": "2024-07-15",
  "status": "Completed",
  "assignedUsers": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439014"]
}
```

**Form Data for File Upload:**
- `attachments` (optional): Additional files (combined with existing attachments cannot exceed 3)

**Request Validation:**
- `title` (optional): Minimum 3 characters
- `description` (optional): Minimum 10 characters
- `startDate` (required): Valid ISO8601 date format
- `endDate` (required): Must be after startDate
- `status` (optional): "Pending", "In-Progress", or "Completed"
- `assignedUsers` (optional): Array of valid MongoDB user IDs

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project updated successfully",
  "project": {
    "_id": "607f1f77bcf86cd799439020",
    "title": "Updated Project Title",
    "description": "Updated project description with new details",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-07-15T00:00:00.000Z",
    "status": "Completed",
    "assignedUsers": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439014"],
    "attachments": [
      {
        "url": "https://res.cloudinary.com/...",
        "publicId": "projects/abc123"
      },
      {
        "url": "https://res.cloudinary.com/...",
        "publicId": "projects/def456"
      }
    ],
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-12T14:45:00.000Z"
  }
}
```

**Error Responses:**

*Maximum Attachments Exceeded (400):*
```json
{
  "success": false,
  "message": "Maximum 3 attachments allowed per project"
}
```

*End Date Before Start Date (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "End date must be after start date",
      "param": "endDate",
      "location": "body"
    }
  ]
}
```

*Invalid Project ID (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid project id",
      "param": "id",
      "location": "params"
    }
  ]
}
```

*Project Not Found (404):*
```json
{
  "success": false,
  "message": "Project not found"
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not Admin (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 15. Delete Project (Admin Only)
**Endpoint:** `DELETE /api/project/:id`

**Description:** Delete a project and all its associated attachments from Cloudinary. Only admins can delete projects.

**Authentication Required:** Yes

**Role-Based:** Yes (Admin only)

**URL Parameters:**
- `id` (required): Valid MongoDB project ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project deleted successfully"
}
```

**Error Responses:**

*Invalid Project ID (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid project id",
      "param": "id",
      "location": "params"
    }
  ]
}
```

*Project Not Found (404):*
```json
{
  "success": false,
  "message": "Project not found"
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not Admin (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

### 16. Update Project Status (User Role)
**Endpoint:** `PATCH /api/project/status/:id`

**Description:** Update the status of a project. Only assigned users can update the status of their assigned projects.

**Authentication Required:** Yes

**Role-Based:** Yes (User role only)

**URL Parameters:**
- `id` (required): Valid MongoDB project ID

**Request Body:**
```json
{
  "status": "Completed"
}
```

**Request Validation:**
- `status` (required): Must be "Pending", "In-Progress", or "Completed"

**Success Response (200):**
```json
{
  "success": true,
  "message": "Project status updated successfully",
  "project": {
    "_id": "607f1f77bcf86cd799439020",
    "title": "Mobile App Development",
    "description": "A comprehensive mobile application for iOS and Android platforms",
    "startDate": "2024-01-15T00:00:00.000Z",
    "endDate": "2024-06-30T00:00:00.000Z",
    "status": "Completed",
    "assignedUsers": ["507f1f77bcf86cd799439012"],
    "attachments": [],
    "createdBy": "507f1f77bcf86cd799439011",
    "createdAt": "2024-01-10T10:30:00.000Z",
    "updatedAt": "2024-01-15T16:20:00.000Z"
  }
}
```

**Error Responses:**

*Invalid Status (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid status",
      "param": "status",
      "location": "body"
    }
  ]
}
```

*Invalid Project ID (400):*
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Invalid project id",
      "param": "id",
      "location": "params"
    }
  ]
}
```

*Project Not Found (404):*
```json
{
  "success": false,
  "message": "Project not found"
}
```

*Not Assigned to Project (403):*
```json
{
  "success": false,
  "message": "You are not assigned to this project"
}
```

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not User Role (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Dashboard APIs

### 17. Get Dashboard Statistics (Admin Only)
**Endpoint:** `GET /api/dashboard/stats`

**Description:** Retrieve dashboard statistics including total users, total projects, project status breakdown, and projects ending soon. Only admins can access this endpoint.

**Authentication Required:** Yes

**Role-Based:** Yes (Admin only)

**Query Parameters:** None

**Success Response (200):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 15,
    "totalProjects": 8,
    "pendingProjects": 2,
    "inProgressProjects": 4,
    "completedProjects": 2,
    "endingSoonProjects": 3
  }
}
```

**Response Fields Explanation:**
- `totalUsers`: Total number of users in the system
- `totalProjects`: Total number of projects in the system
- `pendingProjects`: Number of projects with "Pending" status
- `inProgressProjects`: Number of projects with "In-Progress" status
- `completedProjects`: Number of projects with "Completed" status
- `endingSoonProjects`: Number of projects ending within the next 7 days

**Error Responses:**

*Unauthorized (401):*
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

*Forbidden - Not Admin (403):*
```json
{
  "success": false,
  "message": "Access denied"
}
```

*Server Error (500):*
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Authentication & Authorization Summary

### Authentication Methods
- **Cookie-based:** Token is sent as an HTTP-only cookie
- **Header-based:** Token can also be sent in Authorization header as `Bearer <token>`

### Role-Based Access Control (RBAC)
The system implements two roles:

**Admin Role:**
- Can create, read, update, and delete users
- Can change user roles
- Can create, read, update, and delete projects
- Can view dashboard statistics
- Can view all projects

**User Role:**
- Can update their own profile (first name, last name)
- Can view projects assigned to them
- Can update the status of assigned projects
- Cannot perform admin operations

### Authorization Header Example
```
GET /api/v1/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Error Codes Summary

| Status Code | Meaning | Description |
|------------|---------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource successfully created |
| 400 | Bad Request | Validation or request format error |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Authenticated but lacks permission (role-based) |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 500 | Internal Server Error | Server-side error |

---

## Common Validation Errors

| Field | Validation Rules |
|-------|-----------------|
| `email` | Must be valid email format |
| `password` | Minimum 6 characters |
| `firstName` | Minimum 2 characters, required for creation |
| `lastName` | Minimum 2 characters, required for creation |
| `title` | Minimum 3 characters, required |
| `description` | Minimum 10 characters, required |
| `startDate` | Valid ISO8601 format, required |
| `endDate` | Valid ISO8601 format, must be after startDate |
| `status` | Only "Pending", "In-Progress", or "Completed" |
| `role` | Only "admin" or "user" |
| `id` | Must be valid MongoDB ObjectId |

---

## Rate Limiting & File Uploads

### File Upload Limits
- **Maximum files per project:** 3 attachments
- **File types:** All file types supported (managed by Cloudinary)
- **Upload method:** multipart/form-data

### Attachment Storage
- All attachments are stored in Cloudinary
- Attachments include URL and publicId for deletion tracking
- Attachments are automatically deleted when projects are deleted

---

