# Student API Reference — Gateway Service

**Base URL:** `http://localhost:8084/api/student`

All endpoints (except `/auth/login` and `/auth/register`) require an `Authorization: Bearer <token>` header.  
The gateway forwards requests to internal services (Auth on `:8080`, Knowledge on `:8081`, Content on `:8082`).

---

## Authentication

### POST /auth/register

Create a new student account.

**Full URL:** `http://localhost:8084/api/student/auth/register`  
**Auth required:** No

**Request body:**
```json
{
  "email": "student@example.com",
  "password": "secret123",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Success response (201):**
```json
{
  "token": "<JWT>",
  "user": {
    "id": "<uuid>",
    "email": "student@example.com",
    "isActive": true
  },
  "roles": ["student"]
}
```

---

### POST /auth/login

Authenticate with email and password to receive a JWT.

**Full URL:** `http://localhost:8084/api/student/auth/login`  
**Auth required:** No

**Request body:**
```json
{
  "email": "student@example.com",
  "password": "secret123"
}
```

**Success response (200):**
```json
{
  "token": "<JWT>",
  "user": {
    "id": "<uuid>",
    "email": "student@example.com",
    "isActive": true
  },
  "roles": ["student"]
}
```

---

### GET /auth/me

Get the authenticated user's profile, enrolled learning paths, and all available learning paths.

**Full URL:** `http://localhost:8084/api/student/auth/me`  
**Auth required:** Yes — `Authorization: Bearer <token>`

**Request body:** None

**Success response (200):**
```json
{
  "user": {
    "id": "<uuid>",
    "email": "student@example.com",
    "isActive": true,
  },
  "profile": {
    "userId": "<uuid>",
    "firstName": "Jane",
    "lastName": "Doe",
    "displayName": "jane_doe",
    "avatarUrl": null,
    "city": null,
    "preferredLanguage": null,
  },
  "roles": [
    {
      "id": "<uuid>",
      "name": "student",
      "description": "Student access",
    }
  ],
  "enrolledPaths": [
    {
      "id": "<uuid>",
      "code": "Math",
      "title": "Mathematics Fundamentals",
      "progress": 50.00,
      "isActive": true
    }
  ],
  "availablePaths": [
    {
      "id": "<uuid>",
      "code": "English",
      "title": "English Language Arts"
    }
  ]
}
```

---

### PATCH /auth/me

Update the authenticated user's profile fields (name, avatar, language, etc.).

**Full URL:** `http://localhost:8084/api/student/auth/me`  
**Auth required:** Yes — `Authorization: Bearer <token>`

**Request body** (all fields optional):
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "displayName": "jane_smith",
  "avatarUrl": "https://example.com/avatar.jpg",
  "city": "New York",
  "preferredLanguage": "en"
}
```

**Success response (200):**
```json
{
  "userId": "<uuid>",
  "firstName": "Jane",
  "lastName": "Smith",
  "displayName": "jane_smith",
  "avatarUrl": "https://example.com/avatar.jpg",
  "city": "New York",
  "preferredLanguage": "en"
}
```

---

### PATCH /auth/me/account

Update the authenticated user's email and/or password. Requires current password confirmation.

**Full URL:** `http://localhost:8084/api/student/auth/me/account`  
**Auth required:** Yes — `Authorization: Bearer <token>`

**Request body:**
```json
{
  "currentPassword": "oldPassword123",
  "newEmail": "newemail@example.com",
  "newPassword": "newPassword456"
}
```

**Success response (200)** — when only password changes:
```json
{
  "message": "Account updated successfully"
}
```

**Success response (200)** — when email changes (new JWT issued):
```json
{
  "message": "Account updated successfully",
  "token": "<new JWT>",
  "email": "newemail@example.com"
}
```

---

### DELETE /auth/me

Permanently delete the authenticated user's account.

**Full URL:** `http://localhost:8084/api/student/auth/me`  
**Auth required:** Yes — `Authorization: Bearer <token>`

**Request body:** None

