# 🎓 AI-Powered Learning Companion (SDG 4: Quality Education)

### Intelligent, Personalized & Interactive Learning Platform (MERN + AI)

## 🌍 🚀 Project Overview

The **AI-Powered Learning Companion** is a comprehensive, full-stack web application built using the **MERN (MongoDB, Express.js, React.js, Node.js) stack**, designed to enhance the educational experience by integrating **artificial intelligence** with interactive learning tools. This platform is engineered to support **Sustainable Development Goal 4 (Quality Education)** by providing learners with **personalized, AI-driven educational assistance**.

## Key Features and Capabilities

### For Learners:

* **Structured Lessons:** Access curated academic content and study materials uploaded by teachers.
* **AI Tutoring & Explanations:** Receive AI-generated explanations, hints, and guidance tailored to individual learning needs.
* **Quizzes & Instant Scoring:** Take automatically generated quizzes to reinforce knowledge and track understanding.
* **Progress Tracking:** Monitor learning performance and visualize progress over time.

### For Teachers:

* **Lesson Management:** Upload, organize, and manage educational content for students.
* **AI Assistance:** Support students using AI-powered tools to enhance understanding and engagement.

### Platform Highlights:

* **Full-Stack Development:** Demonstrates end-to-end web development, including RESTful APIs, frontend interfaces, and database design.
* **Real-Time Communication:** Uses WebSockets (Socket.IO) for interactive and collaborative learning sessions.
* **AI Integration:** Leverages OpenAI models for personalized explanations, tutoring, and dynamic quiz generation.
* **Secure Authentication:** Implements user authentication and authorization to safeguard data and privacy.
* **Deployment-Ready:** Configured for production deployment with best practices in error handling, environment management, and performance optimization.
* **Comprehensive Documentation:** Complete software documentation including setup, architecture, and user guidance.

## Purpose & Impact

The platform is designed to **empower learners** by making education more **accessible, interactive, and personalized**. By harnessing the capabilities of AI, the system assists students in understanding academic concepts, reinforces learning through quizzes, and tracks progress to support informed learning decisions. Teachers can enhance their instructional delivery and provide targeted support efficiently.

---

The project includes a fully documented architecture, API specification, testing setup, deployment instructions, and a complete user guide.

---

# 📂 Table of Contents

