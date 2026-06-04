# API Endpoints Reference — Student User

## Installation

```bash
# Install all workspace dependencies
pnpm install

# Generate Prisma client (auth service)
pnpm db:generate

# Run database migrations (auth service — PostgreSQL)
pnpm db:push

# Seed all services

## Auth (PostgreSQL + Prisma)
cd packages/auth && node prisma/seed.js

## Knowledge (Neo4j)
cd packages/knowledge && node scripts/seed.js

## Content (MongoDB)
cd packages/content && node scripts/seed.js
```

Then start the services (each in its own terminal, or use the parallel dev script):

```bash
# All three at once
pnpm dev

# Or individually
cd packages/auth      && node server.js    # port 8080
cd packages/knowledge && node server.js    # port 8081
cd packages/content   && node server.js    # port 8082
```

---

## Auth Service — `http://localhost:8080/api/v1`

### `POST /auth/register`

Create a new student account.

**Auth:** none

**Request body:**

```json
{
  "email": "student@example.com",
  "password": "MyPassword123",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Response `201 Created`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "student@example.com",
    "isActive": true
  },
  "roles": ["student"]
}
```

**Errors:**

Status

Code

When

`400`

`VALIDATION_ERROR`

Missing or invalid email/password

`409`

`CONFLICT`

Email already registered

---

### `POST /auth/login`

Authenticate with email and password.

**Auth:** none

**Request body:**

```json
{
  "email": "student@example.com",
  "password": "MyPassword123"
}
```

