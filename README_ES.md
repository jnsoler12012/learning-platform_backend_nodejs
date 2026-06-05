# Referencia de Endpoints de la API

## Instalación

```bash
# Instalar todas las dependencias del workspace
pnpm install

# Generar el cliente de Prisma (servicio auth)
pnpm db:generate

# Ejecutar migraciones de base de datos (servicio auth — PostgreSQL)
pnpm db:push

# Sembrar todos los servicios

# Auth (PostgreSQL + Prisma)
cd packages/auth && node prisma/seed.js

# Knowledge (Neo4j)
cd packages/knowledge && node scripts/seed.js

# Content (MongoDB)
cd packages/content && node scripts/seed.js
```

Luego iniciar los servicios (cada uno en su propia terminal, o usar el script de desarrollo paralelo):

```bash
# Los tres a la vez
pnpm dev

# O individualmente
cd packages/auth      && node server.js    # puerto 8080
cd packages/knowledge && node server.js    # puerto 8081
cd packages/content   && node server.js    # puerto 8082
```

---

## Servicio Auth — `http://localhost:8080/api/v1`

### `POST /auth/register`

Crear una nueva cuenta de estudiante.

**Autenticación:** ninguna

**Cuerpo de la solicitud:**

```json
{
  "email": "student@example.com",
  "password": "MyPassword123",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Respuesta `201 Created`:**

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

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `400` | `VALIDATION_ERROR` | Falta el email/contraseña o son inválidos |
| `409` | `CONFLICT` | El email ya está registrado |

---

### `POST /auth/login`

Autenticarse con correo electrónico y contraseña.

**Autenticación:** ninguna

**Cuerpo de la solicitud:**

```json
{
  "email": "student@example.com",
  "password": "MyPassword123"
}
```

**Respuesta `200 OK`:**

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

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `401` | `UNAUTHORIZED` | Email o contraseña inválidos |
| `403` | `FORBIDDEN` | La cuenta está inactiva |

---

### `GET /users/me`

Obtener el perfil completo del usuario autenticado, incluidos sus roles.

**Autenticación:** Bearer token

**Respuesta `200 OK`:**

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

Actualizar los campos del perfil del usuario autenticado.

**Autenticación:** Bearer token

**Cuerpo de la solicitud (todos opcionales):**

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

**Respuesta `200 OK`:** Devuelve el objeto de perfil actualizado:

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

Actualizar las credenciales de la cuenta (email y/o contraseña).

**Autenticación:** Bearer token

**Cuerpo de la solicitud:**

```json
{
  "currentPassword": "MyPassword123",
  "newEmail": "jane.smith@example.com",
  "newPassword": "NewSecurePass456"
}
```

Tanto `newEmail` como `newPassword` son opcionales (al menos uno debe ser proporcionado).

**Respuesta `200 OK` (solo cambió la contraseña):**

```json
{
  "message": "Account updated successfully"
}
```

**Respuesta `200 OK` (cambió el email — se devuelve un nuevo JWT):**

```json
{
  "message": "Account updated successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "email": "jane.smith@example.com"
}
```

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `403` | `FORBIDDEN` | La contraseña actual es incorrecta |
| `409` | `CONFLICT` | El nuevo email ya está en uso |

---

### `DELETE /users/me`

Eliminar la cuenta del usuario autenticado.

**Autenticación:** Bearer token

**Respuesta `200 OK`:**

```json
{
  "message": "User deleted successfully"
}
```

---

### `GET /learning-paths`

Listar todas las rutas de aprendizaje disponibles.

**Autenticación:** Bearer token

**Respuesta `200 OK`:**

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

Inscribir al usuario autenticado en una ruta de aprendizaje.

**Autenticación:** Bearer token

**Cuerpo de la solicitud:**

```json
{
  "learningPathId": "lp-uuid-1"
}
```

**Respuesta `201 Created`:**

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

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `404` | `NOT_FOUND` | Ruta de aprendizaje o usuario no encontrado |
| `409` | `CONFLICT` | Ya está inscrito |

---

### `GET /learning-paths/me`

Listar las rutas de aprendizaje en las que el usuario autenticado está inscrito, con su progreso.

**Autenticación:** Bearer token

**Respuesta `200 OK`:**

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

Actualizar el progreso y/o el estado de una inscripción.

**Autenticación:** Bearer token

**Cuerpo de la solicitud:**

```json
{
  "learningPathId": "lp-uuid-1",
  "progressPercent": 50,
  "status": "in_progress"
}
```

`progressPercent` y `status` son opcionales. Establecer `progressPercent >= 100` completa automáticamente la inscripción.

**Respuesta `200 OK`:**

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

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `404` | `NOT_FOUND` | Inscripción no encontrada |
| `409` | `CONFLICT` | La ruta ya fue completada |

---

### `PATCH /learning-paths/enrollment`

Cambiar el estado activo de una inscripción existente.

**Autenticación:** Bearer token

**Cuerpo de la solicitud:**

```json
{
  "learningPathId": "lp-uuid-1",
  "isActive": false
}
```

**Respuesta `200 OK`:**

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

Crear o actualizar el estado activo de una inscripción (upsert). Si no existe una inscripción, se crea una nueva.

**Autenticación:** Bearer token

**Cuerpo de la solicitud:**

```json
{
  "learningPathId": "lp-uuid-1",
  "isActive": true
}
```

**Respuesta `200 OK`:**

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

## Servicio Knowledge — `http://localhost:8081/api/v1`

