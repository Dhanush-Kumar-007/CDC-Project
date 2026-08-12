# CDC Project

Live demo: [CDC Project]([https://dhanush-kumar-007.github.io/CDC-Portal/](https://cdc-project-4agf.vercel.app/))

CDC Project is a full-stack placement portal built for a college Career Development Center (CDC). It supports student registration, job postings, applications, department-based eligibility, and admin management workflows.

## Features

- Student authentication and profile management
- Admin login and job management
- Job posting with company logo upload
- Department-based eligibility filtering
- Application tracking and dashboard views
- Responsive React frontend with Express and MongoDB backend

## Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express.js, MongoDB, Mongoose
- Authentication: JWT
- Deployment: GitHub Pages for frontend, with backend ready for cloud hosting

## Project Structure

- frontend/: React application
- backend/: Express API and MongoDB integration

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Environment Setup

Copy the example environment files and update the values:

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

## Deploying Backend on Render

Create a Render Web Service from this repository with the following settings:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Runtime: Node 18+

Set these environment variables in Render:

- `NODE_ENV=production`
- `MONGO_URI=<your_atlas_connection_string>`
- `JWT_SECRET=<long_random_secret>`
- `JWT_EXPIRES_IN=7d`
- `CLIENT_URL=https://your-frontend.vercel.app`

Notes:

- If your MongoDB password contains special characters like `@`, `#`, or `%`, URL-encode it in `MONGO_URI`.
- `CLIENT_URL` supports multiple comma-separated origins, for example:
  `https://your-frontend.vercel.app,https://preview-123.vercel.app`
- Health endpoint for Render checks: `/api/health`

## License

This project is for educational and demonstration purposes.
