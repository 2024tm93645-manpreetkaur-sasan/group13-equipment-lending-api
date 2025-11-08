# API Documentation - School Equipment Lending Portal

**Repository:** [group13-equipment-lending-api](https://github.com/2024tm93645-manpreetkaur-sasan/group13-equipment-lending-api/tree/ai-assisted)

## System Overview

Two-tier architecture:
- **Proxy Service** (Port 5001): Handles authentication and JWT issuance
- **Backend Service** (Port 4000): Manages equipment, requests, and notifications
- **Database:** MongoDB (`school_equipment_lending`)

---

## Authentication APIs (Proxy - Port 5001)

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{"name": "Admin-Manpreet", "email": "admin-backend@school.com", "password": "adminpass", "role": "admin"}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Registration successful"
}
```

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{"email": "admin-backend@school.com", "password": "adminpass"}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MGY4NjZkMzNhYzAzOTA3YTU4Y2NhNSIsInJvbGUiOiJhZG1pbiIsIm5hbWUiOiJBZG1pbi1NYW5wcmVldCIsImVtYWlsIjoiYWRtaW4tYmFja2VuZEBzY2hvb2wuY29tIiwiaWF0IjoxNzYyNjI1MTQ0LCJleHAiOjE3NjI3MTE1NDR9.Z10t19QXsxhj1YJqirEX2RnpCiYA5ZilGXwyRtrG2bU"
}
```

**Test Accounts:**
- Admin: `admin@school.com` / `admin123`
- Staff: `staff@school.com` / `staff123`
- Student: `student@school.com` / `student123`

---

## Backend APIs (Port 4000)

### GET /api/equipments
Retrieve list of school equipments.

**Headers:** `Authorization: Bearer <jwt_token>`

**Query Parameters:**
- `status` (optional): Filter by status (available, borrowed)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "equipment list",
  "data": [
    {
      "_id": "690f82760a2f2f4aaf022216",
      "name": "Soccer Ball",
      "category": "sports",
      "condition": "good",
      "quantity": 10,
      "available": 10,
      "createdAt": "2025-11-08T17:48:38.397Z",
      "updatedAt": "2025-11-08T17:48:38.397Z",
      "__v": 0
    },
    {
      "_id": "690f82760a2f2f4aaf022218",
      "name": "DSLR Camera",
      "category": "camera",
      "condition": "good",
      "quantity": 2,
      "available": 2,
      "createdAt": "2025-11-08T17:48:38.406Z",
      "updatedAt": "2025-11-08T18:00:01.551Z",
      "__v": 0
    },
    {
      "_id": "690f86c89e828282bb683197",
      "name": "Educational Recorded Sessions",
      "category": "sessions",
      "condition": "good",
      "quantity": 6,
      "available": 6,
      "createdAt": "2025-11-08T18:07:04.022Z",
      "updatedAt": "2025-11-08T18:07:04.022Z",
      "__v": 0
    }
  ]
}
```

---

### GET /api/requests
Retrieve equipment lending requests.

**Headers:** `Authorization: Bearer <jwt_token>`

**Query Parameters:**
- `status` (optional): Filter by status (pending, approved, returned, overdue)
- `userId` (optional): Filter by user ID

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "requests list",
  "data": [
    {
      "_id": "690f82760a2f2f4aaf02221d",
      "user": "690f803e50c423fb2f943107",
      "equipment": {
        "_id": "690f82760a2f2f4aaf022218",
        "name": "DSLR Camera",
        "category": "camera",
        "condition": "good",
        "quantity": 2,
        "available": 2,
        "createdAt": "2025-11-08T17:48:38.406Z",
        "updatedAt": "2025-11-08T18:00:01.551Z",
        "__v": 0
      },
      "quantity": 1,
      "issueDate": "2025-11-05T17:48:38.411Z",
      "dueDate": "2025-11-07T17:48:38.411Z",
      "status": "overdue",
      "overdueNotified": true,
      "approvedBy": "690f803e50c423fb2f943105",
      "createdAt": "2025-11-08T17:48:38.412Z",
      "updatedAt": "2025-11-08T17:50:00.142Z",
      "__v": 0
    },
    {
      "_id": "690f82760a2f2f4aaf02221f",
      "user": "690f803e50c423fb2f943107",
      "equipment": {
        "_id": "690f82760a2f2f4aaf022216",
        "name": "Soccer Ball",
        "category": "sports",
        "condition": "good",
        "quantity": 10,
        "available": 10,
        "createdAt": "2025-11-08T17:48:38.397Z",
        "updatedAt": "2025-11-08T17:48:38.397Z",
        "__v": 0
      },
      "quantity": 1,
      "issueDate": "2025-11-08T18:48:38.411Z",
      "dueDate": "2025-11-11T17:48:38.411Z",
      "status": "approved",
      "overdueNotified": false,
      "approvedBy": "690f803e50c423fb2f943105",
      "createdAt": "2025-11-08T17:48:38.413Z",
      "updatedAt": "2025-11-08T17:48:38.413Z",
      "__v": 0
    },
    {
      "_id": "690f84ca9e828282bb683180",
      "user": "690f83de33ac03907a58cc9f",
      "equipment": {
        "_id": "690f82760a2f2f4aaf022218",
        "name": "DSLR Camera",
        "category": "camera",
        "condition": "good",
        "quantity": 2,
        "available": 2,
        "createdAt": "2025-11-08T17:48:38.406Z",
        "updatedAt": "2025-11-08T18:00:01.551Z",
        "__v": 0
      },
      "quantity": 1,
      "issueDate": "2025-11-08T17:59:57.877Z",
      "dueDate": "2025-11-10T17:59:57.877Z",
      "status": "returned",
      "overdueNotified": false,
      "createdAt": "2025-11-08T17:58:34.533Z",
      "updatedAt": "2025-11-08T18:00:01.557Z",
      "__v": 0,
      "approvedBy": "690f83de33ac03907a58cc9f",
      "returnDate": "2025-11-08T18:00:01.557Z"
    },
    {
      "_id": "690f87199e828282bb6831a1",
      "user": "690f83de33ac03907a58cc9f",
      "equipment": {
        "_id": "690f82760a2f2f4aaf022218",
        "name": "DSLR Camera",
        "category": "camera",
        "condition": "good",
        "quantity": 2,
        "available": 2,
        "createdAt": "2025-11-08T17:48:38.406Z",
        "updatedAt": "2025-11-08T18:00:01.551Z",
        "__v": 0
      },
      "quantity": 1,
      "issueDate": "2025-02-05T09:00:00.000Z",
      "dueDate": "2025-02-07T18:00:00.000Z",
      "status": "pending",
      "overdueNotified": false,
      "createdAt": "2025-11-08T18:08:25.792Z",
      "updatedAt": "2025-11-08T18:08:25.792Z",
      "__v": 0
    }
  ]
}
```