**Success response (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Learning Paths

### GET /learning-paths

List all available learning paths.

**Full URL:** `http://localhost:8084/api/student/learning-paths`  
**Auth required:** Yes — `Authorization: Bearer <token>`

**Request body:** None

**Success response (200):**
```json
[
  {
    "id": "<uuid>",
    "code": "Math",
    "title": "Mathematics Fundamentals",
    "description": "Fundamental mathematics track covering arithmetic through calculus"
  },
  {
    "id": "<uuid>",
    "code": "Geometry",
    "title": "Geometry and Trigonometry",
    "description": "From foundational shapes to advanced trigonometry"
  }
]
```

---

### GET /learning-paths/enrolled

List the authenticated user's enrolled learning paths with progress.

**Full URL:** `http://localhost:8084/api/student/learning-paths/enrolled`  
**Auth required:** Yes — `Authorization: Bearer <token>`

**Request body:** None

**Success response (200):**
```json
[
  {
    "enrollment": {
      "userId": "<uuid>",
      "learningPathId": "<uuid>",
      "isActive": true,
      "startedAt": "2026-01-01T00:00:00.000Z",
      "progressPercent": 50.00,
      "completedAt": null,
      "status": "in_progress"
    },
    "learningPath": {
      "id": "<uuid>",
      "code": "Math",
      "title": "Mathematics Fundamentals",
      "description": "Fundamental mathematics track"
    }
  }
]
```

---

### PUT /learning-paths

Batch enroll or unenroll the authenticated user in learning paths.

**Full URL:** `http://localhost:8084/api/student/learning-paths`  
**Auth required:** Yes — `Authorization: Bearer <token>`

**Request body:**
```json
{
  "codes": ["Math", "Geometry"]
}
```

**Success response (200):**
```json
{
  "enrolledPaths": [
    {
      "code": "Math",
      "title": "Mathematics Fundamentals",
      "isActive": true,
      "progress": 0
    },
    {
      "code": "Geometry",
      "title": "Geometry and Trigonometry",
      "isActive": true,
      "progress": 0
    }
  ]
}
```

**Error response (400):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "codes must be a non-empty array"
  }
}
```

---

## Knowledge Graph

### GET /concepts

List all concepts, optionally filtered by track and/or subtrack.

**Full URL:** `http://localhost:8084/api/student/concepts`  
**Auth required:** Yes — `Authorization: Bearer <token>`

**Query parameters (all optional):**

| Param | Example | Description |
|-------|---------|-------------|
| `track` | `Mathematics` | Filter by track name |
| `subtrack` | `Core Algebraic Spine` | Filter by subtrack name |

**Request body:** None

**Success response (200):**
```json
[
  {
    "id": "CN01",
    "name": "Number Sense",
    "description": "Foundational number operations",
    "subtrack": "Core Algebraic Spine",
    "track": "Mathematics",
    "difficulty": 1
  },
  {
    "id": "CN10",
    "name": "Exponential, Logarithmic & Matrix Algebra",
    "description": "Exponential modeling, properties of logarithms",
    "subtrack": "Core Algebraic Spine",
    "track": "Mathematics",
    "difficulty": 9
  }
]
```

---

### GET /graph

Get the full knowledge graph (all concepts and their relationships), plus the user's enrolled tracks and progress.

**Full URL:** `http://localhost:8084/api/student/graph`  
**Auth required:** Yes — `Authorization: Bearer <token>`

**Request body:** None

**Success response (200):**
```json
{
  "nodes": [
    {
      "id": "CN01",
      "name": "Number Sense",
      "subtrack": "arithmetic",
      "track": "mathematics",
      "difficulty": 1
    }
  ],
  "edges": [
    {
      "from": "CN01",
      "to": "CN02",
      "type": "REQUIRES_TO"
    }
  ],
  "userTracks": ["Math", "Geometry"],
  "learningPaths": [
    {
      "code": "Math",
      "title": "Mathematics Fundamentals",
      "progress": 50
    }
  ]
}
```

---

### GET /graph/track/{track}

Get the knowledge graph filtered to a specific track/course, plus the user's enrollment context.

**Full URL:** `http://localhost:8084/api/student/graph/track/{track}`  
**Auth required:** Yes — `Authorization: Bearer <token>`  
**Path parameter:** `track` — e.g. `Math`, `Geometry`, `Statistics`