**Response `200 OK`:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "student@example.com",
    "isActive": true
  },
  "roles": ["student"]
}
```

**Errors:**

Status

Code

When

`401`

`UNAUTHORIZED`

Invalid email or password

`403`

`FORBIDDEN`

Account is inactive (soft-deleted)

---

### `GET /users/me`

Retrieve the authenticated user’s full profile, including roles.

**Auth:** Bearer token

**Response `200 OK`:**

```json
{
  "user": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "student@example.com",
    "isActive": true
  },
  "profile": {
    "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "firstName": "Jane",
    "lastName": "Doe",
    "displayName": "Jane Doe",
    "avatarUrl": null,
    "city": null,
    "preferredLanguage": null
  },
  "roles": [
    { "id": "r1...", "name": "student", "description": "Student role" }
  ]
}
```

---

### `PATCH /users/me`

Update the authenticated user’s profile fields.

**Auth:** Bearer token

**Request body (all optional):**

```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "displayName": "Jane Smith",
  "avatarUrl": "https://example.com/avatar.jpg",
  "city": "New York",
  "preferredLanguage": "en"
}
```

**Response `200 OK`:** Returns the updated profile object:

```json
{
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "firstName": "Jane",
  "lastName": "Smith",
  "displayName": "Jane Smith",
  "avatarUrl": "https://example.com/avatar.jpg",
  "city": "New York",
  "preferredLanguage": "en"
}
```

---

### `PATCH /users/me/account`

Update the account credentials (email and/or password).

**Auth:** Bearer token

**Request body:**

```json
{
  "currentPassword": "MyPassword123",
  "newEmail": "jane.smith@example.com",
  "newPassword": "NewSecurePass456"
}
```

Both `newEmail` and `newPassword` are optional (at least one must be provided).

**Response `200 OK` (password only changed):**

```json
{
  "message": "Account updated successfully"
}
```

**Response `200 OK` (email changed — new JWT returned):**

```json
{
  "message": "Account updated successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "jane.smith@example.com"
}
```

**Errors:**

Status

Code

When

`403`

`FORBIDDEN`

Current password is incorrect

`409`

`CONFLICT`

New email is already in use

---

### `DELETE /users/me`

Soft-delete the authenticated user’s account.

**Auth:** Bearer token

**Response `200 OK`:**

```json
{
  "message": "User deleted successfully"
}
```

---

### `GET /learning-paths`

List all available learning paths.

**Auth:** Bearer token

**Response `200 OK`:**

```json
[
  {
    "id": "lp-uuid-1",
    "code": "Math",
    "title": "Math fundamentals",
    "description": "Math fundamentals desc",
  },
  {
    "id": "lp-uuid-2",
    "code": "English",
    "title": "English fundamentals",
    "description": "English fundamentals desc",
  }
]
```

---

### `POST /learning-paths/enroll`

Enroll the authenticated user in a learning path.

**Auth:** Bearer token

**Request body:**

```json
{
  "learningPathId": "lp-uuid-1"
}
```

**Response `201 Created`:**

```json
{
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "learningPathId": "lp-uuid-1",
  "isActive": true,
  "startedAt": "2026-06-03T12:00:00.000Z",
  "progressPercent": 0,
  "completedAt": null,
  "status": "in_progress"
}
```

**Errors:**

Status

Code

When

`404`

`NOT_FOUND`

Learning path or user not found

`409`

`CONFLICT`

Already enrolled

---

### `GET /learning-paths/me`

List the authenticated user’s enrolled learning paths with progress.

**Auth:** Bearer token

**Response `200 OK`:**

```json
[
  {
    "enrollment": {
      "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "learningPathId": "lp-uuid-1",
      "isActive": true,
      "startedAt": "2026-06-03T12:00:00.000Z",
      "progressPercent": 0,
      "completedAt": null,
      "status": "in_progress"
    },
    "learningPath": {
      "id": "lp-uuid-1",
      "code": "Math",
      "title": "Math fundamentals",
      "description": "Math fundamentals desc",
    }
  }
]
```

---

### `PATCH /learning-paths/progress`

Update the progress and/or status of an enrollment.

**Auth:** Bearer token

**Request body:**

```json
{
  "learningPathId": "lp-uuid-1",
  "progressPercent": 50,
  "status": "in_progress"
}
```

`progressPercent` and `status` are optional. Setting `progressPercent >= 100` auto-completes the enrollment.

**Response `200 OK`:**

```json
{
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "learningPathId": "lp-uuid-1",
  "isActive": true,
  "startedAt": "2026-06-03T12:00:00.000Z",
  "progressPercent": 50,
  "completedAt": null,
  "status": "in_progress"
}
```

**Errors:**

Status

Code

When

`404`

`NOT_FOUND`

Enrollment not found

`409`

`CONFLICT`

Path already completed

---

### `PATCH /learning-paths/enrollment`

Toggle the active status of an existing enrollment.

**Auth:** Bearer token

**Request body:**

```json
{
  "learningPathId": "lp-uuid-1",
  "isActive": false
}
```

**Response `200 OK`:**

```json
{
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "learningPathId": "lp-uuid-1",
  "isActive": false,
  "progressPercent": 50,
  "status": "in_progress"
}
```

---

### `PUT /learning-paths/enrollment`

Create or update enrollment active status (upsert). If no enrollment exists, one is created.

**Auth:** Bearer token

**Request body:**

```json
{
  "learningPathId": "lp-uuid-1",
  "isActive": true
}
```

**Response `200 OK`:**

```json
{
  "userId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "learningPathId": "lp-uuid-1",
  "isActive": true,
  "startedAt": "2026-06-03T12:00:00.000Z",
  "progressPercent": 0,
  "status": "in_progress"
}
```

---

## Knowledge Service — `http://localhost:8081/api/v1`

### `GET /concepts`

List all concepts, optionally filtered by track and/or subtrack.

**Auth:** Bearer token  
**Permission:** `learning-path.read`

**Query parameters (all optional):**

Param

Example

Description

`track`

`Mathematics`

Filter by track name

`subtrack`

`Core Algebraic Spine`

Filter by subtrack name

**Request:** `GET /concepts?track=Mathematics`

**Response `200 OK`:**

```json
[
  {
    "id": "CN01",
    "name": "Number Sense, Counting & Early Arithmetic",
    "description": "Foundational number operations...",
    "subtrack": "Core Algebraic Spine",
    "track": "Mathematics",
    "difficulty": 1
  },
  {
    "id": "CN10",
    "name": "Exponential, Logarithmic & Matrix Algebra",
    "description": "Exponential modeling, properties of logarithms...",
    "subtrack": "Core Algebraic Spine",
    "track": "Mathematics",
    "difficulty": 9
  }
]
```

---

### `GET /concepts/:id`

Get a single concept with its prerequisites, dependents, and related concepts.