---

### POST /api/requests
Create a new equipment lending request.

**Headers:** `Authorization: Bearer <jwt_token>`

**Request Body:**
```json
{
  "equipment": "690f82760a2f2f4aaf022218",
  "quantity": 1,
  "from": "2025-02-05T09:00:00.000Z",
  "to": "2025-02-07T18:00:00.000Z"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "request created",
  "data": {
    "user": "690f83de33ac03907a58cc9f",
    "equipment": "690f82760a2f2f4aaf022218",
    "quantity": 1,
    "issueDate": "2025-02-05T09:00:00.000Z",
    "dueDate": "2025-02-07T18:00:00.000Z",
    "status": "pending",
    "overdueNotified": false,
    "_id": "690f87199e828282bb6831a1",
    "createdAt": "2025-11-08T18:08:25.792Z",
    "updatedAt": "2025-11-08T18:08:25.792Z",
    "__v": 0
  }
}
```

---

### GET /api/notifications
Retrieve notifications for logged-in user (polled by frontend).

**Headers:** `Authorization: Bearer <jwt_token>`

**Query Parameters:**
- `read` (optional): Filter by read status (true/false)
- `type` (optional): Filter by type (overdue, reminder, approval)

**Response:** `200 OK`
```json
{
  "notifications": [
    {
      "id": "notif_001",
      "userId": "user_123",
      "type": "overdue",
      "message": "Your equipment request for MacBook Pro is overdue",
      "requestId": "req_001",
      "read": false,
      "createdAt": "2025-11-02T08:00:00Z"
    }
  ],
  "unreadCount": 3
}
```


## Cron Scheduler (Backend Internal)

**Configuration:** `CRON_SCHEDULE` environment variable (backend)

**Default Schedule:** Every hour

**Process Flow:**
1. Query all requests where `dueDate < currentDate` AND `status != 'returned'`
2. For each overdue request:
    - Check if notification already exists for this request
    - Create new notification entry in MongoDB if not exists
    - Update request status to `'overdue'`
3. Store notifications in MongoDB for frontend polling

**MongoDB Collections:**
- `users` - User accounts (admin, staff, student)
- `equipments` - School equipment inventory
- `requests` - Lending requests
- `notifications` - System-generated notifications

**Notification Schema:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  requestId: ObjectId,
  type: 'overdue' | 'reminder' | 'approval',
  message: String,
  read: Boolean,
  createdAt: Date
}
```

---

## Frontend Integration

**Polling Strategy:**
- Frontend polls `GET /api/notifications` every 30-60 seconds
- Filters for unread notifications with `?read=false`
- Highlights overdue requests in UI based on notification data
- Marks notifications as read when user views them

---

## Environment Variables

**Proxy (.env):**
```
MONGO_URI=mongodb://localhost:27017/school_equipment_lending
PORT=5001
JWT_SECRET=your_secret_key_here
```

**Backend (.env):**
```
MONGO_URI=mongodb://localhost:27017/school_equipment_lending
PORT=4000
CRON_SCHEDULE=0 * * * *
```

---

## Setup Instructions

1. **Start MongoDB** (locally or remote)
2. **Proxy Service:**
   ```bash
   cd proxy
   npm install
   npm run seed    # Seeds test users
   npm run dev     # Runs on port 5001
   ```
3. **Backend Service:**
   ```bash
   cd backend
   npm install
   npm run seed    # Seeds test data
   npm run dev     # Runs on port 4000
   ```

---

## Error Responses

**401 Unauthorized:**
```json
{
  "error": "Invalid or missing JWT token"
}
```

**403 Forbidden:**
```json
{
  "error": "Insufficient permissions"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error occurred"
}
```