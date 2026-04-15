# Zero Trust Security Tool Project Plan

## Project Title
ZeroTrust Access Guard

## One-Line Idea
A web-based zero trust security tool that verifies user identity, device trust, and access policy before allowing access to protected resources.

## Why This Is a Strong College Project
- It matches a real cybersecurity concept used in industry.
- It is practical and easy to demonstrate live.
- It combines security, backend logic, frontend UI, and logging.
- You can build a solid MVP without needing enterprise infrastructure.

## Core Zero Trust Principles You Should Show
- Never trust by default.
- Always verify identity.
- Check device and session context.
- Apply least-privilege access.
- Continuously monitor and log access attempts.

## Best Project Scope
Build a "Zero Trust Access Gateway" instead of a full enterprise platform.

This means your tool will sit in front of sample protected pages or APIs and decide whether a user should get access based on:
- Login identity
- Role
- Device trust score
- Location/IP rule
- Multi-factor verification
- Risk-based policy checks

## MVP Features
1. User authentication
- Signup/login
- Password hashing
- JWT or session-based authentication

2. Role-based access control
- Admin
- Employee/User
- Guest

3. Device trust check
- Register known devices
- Mark unknown device as high risk
- Give device a trust score

4. Policy engine
- Example policy: allow admins to access admin dashboard only from trusted devices
- Example policy: block guest access to sensitive page
- Example policy: require extra verification for unknown device

5. MFA simulation
- OTP by email mock or generated code on screen for demo

6. Access logs and alerts
- Show who requested access
- Show whether access was allowed or denied
- Show why it was denied

7. Admin dashboard
- View users
- View devices
- View access logs
- Edit policies

## Advanced Features If You Have Time
- Risk scoring using login time, failed attempts, and device history
- Geolocation or IP-based policy
- Session timeout and re-verification
- Suspicious activity alerts
- API protection mode
- Simple anomaly detection

## Recommended Tech Stack
### Option A: Fastest and easiest
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB or SQLite
- Auth: JWT
- Styling: Tailwind CSS

### Option B: Very clean for security logic
- Frontend: React + Vite
- Backend: Python Flask or FastAPI
- Database: SQLite or PostgreSQL
- Auth: JWT

For a college project, Option A is usually the easiest to demo and explain.

## Recommended System Design
### Modules
- Auth Service
- Policy Engine
- Device Trust Service
- Access Gateway
- Logging and Monitoring Module
- Admin Dashboard

### Simple Flow
1. User logs in
2. System checks password
3. System checks role and device trust
4. System applies access policy
5. If risk is high, ask for MFA
6. Allow or deny access
7. Save event in audit log

## Example Database Tables or Collections
### users
- id
- name
- email
- passwordHash
- role
- mfaEnabled

### devices
- id
- userId
- deviceName
- fingerprint
- trusted
- trustScore
- lastSeen

### policies
- id
- name
- roleRequired
- minTrustScore
- requiresMfa
- resource
- effect

### access_logs
- id
- userId
- deviceId
- resource
- decision
- reason
- timestamp
- ipAddress

## Best Demo Scenario
Prepare 3 users:
- Admin on trusted device
- Employee on unknown device
- Guest on blocked route

Then show:
- Admin gets access
- Employee is asked for MFA
- Guest is denied
- Dashboard shows all access decisions in logs

That demo will make your project feel complete and intelligent.

## Suggested Folder Structure
```text
zerotrust-tool/
  client/
  server/
  docs/
```

## Build Plan
### Phase 1
- Set up frontend and backend
- Create login/signup
- Add database models

### Phase 2
- Add roles
- Add protected routes
- Add device registration

### Phase 3
- Build policy engine
- Add MFA simulation
- Add access logs

### Phase 4
- Build admin dashboard
- Improve UI
- Add final presentation data

## What Makes It Look "Best"
- Clean admin dashboard
- Good audit trail visuals
- Real denial reasons instead of generic errors
- Security-focused explanation in report
- A live demo with 2-3 different outcomes

## What To Say In Your Presentation
- Traditional systems trust users after login.
- Zero trust checks every access request continuously.
- This tool improves security by combining identity, device trust, role, and policy checks.
- The system enforces least privilege and logs every decision.

## Best Next Step
Start with this exact MVP:
- React frontend
- Node/Express backend
- SQLite database
- JWT auth
- Role-based access
- Device trust scoring
- Policy-based access decisions
- Access log dashboard

This is realistic, impressive, and strong enough for a college project.

## If You Want To Build It Fast
Build these pages first:
- Login
- Register
- User dashboard
- Admin dashboard
- Access denied page
- Audit log page

## Deliverables You Can Submit
- Source code
- Architecture diagram
- Report
- Demo video
- PPT

## Stretch Goal
Protect a sample internal file portal or API using your policy engine so the project feels like a real security gateway.
