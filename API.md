# 📘 AI-Powered Learning Companion — API Documentation

Welcome to the **API Documentation** for the **AI-Powered Learning Companion**, a MERN-based platform designed to support **SDG 4: Quality Education** by providing personalized learning assistance, AI‑powered tutoring, quizzes, progress tracking, and curriculum‑based content.

This documentation includes:

* Overview of architecture
* Authentication system
* All API endpoints (Users, Learning Content, Quizzes, AI Tutor, Progress, Admin)
* Request/response examples
* Error handling
* Status codes
* Security considerations

---

# 🧱 1. Overview

The backend is built with:

* **Node.js + Express.js**
* **MongoDB + Mongoose**
* **Clerk Authentication (JWT verification)**
* **OpenAI API for AI tutoring**

Base URL (Production):

```
https://mern-final-project-backend-6jkv.onrender.com
```

---

# 🔐 2. Authentication

Authentication is handled using **Clerk JWT tokens**.

### ✔️ Required Header for Protected Routes

```
Authorization: Bearer <token>
```

### ✔️ Middleware Used

* `requireAuth` — verifies Clerk token
* Extracts `userId`, `email`, and creates/updates user in DB

---

# 👤 3. User Endpoints

## **POST /auth/register**

Registers a new user.

### Request Body

```json
{
  "fullName": "Richard Wambua",
  "email": "wambua@example.com"
}
```

### Response

```json
{
  "message": "User created successfully",
  "user": { "id": "678abc123", "email": "wambua@example.com" }
}
```

---

## **GET /user/profile** *(protected)*

Returns logged-in user's profile.

### Response

```json
{
  "id": "678abc123",
  "fullName": "Richard Wambua",
  "email": "wambua@example.com",
  "learningLevel": "Form 2",
  "createdAt": "2025-01-01"
}
```

---

# 📚 4. Learning Content Endpoints

Content includes lessons, notes, explanations, and exercises mapped to the Kenyan curriculum.

## **GET /content**

Fetch all available lessons.

### Query Params

| Param        | Description         |
| ------------ | ------------------- |
| `subject`    | e.g., "Mathematics" |
| `classLevel` | e.g., "Grade 7"     |

### Response

```json
[
  {
    "id": "1",
    "title": "Introduction to Algebra",
    "subject": "Mathematics",
    "classLevel": "Grade 7",
    "summary": "Basics of variables and expressions"
  }
]
```

---

## **GET /content/:id**

Get full lesson details.

### Response

```json
{
  "id": "1",
  "title": "Introduction to Algebra",
  "content": "Algebra is the study of...",
  "examples": ["x + 3 = 7", "2y - 4 = 10"]
}
```

---

# 🧠 5. AI Tutor Endpoints (OpenAI-Powered)

## **POST /ai/ask**

Allows the student to ask the AI a learning question.

### Request Body

```json
{
  "question": "Explain photosynthesis in simple terms"
}
```

### Response

```json
{
  "answer": "Photosynthesis is the process where plants make food using sunlight..."
}
```

---

## **POST /ai/explain**

Generates step-by-step explanations.

### Request Body

```json
{
  "topic": "Quadratic equations"
}
```

### Response

```json
{
  "steps": [
    "1. Identify a, b, c",
    "2. Use the formula x = (-b ± √(b² - 4ac)) / 2a"
  ]
}
```

---

## **POST /ai/practice**

AI generates practice questions.

### Request Body

```json
{
  "subject": "Math",
  "difficulty": "easy"
}
```

### Response

```json
{
  "questions": [
    "What is 7 × 8?",
    "Solve for x: x + 5 = 12"
  ]
}
```

---

# 📝 6. Quiz Endpoints

## **POST /quiz/create** *(admin only)*

Create a quiz manually.

### Request Body

```json
{
  "title": "Algebra Basics Quiz",
  "questions": [
    {
      "question": "Solve x + 5 = 10",
      "options": ["3", "5", "10"],
      "answer": "5"
    }
  ]
}
```

---

## **GET /quiz/:id**

Fetch quiz details.

---

## **POST /quiz/submit**

Student submits a quiz.

### Request Body

```json
{
  "quizId": "12345",
  "answers": ["5", "12"]
}
```

### Response

```json
{
  "score": 80,
  "correctAnswers": ["5", "14"]
}
```

---

# 📊 7. Progress Tracking

## **GET /progress** *(protected)*

Get user's progress summary.

### Response

```json
{
  "examsCompleted": 12,
  "topicsMastered": 7,
  "weakAreas": ["Fractions", "Photosynthesis"]
}
```

---

## **POST /progress/update**

Updates progress automatically after quizzes.

### Response

```json
{
  "message": "Progress updated"
}
```

---

# 🛠️ 8. Admin Endpoints

Admins can:

* Add learning content
* Edit content
* Create quizzes
* Manage subjects & levels

## **POST /admin/content/create**

### Request Body

```json
{
  "title": "Pythagoras Theorem",
  "subject": "Mathematics",
  "level": "Grade 8",
  "content": "a² + b² = c²"
}
```

---

# 🚨 9. Error Handling

### Standard Error Response

```json
{
  "error": "Content not found",
  "status": 404
}
```

---

# 🔒 10. Security

* JWT verification via Clerk
* HTTPS enforced
* Rate limiting on AI routes
* Sanitized DB queries
* Admin-only protected routes

---

# 📦 11. Status Codes Summary

| Code | Meaning          |
| ---- | ---------------- |
| 200  | Success          |
| 201  | Resource created |
| 400  | Bad request      |
| 401  | Unauthorized     |
| 403  | Forbidden        |
| 404  | Not found        |
| 500  | Server error     |

---

# 🎯 End of Documentation
