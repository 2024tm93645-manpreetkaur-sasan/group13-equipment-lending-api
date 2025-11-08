# High-Level Design - School Equipment Lending Portal

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                  │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │         Frontend Application (React/Angular/Vue)                  │  │
│  │              Polls notifications every 30-60s                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                    ▼               ▼               ▼
        POST /auth/register  POST /auth/login  GET /api/*
                    │               │               │
                    └───────────────┼───────────────┘
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      PROXY SERVICE (Port 5001)                           │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐     │
│  │   API Gateway    │──│ Auth Controller  │──│   JWT Manager    │     │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘     │
│                                │                                         │
│                                │ Verify Credentials                      │
└────────────────────────────────┼─────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
            Verify JWT    Generate JWT   Forward Request
                    │            │            │
                    └────────────┼────────────┘
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVICE (Port 4000)                         │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                        API Server                                 │  │
│  │  ┌─────────────────┐ ┌─────────────────┐ ┌──────────────────┐  │  │
│  │  │   Equipment     │ │    Request      │ │   Notification   │  │  │
│  │  │   Controller    │ │   Controller    │ │    Controller    │  │  │
│  │  └─────────────────┘ └─────────────────┘ └──────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │              Cron Scheduler (CRON_SCHEDULE env)                  │  │
│  │                    Runs Every Hour                                │  │
│  │  ┌────────────────────────────────────────────────────────────┐ │  │
│  │  │  1. Query overdue requests (dueDate < now)                 │ │  │
│  │  │  2. Check if notification already exists                   │ │  │
│  │  │  3. Create notification entry in MongoDB                   │ │  │
│  │  │  4. Update request status to 'overdue'                     │ │  │
│  │  └────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────────┐
│              MongoDB Database: school_equipment_lending                  │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────────────┐  │
│  │     users      │  │   equipments   │  │       requests          │  │
│  │  ────────────  │  │  ────────────  │  │     ──────────────      │  │
│  │  _id           │  │  _id           │  │     _id                 │  │
│  │  email         │  │  name          │  │     equipmentId         │  │
│  │  password      │  │  category      │  │     userId              │  │
│  │  name          │  │  status        │  │     status              │  │
│  │  role          │  │  serialNumber  │  │     requestDate         │  │
│  └────────────────┘  └────────────────┘  │     dueDate             │  │
│                                           │     returnDate          │  │
│  ┌─────────────────────────────────────┐ └─────────────────────────┘  │
│  │      notifications (★ NEW)          │        ▲                      │
│  │    ──────────────────────────       │        │                      │
│  │    _id                               │        │                      │
│  │    userId                            │        │                      │
│  │    requestId ───────────────────────┼────────┘                      │
│  │    type (overdue/reminder)           │                               │
│  │    message                           │                               │
│  │    read (boolean)                    │                               │
│  │    createdAt                         │                               │
│  └─────────────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

### 1. Authentication Flow
```
Frontend → POST /auth/login → Proxy (5001)
                                  ↓
                            Auth Controller
                                  ↓
                            Verify credentials against MongoDB users collection
                                  ↓
                            Generate JWT token
                                  ↓
                            Return token to Frontend
```

### 2. API Request Flow
```
Frontend → GET /api/equipments (Bearer Token) → Proxy (5001)
                                                     ↓
                                              Verify JWT
                                                     ↓
                                              Forward to Backend (4000)
                                                     ↓
                                              Equipment Controller
                                                     ↓
                                              Query MongoDB equipments collection
                                                     ↓
                                              Return data to Frontend
```

### 3. Notification Generation Flow (Cron)
```
Cron Scheduler (Every Hour)
        ↓
Query MongoDB requests collection
WHERE dueDate < currentDate AND status != 'returned'
        ↓
For each overdue request:
        ↓
Check if notification exists in notifications collection
        ↓
If NOT exists:
    ├── Create notification entry
    ├── Set type = 'overdue'
    ├── Set message = "Equipment request is overdue"
    └── Set read = false
        ↓
Update request status to 'overdue'
```

### 4. Frontend Notification Polling
```
Frontend (Interval: 30-60s)
        ↓
GET /api/notifications?read=false (Bearer Token)
        ↓
Proxy → Backend → Notification Controller
        ↓
Query MongoDB notifications collection for current user
        ↓
Return unread notifications
        ↓
Frontend highlights overdue requests in UI
        ↓
User views notification
        ↓
PATCH /api/notifications/:id/read
        ↓
Mark notification as read in MongoDB
```

---

## Component Responsibilities

### Proxy Service (Port 5001)
- **Authentication:** User registration and login
- **JWT Management:** Token generation and validation
- **API Gateway:** Route requests to backend with verified JWT

### Backend Service (Port 4000)
- **Equipment Management:** CRUD operations for school equipment
- **Request Management:** Handle equipment lending requests
- **Notification Management:** Serve notifications to frontend
- **Cron Scheduler:** Generate overdue notifications automatically

### MongoDB Database
- **users:** Store user accounts (admin, staff, student)
- **equipments:** Equipment inventory
- **requests:** Lending request records
- **notifications:** System-generated alerts

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Proxy Service | Node.js + Express |
| Backend Service | Node.js + Express |
| Database | MongoDB |
| Authentication | JWT (JSON Web Tokens) |
| Cron Scheduler | node-cron |
| Frontend Polling | HTTP polling (30-60s interval) |

---

## Environment Configuration

### Proxy (.env)
```
MONGO_URI=mongodb://localhost:27017/school_equipment_lending
PORT=5001
JWT_SECRET=your_jwt_secret_key
```

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/school_equipment_lending
PORT=4000
CRON_SCHEDULE=0 * * * *  # Every hour
```

---

## Key Features

✅ **Separation of Concerns:** Auth logic isolated in proxy layer  
✅ **Automated Monitoring:** Cron scheduler detects overdue requests  
✅ **Real-time Updates:** Frontend polling ensures users see notifications  
✅ **Scalable Design:** Services can be deployed independently  
✅ **Security:** JWT-based authentication across all API ca