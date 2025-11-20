---

# 🏗️ **ARCHITECTURE.md**

### **AI-Powered Learning Companion**

*A Scalable, Secure, and AI-Driven Learning Platform*

---

## 📘 **Table of Contents**

1. [Overview](#overview)
2. [System Architecture Diagram](#system-architecture-diagram)
3. [High-Level Architecture](#high-level-architecture)
4. [Backend Architecture](#backend-architecture)

   * [Core Modules](#core-modules)
   * [Controllers](#controllers)
   * [Services & Business Logic](#services--business-logic)
   * [Database Models](#database-models)
   * [Middlewares](#middlewares)
5. [Frontend Architecture](#frontend-architecture)
6. [AI Layer Architecture](#ai-layer-architecture)
7. [API Architecture](#api-architecture)
8. [Database Schema & Relationships](#database-schema--relationships)
9. [Security Architecture](#security-architecture)
10. [Testing Strategy](#testing-strategy)
11. [Deployment Architecture](#deployment-architecture)
12. [CI/CD Pipeline](#cicd-pipeline)
13. [Monitoring & Observability](#monitoring--observability)

---

# 📌 **Overview**

The **AI-Powered Learning Companion** is a full-stack MERN + AI platform designed to deliver:

* AI-assisted learning
* Interactive lessons
* Practice quizzes
* Real-time feedback
* Personalized progress insights

The architecture is designed to be **modular, scalable, testable, and production-ready**, following best practices in:

* API design
* Security
* Cloud deployment
* Continuous integration & testing

---

# 🖼️ **System Architecture Diagram**

```
┌───────────────────────────────┐
│           Frontend            │
│  React + Vite + Tailwind CSS  │
└───────────────▲───────────────┘
                │ HTTPS
                ▼
┌───────────────────────────────┐
│            Backend            │
│       Node.js + Express       │
│   Controllers / Services /    │
│   Middlewares / Routes        │
└───────────────▲───────────────┘
                │ Mongoose ODM
                ▼
┌───────────────────────────────┐
│          MongoDB Atlas        │
│ Lessons • Quizzes • Users     │
│ Progress • AI Logs            │
└───────────────────────────────┘
                ▲
                │ API CALLS (OpenAI or LLM Provider)
                ▼
┌───────────────────────────────┐
│      AI Service Provider      │
│ GPT-Models or Alternatives    │
└───────────────────────────────┘
```

---

# 🏛️ **High-Level Architecture**

The architecture follows a **clean layered approach**:

### **1. Presentation Layer** (Frontend)

* Handles user interfaces
* Communicates with backend via REST APIs
* Manages authentication tokens
* Provides interactive UI for lessons, quizzes, AI chat

### **2. Application Layer** (Backend Controllers)

* Orchestrates incoming requests
* Validates data
* Delegates operations to services
* Returns structured JSON responses

### **3. Domain Layer** (Services)

* Business rules
* AI request orchestration
* Quiz scoring logic
* Lesson recommendations

### **4. Data Layer** (Database Models)

* MongoDB Atlas
* Mongoose schemas
* Validation & relationships

---

# 🗄️ **Backend Architecture**

Backend is located in:
`/backend/src/`

It is a **modular Express server** supporting:

* ES Modules
* Centralized error handling
* Secure request handling
* Scalable routing patterns

---

## 🔹 **Core Modules**

### **1. app.js**

Configures Express:

* CORS
* Helmet
* Morgan logging
* JSON parser
* Route mounting
* Error handler

### **2. server.js**

Handles:

* DB Connection
* Process signals
* Server startup
* Optional Socket.io integration

### **3. routes/**

Defines REST endpoints:

* `/api/auth`
* `/api/lessons`
* `/api/quiz`
* `/api/ai`

---

## 🔹 **Controllers**

Controllers coordinate HTTP logic.

| Controller               | Purpose                           |
| ------------------------ | --------------------------------- |
| **auth.controller.js**   | Signup, Login, JWT issuing        |
| **lesson.controller.js** | CRUD for lessons                  |
| **quiz.controller.js**   | Create quizzes, evaluate answers  |
| **ai.controller.js**     | AI explanations, hints, summaries |

Controllers use services to avoid heavy logic.

---

## 🔹 **Services & Business Logic**

| Service               | Responsibility                         |
| --------------------- | -------------------------------------- |
| **ai.service.js**     | Connects to OpenAI or LLM API          |
| **quiz.service.js**   | Scoring logic, randomization, feedback |
| **lesson.service.js** | Topic retrieval, recommendations       |
| **auth.service.js**   | Password hashing, token issuing        |

This separation makes the code testable and clean.

---

## 🔹 **Database Models**

The database uses MongoDB + Mongoose.

### 1. **User Model**

* name, email, role
* hashed password
* learning progress reference

### 2. **Lesson Model**

* title, content, examples
* lesson difficulty
* related quizzes

### 3. **Quiz Model**

* lessonId reference
* questions array
* answer keys
* explanations

### 4. **Progress Model**

* userId
* completed lessons
* quiz results history

---

## 🔹 **Middlewares**

| Middleware             | Purpose                     |
| ---------------------- | --------------------------- |
| **auth.js**            | Protects routes using JWT   |
| **validateRequest.js** | Input validation            |
| **errorHandler.js**    | Centralized error response  |
| **rateLimiter.js**     | Prevent brute force attacks |
| **helmet + CORS**      | Security configurations     |

---

# 🎨 **Frontend Architecture**

Frontend is built with:

* **React.js**
* **Vite**
* **Tailwind CSS**
* **React Query or Axios**
* **Context API or Zustand** for state

### Key Features:

* Reusable components
* Light/dark mode
* Mobile-first responsive layout
* Protected routes
* AI chat interface

---

# 🧠 **AI Layer Architecture**

The AI layer is isolated in:
`src/services/ai.service.js`

### Responsibilities:

* Handling LLM provider authentication
* Generating explanations
* Summaries / Simplified versions
* Quiz feedback
* Personalized learning recommendations

AI requests are logged for:

* Monitoring
* Abuse detection
* Analytics

---

# 🌐 **API Architecture**

The backend exposes a clean REST API:

| Endpoint Group | Path           |
| -------------- | -------------- |
| Authentication | `/api/auth`    |
| Lessons        | `/api/lessons` |
| Quizzes        | `/api/quiz`    |
| AI             | `/api/ai`      |

The API follows:

* REST principles
* Meaningful HTTP status codes
* Consistent response shape
* JWT-based authentication

Example response structure:

```json
{
  "success": true,
  "data": { ... },
  "message": "Lesson retrieved successfully"
}
```

---

# 🗃️ **Database Schema & Relationships**

```
User
 ├── id
 ├── name
 ├── email
 ├── password
 └── progress → Progress

Lesson
 ├── id
 ├── title
 ├── content
 ├── difficulty
 └── quizzes[] → Quiz

Quiz
 ├── id
 ├── lessonId → Lesson
 ├── questions[]
 └── answers[]

Progress
 ├── id
 ├── userId → User
 ├── lessonsCompleted[]
 └── quizResults[]
```

---

# 🔐 **Security Architecture**

The platform uses a **defense-in-depth** approach:

### Application-Level:

* Helmet for secure headers
* CORS restrictions
* Brute-force protection with rate limiting

### Authentication:

* JWT-based auth
* Token expiry & refresh logic
* Hashed passwords (bcrypt)

### Data:

* No plain-text passwords
* Encrypted environment variables
* Input validation using middleware

### Deployment:

* HTTPS only
* Secure CI/CD secrets
* MongoDB Atlas network rules

---

# 🧪 **Testing Strategy**

Testing supports **Task 4 requirements**.

### Layers:

| Test Type         | Tools                 | What is Tested         |
| ----------------- | --------------------- | ---------------------- |
| Unit Tests        | Jest                  | Services, utilities    |
| Integration Tests | Supertest + Jest      | Controllers, endpoints |
| End-to-End (E2E)  | Playwright or Cypress | Full user flows        |
| Manual Testing    | Browsers & devices    | UI and responsiveness  |

CI/CD ensures tests run automatically.

---

# 🚀 **Deployment Architecture**

Deployment follows a **multi-stage** flow:

### **Backend Deployment**

* Node.js server containerized
* Deployed to:

  * Railway / Render / AWS / Azure / DigitalOcean
* Env variables stored securely

### **Frontend Deployment**

* Build static Vite assets
* Deploy to:

  * Netlify / Vercel / AWS S3

### **Database Deployment**

* MongoDB Atlas (Dedicated Cluster recommended)

### **AI Provider**

* OpenAI or compatible LLM endpoint

---

# 🔄 **CI/CD Pipeline**

A GitHub Actions pipeline handles:

### On Every Push:

* Install dependencies
* Run unit + integration tests
* Lint code
* Build frontend
* Build backend

### On main branch merge:

* Auto-deployment
* API health checks
* Rollback on failure

---

# 🔍 **Monitoring & Observability**

Production system includes:

### Logging:

* Morgan request logs
* Winston for error logs
* AI usage logs

### Monitoring:

* Uptime Robot / Pingdom
* Vercel / Netlify dashboards
* Railway / Render logs

### Error Tracking:

* Sentry (optional)

---

# 🏁 **End of Architecture File**
