
# Overview (short)

**Goal:** Use Clerk for user sign-up/sign-in, session handling in the frontend, and secure backend routes (no rolling your own JWTs). On the backend we’ll verify Clerk sessions and map Clerk users to your local `User` model (create/upsert), so you can store roles and stats.

You will:

* Add Clerk to the frontend (React + Vite)
* Add Clerk to the backend (Express)
* Create middleware to upsert Clerk users into MongoDB
* Protect API endpoints with Clerk middleware
* Optionally wire Clerk webhooks to sync user create/delete events

---

# Prerequisites

* Existing frontend (React + Vite) and backend (Node + Express + Mongoose)
* Clerk account ([https://clerk.com](https://clerk.com)) — create a project (dev and prod)
* Node environment with `npm` or `pnpm`

**Environment variable names used below (you will set these in `.env` or your host’s env):**

```env
# Frontend (vite)
VITE_CLERK_PUBLISHABLE_KEY=pk_...
VITE_CLERK_FRONTEND_API=clerk.your-frontend-domain  # optional for advanced setups

# Backend
CLERK_SECRET_KEY=sk_...        # Clerk API key / secret for server-side calls
CLERK_WEBHOOK_SECRET=whsec_... # webhook signing secret (if using webhooks)
```

---

## 1) Frontend — Add Clerk to React (Vite)

### 1.1 Install Clerk React SDK

```bash
cd frontend
npm install @clerk/clerk-react
```

### 1.2 Wrap your app with `ClerkProvider` and add UI components

**`src/main.jsx`**

```jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={clerkPublishableKey}>
    <App />
  </ClerkProvider>
);
```

### 1.3 Use Clerk UI / hooks in components

Example: Sign-in/out, protected UI, and getting user info.

**`src/components/Header.jsx`**

```jsx
import React from "react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";

export default function Header() {
  return (
    <header>
      <nav>
        <SignedIn>
          <UserButton /> {/* shows avatar + menu */}
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">Sign In / Sign Up</SignInButton>
        </SignedOut>
      </nav>
    </header>
  );
}
```

**Using user data**

```jsx
import { useUser } from "@clerk/clerk-react";

function Profile() {
  const { user } = useUser();
  return (<div>{user ? user.firstName : "Guest"}</div>);
}
```

### 1.4 Protect client routes (example)

```jsx
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

function ProtectedPage() {
  return (
    <>
      <SignedIn>
        <MyProtectedContent />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
```

**Note:** Clerk’s `SignedIn`/`SignedOut` are useful for guarding UI. Backend protection must still be enforced.

---

## 2) Backend — Verify Clerk sessions & protect routes

### 2.1 Install Clerk server SDK for Express

```bash
cd backend
npm install @clerk/express @clerk/clerk-sdk-node
```

### 2.2 Initialize the Clerk middleware

**`src/app.js`** (near top)

```js
import express from "express";
import { clerkExpressWithAuth } from "@clerk/express"; // newer name; see your installed version
// or: import { clerkMiddleware } from "@clerk/express";

const app = express();

// Add Clerk middleware BEFORE your routes
app.use(clerkExpressWithAuth()); // makes getAuth/requireAuth available
// or: app.use(clerkMiddleware());
```

> **Important:** There are slightly different exports depending on @clerk/express version. If `clerkExpressWithAuth` is not available, check `clerkMiddleware`, `withAuth`, or `requireAuth` from your installed package. The pattern below assumes `requireAuth()` or `getAuth()` is present.

### 2.3 Protect a route with `requireAuth()`

```js
import { requireAuth, getAuth } from "@clerk/express";

app.get("/api/protected", requireAuth(), (req, res) => {
  // req.auth or getAuth(req) returns { userId, sessionId }
  const { userId } = getAuth(req);
  res.json({ message: "hello", userId });
});
```

---

## 3) Upsert Clerk user into your MongoDB `User` model

You want to store extra data (role, stats). Best approach: when a user hits a protected route for first time, create a local User document mapped to Clerk's `userId`. Alternatively: handle via webhooks. Below is the **on-demand upsert** middleware approach (simple and reliable):

### 3.1 Install clerk client method (we installed `@clerk/clerk-sdk-node` above)

**`src/middleware/clerkUserSync.js`**

```js
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User.js"; // your Mongoose model
import { getAuth } from "@clerk/express";

export default async function clerkUserSync(req, res, next) {
  try {
    const auth = getAuth(req);
    if (!auth || !auth.userId) return next(); // not authenticated

    const clerkId = auth.userId;
    let user = await User.findOne({ clerkId });

    if (!user) {
      // fetch user details from Clerk
      const clerkUser = await clerkClient.users.getUser(clerkId);

      const primaryEmail = clerkUser.emailAddresses?.[0]?.emailAddress || clerkUser.primaryEmailAddress?.emailAddress;

      user = await User.create({
        clerkId,
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.fullName,
        email: primaryEmail,
        role: "student", // default; you may read metadata to set teacher/admin
      });
    }

    req.userDoc = user; // attach local user doc for controllers
    next();
  } catch (err) {
    next(err);
  }
}
```

**Usage:** Mount this middleware on routes that should have a local user. Or add it after `requireAuth()` globally for authenticated routes.

```js
import clerkUserSync from "./middleware/clerkUserSync.js";

app.use("/api", (req, res, next) => {
  // optionally run for all /api requests after clerk auth
  next();
});

// Example protected route group
app.use("/api/lessons", requireAuth(), clerkUserSync, lessonsRoutes);
```

---

## 4) Role management (teacher / admin / student)

You have two primary options:

### A) Store roles in your local DB (recommended)

* Use the `role` field in your `User` model (teacher, student, admin).
* Provide an admin UI to promote users or seed teachers manually.

### B) Use Clerk metadata to store role

* Clerk supports custom user metadata; you can set `publicMetadata` on a Clerk user and read it server-side.
* If you store roles in Clerk, reflect it into your local DB on sync.

**Example: set role during on-demand registration** (local DB approach):

```js
// admin route to set role
app.post("/api/admin/set-role", requireAuth(), async (req, res) => {
  const { targetClerkId, role } = req.body;
  // verify requester is admin first (check your local DB)
  await User.findOneAndUpdate({ clerkId: targetClerkId }, { role });
  res.json({ ok: true });
});
```

---

## 5) Optional: Clerk webhooks (create/delete/update user sync)

Use webhooks if you want server-side sync when user is created/deleted in Clerk, rather than waiting for first login.

### 5.1 Create webhook in Clerk dashboard

* Events: `user.created`, `user.deleted`, `user.updated`
* Set the webhook URL to your backend endpoint: `POST /webhooks/clerk`

### 5.2 Implement webhook handler (verify signature)

**Important:** always verify the webhook signature using Clerk's recommended method. You can use `svix` or Clerk’s SDK (check Clerk docs for current verify function). Below is an example using `svix`:

```bash
npm install svix
```

**`src/routes/webhook.routes.js`**

```js
import express from "express";
import { Webhook } from "svix";
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User.js";

const router = express.Router();

const svix = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

router.post("/clerk", express.raw({ type: "*/*" }), async (req, res) => {
  try {
    const signature = req.headers["svix-signature"] || req.headers["clerk-signature"];
    const payload = req.body; // raw body required for svix

    // verify signature (svix throws on invalid signature)
    const msg = svix.verify(payload, signature);

    // msg now contains parsed event
    const event = JSON.parse(payload.toString());

    if (event.type === "user.created") {
      const clerkUser = event.data;
      // create local user (or upsert)
      await User.create({
        clerkId: clerkUser.id,
        name: clerkUser.first_name + " " + clerkUser.last_name,
        email: clerkUser.primary_email_address,
        role: "student",
      });
    }

    if (event.type === "user.deleted") {
      await User.findOneAndDelete({ clerkId: event.data.id });
    }

    res.status(200).send("ok");
  } catch (err) {
    console.error("Webhook verify failed", err);
    res.status(400).send("invalid signature");
  }
});

export default router;
```

> **Note:** exact webhook sign header and payload format may change; check Clerk docs for the correct header name and verification function. If Clerk exposes a server SDK method to verify webhooks, prefer that.

---

## 6) Protect backend routes & use local user in controllers

Example controller that needs the local user doc:

```js
// src/controllers/lessons.controller.js
export const createLesson = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    // req.userDoc set by clerkUserSync middleware
    const author = req.userDoc;
    const lesson = await Lesson.create({
      title, content, author: author._id
    });
    res.status(201).json({ lesson });
  } catch (err) {
    next(err);
  }
};
```

---

## 7) Testing locally with Clerk

* Use Clerk **development project** (Clerk dashboard gives you dev publishable key + secret). Set these env vars locally.
* You can use Clerk’s test users in the dashboard or use the SignIn modal to create a test account.
* For integration tests (Jest + Supertest), prefer **mongodb-memory-server** and bypass Clerk by mocking the Clerk middleware or using Clerk server keys to create a test session. A practical approach:

  * Mock `requireAuth()` in tests to set `req.auth = { userId: '<test-clerk-id>' }` and call the `clerkUserSync` logic manually to create a local user in the test DB.

Example Jest mock for requireAuth:

```js
// jest.setup.js
jest.mock("@clerk/express", () => ({
  requireAuth: () => (req, res, next) => {
    req.auth = { userId: "test_clerk_user_id" };
    next();
  },
  getAuth: (req) => req.auth,
}));
```

---

## 8) Deploying Clerk-based app (production)

1. Create a **production project** in Clerk dashboard.
2. Add redirect URLs for frontend (Vercel/Netlify) and set the allowed origins.
3. Add **Publishable key** to frontend environment (VITE_CLERK_PUBLISHABLE_KEY).
4. Add **Secret key** and **Webhook signing secret** to backend environment (CLERK_SECRET_KEY, CLERK_WEBHOOK_SECRET).
5. Create webhooks in Clerk to point to your backend webhook endpoint (ensure URL is reachable and uses HTTPS).
6. In production, restrict CORS to your frontend origin.

---

## 9) Migration & Rollout notes

* You can keep existing JWT-based auth active while you integrate Clerk. Strategy:

  1. Add Clerk to frontend and backend.
  2. Add middleware to upsert Clerk users to local DB. Allow both auth methods to coexist.
  3. Gradually convert protected endpoints to `requireAuth()` and remove old JWT verification once done.
* If you rely heavily on roles, either:

  * Maintain roles locally (recommended), or
  * Use Clerk public metadata and sync to local DB.

---

## 10) Security & best practices

* **Never** expose `CLERK_SECRET_KEY` or `CLERK_WEBHOOK_SECRET` in frontend or public code.
* Always **verify webhooks** with the signing secret before processing the payload.
* Use **HTTPS** for production.
* Limit Clerk publishable key usage to frontend; keep secret key server-side.
* Implement **rate limiting** on `/api/ai/*` endpoints so the AI provider cannot be abused.

---

## 11) Example full flow (user signs up and creates a lesson)

1. User signs up in frontend via Clerk (clerk handles email verification).
2. User signs in; Clerk creates session and stores client-side cookie.
3. User requests `POST /api/lessons`.
4. Frontend sends request with cookie/session (Clerk session cookie or token).
5. Backend middleware `requireAuth()` verifies the session; `getAuth(req)` gives `userId`.
6. `clerkUserSync` sees no local user, calls `clerkClient.users.getUser(userId)`, creates local `User` doc with `clerkId` and default role.
7. Controller uses `req.userDoc` to create the lesson with `author` set to local user id.

---

## 12) Troubleshooting common issues

* **`requireAuth()` errors**: ensure Clerk middleware is mounted before routes and `CLERK_SECRET_KEY` is set.
* **No `userId` returned**: make sure the request includes Clerk session cookie or header and that the session is active.
* **Webhook signature fails**: ensure you read raw request body (use `express.raw({ type: '*/*' })`) and pass raw body into verifier.
* **Local tests failing**: mock Clerk middleware in test environment to avoid needing real Clerk sessions.

---

## 13) Helpful code snippets quick reference

### Frontend `.env`

```
VITE_CLERK_PUBLISHABLE_KEY=pk_abc123
```

### Backend `.env`

```
CLERK_SECRET_KEY=sk_abc123
CLERK_WEBHOOK_SECRET=whsec_abc123
```

### Install commands

```bash
# frontend
npm i @clerk/clerk-react

# backend
npm i @clerk/express @clerk/clerk-sdk-node
# optional for webhooks
npm i svix
```

---