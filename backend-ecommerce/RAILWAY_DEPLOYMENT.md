# Railway Deployment Guide for Backend

This guide walks you through deploying your `backend-ecommerce` to Railway using the Dockerfile we just created.

## 1. Preparation (Already Done)
*   **Dockerfile**: Created in `backend-ecommerce/Dockerfile`.
*   **Prisma Config**: Updated `schema.prisma` for Linux/Alpine compatibility.
*   **CORS**: Configured to assume permissive credentials (`origin: true`).

## 2. Push Changes
First, ensure all the latest changes are pushed to your git repository:
```bash
git add .
git commit -m "Prepare backend for Railway deployment: Dockerfile + Prisma"
git push origin main
```

## 3. Create Railway Project
1.  Go to [Railway.app](https://railway.app/).
2.  Click **"New Project"** > **"Deploy from GitHub repo"**.
3.  Select your repository: `BrolfEcommerce-`.
4.  **IMPORTANT:** Railway typically tries to auto-detect the app at the root. Since your backend is in a subdirectory (`backend-ecommerce`), we need to configure the **Root Directory**.

## 4. Configure Service Settings
Once the project is created (it might fail the initial build if it tries to build the root, don't panic):

1.  Click on the service card representing your repo.
2.  Go to **Settings** tab.
3.  **Root Directory**: Set this to `backend-ecommerce`.
4.  **Watch Paths** (Optional): Set to `/backend-ecommerce/**` so it only rebuilds when backend code changes.

## 5. Configure Environment Variables
Go to the **Variables** tab and add the following keys. **Copy values from your Vercel project or `.env` file**:

| Variable Key | Description |
| :--- | :--- |
| `DATABASE_URL` | **Critical.** Connection string to your Postgres DB (Supabase/Neon/etc). **Ensure `?pgbouncer=true` is appended** if using a pooler. |
| `JWT_SECRET` | Your secure secret key for signing tokens. |
| `JWT_EXPIRATION` | e.g., `3600s` or `1d`. |
| `FRONTEND_URL` | URL of your frontend (e.g., `https://your-frontend.vercel.app`). |
| `PORT` | **Leave this empty.** Railway sets this automatically (usually `3001` or random). Our app listens on `process.env.PORT` so it will work automatically. |

## 6. Networking (Public URL)
1.  Go to **Settings** > **Networking**.
2.  Click **"Generate Domain"** (or add a custom domain).
3.  This will give you a URL like `backend-ecommerce-production.up.railway.app`.
4.  **Copy this URL**.

## 7. Update Frontend
You need to point your frontend to this new Railway Backend.
1.  Go to your **Vercel** dashboard (where the Frontend is deployed).
2.  Select the **Frontend Project**.
3.  Go to **Settings** > **Environment Variables**.
4.  Update `NEXT_PUBLIC_API_URL` to your new Railway URL (e.g., `https://backend-ecommerce-production.up.railway.app/api`).
5.  Update `NEXT_PUBLIC_SOCKET_URL` to the *same* Railway URL (e.g., `https://backend-ecommerce-production.up.railway.app`).
6.  **Redeploy the Frontend** for changes to take effect.

## 8. Verification
1.  Check Railway **Deployments** tab logs. It should say:
    > `Application is running on: http://[::]:<PORT>`
2.  Open your frontend app and check standard features (Products loading).
3.  Check WebSocket features (Real-time order updates).