**Request body:** None

**Success response (200):**
```json
{
  "nodes": [
    {
      "id": "CN01",
      "name": "Number Sense",
      "subtrack": "arithmetic",
      "track": "mathematics",
      "difficulty": 1
    }
  ],
  "edges": [
    {
      "from": "CN01",
      "to": "CN02",
      "type": "REQUIRES_TO"
    }
  ],
  "userTracks": ["Math"],
  "learningPaths": [
    {
      "code": "Math",
      "title": "Mathematics Fundamentals",
      "progress": 50
    }
  ]
}
```

---

### GET /concepts/{id}

Get detailed information about a single concept, including its prerequisites, dependents, and related concepts.

**Full URL:** `http://localhost:8084/api/student/concepts/{id}`  
**Auth required:** Yes — `Authorization: Bearer <token>`  
**Path parameter:** `id` — concept ID (e.g. `CN05`, `GEO03`)

**Request body:** None

**Success response (200):**
```json
{
  "id": "CN05",
  "name": "Algebraic Foundations",
  "description": "Equations, Variables, Expressions, Inequalities",
  "subtrack": "algebra",
  "track": "mathematics",
  "difficulty": 4,
  "prerequisites": [
    { "id": "CN04", "name": "Integers and Ratios", "difficulty": 3 }
  ],
  "dependents": [
    { "id": "CN06", "name": "Powers and Roots", "difficulty": 3 }
  ],
  "related": [
    { "id": "CN07", "name": "Linear Functions", "difficulty": 4 }
  ]
}
```

---

## Content Nodes and Notes

### GET /nodes/{nodeId}

Get the full content (concept metadata + content blocks) for a specific node.

**Full URL:** `http://localhost:8084/api/student/nodes/{nodeId}`  
**Auth required:** Yes — `Authorization: Bearer <token>`  
**Path parameter:** `nodeId` — e.g. `CN11`, `GEO01`

**Request body:** None

**Success response (200):**
```json
{
  "concept": {
    "id": "CN11",
    "name": "Limits and Derivatives",
    "description": "Calculus — the study of continuous change",
    "subtrack": "calculus",
    "track": "mathematics",
    "difficulty": 5,
    "prerequisites": [
      { "id": "CN10", "name": "Exponentials and Logarithms", "difficulty": 4 }
    ],
    "dependents": [],
    "related": []
  },
  "content": {
    "id": "<ObjectId>",
    "nodeId": "CN11",
    "estimatedDurationMinutes": 30,
    "version": 1,
    "versionStatus": "PUBLISHED",
    "searchText": "Limits, Derivatives, Integral Calculus, Continuity, FTC, integration",
    "blocks": [
      {
        "type": "THEORY",
        "order": 1,
        "content": "Calculus is the study of continuous change..."
      },
      {
        "type": "EXAMPLE",
        "order": 2,
        "content": "Let's calculate the derivative of a polynomial function...",
        "question": "Find the derivative of the function f(x) = 3x^2 + 5x - 4.",
        "steps": "1. Apply the Power Rule...\n2. ...",
        "solution": "f'(x) = 6x + 5",
        "hints": [
          "Power rule: bring the exponent to the front and reduce by 1.",
          "Derivative of a constant is always zero."
        ]
      }
    ],
  }
}
```

**Error response (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Content not found for this node"
  }
}
```

---

### GET /nodes/{nodeId}/note

Get the authenticated user's personal note for a specific node.

**Full URL:** `http://localhost:8084/api/student/nodes/{nodeId}/note`  
**Auth required:** Yes — `Authorization: Bearer <token>`  
**Path parameter:** `nodeId` — e.g. `CN11`

**Request body:** None

**Success response (200):**
```json
{
  "id": "<ObjectId>",
  "userId": "<uuid>",
  "nodeId": "CN11",
  "title": "My Derivative Notes",
  "markdownContent": "## Key Takeaways\n\n- Derivatives measure instantaneous rate of change\n- Power rule: d/dx[x^n] = n*x^(n-1)",
  "tags": ["calculus", "derivatives", "review"],
}
```

