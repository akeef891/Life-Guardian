# Life Guardian

Life Guardian is a modern emergency-readiness web platform that helps users prepare critical medical information, share it instantly through QR emergency cards, and trigger SOS events when urgent support is needed.

---

## Project Overview

In emergency situations, the gap between incident and response is often caused by missing information. Life Guardian reduces that gap by providing:

- A personal emergency profile
- Trusted emergency contacts
- Public QR emergency card access
- Logged SOS event foundation

The product is designed as a secure, scalable, production-style full-stack application.

---

## Problem Statement

During emergencies, first responders and bystanders often do not have immediate access to essential medical data such as blood type, allergies, medications, and trusted contact details. This delay can increase risk and reduce response effectiveness.

Life Guardian addresses this by centralizing emergency data in one platform, making it securely accessible when time matters most.

---

## Features Implemented

### Core Platform
- Clerk authentication (sign-in / sign-up)
- Protected application routes
- PostgreSQL + Prisma data layer

### Emergency Profile
- Persistent user emergency profile
- Profile form with database-backed save/load
- Data survives refresh and re-login

### Emergency Contacts
- Create, edit, delete emergency contacts
- Phone validation (international format)
- Single primary contact enforcement
- Contacts rendered in profile, dashboard, and public emergency card

### QR Emergency Card
- Secure QR token generation
- Public route `/emergency/[token]` (no auth required)
- Graceful invalid token handling
- QR generation + download support

### SOS Foundation (Phase 5)
- SOS alert event creation
- Alert record associated with authenticated user
- Default status `ACTIVE`
- SOS history on SOS page
- Recent SOS alerts summary on dashboard

---

## Tech Stack

### Frontend
- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

### Backend / Data
- Next.js Server Actions
- PostgreSQL
- Prisma ORM (Prisma v7 config)

### Authentication
- Clerk

### Utility Packages
- `qrcode` for QR image generation

---

## Installation Guide

### 1) Clone and install

```bash
git clone <your-repo-url>
cd life-guardian
npm install
```

### 2) Configure environment

Create `.env` (or update existing) with:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/life_guardian?schema=public"
NEXT_PUBLIC_APP_URL="https://my-domain.com"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
```

You can use `.env.example` as reference.

### 3) Set up database

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4) Run the app

```bash
npm run dev
```

Open the local URL shown in terminal (usually `http://localhost:3000` or next available port).

### 5) Production build check

```bash
npm run build
```

---

## Project Architecture

Life Guardian follows a modular monolith architecture optimized for startup velocity and maintainability.

### High-Level Layers

- **Presentation Layer**
  - App Router pages
  - Feature components
  - Responsive UI with Tailwind

- **Application Layer**
  - Server Actions for mutations (profile, contacts, SOS, QR token)
  - Route-level auth and guarded sections

- **Domain/Data Layer**
  - Prisma schema models (`User`, `EmergencyProfile`, `EmergencyContact`, `SOSAlert`)
  - Service/helper modules for token/profile lookups

### Route Groups

- `(marketing)` → landing and public marketing pages
- `(auth)` → Clerk sign-in / sign-up routes
- `(app)` → authenticated dashboard and product pages
- `/emergency/[token]` → public emergency card route

---

## Screenshots

> Add screenshots after each milestone. Suggested structure:

```text
docs/screenshots/
├── landing-page.png
├── sign-up.png
├── dashboard.png
├── profile-form.png
├── qr-card.png
├── public-emergency-card.png
└── sos-history.png
```

### Recommended README embeds

```md
![Landing Page](docs/screenshots/landing-page.png)
![Dashboard](docs/screenshots/dashboard.png)
![QR Card](docs/screenshots/qr-card.png)
![SOS History](docs/screenshots/sos-history.png)
```

---

## Future Roadmap

### Product
- SOS contact notification delivery integrations (future phase)
- Contact acknowledgement workflow
- Visibility controls per profile field
- Role-based family access
- Mobile-first/PWA enhancements

### Platform
- Audit/event observability improvements
- Better error telemetry and alerting
- API versioning for external integrations
- Background jobs for asynchronous processing

---

## License

This project is currently private/proprietary.

If you plan to open-source it, replace this section with your preferred license (e.g., MIT, Apache-2.0) and add a `LICENSE` file.
