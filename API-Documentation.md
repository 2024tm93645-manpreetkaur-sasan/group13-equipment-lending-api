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
{
  "email": "user@school.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student"
}
```

**Response:** `201 Created`
```json
{
  "id": "user_123",
  "email": "user@school.com",
  "name": "John Doe",
  "role": "student"
}
```

---

### POST /auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "student@school.com",
  "password": "student123"
}
```

**Response:** `200 OK`
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_123",
    "email": "student@school.com",
    "name": "Student User",
    "role": "student"
  }
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
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (available, borrowed)

**Response:** `200 OK`
```json
{
  "equipments": [
    {
      "id": "equip_001",
      "name": "MacBook Pro",
      "category": "Laptop",
      "status": "available",
      "serialNumber": "SN123456"
    }
  ],
  "total": 25,
  "page": 1
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
  "requests": [
    {
      "id": "req_001",
      "equipmentId": "equip_001",
      "userId": "user_123",
      "status": "overdue",
      "requestDate": "2025-10-01T10:00:00Z",
      "dueDate": "2025-11-01T10:00:00Z",
      "returnDate": null
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
  "equipmentId": "equip_001",
  "dueDate": "2025-12-01T10:00:00Z",
  "purpose": "Class project work"
}
```

**Response:** `201 Created`
```json
{
  "id": "req_002",
  "equipmentId": "equip_001",
  "userId": "user_123",
  "status": "pending",
  "dueDate": "2025-12-01T10:00:00Z"
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

---

### PATCH /api/notifications/:id/read
Mark notification as read.

**Headers:** `Authorization: Bearer <jwt_token>`

**Response:** `200 OK`
```json
{
  "id": "notif_001",
  "read": true,
  "updatedAt": "2025-11-08T12:00:00Z"
}
```

---

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