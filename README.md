# Teraleads - AI-Powered Dental Patient Assistant

A full-stack AI-powered patient assistant dashboard for a dental clinic. Built with React, Express, PostgreSQL, and a Python AI microservice using OpenRouter.

## Tech Stack

- **Frontend**: React (Vite) + TailwindCSS + React Router
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **AI Service**: Python + FastAPI + Google Gemini API

## Live URLs (Post-Deployment)

After deployment, update these placeholder URLs:

- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.railway.app`
- **AI Service**: `https://your-ai.railway.app`

## Architecture Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│   Express   │────▶│  PostgreSQL │
│   Frontend  │     │   Backend   │     │  (Neon)     │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                          ▼
                   ┌─────────────┐     ┌─────────────┐
                   │   Python    │────▶│  OpenRouter │
                   │  AI Service │     │     API     │
                   └─────────────┘     └─────────────┘
```

## Local Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 16+ (or Docker)
- Google Gemini API key (optional for AI - service returns fallback if not configured)

### Option 1: Docker Compose (Recommended)

```bash
# Clone and enter project
cd teraleads

# Create .env file with optional OpenRouter API key
echo "GEMINI_API_KEY=your-key-here" > .env

# Start all services
docker compose up -d

# Run database migration (in backend container)
docker compose exec backend npm run db:migrate

# Services will be available at:
# - Frontend: http://localhost:3000
# - Backend:  http://localhost:3001
# - AI:       http://localhost:8000
```

### Option 2: Manual Setup

#### 1. Database

Create a PostgreSQL database and run migrations:

```bash
cd backend
cp .env.example .env
# Edit .env with DATABASE_URL

npm install
npm run db:migrate
```

#### 2. Backend

```bash
cd backend
npm install
# Set AI_SERVICE_URL, DATABASE_URL, JWT_SECRET in .env
npm run dev
```

#### 3. AI Service

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
# Set GEMINI_API_KEY in .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### 4. Frontend

```bash
cd frontend
npm install
# Create .env with VITE_API_URL=http://localhost:3001
npm run dev
```

## Environment Variables

### Backend (`.env`)

| Variable        | Description              | Default                    |
|----------------|--------------------------|----------------------------|
| DATABASE_URL   | PostgreSQL connection    | -                          |
| JWT_SECRET     | JWT signing key          | -                          |
| JWT_EXPIRES_IN | Token expiration         | 7d                         |
| AI_SERVICE_URL | AI microservice URL      | http://localhost:8000      |
| PORT           | Server port              | 3001                       |
| CORS_ORIGIN    | Allowed origins (comma)  | http://localhost:5173      |

### AI Service (`.env`)

| Variable            | Description           | Default                              |
|---------------------|-----------------------|--------------------------------------|
| GEMINI_API_KEY      | Gemini API key        | - (optional, fallback if missing)   |
| GEMINI_MODEL        | Model identifier      | gemini-1.5-flash                      |
| PORT                | Service port          | 8000                                 |

### Frontend (`.env`)

| Variable      | Description        | Default                  |
|---------------|--------------------|--------------------------|
| VITE_API_URL  | Backend API base   | http://localhost:3001   |

## API Documentation

### Auth

- `POST /api/auth/register` - Register user
  - Body: `{ email, password }`
  - Returns: `{ token, user }`
- `POST /api/auth/login` - Login
  - Body: `{ email, password }`
  - Returns: `{ token, user }`

### Patients (requires Authorization: Bearer \<token\>)

- `GET /api/patients?page=1&limit=10` - List patients with pagination
- `GET /api/patients/:id` - Get patient
- `POST /api/patients` - Create patient
  - Body: `{ name, email?, phone?, dateOfBirth?, medicalNotes? }`
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient

### Chat (requires Authorization: Bearer \<token\>)

- `GET /api/chat/:patientId` - Get chat history
- `POST /api/chat` - Send message
  - Body: `{ patientId, message }`
  - Returns: `{ reply }`

## Deployment

### Database (Neon)

1. Create a Neon project at [neon.tech](https://neon.tech)
2. Copy the connection string
3. Run migrations locally: `DATABASE_URL=<neon-url> npm run db:migrate` (from backend)

### Backend (Railway)

1. Connect GitHub repo to Railway
2. Create service from `backend/` directory
3. Add environment variables: DATABASE_URL, JWT_SECRET, AI_SERVICE_URL, CORS_ORIGIN
4. Deploy

### AI Service (Railway)

1. Create second Railway service from `ai-service/` directory
2. Add GEMINI_API_KEY, GEMINI_MODEL
3. Copy public URL and set as AI_SERVICE_URL in backend

### Frontend (Vercel)

1. Connect repo to Vercel
2. Root directory: `frontend/`
3. Build command: `npm run build`
4. Output: `dist`
5. Environment: VITE_API_URL = backend public URL

## AI Usage Disclosure

This project was built with AI assistance (Cursor/Claude). AI was used for:

- Project scaffolding and boilerplate structure
- TailwindCSS styling and layout suggestions
- Prompt engineering for the dental assistant persona (Gemini)
- Error handling patterns and validation logic
- Documentation and README content

All implementation decisions were reviewed and the developer understands the architecture, security implications, and can explain the codebase.

## License

MIT
