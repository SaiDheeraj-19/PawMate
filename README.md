# PawMate: Premium Pet Matchmaking 🐾

A high-quality, secure Next.js 14 full-stack application built for a curated pet companionship experience, focusing on community pairing and wellness management.

## Tech Stack
- Frontend: Next.js 14 (App Router), React, Tailwind CSS, Framer Motion
- Backend: Next.js Server Actions, Supabase (PostgreSQL, Auth, Realtime)
- ORM: Prisma
- Email: Resend

## Setup Instructions

### 1. Repository Setup
Clone the repository to your local machine:
```bash
git clone https://github.com/SaiDheeraj-19/PawMate.git
cd PawMate
```

### 2. Environment Variables Setup
Copy the safe template variable file explicitly:
```bash
cp .env.example .env
```
Populate the missing values with your specific service provider tokens:
- `NEXT_PUBLIC_SUPABASE_URL`: Setup a Supabase project and find your API URL under Project Settings -> API.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Found under Project Settings -> API in Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: Required for server-side auth/data overrides, found under Project Settings -> API.
- `DATABASE_URL`: Setup connection pooling URL under Database settings in Supabase (`postgres://user:pass@host:port/postgres`).
- `RESEND_API_KEY`: Found under your Resend Dashboard.

### 3. Database Initialization (Supabase + Prisma)
```bash
# Push schema to Supabase
npx prisma db push
```

### 4. Running Locally
Simply install packages and start the secure preview server (ensure `npm` is updated):
```bash
npm install
npm run dev
```

## Security & Deployment

### Production Deployment (Vercel)
This repository is pre-configured and strictly secured for direct deployment with Vercel.
1. Create a New Project on Vercel and link your GitHub Repo.
2. In the deployment settings, manually input all environment variables found in `.env.example`.
3. Do NOT configure or upload a raw `.env` file to your server or code hosting platform.
4. Hit **Deploy**. The pre-commit Husky hooks and lint-staged pipeline will protect from rogue secrets entering the master branch.

## Internal Branching Strategy
- `main`: Triggers automated building for Production environment. Fast-forward pushes only.
- `dev`: Active development timeline ensuring separation of concerns.

> Security Checklist Approved: Prevented secrets committal, sanitized `.gitignore`, protected console logs in production, configured Husky pre-commit hooks.
