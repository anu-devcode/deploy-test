# Vercel Deployment Guide (Monorepo with Supabase)

This guide walks you through deploying your Backend (NestJS) and Frontend (Next.js) to Vercel for testing purposes, using separate projects from the same repository.

## 1. Database Setup (Supabase)

1.  Log in to [Supabase](https://supabase.com/).
2.  Create a new project.
3.  Go to **Project Settings > Database**.
4.  Copy the **Connection String (URI)**. It should look like:
    `postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres`
    *(Make sure to replace `[PASSWORD]` with your actual database password)*.

> [!TIP]
> **Connection Pooling**: For Vercel Serverless (Backend), it is recommended to use the Transaction Pool connection string (port 6543) for `DATABASE_URL` and the Session connection string (port 5432) for `DIRECT_URL` in Prisma configurations.

## 2. GitHub Repository Setup

1.  Push your code to a GitHub repository.
    ```bash
    git add .
    git commit -m "Ready for deployment"
    git push origin main
    ```

## 3. Vercel Deployment Steps

You will deploy the repository **twice** on Vercel: once for the Backend and once for the Frontend.

### Part A: Deploy Backend (NestJS)

1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..." > "Project"**.
2.  Import your GitHub repository.
3.  **Configure Project:**
    *   **Project Name**: `brolf-backend` (or similar)
    *   **Root Directory**: Click "Edit" and select `backend-ecommerce`.
    *   **Framework Preset**: Select **Other** (NestJS runs via Serverless Function adapter).
    *   **Build Command**: `npx prisma generate && nest build` 
       *(Ensure `prisma generate` runs during build to create the client)*.
    *   **Output Directory**: `dist` (Standard for NestJS).
4.  **Environment Variables**:
    Add the following variables:
    *   `DATABASE_URL`: `<YOUR_SUPABASE_POOLING_URL>` (or direct URL if not using pooling)
    *   `DIRECT_URL`: `<YOUR_SUPABASE_DIRECT_URL>`
    *   `JWT_SECRET`: `<YOUR_SECURE_JWT_SECRET>` (Generate a random string)
    *   `FRONTEND_URL`: `https://<YOUR_FRONTEND_PROJECT_URL>.vercel.app` (You can update this later after deploying frontend).
    *   `NODE_ENV`: `production`
5.  Click **Deploy**.

> [!NOTE]
> The deployment might fail initially if `Frontend URL` is invalid or DB connection fails. You can redeploy later.
> **Public URL**: Once deployed, your backend URL will be like `https://brolf-backend.vercel.app`.

### Part B: Deploy Frontend (Next.js)

1.  Go to Vercel Dashboard, click **"Add New..." > "Project"**.
2.  Import the **same** GitHub repository again.
3.  **Configure Project:**
    *   **Project Name**: `brolf-frontend`
    *   **Root Directory**: Click "Edit" and select `frontend-ecommerce`.
    *   **Framework Preset**: **Next.js** (Should interactively detect).
4.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: `https://brolf-backend.vercel.app/api` (The URL from Part A + `/api` suffix).
5.  Click **Deploy**.

## 4. Final Integration Configuration

1.  **Update Backend CORS**:
    *   Go to your Backend Project on Vercel > Settings > Environment Variables.
    *   Update `FRONTEND_URL` to exact URL of your deployed frontend (e.g., `https://brolf-frontend.vercel.app`).
    *   Redeploy the backend (Deployment > Redeploy) for changes to take effect.

2.  **Run Database Migration**:
    *   You generally cannot run `prisma migrate dev` from Vercel.
    *   **Run locally**: Connect your local environment to the Supabase PROD database temporarily to apply migrations.
        1.  In your local `backend-ecommerce/.env`, set `DATABASE_URL` to the Supabase URL.
        2.  Run: `npx prisma migrate deploy`
        3.  Run: `npx prisma db seed` (if you want to seed initial data).

## Service Limitations (Free Tier)
*   **Uploads**: The standard `/uploads` folder will **NOT** work on Vercel (files are deleted after execution). For production, you must use an external storage provider like **Supabase Storage**, **AWS S3**, or **Vercel Blob**.
*   **Timeouts**: Vercel Free Tier serverless functions timeout after 10 seconds. Heavy processing might fail.

## Environment Variables Reference

### Backend (`backend-ecommerce`)
```ini
DATABASE_URL="postgres://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
JWT_SECRET="super-secret-key-change-me"
FRONTEND_URL="https://your-frontend-domain.vercel.app"
PORT="3001" 
# Add other keys like SMTP_HOST, GOOGLE_CLIENT_ID as required
```

### Frontend (`frontend-ecommerce`)
```ini
NEXT_PUBLIC_API_URL="https://your-backend-domain.vercel.app/api"
```
