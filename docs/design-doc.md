# Teraleads Design Document

## 1. Schema Design & Indexing

### Schema Overview

**users**
- `id` (UUID, PK) – Globally unique identifier for distributed systems and security
- `email` (VARCHAR 255, UNIQUE) – Login identifier
- `password_hash` (VARCHAR 255) – bcrypt hash, never store plain text
- `created_at`, `updated_at` – Audit timestamps

**patients**
- `id` (UUID, PK)
- `user_id` (FK → users.id, ON DELETE CASCADE) – Multi-tenant isolation
- `name`, `email`, `phone`, `date_of_birth`, `medical_notes`
- `created_at`, `updated_at`

**chat_messages**
- `id` (UUID, PK)
- `patient_id` (FK → patients.id, ON DELETE CASCADE)
- `user_id` (FK → users.id)
- `role` (ENUM: user, assistant)
- `message` (TEXT)
- `created_at`

### Indexing Choices

- `idx_users_email` – Fast login lookups by email
- `idx_patients_user_id` – Filter patients by owner
- `idx_patients_user_created` – Paginated list of patients ordered by `created_at DESC`
- `idx_chat_messages_patient_id` – Load chat history by patient
- `idx_chat_messages_patient_created` – Chronological message retrieval

### Design Rationale

- **UUID vs auto-increment**: UUIDs avoid enumeration attacks, work across distributed deployments, and simplify merging data. Trade-off: slightly larger storage and index size.
- **CASCADE on patient delete**: Deleting a patient removes associated chat messages; keeps referential integrity without orphaned rows.
- **Composite index (user_id, created_at)**: Optimizes the common query pattern: list a user’s patients, ordered by most recent first, with pagination.

---

## 2. Authentication & Security Design

### Authentication Flow

1. **Register**: Client sends email + password → server hashes with bcrypt (10 rounds) → stores user → returns JWT.
2. **Login**: Server verifies credentials → issues JWT with `userId` and `email`.
3. **Protected routes**: `Authorization: Bearer <token>` header → middleware verifies JWT → attaches user to request.

### Security Measures

- **Password hashing**: bcrypt with 10 salt rounds
- **JWT**: Signed with HS256; expiration 7 days
- **Input validation**: `express-validator` on all endpoints (email, UUIDs, required fields)
- **Parameterized queries**: All DB access uses parameterized queries to prevent SQL injection
- **CORS**: Whitelist frontend domains; reject unknown origins
- **XSS**: React escapes output; no `dangerouslySetInnerHTML` on user content

### Trade-offs

- **Stateless JWT**: No server-side session store; revoking tokens before expiry requires a deny-list (e.g., Redis), which was not implemented for the MVP.
- **Token in localStorage**: Easier to implement; vulnerable to XSS. For higher security, use httpOnly cookies with CSRF protection.

---

## 3. AI Service Architecture

### Design

- **Microservice**: Separate Python service from the Node backend to allow independent scaling, language choice, and deployment.
- **OpenRouter**: Single API for multiple LLM providers; easy to change models via `OPENROUTER_MODEL`.
- **Endpoint**: `POST /generate` accepts `{ message, patient_context? }` and returns `{ reply }`.

### Prompt Strategy

System-style prompt: “You are a helpful dental assistant…” with optional patient context (name, medical notes). Patient question appended as user message. Response is concise, professional, and non-diagnostic; users are advised to consult their dentist for specific concerns.

### Error Handling

- Missing API key: Return friendly fallback message
- Timeout / network error: Retry not implemented; return generic fallback
- Rate limits (429): Fallback message
- All errors: Log server-side, never expose internal details to client

### Future Enhancements

- Conversation memory: Include recent N messages in the prompt
- RAG: Retrieve from a dental knowledge base for domain-specific answers
- Caching: Cache responses for common questions (e.g., appointment info, after-hours)

---

## 4. Scaling Considerations & Trade-offs

### Database

- PostgreSQL handles thousands of concurrent users on a single instance.
- For higher scale: read replicas for heavy read workloads, connection pooling (e.g., PgBouncer).

### Backend

- Stateless design allows horizontal scaling behind a load balancer.
- Session-less JWT removes need for sticky sessions.

### AI Service

- Can be scaled independently (e.g., multiple replicas).
- Consider rate limiting per user/tenant if using shared API keys.

### Trade-offs Made

| Decision              | Trade-off                                                |
|-----------------------|----------------------------------------------------------|
| No Redis caching      | Simpler MVP; added latency for repeated identical reads  |
| HTTP for chat         | No WebSockets; sufficient for MVP; real-time requires WS |
| No automated tests    | Faster delivery; technical debt for production           |
| OpenRouter vs self-hosted | Less ops burden; API costs and vendor dependency    |
