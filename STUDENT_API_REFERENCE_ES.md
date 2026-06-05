# Referencia de API para Estudiantes — Servicio Gateway

**URL Base:** `http://localhost:8084/api/student`

Todos los endpoints (excepto `/auth/login` y `/auth/register`) requieren un encabezado `Authorization: Bearer <token>`.  
El gateway reenvía las solicitudes a los servicios internos (Auth en `:8080`, Knowledge en `:8081`, Content en `:8082`).

---

## Autenticación

### POST /auth/register

Crear una nueva cuenta de estudiante.

**URL completa:** `http://localhost:8084/api/student/auth/register`  
**Autenticación requerida:** No

**Cuerpo de la solicitud:**
```json
{
  "email": "student@example.com",
  "password": "secret123",
  "firstName": "Jane",
  "lastName": "Doe"
}
```

**Respuesta exitosa (201):**
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

Autenticarse con correo electrónico y contraseña para recibir un JWT.

**URL completa:** `http://localhost:8084/api/student/auth/login`  
**Autenticación requerida:** No

**Cuerpo de la solicitud:**
```json
{
  "email": "student@example.com",
  "password": "secret123"
}
```

**Respuesta exitosa (200):**
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

Obtener el perfil del usuario autenticado, las rutas de aprendizaje en las que está inscrito y todas las rutas de aprendizaje disponibles.

**URL completa:** `http://localhost:8084/api/student/auth/me`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`

**Cuerpo de la solicitud:** Ninguno

**Respuesta exitosa (200):**
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

Actualizar los campos del perfil del usuario autenticado (nombre, avatar, idioma, etc.).

**URL completa:** `http://localhost:8084/api/student/auth/me`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`

**Cuerpo de la solicitud** (todos los campos son opcionales):
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

**Respuesta exitosa (200):**
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

Actualizar el correo electrónico y/o la contraseña del usuario autenticado. Requiere confirmación de la contraseña actual.

**URL completa:** `http://localhost:8084/api/student/auth/me/account`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`

**Cuerpo de la solicitud:**
```json
{
  "currentPassword": "oldPassword123",
  "newEmail": "newemail@example.com",
  "newPassword": "newPassword456"
}
```

**Respuesta exitosa (200)** — cuando solo cambia la contraseña:
```json
{
  "message": "Account updated successfully"
}
```

**Respuesta exitosa (200)** — cuando cambia el correo electrónico (se emite un nuevo JWT):
```json
{
  "message": "Account updated successfully",
  "token": "<new JWT>",
  "email": "newemail@example.com"
}
```

---

### DELETE /auth/me

Eliminar permanentemente la cuenta del usuario autenticado.

**URL completa:** `http://localhost:8084/api/student/auth/me`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`

**Cuerpo de la solicitud:** Ninguno

**Respuesta exitosa (200):**
```json
{
  "message": "User deleted successfully"
}
```

---

## Grafo de Conocimiento

### GET /graph

Obtener el grafo de conocimiento completo (todos los conceptos y sus relaciones), junto con las rutas en las que el usuario está inscrito y su progreso.

**URL completa:** `http://localhost:8084/api/student/graph`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`

**Cuerpo de la solicitud:** Ninguno

**Respuesta exitosa (200):**
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

Obtener el grafo de conocimiento filtrado por una ruta/curso específico, junto con el contexto de inscripción del usuario.

**URL completa:** `http://localhost:8084/api/student/graph/track/{track}`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`  
**Parámetro de ruta:** `track` — ej. `Math`, `Geometry`, `Statistics`

**Cuerpo de la solicitud:** Ninguno

**Respuesta exitosa (200):**
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

Obtener información detallada de un solo concepto, incluyendo sus prerrequisitos, dependientes y conceptos relacionados.

**URL completa:** `http://localhost:8084/api/student/concepts/{id}`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`  
**Parámetro de ruta:** `id` — ID del concepto (ej. `CN05`, `GEO03`)

**Cuerpo de la solicitud:** Ninguno

**Respuesta exitosa (200):**
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

## Nodos de Contenido y Notas

### GET /nodes/{nodeId}

Obtener el contenido completo (metadatos del concepto + bloques de contenido) para un nodo específico.

**URL completa:** `http://localhost:8084/api/student/nodes/{nodeId}`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`  
**Parámetro de ruta:** `nodeId` — ej. `CN11`, `GEO01`

**Cuerpo de la solicitud:** Ninguno

**Respuesta exitosa (200):**
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

**Respuesta de error (404):**
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

Obtener la nota personal del usuario autenticado para un nodo específico.

**URL completa:** `http://localhost:8084/api/student/nodes/{nodeId}/note`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`  
**Parámetro de ruta:** `nodeId` — ej. `CN11`

**Cuerpo de la solicitud:** Ninguno

**Respuesta exitosa (200):**
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

**Respuesta de error (404):**
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

Crear o actualizar la nota personal del usuario autenticado para un nodo específico (upsert). Una nota por usuario por nodo.

**URL completa:** `http://localhost:8084/api/student/nodes/{nodeId}/note`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`  
**Parámetro de ruta:** `nodeId` — ej. `CN11`

**Cuerpo de la solicitud** (todos los campos son opcionales):
```json
{
  "title": "My Derivative Notes",
  "markdownContent": "## Key Takeaways\n\nPower rule is key.",
  "tags": ["calculus", "derivatives"]
}
```

**Respuesta exitosa (200):**
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

Eliminar la nota personal del usuario autenticado para un nodo específico.

**URL completa:** `http://localhost:8084/api/student/nodes/{nodeId}/note`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`  
**Parámetro de ruta:** `nodeId` — ej. `CN11`

**Cuerpo de la solicitud:** Ninguno

**Respuesta exitosa (200):**
```json
{
  "message": "Note deleted successfully"
}
```

**Respuesta de error (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Note not found for this user and node"
  }
}
```

---

## Evaluaciones

### GET /assessments

Listar todas las evaluaciones disponibles.

**URL completa:** `http://localhost:8084/api/student/assessments`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`

**Cuerpo de la solicitud:** Ninguno

**Respuesta exitosa (200):**
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

Obtener una evaluación individual con todas sus preguntas.

**URL completa:** `http://localhost:8084/api/student/assessments/{id}`  
**Autenticación requerida:** Sí — `Authorization: Bearer <token>`  
**Parámetro de ruta:** `id` — ObjectId de la evaluación

**Cuerpo de la solicitud:** Ninguno

**Respuesta exitosa (200):**
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

**Respuesta de error (404):**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Assessment not found"
  }
}
```

---

## Formato de Respuesta de Error (Todos los Endpoints)

Todos los errores siguen la misma estructura:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description"
  }
}
```

**Códigos de error comunes y estados HTTP:**

| Code               | HTTP | Descripción                                    |
|--------------------|------|------------------------------------------------|
| `VALIDATION_ERROR` | 400  | Cuerpo de solicitud o parámetros inválidos     |
| `UNAUTHORIZED`     | 401  | JWT faltante o inválido                        |
| `FORBIDDEN`        | 403  | Cuenta inactiva o contraseña incorrecta        |
| `NOT_FOUND`        | 404  | Recurso no encontrado                          |
| `CONFLICT`         | 409  | Correo duplicado o ya inscrito                 |
| `INTERNAL_ERROR`   | 500  | Error inesperado del servidor                  |