**Error response (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Note not found for this user and node"
  }
}
```

---

### PUT /nodes/{nodeId}/note

Create or update the authenticated user's personal note for a specific node (upsert). One note per user per node.

**Full URL:** `http://localhost:8084/api/student/nodes/{nodeId}/note`  
**Auth required:** Yes — `Authorization: Bearer <token>`  
**Path parameter:** `nodeId` — e.g. `CN11`

**Request body** (all fields optional):
```json
{
  "title": "My Derivative Notes",
  "markdownContent": "## Key Takeaways\n\nPower rule is key.",
  "tags": ["calculus", "derivatives"]
}
```

**Success response (200):**
```json
{
  "id": "<ObjectId>",
  "userId": "<uuid>",
  "nodeId": "CN11",
  "title": "My Derivative Notes",
  "markdownContent": "## Key Takeaways\n\nPower rule is key.",
  "tags": ["calculus", "derivatives"],
}
```

---

### DELETE /nodes/{nodeId}/note

Delete the authenticated user's personal note for a specific node.

**Full URL:** `http://localhost:8084/api/student/nodes/{nodeId}/note`  
**Auth required:** Yes — `Authorization: Bearer <token>`  
**Path parameter:** `nodeId` — e.g. `CN11`

**Request body:** None

**Success response (200):**
```json
{
  "message": "Note deleted successfully"
}
```

**Error response (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Note not found for this user and node"
  }
}
```

---

## Assessments

### GET /assessments

List all available assessments.

**Full URL:** `http://localhost:8084/api/student/assessments`  
**Auth required:** Yes — `Authorization: Bearer <token>`

**Request body:** None

**Success response (200):**
```json
[
  {
    "id": "<ObjectId>",
    "contextType": "QUIZ",
    "title": "Diagnostic Assessment: Foundations of Algebra",
    "state": "active",
    "targetNodes": ["CN04", "CN05", "CN06", "CN07", "CN08", "CN09", "CN10"],
    "difficultyLevel": 5,
    "timeLimitMinutes": 30,
    "passingScore": 70,
    "maxAttempts": 3,
  }
]
```

---

### GET /assessments/{id}

Get a single assessment with all its questions.

**Full URL:** `http://localhost:8084/api/student/assessments/{id}`  
**Auth required:** Yes — `Authorization: Bearer <token>`  
**Path parameter:** `id` — assessment ObjectId

**Request body:** None

**Success response (200):**
```json
{
  "assessment": {
    "id": "<ObjectId>",
    "contextType": "QUIZ",
    "title": "Diagnostic Assessment: Foundations of Algebra",
    "state": "active",
    "targetNodes": ["CN04", "CN05", "CN06", "CN07", "CN08", "CN09", "CN10"],
    "difficultyLevel": 5,
    "timeLimitMinutes": 30,
    "passingScore": 70,
    "maxAttempts": 3,
  },
  "questions": [
    {
      "id": "<ObjectId>",
      "evaluationId": "<ObjectId>",
      "state": "active",
      "relatedNodeId": "CN04",
      "bloomLevel": "APPLY",
      "questionType": "MULTIPLE_CHOICE",
      "data": {
        "question_text": "Evaluate the following integer expression: |{val1}| + {val2}",
        "variables": { "val1": -8, "val2": 3 },
        "options": ["11", "5", "-5", "-11"],
        "correct_answer": "11",
        "explanation": "1. Find the absolute value of -8: |-8| = 8.\n2. Add: 8 + 3 = 11."
      },
    }
  ]
}
```

**Error response (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Assessment not found"
  }
}
```

---

## Error Response Format (All Endpoints)

All errors follow the same shape:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description"
  }
}
```

**Common error codes and HTTP statuses:**

| Code               | HTTP | Description                        |
|--------------------|------|------------------------------------|
| `VALIDATION_ERROR` | 400  | Invalid request body or parameters |
| `UNAUTHORIZED`     | 401  | Missing or invalid JWT             |
| `FORBIDDEN`        | 403  | Inactive account or wrong password |
| `NOT_FOUND`        | 404  | Resource not found                 |
| `CONFLICT`         | 409  | Duplicate email or already enrolled|
| `INTERNAL_ERROR`   | 500  | Unexpected server error            |
