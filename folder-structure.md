group13-equipment-lending-api/
├── proxy/
│ ├── server.js # Auth + header injection + proxying to backend
│ ├── models/User.js # Users for authentication
│ ├── seed.js # Pre-seeds admin/staff/student
│ └── .env # proxy env (PORT, MONGO_URI, JWT_SECRET)
├── backend/
│ ├── server.js # Backend entry, auto DB connect
│ ├── models/ # Equipment, Request, Notification, User (readonly)
│ ├── controllers/ # Business logic, uses http-status-codes
│ ├── scripts/ # seed + overdue scheduler (cron)
│ └── .env # backend env (PORT, MONGO_URI, CRON_SCHEDULE)
└── postman/ # Postman collection for testing
