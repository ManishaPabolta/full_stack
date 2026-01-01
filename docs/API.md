# TaskApp - Full-Stack Application

A modern full-stack task management application built with React, Node.js, Express, and MongoDB.

## Project Structure

```
assesment/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── SignupForm.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   └── TaskFilters.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── DashboardPage.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authService.js
│   │   ├── store/
│   │   │   └── authStore.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── .env.example
│
└── docs/
    ├── API.md
    ├── DEPLOYMENT.md
    └── SCALING.md
```

## Features

### Authentication
- User registration with email validation
- Secure login with JWT tokens
- Password hashing using bcrypt
- Protected routes and API endpoints
- Token-based session management

### Task Management
- Create, read, update, and delete tasks
- Task priorities (low, medium, high)
- Task status tracking (to-do, in-progress, completed)
- Due date management
- Search and filter functionality
- Task statistics dashboard

### UI/UX
- Responsive design with TailwindCSS
- Modern component-based architecture
- Real-time form validation
- Error handling and user feedback
- Clean and intuitive interface

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fullstack-app
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

5. Start the backend server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` if needed:
```
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication Endpoints

**POST** `/api/auth/signup`
- Register a new user
- Body: `{ name, email, password }`
- Response: `{ success, message, data: { user, token } }`

**POST** `/api/auth/login`
- Login user
- Body: `{ email, password }`
- Response: `{ success, message, data: { user, token } }`

**GET** `/api/auth/profile`
- Get user profile (Protected)
- Headers: `Authorization: Bearer {token}`
- Response: `{ success, message, data: { user } }`

**PUT** `/api/auth/profile`
- Update user profile (Protected)
- Body: `{ name?, email?, profile? }`
- Response: `{ success, message, data: { user } }`

### Task Endpoints

**POST** `/api/tasks`
- Create a new task (Protected)
- Body: `{ title, description?, priority, status, dueDate? }`
- Response: `{ success, message, data: { task } }`

**GET** `/api/tasks`
- Get all tasks for user (Protected)
- Query params: `status?, priority?, search?`
- Response: `{ success, message, data: { count, tasks } }`

**GET** `/api/tasks/:id`
- Get specific task (Protected)
- Response: `{ success, message, data: { task } }`

**PUT** `/api/tasks/:id`
- Update task (Protected)
- Body: `{ title?, description?, priority?, status?, dueDate? }`
- Response: `{ success, message, data: { task } }`

**DELETE** `/api/tasks/:id`
- Delete task (Protected)
- Response: `{ success, message, data: { deletedId } }`

## Security Features

✅ **Password Security**
- Passwords hashed with bcrypt (10 salt rounds)
- Never stored in plaintext
- Validated on both client and server

✅ **Authentication**
- JWT-based token authentication
- Tokens include user ID and expiration
- Auto-logout on token expiration
- Secure token storage in localStorage

✅ **Authorization**
- Protected routes require authentication
- API endpoints validate user ownership
- Users can only access their own data

✅ **Input Validation**
- Server-side validation with express-validator
- Client-side form validation
- Email format validation
- Password strength requirements

✅ **API Security**
- CORS enabled for frontend origin
- Secure headers via Express middleware
- Error messages don't leak sensitive info
- Proper HTTP status codes

## Scaling Considerations

### Frontend Scaling
- **Code Splitting**: Implement lazy loading for routes
- **State Management**: Zustand allows easy scaling
- **API Client**: Centralized API layer for easy changes
- **Component Architecture**: Modular components for reuse
- **Performance**: Consider React.memo for expensive renders

### Backend Scaling
- **Database Indexing**: Indexes on frequently queried fields
- **Pagination**: Implement pagination for large datasets
- **Caching**: Redis for frequently accessed data
- **Load Balancing**: Run multiple instances behind a load balancer
- **Microservices**: Separate auth, tasks, users into services
- **API Rate Limiting**: Prevent abuse with rate limiting

### Database Scaling
- **Replication**: MongoDB replica sets for high availability
- **Sharding**: Distribute data across multiple servers
- **Backups**: Regular automated backups
- **Indexes**: Optimize with proper indexing strategy
- **Connection Pooling**: Efficient database connections

### Deployment
- **Frontend**: Deploy to Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Deploy to Heroku, AWS EC2, or Railway
- **Database**: MongoDB Atlas (cloud) or self-hosted
- **CI/CD**: GitHub Actions for automated testing and deployment
- **Monitoring**: Set up error tracking and performance monitoring

## Development Tips

1. **Environment Variables**: Always use `.env` files for sensitive data
2. **Error Handling**: Implement comprehensive error handling
3. **Logging**: Add logging for debugging and monitoring
4. **Testing**: Write unit and integration tests
5. **Code Quality**: Use ESLint and Prettier for code formatting

## Troubleshooting

**Backend won't connect to MongoDB**
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database permissions

**Frontend can't reach backend**
- Ensure backend is running on port 5000
- Check CORS configuration
- Verify API URL in frontend `.env`

**Authentication not working**
- Clear localStorage and refresh
- Check JWT_SECRET in backend `.env`
- Verify token in browser DevTools

## License

MIT

## Support

For issues and questions, please create an issue in the GitHub repository.