**Auth:** Bearer token  
**Permission:** `learning-path.read`

**Request:** `GET /concepts/CN10`

**Response `200 OK`:**

```json
{
  "id": "CN10",
  "name": "Exponential, Logarithmic & Matrix Algebra",
  "description": "Exponential modeling, properties of logarithms...",
  "subtrack": "Core Algebraic Spine",
  "track": "Mathematics",
  "difficulty": 9,
  "prerequisites": [
    { "id": "CN06", "name": "Powers, Roots & Scientific Notation", "difficulty": 5 },
    { "id": "CN09", "name": "Advanced Functions & Rational Graphs", "difficulty": 8 }
  ],
  "dependents": [
    { "id": "CN11", "name": "Limits, Derivatives & Integral Calculus", "difficulty": 10 }
  ],
  "related": [
    { "id": "STAT02", "name": "Theoretical & Applied Probability", "difficulty": 6 }
  ]
}
```

**Errors:**

Status

Code

When

`404`

`NOT_FOUND`

Concept does not exist

---

### `GET /concepts/:id/prerequisites`

List the prerequisite concepts (incoming `REQUIRES_TO` relationships).

**Auth:** Bearer token  
**Permission:** `learning-path.read`

**Request:** `GET /concepts/CN10/prerequisites`

**Response `200 OK`:**

```json
[
  { "id": "CN06", "name": "Powers, Roots & Scientific Notation", "difficulty": 5 },
  { "id": "CN09", "name": "Advanced Functions & Rational Graphs", "difficulty": 8 }
]
```

---

### `GET /concepts/:id/dependents`

List the dependent concepts (outgoing `REQUIRES_TO` relationships).

**Auth:** Bearer token  
**Permission:** `learning-path.read`

**Request:** `GET /concepts/CN10/dependents`

**Response `200 OK`:**

```json
[
  { "id": "CN11", "name": "Limits, Derivatives & Integral Calculus", "difficulty": 10 }
]
```

---

### `GET /concepts/:id/related`

List the related concepts (bidirectional `RELATES_TO` relationships).

**Auth:** Bearer token  
**Permission:** `learning-path.read`

**Request:** `GET /concepts/CN10/related`

**Response `200 OK`:**

```json
[
  { "id": "STAT02", "name": "Theoretical & Applied Probability", "difficulty": 6 }
]
```

---

### `GET /concepts/graph`

Return the entire knowledge graph as nodes and edges.

**Auth:** Bearer token

**Response `200 OK`:**

```json
{
  "nodes": [
    { "id": "CN01", "name": "Number Sense...", "subtrack": "Core Algebraic Spine", "track": "Mathematics", "difficulty": 1 },
    { "id": "CN10", "name": "Exponential, Logarithmic...", "subtrack": "Core Algebraic Spine", "track": "Mathematics", "difficulty": 9 }
  ],
  "edges": [
    { "from": "CN01", "to": "CN02", "type": "REQUIRES_TO" },
    { "from": "CN09", "to": "CN10", "type": "REQUIRES_TO" },
    { "from": "CN10", "to": "STAT02", "type": "RELATES_TO" }
  ]
}
```

---

### `GET /concepts/graph/track/:track`

Return the knowledge graph filtered to a specific track.

**Auth:** Bearer token

**Request:** `GET /concepts/graph/track/Mathematics`

**Response `200 OK`:**

```json
{
  "nodes": [ /* only Mathematics concepts */ ],
  "edges": [ /* only edges between Mathematics concepts */ ]
}
```

---

### `GET /concepts/graph/path/:from/:to`

Find the shortest `REQUIRES_TO` path between two concepts.

**Auth:** Bearer token

**Request:** `GET /concepts/graph/path/CN01/CN10`

**Response `200 OK`:**

