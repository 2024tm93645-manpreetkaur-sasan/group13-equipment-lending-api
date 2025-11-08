# group13-equipment-lending-api

## Overview

Simple School Equipment Lending Portal (proxy + backend). Proxy handles auth and issues JWTs; backend handles equipment, requests, and notifications. Both connect to MongoDB database `school_equipment_lending`.

## Quick start

1. Ensure MongoDB is running locally or accessible at the URI in `.env` files.
2. Start proxy:
   - cd proxy
   - npm install
   - npm run seed
   - npm run dev
3. Start backend:
   - cd backend
   - npm install
   - npm run seed
   - npm run dev

## Ports

- Proxy: 5001
- Backend: 4000

## Pre-seeded users (proxy)

- admin@school.com / admin123
- staff@school.com / staff123
- student@school.com / student123

## Configurable via .env files

- MONGO_URI
- PORT
- JWT_SECRET (proxy)
- CRON_SCHEDULE (backend)
