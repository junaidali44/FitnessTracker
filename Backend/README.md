# Fitness Tracker Backend

MERN Fitness Tracker API — track workouts, nutrition, and progress.

## Quick Start

```bash
# Install
npm install

# Setup env
cp .env.example .env
# Edit .env with your credentials

# Run
npm run dev
Environment Variables
See .env.example for the full list:

MongoDB Atlas URI

JWT secret

Cloudinary credentials

API Endpoints
Auth
POST /api/auth/register — Create account

POST /api/auth/login — Login (returns JWT)

GET /api/auth/me — Current user

PUT /api/auth/profile — Update profile

POST /api/auth/upload-avatar — Upload profile picture

Workouts
GET /api/workouts — List (filters: category, search, date range)

GET /api/workouts/analytics — Stats for charts

POST /api/workouts — Create

PUT /api/workouts/:id — Update

DELETE /api/workouts/:id — Delete

Nutrition
GET /api/nutrition — List (filters: mealType, date)

GET /api/nutrition/analytics — Daily macros

POST /api/nutrition — Log meal (auto-calculates totals)

PUT /api/nutrition/:id — Update

DELETE /api/nutrition/:id — Delete

Progress
GET /api/progress — List entries

GET /api/progress/chart — Chart data (weight, bodyfat, performance)

POST /api/progress — Log measurement

PUT /api/progress/:id — Update

DELETE /api/progress/:id — Delete

Dashboard
GET /api/dashboard — Today + week overview

GET /api/dashboard/weekly — 7-day summary

GET /api/dashboard/monthly — 30-day summary

Notifications
GET /api/notifications — List (query: unreadOnly=true)

PUT /api/notifications/:id/read — Mark one as read

PUT /api/notifications/read-all — Mark all as read

DELETE /api/notifications/:id — Delete

Settings
GET /api/settings — User preferences

PUT /api/settings — Update preferences

Feedback
POST /api/feedback — Submit feedback

GET /api/feedback — View my feedback

Export
GET /api/export/workouts?format=csv|pdf — Workout report

GET /api/export/nutrition?format=csv|pdf — Nutrition report

GET /api/export/progress — Progress CSV

Cron Jobs
9 AM daily: Morning motivation if no workout logged

8 PM daily: Dinner reminder if not logged

Sunday 8 PM: Weekly summary notification

Disable with ENABLE_CRON=false in .env.

Tech Stack
Node.js + Express

MongoDB Atlas + Mongoose

JWT authentication

Cloudinary (image uploads)

node-cron (scheduled jobs)

json2csv + pdfkit (exports)

Author
Syed Junaid Ali 


---

## 📦 **STEP 43: .env.example**

```env
# Server
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# MongoDB — paste your Atlas URI
MONGO_URI=mongodb+srv://USERNAME:PASSWORD@cluster.mongodb.net/fitness_tracker?retryWrites=true&w=majority

# JWT
JWT_SECRET=change_this_to_a_long_random_string_minimum_32_chars
JWT_EXPIRE=7d

# Cloudinary — sign up at cloudinary.com/console
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Cron
ENABLE_CRON=true