# Gamified Goal Tracker

A full-stack web application to help users track daily goals, earn XP, unlock badges, and maintain streaks. Built with ReactJS (frontend), NodeJS/Express (backend), and MongoDB. DevOps-ready with Docker and basic test setup.

## Features
- User registration & login (JWT authentication)
- Add, complete, and track daily goals
- XP, streak, and badge system
- Visual dashboard with progress bars and charts
- Dockerized for easy deployment
- Basic tests (Jest for backend, React Testing Library for frontend)

## Project Structure
```
backend/    # NodeJS/Express API
frontend/   # ReactJS app
.github/    # Copilot instructions
```

## Prerequisites
- Docker & Docker Compose

## Quick Start
1. **Clone the repository**
2. **Run the app:**
   ```sh
   docker-compose up --build
   ```
3. **Access the app:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: mongodb://mongo:27017/gamified-goal-tracker

## Development
- Frontend: `cd frontend && npm install && npm start`
- Backend: `cd backend && npm install && npm run dev`

## Testing
- Frontend: `cd frontend && npm test`
- Backend: `cd backend && npm test`

## Environment Variables
- See `backend/.env.example` and `frontend/.env.example` for configuration.

## License
MIT
