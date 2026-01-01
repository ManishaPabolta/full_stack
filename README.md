# Full-Stack Task Management Application

A modern, secure, and scalable full-stack application for task management, built with React, Node.js/Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Application runs on: `http://localhost:5173`

## 📁 Project Structure

```
assesment/
├── backend/              # Node.js/Express API
│   ├── config/           # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth and validation middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions and validators
│   └── server.js          # Entry point
│
├── frontend/             # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API client and services
│   │   ├── store/         # State management (Zustand)
│   │   ├── hooks/         # Custom React hooks
│   │   └── App.jsx        # Main app component
│   └── index.html         # HTML entry point
│
└── docs/                 # Documentation
    ├── API.md            # API documentation
    ├── DEPLOYMENT.md     # Deployment guide
    └── SCALING.md        # Scaling strategy
```

## ✨ Features

### 🔐 Authentication & Security
- User registration and secure login
- JWT-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected routes and API endpoints
- Token expiration and refresh
- Secure localStorage management

### 📝 Task Management
- **Create** tasks with title, description, priority, status, and due dates
- **Read** tasks with advanced filtering (search, status, priority)
- **Update** task details in real-time
- **Delete** tasks with confirmation
- Task statistics dashboard
- Multiple status options (To Do, In Progress, Completed)
- Three priority levels (Low, Medium, High)

### 👤 User Management
- User profile viewing and editing
- Secure password storage
- Profile customization
- User-specific task isolation

### 🎨 UI/UX
- **Responsive design** with TailwindCSS
- **Modern interface** with intuitive navigation
- **Real-time form validation** (client & server-side)
- **Error handling** with user-friendly messages
- **Loading states** for better UX
- **Mobile-friendly** layout

### 📊 Dashboard
- Welcome message with user name
- Task statistics (total, in-progress, to-do, completed)
- Quick task creation
- Advanced search and filtering
- Task status indicators with color coding
- Priority badges

## 🔒 Security Features

✅ **Password Security**
- Bcrypt hashing with 10 salt rounds
- Server-side password validation
- Minimum 6 character requirement

✅ **Authentication**
- JWT tokens with expiration (7 days)
- Secure token storage
- Auto-logout on token expiration
- Protected API endpoints

✅ **Input Validation**
- Server-side validation with express-validator
- Client-side form validation
- Email format validation
- XSS protection

✅ **API Security**
- CORS enabled for trusted origins
- Proper HTTP status codes
- Error messages don't leak sensitive information
- User data isolation (can't access other users' data)

## 🛠 Technology Stack

### Frontend
- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Zustand** - State management
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **express-validator** - Input validation

## 📚 API Documentation

### Authentication Endpoints

**POST** `/api/auth/signup`
```json
Request:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGci..."
  }
}
```

**POST** `/api/auth/login`
```json
Request:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGci..."
  }
}
```

**GET** `/api/auth/profile` (Protected)
```
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "message": "Profile fetched successfully",
  "data": { "user": {...} }
}
```

**PUT** `/api/auth/profile` (Protected)
```json
Request:
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "profile": {
    "bio": "I'm a software engineer",
    "phone": "+1234567890"
  }
}

Response:
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { "user": {...} }
}
```

### Task Endpoints

**POST** `/api/tasks` (Protected)
```json
Request:
{
  "title": "Complete project",
  "description": "Finish the React component",
  "priority": "high",
  "status": "in-progress",
  "dueDate": "2024-12-31"
}

Response:
{
  "success": true,
  "message": "Task created successfully",
  "data": { "task": {...} }
}
```

**GET** `/api/tasks` (Protected)
```
Query Parameters:
- search: "search term"
- status: "todo|in-progress|completed"
- priority: "low|medium|high"
- sort: "-createdAt" (default)

Response:
{
  "success": true,
  "message": "Tasks fetched successfully",
  "data": {
    "count": 10,
    "tasks": [...]
  }
}
```

**GET** `/api/tasks/:id` (Protected)
```
Response:
{
  "success": true,
  "message": "Task fetched successfully",
  "data": { "task": {...} }
}
```

**PUT** `/api/tasks/:id` (Protected)
```json
Request:
{
  "title": "Updated title",
  "status": "completed",
  "priority": "low"
}

Response:
{
  "success": true,
  "message": "Task updated successfully",
  "data": { "task": {...} }
}
```

**DELETE** `/api/tasks/:id` (Protected)
```
Response:
{
  "success": true,
  "message": "Task deleted successfully",
  "data": { "deletedId": "..." }
}
```

## 🚀 Deployment

### Frontend
Deploy to Vercel, Netlify, or AWS S3 + CloudFront
```bash
cd frontend
npm run build
# Follow platform-specific deployment instructions
```

### Backend
Deploy to Heroku, Railway, AWS EC2, or similar
```bash
cd backend
# Set environment variables in deployment platform
# Push to repository, CI/CD will handle deployment
```

**See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.**

## 📈 Scaling Strategy

The application is designed to scale from MVP to enterprise level:

1. **MVP Phase**: Single server, single database
2. **Growth Phase**: Load-balanced backend, database replication
3. **Enterprise Phase**: Microservices, database sharding, global CDN

**See [docs/SCALING.md](docs/SCALING.md) for comprehensive scaling strategy.**

## 📊 Code Quality

- ✅ Modular component architecture
- ✅ Separation of concerns (controllers, services, middleware)
- ✅ Error handling and validation throughout
- ✅ RESTful API design
- ✅ Clean code practices
- ✅ Reusable utility functions

## 🧪 Testing

Testing should be implemented for:
- Authentication endpoints
- Task CRUD operations
- Form validation
- Protected routes
- Error handling

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fullstack-app
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🔧 Development Commands

### Backend
```bash
npm install          # Install dependencies
npm run dev          # Start development server with nodemon
npm start            # Start production server
npm test             # Run tests (when implemented)
```

### Frontend
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## 🐛 Troubleshooting

**Backend won't start**
- Ensure MongoDB is running and connection string is correct
- Check if port 5000 is available
- Verify all environment variables are set

**Frontend can't reach backend**
- Ensure backend server is running on port 5000
- Check VITE_API_URL in .env
- Verify CORS is enabled in backend

**Authentication not working**
- Clear localStorage in browser DevTools
- Check JWT_SECRET is set correctly
- Verify token format in Network tab

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👤 Author

Full-Stack Developer

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📞 Support

For issues and questions, please create an issue in the GitHub repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**
