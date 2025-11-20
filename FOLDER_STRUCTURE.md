# Optimized Project Folder Structure

ai-learning-companion/
│
├── API.md
├── ARCHITECTURE.md
├── backend
│   ├── babel.config.js
│   ├── jest.config.mjs
│   ├── package.json
│   ├── package-lock.json
│   └── src
│       ├── app.js
│       ├── controllers
│       │   ├── ai.controller.js
│       │   ├── auth.controller.js
│       │   ├── lesson.controller.js
│       │   └── quiz.controller.js
│       ├── middleware
│       │   ├── auth.middleware.js
│       │   ├── errorHandler.js
│       │   ├── role.middleware.js
│       │   └── validate.js
│       ├── models
│       │   ├── Lesson.js
│       │   ├── Quiz.js
│       │   └── User.js
│       ├── routes
│       │   ├── ai.routes.js
│       │   ├── auth.routes.js
│       │   ├── lesson.routes.js
│       │   └── quiz.routes.js
│       ├── server.js
│       ├── services
│       │   └── ai.service.js
│       ├── tests
│       │   ├── ai.test.js
│       │   ├── auth.test.js
│       │   ├── lessons.test.js
│       │   ├── quiz.test.js
│       │   └── setup.js
│       └── utils
│           ├── generateToken.js
│           └── generateToken.test.js
├── BLUEPRINT.md
├── CLERK_AUTH.md
├── FOLDER_STRUCTURE.md
├── frontend
│   ├── e2e
│   │   ├── accessibility.spec.js
│   │   ├── lessons.spec.js
│   │   └── login.spec.js
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.js
│   ├── public
│   │   └── vite.svg
│   ├── README.md
│   ├── src
│   │   ├── api
│   │   │   └── axiosClient.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   ├── LessonCard.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.test.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks
│   │   │   └── useSocket.js
│   │   ├── index.css
│   │   ├── lib
│   │   │   └── api.js
│   │   ├── main.jsx
│   │   ├── pages
│   │   │   ├── Chat.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LessonDetails.jsx
│   │   │   ├── Lessons.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Quiz.jsx
│   │   │   └── Register.jsx
│   │   ├── routes
│   │   │   └── AppRouter.jsx
│   │   ├── services
│   │   │   └── api.js
│   │   ├── styles
│   │   │   └── index.css
│   │   └── utils
│   │       └── validators.js
│   ├── test-results
│   └── vite.config.js
├── PROJECT_PLAN.md
├── README.md
├── USER_GUIDE.md
└── Week8-Assignment.md

26 directories, 77 files