### `GET /concepts`

Listar todos los conceptos, opcionalmente filtrados por track y/o subtrack.

**Autenticación:** Bearer token  
**Permiso:** `learning-path.read`

**Parámetros de consulta (todos opcionales):**

| Parámetro | Ejemplo | Descripción |
|-----------|---------|-------------|
| `track` | `Mathematics` | Filtrar por nombre de track |
| `subtrack` | `Core Algebraic Spine` | Filtrar por nombre de subtrack |

**Solicitud:** `GET /concepts?track=Mathematics`

**Respuesta `200 OK`:**

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

Obtener un solo concepto con sus prerrequisitos, dependientes y conceptos relacionados.

**Autenticación:** Bearer token  
**Permiso:** `learning-path.read`

**Solicitud:** `GET /concepts/CN10`

**Respuesta `200 OK`:**

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

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `404` | `NOT_FOUND` | El concepto no existe |

---

### `GET /concepts/:id/prerequisites`

Listar los conceptos prerrequisito (relaciones `REQUIRES_TO` entrantes).

**Autenticación:** Bearer token  
**Permiso:** `learning-path.read`

**Solicitud:** `GET /concepts/CN10/prerequisites`

**Respuesta `200 OK`:**

```json
[
  { "id": "CN06", "name": "Powers, Roots & Scientific Notation", "difficulty": 5 },
  { "id": "CN09", "name": "Advanced Functions & Rational Graphs", "difficulty": 8 }
]
```

---

### `GET /concepts/:id/dependents`

Listar los conceptos dependientes (relaciones `REQUIRES_TO` salientes).

**Autenticación:** Bearer token  
**Permiso:** `learning-path.read`

**Solicitud:** `GET /concepts/CN10/dependents`

**Respuesta `200 OK`:**

```json
[
  { "id": "CN11", "name": "Limits, Derivatives & Integral Calculus", "difficulty": 10 }
]
```

---

### `GET /concepts/:id/related`

Listar los conceptos relacionados (relaciones bidireccionales `RELATES_TO`).

**Autenticación:** Bearer token  
**Permiso:** `learning-path.read`

**Solicitud:** `GET /concepts/CN10/related`

**Respuesta `200 OK`:**

```json
[
  { "id": "STAT02", "name": "Theoretical & Applied Probability", "difficulty": 6 }
]
```

---

### `GET /concepts/graph`

Devolver el grafo de conocimiento completo como nodos y aristas.

**Autenticación:** Bearer token

**Respuesta `200 OK`:**

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

Devolver el grafo de conocimiento filtrado por un track específico.

**Autenticación:** Bearer token

**Solicitud:** `GET /concepts/graph/track/Mathematics`

**Respuesta `200 OK`:**

```json
{
  "nodes": [ /* solo conceptos de Mathematics */ ],
  "edges": [ /* solo aristas entre conceptos de Mathematics */ ]
}
```

---

### `GET /concepts/graph/path/:from/:to`

Encontrar la ruta más corta (`REQUIRES_TO`) entre dos conceptos.

**Autenticación:** Bearer token

**Solicitud:** `GET /concepts/graph/path/CN01/CN10`

**Respuesta `200 OK`:**

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

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `404` | `NOT_FOUND` | No existe una ruta entre los conceptos especificados |

---

## Servicio Content — `http://localhost:8082/api/v1`

### `GET /content/nodes/:nodeId`

Obtener los bloques de contenido de un nodo de conocimiento.

**Autenticación:** Bearer token  
**Permiso:** `content.read`