```json
{
  "nodes": [
    { "id": "CN01", "name": "Number Sense...", "difficulty": 1 },
    { "id": "CN02", "name": "Multi-Digit Arithmetic...", "difficulty": 2 },
    { "id": "CN04", "name": "Integers, Ratios & Rates", "difficulty": 4 },
    { "id": "CN05", "name": "Algebraic Foundations...", "difficulty": 5 },
    { "id": "CN06", "name": "Powers, Roots...", "difficulty": 5 },
    { "id": "CN10", "name": "Exponential, Logarithmic...", "difficulty": 9 }
  ],
  "edges": [
    { "from": "CN01", "to": "CN02", "type": "REQUIRES_TO" },
    { "from": "CN02", "to": "CN04", "type": "REQUIRES_TO" },
    { "from": "CN04", "to": "CN05", "type": "REQUIRES_TO" },
    { "from": "CN05", "to": "CN06", "type": "REQUIRES_TO" },
    { "from": "CN06", "to": "CN10", "type": "REQUIRES_TO" }
  ]
}
```

**Errors:**

Status

Code

When

`404`

`NOT_FOUND`

No path exists between the specified concepts

---

## Content Service — `http://localhost:8082/api/v1`

### `GET /content/nodes/:nodeId`

Retrieve the content blocks for a knowledge node.

**Auth:** Bearer token  
**Permission:** `content.read`

**Request:** `GET /content/nodes/CN10`

**Response `200 OK`:**

```json
{
  "_id": "669c...",
  "node_id": "CN10",
  "estimated_duration_minutes": 15,
  "version": 1,
  "version_status": "PUBLISHED",
  "search_text": "Exponential modeling, properties of logarithms...",
  "blocks": [
    {
      "type": "THEORY",
      "order": 1,
      "content": "An exponential function has the form f(x) = a · b^x..."
    },
    {
      "type": "EXAMPLE",
      "order": 2,
      "content": "Let's look at exponential growth in context.",
      "question": "If a population doubles every hour, starting at 100, what is the population after 3 hours?",
      "steps": "f(3) = 100 · 2^3 = 800",
      "solution": "800",
      "hints": ["Use the formula f(t) = a · b^t", "Substitute t = 3"]
    }
  ],
  "created_at": "2026-06-03T10:00:00.000Z",
  "updated_at": "2026-06-03T10:00:00.000Z"
}
```

**Errors:**

Status

Code

When

`404`

`NOT_FOUND`

No content exists for this node

---

### `PUT /content/notes/:nodeId`

Create or update (upsert) the authenticated user’s personal note for a knowledge node.

**Auth:** Bearer token  
**Permission:** `notes.write`

**Request body:**

```json
{
  "title": "Exponential Functions Summary",
  "markdownContent": "# Key Points\n\n- Exponential: f(x) = a · b^x\n- Logarithm is the inverse\n- Used for modeling growth/decay",
  "tags": ["math", "exponential", "algebra"]
}
```

**Response `200 OK`:**

```json
{
  "_id": "669c...",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "node_id": "CN10",
  "title": "Exponential Functions Summary",
  "markdown_content": "# Key Points\n\n- Exponential: f(x) = a · b^x\n- Logarithm is the inverse\n- Used for modeling growth/decay",
  "tags": ["math", "exponential", "algebra"],
  "created_at": "2026-06-03T14:00:00.000Z",
  "updated_at": "2026-06-03T14:00:00.000Z"
}
```

---

### `GET /content/notes/:nodeId`

Retrieve the authenticated user’s note for a knowledge node.

**Auth:** Bearer token  
**Permission:** `notes.read`

**Request:** `GET /content/notes/CN10`

**Response `200 OK`:**

```json
{
  "_id": "669c...",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "node_id": "CN10",
  "title": "Exponential Functions Summary",
  "markdown_content": "# Key Points\n\n- Exponential: f(x) = a · b^x\n- Logarithm is the inverse\n- Used for modeling growth/decay",
  "tags": ["math", "exponential", "algebra"],
  "created_at": "2026-06-03T14:00:00.000Z",
  "updated_at": "2026-06-03T14:00:00.000Z"
}
```

**Errors:**

Status

Code

When

`404`

`NOT_FOUND`

No note exists for this user and node

---

### `DELETE /content/notes/:nodeId`

Delete the authenticated user’s note for a knowledge node.

**Auth:** Bearer token  
**Permission:** `notes.write`

**Request:** `DELETE /content/notes/CN10`

**Response `200 OK`:**

```json
{
  "message": "Note deleted successfully"
}
```

