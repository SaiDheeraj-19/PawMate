# PawMate - Pet Matchmaking Platform

Find playdates and breeding partners for your pets with ease.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Database**: Supabase (PostgreSQL + PostGIS)
- **ORM**: Prisma
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Realtime**: Supabase Realtime
- **Email**: Resend

## Setup Instructions

### 1. Supabase Setup
1. Create a new project on [Supabase](https://supabase.com).
2. Go to the **SQL Editor** and run the contents of `supabase/migrations/20240320000000_init.sql`.
3. Enable **Google OAuth** in the Auth settings (optional, but recommended).
4. Create a storage bucket called `pets` and set its policy to public.

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL="postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres?schema=public"
DIRECT_URL="postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres?schema=public"
RESEND_API_KEY=your_resend_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. PocketBase Setup (Alternative Backend)
1. Download and run [PocketBase](https://pocketbase.io).
2. Go to the **Settings > Import collections** and paste the contents of `pocketbase/schema.json`.
3. Set `NEXT_PUBLIC_BACKEND=pocketbase` in your `.env` to switch backends.

### 4. Installation
```bash
npm install
npx prisma generate
```

### 5. Running the App
```bash
npm run dev
```

### 6. Seeding Data (Optional)
```bash
# Supabase
npx ts-node prisma/seed.ts
# PocketBase: Manual upload via Admin UI or custom script
```

## Features
- **Dual Backend**: Support for both Supabase and PocketBase.
- **Auth**: Social and email login.
- **Profiles**: Management for owners and multiple pets.
- **Discovery**: Swipe UI with distance-based sorting (PostGIS or Math).
- **Chat**: Real-time messaging.
- **Notifications**: In-app and email alerts.
