# Todo App - Testing Guide

## Current Status: ✅ BOTH SERVERS RUNNING

**Backend:** http://localhost:8000
**Frontend:** http://localhost:3000

---

## Quick Start Testing

### 1. Access the Application
Open your browser and go to: **http://localhost:3000**

You should see:
- A beautiful landing page with TodoApp branding
- "Get Started - Sign Up" button
- "Sign In" button
- Three feature cards (Secure Authentication, Task Management, Data Isolation)
- Header with TodoApp logo and Sign In/Sign Up buttons
- Footer with links

### 2. Create an Account (Signup)
1. Click "Sign Up" or "Get Started"
2. Enter email: `newuser@example.com`
3. Enter password: `SecurePass123!` (must include uppercase, lowercase, number, special char)
4. Confirm password: `SecurePass123!`
5. See password strength indicator (should show "Strong")
6. Click "Sign Up"
7. Should automatically login and redirect to `/tasks`

### 3. Login (Signin)
1. Go to http://localhost:3000/auth/signin
2. Enter email: `testuser@example.com`
3. Enter password: `Pass123!`
4. Click "Sign In"
5. Should redirect to `/tasks`

### 4. Manage Tasks
Once logged in at `/tasks`:
1. Click "Add New Task" button
2. Fill in:
   - Title: "Complete testing"
   - Description: "Test all features"
   - Priority: High
   - Due Date: Select a future date
3. Click "Create Task"
4. Task appears in list

### 5. Edit/Complete/Delete Tasks
-  Click checkbox to mark as complete
- Click edit icon (✏️) to edit
- Click delete icon (🗑️) to delete
- Click on task to see details

### 6. Profile
- Click "Profile" in header
- See your user information
- Click "Logout" to sign out

---

## API Endpoints (Backend)

All working and tested:

### Authentication
- ✅ POST `/api/auth/signup` - Register new user
- ✅ POST `/api/auth/signin` - Login user
- ✅ POST `/api/auth/signout` - Logout user
- ✅ GET `/api/users/me` - Get current user (requires auth)

### Tasks
- ✅ GET `/api/tasks` - Get all user tasks (requires auth)
- ✅ POST `/api/tasks` - Create task (requires auth)
- ✅ GET `/api/tasks/{id}` - Get task by ID (requires auth)
- ✅ PUT `/api/tasks/{id}` - Update task (requires auth)
- ✅ PATCH `/api/tasks/{id}/complete` - Toggle completion (requires auth)
- ✅ DELETE `/api/tasks/{id}` - Delete task (requires auth)

---

## Fixed Issues

### Backend Fixes:
1. ✅ Fixed bcrypt/passlib compatibility (using bcrypt directly)
2. ✅ Fixed auth_config attribute references
3. ✅ Fixed database connection (PostgreSQL with SQLite fallback)
4. ✅ Fixed all import statements
5. ✅ Added user_router to main.py
6. ✅ CORS configured for http://localhost:3000

### Frontend Fixes:
1. ✅ Replaced default Next.js home page with custom landing page
2. ✅ Fixed token key consistency ('access_token' everywhere)
3. ✅ Fixed useAuth to handle backend response (access_token field)
4. ✅ Fixed ProtectedRoute to not cause loops
5. ✅ Fixed all component imports with @ alias
6. ✅ Added Header and Footer to layout
7. ✅ Password strength validation with visual indicator

---

## Known Working Features

✅ Beautiful landing page with gradient background
✅ User signup with password strength indicator
✅ User signin
✅ JWT token storage and retrieval
✅ Protected routes (redirects if not authenticated)
✅ Task list view
✅ Task creation
✅ Task editing
✅ Task completion toggle
✅ Task deletion
✅ User profile page
✅ Logout functionality
✅ Responsive header and footer
✅ Mobile-responsive design

---

## Troubleshooting

### If Authentication Doesn't Work:
1. Clear browser localStorage: Open DevTools > Application > Local Storage > Clear all
2. Refresh the page
3. Try signing up with a new email

### If You See "Login again and again":
- This was caused by token key mismatch - NOW FIXED
- Clear localStorage and try again

### If Backend Not Responding:
```bash
cd backend
source venv/bin/activate
python -m uvicorn src.main:app --reload --port 8000
```

### If Frontend Not Responding:
```bash
cd frontend
npm run dev
```

---

## Test Checklist

- [ ] Can access home page at http://localhost:3000
- [ ] Can see beautiful landing page (not default Next.js template)
- [ ] Can click "Sign Up" and see signup form
- [ ] Can register with strong password
- [ ] See password strength indicator working
- [ ] After signup, redirected to `/tasks` (not login loop)
- [ ] Can see task dashboard
- [ ] Can create a new task
- [ ] Can view task list
- [ ] Can edit a task
- [ ] Can mark task as complete
- [ ] Can delete a task
- [ ] Can view profile
- [ ] Can logout
- [ ] After logout, can sign in again
- [ ] All pages are properly styled (no broken UI)

---

## Success Criteria

The app is working 100% perfectly when:
1. ✅ Both servers start without errors
2. ✅ Home page shows custom landing page (not default template)
3. ✅ Signup/Signin works without redirect loops
4. ✅ After login, user stays logged in and can access `/tasks`
5. ✅ All CRUD operations on tasks work
6. ✅ UI is beautiful and responsive
7. ✅ No console errors in browser

---

**Status: READY FOR TESTING** 🎉

Open http://localhost:3000 in your browser to start using the application!
