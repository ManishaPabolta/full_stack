# Quick Setup & Testing Guide

## 🚀 Fast Track Setup (5 minutes)

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Backend
Create `.env` file in backend folder:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fullstack-app
JWT_SECRET=your_super_secret_key_123
JWT_EXPIRE=7d
NODE_ENV=development
```

**Note:** Install MongoDB locally or use MongoDB Atlas cloud at https://www.mongodb.com/cloud/atlas

### Step 3: Start Backend
```bash
npm run dev
```
✅ Backend running on http://localhost:5000

### Step 4: Install Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 5: Start Frontend
```bash
npm run dev
```
✅ Frontend running on http://localhost:5173

---

## 🧪 Testing the Application

### 1. Test Signup
1. Go to http://localhost:5173
2. Click "Get Started" or navigate to /signup
3. Fill in: Name, Email, Password
4. Click "Sign Up"
5. You should be redirected to dashboard

### 2. Test Login
1. Go to /login
2. Enter your email and password
3. Click "Login"
4. You should see your dashboard

### 3. Test Task Creation
1. On dashboard, click "+ New Task"
2. Fill in task details:
   - Title: "My First Task"
   - Description: "This is a test task"
   - Priority: "High"
   - Status: "To Do"
   - Due Date: (any date)
3. Click "Create Task"
4. Task should appear in the list

### 4. Test Task Filtering
1. Use the filter panel to search by:
   - Search term
   - Status (To Do, In Progress, Completed)
   - Priority (Low, Medium, High)
2. Click "Reset Filters" to clear

### 5. Test Task Operations
- **Edit**: Click "Edit" button on a task
- **Update**: Make changes and click "Update Task"
- **Complete**: Change status to "Completed"
- **Delete**: Click "Delete" and confirm

### 6. Test Profile
1. Click on welcome card (future: add profile page)
2. Profile is managed through API (see API docs)

### 7. Test Logout
1. Click "Logout" button in header
2. Should redirect to login page
3. Token cleared from localStorage

---

## 🔌 Testing with Postman

### Import Collection
1. Open Postman
2. Click "Import" → "Upload Files"
3. Select `postman_collection.json` from root folder
4. Collection imported ✅

### Setup Environment Variables
1. In Postman, click "Environments" → Create new
2. Add variables:
   - `base_url`: http://localhost:5000/api
   - `token`: (leave empty, will be set after login)

### Test Signup
1. Go to **Authentication** → **Signup**
2. Click "Send"
3. Copy the `token` from response
4. Paste it in Environment variable `token`

### Test Subsequent Requests
All protected endpoints will now use the token automatically from the environment variable.

---

## 🐛 Troubleshooting

### MongoDB Connection Error
**Problem:** "Cannot connect to MongoDB"
**Solution:**
- Option 1: Install and start MongoDB locally
- Option 2: Use MongoDB Atlas (cloud):
  1. Create account at https://www.mongodb.com/cloud/atlas
  2. Create a cluster
  3. Get connection string
  4. Update MONGODB_URI in .env

### Port Already in Use
**Problem:** "Port 5000 already in use"
**Solution:**
- Kill process on port 5000 or change PORT in .env to 5001

### Frontend can't reach backend
**Problem:** API calls fail with CORS error
**Solution:**
- Ensure backend is running on port 5000
- Check VITE_API_URL in frontend/.env
- Clear browser cache and reload

### Login not working
**Problem:** "Invalid email or password" even with correct credentials
**Solution:**
- Check JWT_SECRET in backend .env is consistent
- Make sure user was created (check MongoDB)
- Clear localStorage and try again

---

## 📊 Project Statistics

### Backend
- **Files**: 13 core files
- **Routes**: 2 route modules (Auth, Tasks)
- **Models**: 2 MongoDB schemas (User, Task)
- **Endpoints**: 9 API endpoints
- **Authentication**: JWT-based with bcrypt

### Frontend
- **Components**: 7 reusable components
- **Pages**: 4 page components
- **Files**: 14 source files
- **State Management**: Zustand
- **Styling**: TailwindCSS

### Documentation
- **API.md**: Complete API documentation
- **DEPLOYMENT.md**: Deployment guide (Vercel, Heroku, AWS)
- **SCALING.md**: Scalability strategy for enterprise growth
- **postman_collection.json**: Ready-to-import Postman collection

---

## 🎯 Key Features Implemented

✅ User Authentication (Signup/Login/Logout)
✅ JWT Token-based Security
✅ Password Hashing with Bcrypt
✅ Protected Routes & APIs
✅ Task CRUD Operations
✅ Advanced Filtering & Search
✅ Task Statistics Dashboard
✅ Responsive Design with TailwindCSS
✅ Form Validation (Client + Server)
✅ Error Handling
✅ Complete API Documentation
✅ Postman Collection for Testing
✅ Production Deployment Guide
✅ Scalability Architecture

---

## 📚 Next Steps

After testing locally:

1. **Add Tests**: Implement Jest/Vitest tests
2. **Error Tracking**: Add Sentry for error monitoring
3. **Logging**: Add Winston for application logging
4. **Performance**: Add monitoring with Prometheus/Grafana
5. **CI/CD**: Set up GitHub Actions for automation
6. **Deployment**: Deploy to production using guides in docs/
7. **Scaling**: Implement Redis caching and load balancing
8. **Additional Features**: 
   - Task comments/collaboration
   - Notifications/reminders
   - Mobile app version
   - Dark mode

---

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the detailed docs in `/docs` folder
3. Check browser console for error messages
4. Check terminal for backend logs

---

**Happy coding! 🚀**
