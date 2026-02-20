Teraleads - Senior Full-Stack Engineer Assessment

Submission:
Please submit the test on this link only, not by email: https://wkf.ms/3Mb3tfT

Deadline: 
Next Friday, 5 pm EOD


Stack: React + Node.js (Express) + PostgreSQL + Python (AI Layer)
Duration: around 3-5 hours (take-home)
AI Usage: Allowed - candidates must disclose AI usage in the README.
Overview
You will build a simplified AI-powered patient assistant dashboard for a dental clinic.
This assignment evaluates:
Backend design & API structure
React front-end component design & state management
Database modeling (PostgreSQL)
AI integration approach (Python service)
Deployment capability
Senior-level engineering thinking & trade-offs

Important: AI usage is allowed, but you must disclose any AI-assisted code and be able to explain your implementation.
Deliverables
GitHub repository (private) - share access with:
ai@teraleads.com
app@teraleads.com
operations@teraleads.com

README.md, including:
Setup & run instructions
Live deployment URLs for the frontend and backend
Environment variables required
Architecture overview
AI usage disclosure (which parts were AI-assisted)

Short design doc (1–2 pages) covering:
Schema design & indexing choices
Authentication & security design
AI service architecture
Scaling considerations & trade-offs

Code (take-home submission):
Backend: Express.js + PostgreSQL (auth + CRUD + chat)
Frontend: React SPA (patient list + chat UI)
Optional Python AI service (OpenAI/OpenRouter/local LLM) - can be mocked if necessary

Live deployment:
Frontend deployed publicly (e.g., Vercel)
Backend deployed publicly (e.g., Render, Railway, Fly.io)
Database hosted publicly (Supabase, Neon, or equivalent)
All URLs must be included in the README and emailed along with GitHub repo link
Docker & docker-compose are recommended but optional
Take-Home Task Scope (3-5 hours)
1. Backend (Express.js + PostgreSQL)
Auth:
Register/Login with JWT-based authentication
Password hashing (bcrypt)
Protect all patient & chat routes
Patient CRUD:
Create, read (with pagination), update, delete patients
Fields: Name, Email, Phone, DOB, Medical Notes, createdAt, updatedAt
Chat endpoint:
POST /chat with { patientId, message }
Store user message, call AI service (mock or real), store AI response, return AI response
Persist chat history in PostgreSQL
Engineering expectations:
Clean folder structure (routes, controllers, services, models)
Input validation & error handling
2. Frontend (React SPA)
Patient dashboard:
List patients with pagination
Create/Edit patient form
Delete functionality
Chat UI:
Display chat history
Input box & send button
Loading indicator during AI response
Basic client-side validation & error handling
Optional UI frameworks: TailwindCSS, Material UI, or plain CSS

3. AI Service (Optional but Preferred)
Minimal Python microservice 
Expose POST /generate endpoint: accepts message & optional patient context, returns AI-generated reply
Prompt template example:


You are a helpful dental assistant.
Patient question: {message}
Provide a professional and helpful response.

Configurable via environment variables
Error handling if API/model fails
Mocking AI responses is acceptable if service cannot be implemented


Submission:

Please submit the test on this link only, not by email: https://wkf.ms/3Mb3tfT

Deadline: Next Friday, 5 pm EOD
