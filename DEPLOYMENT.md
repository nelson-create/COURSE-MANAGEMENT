# Deployment Guide - Course Management Platform

## Overview
This application is split into two deployments:
- **Frontend**: Vercel (static site with SPA routing)
- **Backend**: Render (Node.js API server)

## Prerequisites
1. MongoDB Atlas account with a database and connection string
2. Vercel account
3. Render account
4. Git repository

---

## Backend Deployment on Render

### Step 1: Create MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (M0 free tier recommended)
3. Create database user with read/write permissions
4. Get connection string (format: `mongodb+srv://user:password@cluster...`)
5. Add your IP to Network Access (or allow all IPs `0.0.0.0/0` for production)

### Step 2: Deploy to Render
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: course-management-api
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Runtime**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (root)

### Step 3: Set Environment Variables on Render
In the Render dashboard, add these environment variables:
```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=generate_a_secure_random_string_here
JWT_EXPIRE=7d
CLIENT_URL=https://your-frontend-url.vercel.app
```

**Important**: Replace `your_mongodb_connection_string_here` with your actual MongoDB Atlas connection string.

---

## Frontend Deployment on Vercel

### Step 1: Update vercel.json (if needed)
Ensure the `vercel.json` has the correct configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist",
        "installCommand": "cd client && npm install && npm run build"
      }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/index.html"
    }
  ]
}
```

### Step 2: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Other
   - **Build Command**: `cd client && npm install && npm run build`
   - **Output Directory**: `dist`
   - **Root Directory**: Leave empty (root)

### Step 3: Set Environment Variables on Vercel
In Project Settings → Environment Variables, add:
```
VITE_API_URL= (leave empty for production - uses relative URL)
```

**Note**: The frontend uses relative URLs (`/api/*`) in production, so `VITE_API_URL` should be empty.

### Step 4: Update CLIENT_URL on Render
After deploying to Vercel, update the `CLIENT_URL` environment variable on Render to point to your Vercel URL:
```
CLIENT_URL=https://your-project-name.vercel.app
```

---

## Testing the Deployment

### Health Checks
1. **Backend**: `https://your-render-url.onrender.com/api/health`
   - Should return: `{"success": true, "message": "Course Management API is running"}`

2. **Frontend**: `https://your-vercel-url.vercel.app`
   - Should load the React app

### Common Issues

1. **404 on refresh**: Ensure vercel.json routes are correct for SPA routing
2. **Database connection errors**: Check MongoDB Atlas IP whitelist and connection string
3. **CORS errors**: Verify CLIENT_URL matches your Vercel domain exactly
4. **API not found**: Check that API routes point to `/api/index.js`

---

## Local Development

```bash
# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend
npm run client
```

Or use concurrently for both:
```bash
npm run dev
```

---

## Troubleshooting

### "Unable to load database" error
- Check MongoDB Atlas connection string
- Verify Network Access allows connections
- Check Render logs for detailed error messages

### 404 errors on frontend
- Ensure vercel.json has correct routes
- Make sure the catch-all route points to `/dist/index.html`

### CORS errors
- Update CLIENT_URL on Render to match your Vercel URL exactly
- Include `https://` prefix