* [✨ Features](#-features)
* [🧠 System Components](#-system-components)
* [📦 Tech Stack](#-tech-stack)
* [📁 Project Structure](#-project-structure)
* [⚙️ Installation & Setup](#️-installation--setup)

  * [Backend Setup](#backend-setup)
  * [Frontend Setup](#frontend-setup)
* [🔐 Environment Variables](#-environment-variables)
* [🧪 Testing (Unit, Integration, E2E)](#-testing-unit-integration-e2e)
* [🚀 Deployment Guide](#-deployment-guide)
* [🧭 API Documentation](#-api-documentation)
* [📚 Additional Docs](#-additional-docs)
* [🧑‍💻 Developer Notes](#-developer-notes)
* [📜 License](#-license)

---

# ✨ Features

### 🔒 Authentication

* JWT-based login & registration
* Role-based access control (Admin, Student)
* Secure password hashing

### 🎓 Lessons Module

* Create, update, read, delete lessons
* AI-generated summaries & explanations

### 📝 Quiz Module

* Quizzes linked to lessons
* Auto-graded responses
* AI-powered answer analysis & hints

### 🤖 AI Assistant

* Context-aware learning support
* Lesson explanation
* Quiz hint generation
* Student progress recommendations

### 📊 User Progress Tracking

* Quiz score history
* Lesson completion tracking

### 🧪 Full Testing Suite

* Jest unit tests
* Supertest integration tests
* Playwright E2E tests

### ⚙️ Deployment Ready

* CI/CD pipeline
* Production build optimized
* Error tracking & monitoring support

---

# 🧠 System Components

| Component         | Description                                          |
| ----------------- | ---------------------------------------------------- |
| **Frontend**      | React + Vite + Tailwind, UI for learners/instructors |
| **Backend**       | Node.js Express API for lessons, quizzes, auth, AI   |
| **Database**      | MongoDB with Mongoose schema models                  |
| **AI Service**    | OpenAI/LLM-powered responses for learning assistance |
| **Testing Layer** | Jest, Supertest, Playwright                          |
| **Deployment**    | Render / Vercel / Railway / Docker                   |

---

# 📦 Tech Stack

### **Frontend**

* React.js
* Vite
* Tailwind CSS
* React Query
* Axios

### **Backend**

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication
* Morgan, Helmet, CORS

### **AI**

* OpenAI API (or LLM provider)

### **Testing**

* Jest
* Supertest
* Playwright

### **DevOps**

* GitHub Actions CI/CD
* Docker (optional)
* Production deployments (Render / Vercel)

---

# 📁 Project Structure

```
backend/
│── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── models/
│   ├── tests/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│── .env
│── package.json

frontend/
│── src/
│   ├── components/
│   ├── pages/
│   ├── routes/
│   ├── context/
│   ├── hooks/
│── .env
│── package.json

docs/
│── README.md
│── USER_GUIDE.md
│── ARCHITECTURE.md
│── API_DOCUMENTATION
```

---

# ⚙️ Installation & Setup

---

## 🖥 Backend Setup

```bash
cd backend
npm install
```

### Start development server

```bash
npm run dev
```

### Build production server

```bash
npm run build
npm start
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
```

### Start dev server

```bash
npm run dev
```

### Build production version

```bash
npm run build
```

---

# 🔐 Environment Variables

Create **backend/.env**:

```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

Create **frontend/.env**:

```
VITE_API_URL=http://localhost:5000/api
VITE_OPENAI_ENABLED=true
```

---

# 🧪 Testing (Unit, Integration, E2E)

### ✔ Unit Tests (Jest)

```bash
npm run test
```

### ✔ Integration Tests (Supertest)

```bash
npm run test:integration
```

### ✔ End-to-End Tests (Playwright)

```bash
npx playwright test
```

All tests are located inside:

```
backend/src/tests/
frontend/tests/
```

---

# 🚀 Deployment Guide

Supported deployment targets:

### **Backend**

* Render
* Railway
* Docker
* AWS EC2
* Heroku (if enabled)

### **Frontend**

* Vercel
* Netlify
* Render static hosting

# 🚀 Production

The project is live on:

Backend: https://mern-final-project-backend-ws4x.onrender.com
Frontend: https://mern-final-project-frontend-phi.vercel.app/

### **CI/CD Pipeline (GitHub Actions)**

The project includes:

* Code checkout
* Install dependencies
* Run tests
* Build app
* Auto-deploy to Render/Vercel

### **Monitoring / Logs**

Recommended tools:

* Logtail / BetterStack
* Sentry for error tracking
* UptimeRobot

---

# 🧭 API Documentation

Full OpenAPI spec located at:

```
docs/API_DOCUMENTATION.yml
```

Example:

* `POST /api/auth/register`
* `POST /api/auth/login`
* `GET /api/lessons`
* `POST /api/lessons`
* `POST /api/quiz/submit`
* `POST /api/ai/ask`

---

# 📚 Additional Docs

The project also includes:

### 📘 **USER_GUIDE.md**

For end-users (students & instructors)

### 🏗 **ARCHITECTURE.md**

Complete system architecture breakdown

* ER diagrams
* Sequence diagrams
* API flow
* Frontend/Backend integration

### 🔌 **API_DOCUMENTATION.yml**

OpenAPI 3.0 spec for Postman / Swagger

---

# 🧑‍💻 Developer Notes

* Follow MVC pattern for backend
* Use React Query for data fetching
* Use Tailwind + shadcn/ui for UI
* Ensure `.env` files are NOT pushed to GitHub
* Run tests before pushing to main

---

# 🙌 Acknowledgements

* United Nations Sustainable Development Goals
* Clerk for Authentication
* OpenAI Language Models
* MongoDB Atlas
* Vercel & Render Deployment Tools

# 👨‍💻 **Author**

**Richard Wambua**
Full Stack Developer

📧 Email: wambuarichard335@gmai.com
🔗 LinkedIn: https://www.linkedin.com/in/richard-wambua-48568817b
🔗 Portfolio: *portfolio link*