**Solicitud:** `GET /content/nodes/CN10`

**Respuesta `200 OK`:**

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
}
```

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `404` | `NOT_FOUND` | No existe contenido para este nodo |

---

### `PUT /content/notes/:nodeId`

Crear o actualizar (upsert) la nota personal del usuario autenticado para un nodo de conocimiento.

**Autenticación:** Bearer token  
**Permiso:** `notes.write`

**Cuerpo de la solicitud:**

```json
{
  "title": "Exponential Functions Summary",
  "markdownContent": "# Key Points\n\n- Exponential: f(x) = a · b^x\n- Logarithm is the inverse\n- Used for modeling growth/decay",
  "tags": ["math", "exponential", "algebra"]
}
```

**Respuesta `200 OK`:**

```json
{
  "_id": "669c...",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "node_id": "CN10",
  "title": "Exponential Functions Summary",
  "markdown_content": "# Key Points\n\n- Exponential: f(x) = a · b^x\n- Logarithm is the inverse\n- Used for modeling growth/decay",
  "tags": ["math", "exponential", "algebra"],
}
```

---

### `GET /content/notes/:nodeId`

Obtener la nota del usuario autenticado para un nodo de conocimiento.

**Autenticación:** Bearer token  
**Permiso:** `notes.read`

**Solicitud:** `GET /content/notes/CN10`

**Respuesta `200 OK`:**

```json
{
  "_id": "669c...",
  "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "node_id": "CN10",
  "title": "Exponential Functions Summary",
  "markdown_content": "# Key Points\n\n- Exponential: f(x) = a · b^x\n- Logarithm is the inverse\n- Used for modeling growth/decay",
  "tags": ["math", "exponential", "algebra"],
}
```

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `404` | `NOT_FOUND` | No existe una nota para este usuario y nodo |

---

### `DELETE /content/notes/:nodeId`

Eliminar la nota del usuario autenticado para un nodo de conocimiento.

**Autenticación:** Bearer token  
**Permiso:** `notes.write`

**Solicitud:** `DELETE /content/notes/CN10`

**Respuesta `200 OK`:**

```json
{
  "message": "Note deleted successfully"
}
```

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `404` | `NOT_FOUND` | No existe una nota para este usuario y nodo |

---

### `GET /content/assessments`

Listar todas las evaluaciones.

**Autenticación:** Bearer token  
**Permiso:** `assessment.read`

**Respuesta `200 OK`:**

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
  }
]
```

---

### `GET /content/assessments/:id`

Obtener una evaluación individual con sus preguntas incorporadas.

**Autenticación:** Bearer token  
**Permiso:** `assessment.read`

**Solicitud:** `GET /content/assessments/eval_math_algebra_diag`

**Respuesta `200 OK`:**

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
    }
  ]
}
```

**Errores:**

| Estado | Código | Cuándo |
|--------|--------|--------|
| `404` | `NOT_FOUND` | La evaluación no existe |

---

### `GET /content/assessments/:id/questions`

Listar todas las preguntas pertenecientes a una evaluación.

**Autenticación:** Bearer token  
**Permiso:** `assessment.read`

**Solicitud:** `GET /content/assessments/eval_math_algebra_diag/questions`

**Respuesta `200 OK`:**

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

## Referencia de Permisos del Estudiante

| Permiso | Endpoints |
|---------|-----------|
| `user.read` | `GET /users/me` |
| `learning-path.read` | `GET /concepts`, `GET /concepts/:id`, `GET /concepts/:id/prerequisites`, `GET /concepts/:id/dependents`, `GET /concepts/:id/related` |
| `learning-path.enroll` | `POST /learning-paths/enroll` |
| `content.read` | `GET /content/nodes/:nodeId` |
| `notes.read` | `GET /content/notes/:nodeId` |
| `notes.write` | `PUT /content/notes/:nodeId`, `DELETE /content/notes/:nodeId` |
| `assessment.read` | `GET /content/assessments`, `GET /content/assessments/:id`, `GET /content/assessments/:id/questions` |
| `assessment.attempt` | |

Los endpoints que solo usan `authMiddleware` (sin verificación de permiso) están disponibles para cualquier usuario autenticado: `GET /learning-paths`, `GET /learning-paths/me`, `PATCH /learning-paths/progress`, `PATCH /learning-paths/enrollment`, `PUT /learning-paths/enrollment`, `GET /concepts/graph`, `GET /concepts/graph/track/:track`, `GET /concepts/graph/path/:from/:to`.
