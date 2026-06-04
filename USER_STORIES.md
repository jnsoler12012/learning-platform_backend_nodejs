# Learning Platform — End-to-End Validation User Stories

## Overview

This document maps each user story (US) to its functional requirement (RF), describes the HTTP request, and lists the expected response and test configuration.

**Services under test:**

| Service | Base URL | Port |
|---|---|---|
| Auth | `http://localhost:8080/api/v1` | 8080 |
| Knowledge | `http://localhost:8081/api/v1` | 8081 |
| Content | `http://localhost:8082/api/v1` | 8082 |

**Shared collection variables:**

| Variable | Default | Description |
|---|---|---|
| `user_token` | _(empty)_ | JWT obtained after register/login |
| `user_id` | _(empty)_ | UUID of the test user |
| `user_email` | `testuser@test.com` | Email used for registration |
| `user_password` | `Test@123` | Password used for registration |
| `learning_path_id` | _(empty)_ | UUID of the first learning path (obtained from list) |
| `assessment_id` | `eval_math_algebra_diag` | Hardcoded assessment identifier |
| `node_id` | `CN10` | Seeded content node identifier |
| `track_name` | `Mathematics` | Seeded concept track name |
| `subtrack_name` | `Core Algebraic Spine` | Seeded concept subtrack name |

**Naming conventions:**
- `{{var}}` denotes a Postman collection variable
- All requests use `Content-Type: application/json` except where noted
- Every request includes `pm.test()` blocks that assert HTTP status and response structure

---

## RF1 — Registration and Authentication

### US-01: User registers a new account

| Field | Value |
|---|---|
| **Description** | A new user creates an account on the platform with email and password |
| **Method** | `POST` |
| **URL** | `{{auth_url}}/auth/register` |
| **Auth** | none |
| **Request body** | `{"email": "{{user_email}}", "password": "{{user_password}}"}` |
| **Expected status** | `201 Created` |
| **Response shape** | `{ token: string, user: { id, email, isActive }, roles: string[] }` |
| **Test assertions** | Status 201, `response has property token`, `response.user has property id` |
| **Side effects** | Stores `user_token` and `user_id` in collection variables |

### US-02: User logs in with correct credentials

| Field | Value |
|---|---|
| **Description** | The newly registered user logs in using the same credentials |
| **Method** | `POST` |
| **URL** | `{{auth_url}}/auth/login` |
| **Auth** | none |
| **Request body** | `{"email": "{{user_email}}", "password": "{{user_password}}"}` |
| **Expected status** | `200 OK` |
| **Response shape** | Same as US-01: `{ token, user, roles }` |
| **Test assertions** | Status 200, `response has property token` |

### US-03: Duplicate registration is rejected

| Field | Value |
|---|---|
| **Description** | An attempt to register the same email again returns a conflict error |
| **Method** | `POST` |
| **URL** | `{{auth_url}}/auth/register` |
| **Auth** | none |
| **Request body** | `{"email": "{{user_email}}", "password": "{{user_password}}"}` |
| **Expected status** | `409 Conflict` |
| **Response shape** | `{ error: { code: "CONFLICT", message: string } }` |
| **Test assertions** | Status 409, `error.code equals "CONFLICT"` |

### US-04: User updates account password

| Field | Value |
|---|---|
| **Description** | The user changes their password via the account update endpoint |
| **Method** | `PATCH` |
| **URL** | `{{auth_url}}/users/me/account` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | `{"currentPassword": "Test@123", "newPassword": "NewPass@456"}` |
| **Expected status** | `200 OK` |
| **Response shape** | `{ message: "Account updated successfully" }` |
| **Test assertions** | Status 200, `message is present` |
| **Notes** | The old JWT remains valid because JWTs are stateless |

### US-05: Login with wrong password returns 401

