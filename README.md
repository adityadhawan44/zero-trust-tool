# ZeroTrust Access Guard

A college-ready zero trust security demo built with React, Express, and a lightweight JSON data store.

## What it demonstrates
- Authentication and role-based access
- Device trust scoring
- Policy-based access decisions
- Step-up MFA challenge
- Audit logging for every access request

## Demo accounts
- Admin: `deepanshupg4@gmail.com` / `Admin@123`
- Employee: `employee@zerotrust.local` / `Employee@123`
- Guest: `guest@zerotrust.local` / `Guest@123`

Demo OTP when prompted: `246810`

## Run locally
1. Install dependencies: `npm install`
2. Seed the database: `npm run seed`
3. Start both apps: `npm run dev`

Frontend: `http://localhost:5173`
Backend: `http://localhost:4000`

## Publish to GitHub
1. Create a new public GitHub repository named `zero-trust-tool`
2. In this project folder run:
   `git init`
3. Then run:
   `git branch -M main`
4. Add files:
   `git add .`
5. Create the first commit:
   `git commit -m "Initial commit"`
6. Connect the remote:
   `git remote add origin https://github.com/adityadhawan44/zero-trust-tool.git`
7. Push:
   `git push -u origin main`

## Deploy publicly
- Frontend: deploy `client` on Vercel or Netlify
- Backend: deploy `server` on Render or Railway
- Before deploying, switch the frontend API URL in `client/src/services/api.js` to your hosted backend URL

## Suggested presentation flow
1. Log in as admin on a trusted device and request `admin-dashboard`.
2. Log in as employee on an untrusted device and show the MFA challenge.
3. Log in as guest and request a protected resource to show a deny decision.
4. Open the audit trail to explain how every request is logged.