**Errors:**

Status

Code

When

`404`

`NOT_FOUND`

No note exists for this user and node

---

### `GET /content/assessments`

List all assessments.

**Auth:** Bearer token  
**Permission:** `assessment.read`

**Response `200 OK`:**

```json
[
  {
    "_id": "eval_math_algebra_diag",
    "context_type": "QUIZ",
    "title": "Diagnostic Assessment: Basic Derivatives",
    "state": "active",
    "target_nodes": ["CN11", "CN12"],
    "difficulty_level": 3,
    "time_limit_minutes": 30,
    "passing_score": 70,
    "max_attempts": 3,
    "created_at": "2026-06-03T10:00:00.000Z",
    "updated_at": "2026-06-03T10:00:00.000Z"
  }
]
```

---

### `GET /content/assessments/:id`

Get a single assessment with its questions embedded.

**Auth:** Bearer token  
**Permission:** `assessment.read`

**Request:** `GET /content/assessments/eval_math_algebra_diag`

**Response `200 OK`:**

```json
{
  "_id": "eval_math_algebra_diag",
  "context_type": "QUIZ",
  "title": "Diagnostic Assessment: Basic Derivatives",
  "state": "active",
  "target_nodes": ["CN11", "CN12"],
  "difficulty_level": 3,
  "time_limit_minutes": 30,
  "passing_score": 70,
  "max_attempts": 3,
  "questions": [
    {
      "_id": "669c...",
      "evaluation_id": "eval_math_algebra_diag",
      "state": "active",
      "related_node_id": "CN11",
      "bloom_level": "APPLY",
      "question_type": "MULTIPLE_CHOICE",
      "data": {
        "question_text": "What is the first derivative of f(x) = 5x?",
        "variables": { "coeff": 5, "power": 1 },
        "options": ["5", "5x", "0", "1"],
        "correct_answer": "5",
        "explanation": "Using the power rule: d/dx of 5x^1 = 5x^0 = 5."
      },
      "created_at": "2026-06-03T10:00:00.000Z",
      "updated_at": "2026-06-03T10:00:00.000Z"
    }
  ]
}
```

**Errors:**

Status

Code

When

`404`

`NOT_FOUND`

Assessment does not exist

---

### `GET /content/assessments/:id/questions`

List all questions belonging to an assessment.

**Auth:** Bearer token  
**Permission:** `assessment.read`

**Request:** `GET /content/assessments/eval_math_algebra_diag/questions`

**Response `200 OK`:**

```json
[
  {
    "_id": "669c...",
    "evaluation_id": "eval_math_algebra_diag",
    "state": "active",
    "related_node_id": "CN11",
    "bloom_level": "APPLY",
    "question_type": "MULTIPLE_CHOICE",
    "data": {
      "question_text": "What is the first derivative of f(x) = 5x?",
      "options": ["5", "5x", "0", "1"],
      "correct_answer": "5",
      "explanation": "Using the power rule: d/dx of 5x^1 = 5x^0 = 5."
    },
  }
]
```

---

## Student Permissions Reference

Permission slug

Endpoints

`user.read`

`GET /users/me`

`learning-path.read`

`GET /concepts`, `GET /concepts/:id`, `GET /concepts/:id/prerequisites`, `GET /concepts/:id/dependents`, `GET /concepts/:id/related`

`learning-path.enroll`

`POST /learning-paths/enroll`

`content.read`

`GET /content/nodes/:nodeId`

`notes.read`

`GET /content/notes/:nodeId`

`notes.write`

`PUT /content/notes/:nodeId`, `DELETE /content/notes/:nodeId`

`assessment.read`

`GET /content/assessments`, `GET /content/assessments/:id`, `GET /content/assessments/:id/questions`

`assessment.attempt`

*(not exposed via student endpoints in current code)*

Endpoints with only `authMiddleware` (no permission check) are available to every authenticated user: `GET /learning-paths`, `GET /learning-paths/me`, `PATCH /learning-paths/progress`, `PATCH /learning-paths/enrollment`, `PUT /learning-paths/enrollment`, `GET /concepts/graph`, `GET /concepts/graph/track/:track`, `GET /concepts/graph/path/:from/:to`.