| Field | Value |
|---|---|
| **Description** | Attempting to log in with an incorrect password returns unauthorized |
| **Method** | `POST` |
| **URL** | `{{auth_url}}/auth/login` |
| **Auth** | none |
| **Request body** | `{"email": "{{user_email}}", "password": "wrong-password"}` |
| **Expected status** | `401 Unauthorized` |
| **Response shape** | `{ error: { code: "UNAUTHORIZED", message: string } }` |
| **Test assertions** | Status 401, `error.code equals "UNAUTHORIZED"` |

---

## RF2 — Profile and Learning Objectives

### US-06: User views their own profile

| Field | Value |
|---|---|
| **Description** | The user retrieves their profile and roles |
| **Method** | `GET` |
| **URL** | `{{auth_url}}/users/me` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `{ user: { id, email, isActive, ... }, profile: { firstName, lastName, ... }, roles: [...] }` |
| **Test assertions** | Status 200, `response has property user`, `response has property profile` |

### US-07: User updates their profile display name

| Field | Value |
|---|---|
| **Description** | The user updates their profile information (displayName) |
| **Method** | `PATCH` |
| **URL** | `{{auth_url}}/users/me` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | `{"displayName": "Test User"}` |
| **Expected status** | `200 OK` |
| **Response shape** | Updated `UserProfile` entity with `displayName: "Test User"` |
| **Test assertions** | Status 200, `displayName equals "Test User"` |

### US-08: User lists available learning paths

| Field | Value |
|---|---|
| **Description** | The user browses all available learning paths on the platform |
| **Method** | `GET` |
| **URL** | `{{auth_url}}/learning-paths` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `[ { id, code, title, description, ... }, ... ]` |
| **Test assertions** | Status 200, `response is array` |
| **Side effects** | Stores the first path's `id` as `learning_path_id` |

---

## RF3 — Navigation by Topics and Knowledge Nodes

### US-09: User lists all concepts with track filter

| Field | Value |
|---|---|
| **Description** | The user views all concepts in the knowledge graph, filtered by track |
| **Method** | `GET` |
| **URL** | `{{knowledge_url}}/concepts?track={{track_name}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `[ { id, name, description, subtrack, track, difficulty }, ... ]` |
| **Test assertions** | Status 200, `response is array` |

### US-10: User gets concept detail with relationships

| Field | Value |
|---|---|
| **Description** | The user views a single concept's full detail including prerequisites, dependents, and related concepts |
| **Method** | `GET` |
| **URL** | `{{knowledge_url}}/concepts/CN11` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `{ id, name, description, subtrack, track, difficulty, prerequisites: [...], dependents: [...], related: [...] }` |
| **Test assertions** | Status 200, `response has property prerequisites`, `response has property dependents`, `response has property related` |

### US-11: User views the full knowledge graph

| Field | Value |
|---|---|
| **Description** | The user visualises the entire knowledge graph with nodes and edges |
| **Method** | `GET` |
| **URL** | `{{knowledge_url}}/concepts/graph` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `{ nodes: [...], edges: [...] }` |
| **Test assertions** | Status 200, `response has property nodes`, `response has property edges` |

### US-12: User views knowledge graph filtered by track

| Field | Value |
|---|---|
| **Description** | The user visualises the graph restricted to a single track |
| **Method** | `GET` |
| **URL** | `{{knowledge_url}}/concepts/graph/track/{{track_name}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `{ nodes: [...], edges: [...] }` |
| **Test assertions** | Status 200, `response has property nodes`, `response has property edges` |

### US-13: User finds the shortest prerequisite path between two concepts

| Field | Value |
|---|---|
| **Description** | The user finds the shortest `REQUIRES_TO` path between two concepts in the knowledge graph |
| **Method** | `GET` |
| **URL** | `{{knowledge_url}}/concepts/graph/path/CN01/CN11` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `{ nodes: [...], edges: [...] }` — an ordered path from CN01 to CN11 |
| **Test assertions** | Status 200, `nodes array is non-empty` |

---

## RF4 — Learning Pathways and Progression Control

### US-14: User enrolls in a learning path

| Field | Value |
|---|---|
| **Description** | The user enrolls in a learning path to begin tracking their progress |
| **Method** | `POST` |
| **URL** | `{{auth_url}}/learning-paths/enroll` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | `{"learningPathId": "{{learning_path_id}}"}` |
| **Expected status** | `201 Created` |
| **Response shape** | `{ userId, learningPathId, isActive, startedAt, progressPercent, status, ... }` |
| **Test assertions** | Status 201, `response has property learningPathId`, `response has property status` |

### US-15: User lists their enrolled paths

| Field | Value |
|---|---|
| **Description** | The user views all learning paths they are enrolled in |
| **Method** | `GET` |
| **URL** | `{{auth_url}}/learning-paths/me` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `[ { enrollment: { ... }, learningPath: { ... } }, ... ]` |
| **Test assertions** | Status 200, `response is array` |

### US-16: User updates their enrollment progress

| Field | Value |
|---|---|
| **Description** | The user reports progress on their enrolled learning path |
| **Method** | `PATCH` |
| **URL** | `{{auth_url}}/learning-paths/progress` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | `{"learningPathId": "{{learning_path_id}}", "progressPercent": 50, "status": "in_progress"}` |
| **Expected status** | `200 OK` |
| **Response shape** | Updated `UserLearningPath` entity with `progressPercent: 50` |
| **Test assertions** | Status 200, `progressPercent equals 50` |

### US-17: User toggles enrollment active status

| Field | Value |
|---|---|
| **Description** | The user deactivates (pauses) their enrollment |
| **Method** | `PATCH` |
| **URL** | `{{auth_url}}/learning-paths/enrollment` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | `{"learningPathId": "{{learning_path_id}}", "isActive": false}` |
| **Expected status** | `200 OK` |
| **Response shape** | Updated `UserLearningPath` with `isActive: false` |
| **Test assertions** | Status 200, `response has property isActive` |

### US-18: User sets enrollment active status (upsert)

| Field | Value |
|---|---|
| **Description** | The user reactivates their enrollment via the upsert endpoint |
| **Method** | `PUT` |
| **URL** | `{{auth_url}}/learning-paths/enrollment` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | `{"learningPathId": "{{learning_path_id}}", "isActive": true}` |
| **Expected status** | `200 OK` |
| **Response shape** | `UserLearningPath` with `isActive: true` |
| **Test assertions** | Status 200, `response has property isActive` |

---

## RF5 — Knowledge Base Access and Interaction

### US-19: User reads content for an existing node

| Field | Value |
|---|---|
| **Description** | The user reads the learning content associated with a knowledge node |
| **Method** | `GET` |
| **URL** | `{{content_url}}/content/nodes/{{node_id}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `ContentNode` document: `{ node_id, estimated_duration_minutes, version, version_status, blocks, ... }` |
| **Test assertions** | Status 200, `response has property node_id` |

### US-20: User requests content for a non-existent node

| Field | Value |
|---|---|
| **Description** | Requesting content for an invalid node ID returns 404 |
| **Method** | `GET` |
| **URL** | `{{content_url}}/content/nodes/INVALID` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `404 Not Found` |
| **Response shape** | `{ error: { code: "NOT_FOUND", message: string } }` |
| **Test assertions** | Status 404 |

### US-21: User validates content block structure

| Field | Value |
|---|---|
| **Description** | The user reads a content node and validates that the block array has the expected structure |
| **Method** | `GET` |
| **URL** | `{{content_url}}/content/nodes/{{node_id}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | Same as US-19; `blocks` array with subdocuments containing `type` and `order` |
| **Test assertions** | Status 200, `blocks is non-empty array`, `first block has property type`, `first block has property order` |

---

## RF6 — Formative and Summative Assessments

### US-22: User lists all assessments

| Field | Value |
|---|---|
| **Description** | The user browses all available assessments |
| **Method** | `GET` |
| **URL** | `{{content_url}}/content/assessments` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `[ { _id, context_type, title, state, ... }, ... ]` |
| **Test assertions** | Status 200, `response is array` |
| **Side effects** | Uses the hardcoded `assessment_id` collection variable |

### US-23: User views an assessment with its questions

| Field | Value |
|---|---|
| **Description** | The user views a single assessment including its embedded questions |
| **Method** | `GET` |
| **URL** | `{{content_url}}/content/assessments/{{assessment_id}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | Assessment object with an additional `questions` array |
| **Test assertions** | Status 200, `response has property questions` |

### US-24: User lists questions for an assessment

| Field | Value |
|---|---|
| **Description** | The user retrieves all questions belonging to a specific assessment |
| **Method** | `GET` |
| **URL** | `{{content_url}}/content/assessments/{{assessment_id}}/questions` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `[ { evaluation_id, question_type, bloom_level, data, ... }, ... ]` |
| **Test assertions** | Status 200, `response is array` |

---

## RF7 — Markers, Notes and Summaries

### US-25: User creates/upserts a note for a node

| Field | Value |
|---|---|
| **Description** | The user writes a personal note attached to a knowledge node |
| **Method** | `PUT` |
| **URL** | `{{content_url}}/content/notes/{{node_id}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | `{"title": "My Note", "markdownContent": "# Derivatives\\n\\nKey concepts...", "tags": ["math", "calculus"]}` |
| **Expected status** | `200 OK` |
| **Response shape** | `UserNote` document: `{ user_id, node_id, title, markdown_content, tags, ... }` |
| **Test assertions** | Status 200, `response has property title` |

### US-26: User retrieves their note

| Field | Value |
|---|---|
| **Description** | The user reads the note they previously created |
| **Method** | `GET` |
| **URL** | `{{content_url}}/content/notes/{{node_id}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | Same `UserNote` document |
| **Test assertions** | Status 200, `user_id matches current user` |

### US-27: User deletes their note

| Field | Value |
|---|---|
| **Description** | The user removes their note (cleanup) |
| **Method** | `DELETE` |
| **URL** | `{{content_url}}/content/notes/{{node_id}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `{ message: "Note deleted successfully" }` |
| **Test assertions** | Status 200, `message equals "Note deleted successfully"` |

---

## RF8 — Semantic Search and Filters

### US-28: User searches concepts filtered by track

| Field | Value |
|---|---|
| **Description** | The user searches for all concepts belonging to a specific track |
| **Method** | `GET` |
| **URL** | `{{knowledge_url}}/concepts?track={{track_name}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `[ { id, name, track: "Mathematics", ... }, ... ]` |
| **Test assertions** | Status 200, `response is array`, each concept has `track` matching the query |

### US-29: User searches concepts filtered by subtrack

| Field | Value |
|---|---|
| **Description** | The user searches for concepts within a specific subtrack |
| **Method** | `GET` |
| **URL** | `{{knowledge_url}}/concepts?subtrack={{subtrack_name}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `[ { id, name, subtrack: "Core Algebraic Spine", ... }, ... ]` |
| **Test assertions** | Status 200, `response is array` |

### US-30: User filters knowledge graph by track

| Field | Value |
|---|---|
| **Description** | The user visualises the graph restricted to a single track (search use case) |
| **Method** | `GET` |
| **URL** | `{{knowledge_url}}/concepts/graph/track/{{track_name}}` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `{ nodes: [...], edges: [...] }` — only nodes/edges within the track |
| **Test assertions** | Status 200, `response has property nodes`, `response has property edges` |

---

## Cleanup

### US-31: Delete test user account

| Field | Value |
|---|---|
| **Description** | The test user deletes their account to clean up all created resources |
| **Method** | `DELETE` |
| **URL** | `{{auth_url}}/users/me` |
| **Auth** | Bearer `{{user_token}}` |
| **Request body** | none |
| **Expected status** | `200 OK` |
| **Response shape** | `{ message: "User deleted successfully" }` |
| **Test assertions** | Status 200, `message equals "User deleted successfully"` |
| **Notes** | This is a soft-delete (sets `deletedAt` and `isActive = false`). The note was already deleted in US-27. |
