# EduStream - Educational Video Streaming Platform

A full-stack web application for educational video streaming with social features, built with React frontend and Node.js/Express backend.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login/signup with JWT tokens
- **Video Management**: Upload, stream, and manage educational videos
- **Social Features**: Posts, messaging, and notifications
- **User Roles**: Teacher and student profiles with different capabilities
- **File Uploads**: Support for videos, thumbnails, and attachments

### User Features
- **Teachers**: Upload videos, manage content, view analytics
- **Students**: Watch videos, interact with content, communicate with teachers
- **Real-time Chat**: Instant messaging between users
- **Notifications**: Get notified about new messages and activities
- **Profile Management**: Update personal information and profile pictures

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **multer** - File uploads
- **socket.io** - Real-time communication
- **cors** - Cross-origin resource sharing

### Frontend
- **React** - Frontend framework
- **React Router** - Navigation
- **Redux** - State management
- **Redux Thunk** - Async actions
- **Material-UI** - UI components
- **Bootstrap** - CSS framework
- **Axios** - HTTP client
- **socket.io-client** - Real-time client

## 📁 Project Structure

```
Website clone/
├── Backend/
│   ├── models/          # Database models
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Video.js
│   │   ├── Message.js
│   │   └── Notification.js
│   ├── uploads/         # File uploads directory
│   ├── server.js        # Main server file
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── actions/     # Redux actions
│   │   ├── reducers/    # Redux reducers
│   │   ├── pages/       # React components
│   │   ├── styles/      # CSS files
│   │   ├── images/      # Image assets
│   │   ├── store.js     # Redux store
│   │   └── App.js       # Main App component
│   ├── package.json
│   └── README.md
└── README.md           # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/edustream
JWT_SECRET=your-secret-key
PORT=3001
```

4. Start the backend server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📋 API Endpoints

### Authentication
- `POST /signup` - User registration
- `POST /login` - User login
- `GET /user` - Get current user info
- `PUT /user/password` - Update password

### Posts
- `GET /posts` - Get all posts
- `POST /posts` - Create a new post
- `GET /posts/:postId` - Get specific post
- `PUT /posts/:postId` - Update post
- `DELETE /posts/:postId` - Delete post

### Videos
- `GET /videos` - Get all videos
- `GET /videos/:videoId` - Get specific video
- `POST /videos` - Upload new video

### Messaging
- `POST /messages` - Send message
- `GET /messages/:userId` - Get messages with user

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/:notificationId/read` - Mark notification as read

### User Management
- `PUT /user/profile-image` - Update profile image
- `GET /users` - Get all users
- `PUT /user/details` - Update user details

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/edustream
JWT_SECRET=your-secret-key-here
PORT=3001
```

## 🎯 Usage

1. **Registration**: Create a new account as either a teacher or student
2. **Login**: Access your account with email and password
3. **Dashboard**: View your personalized dashboard based on role
4. **Videos**: Browse, watch, and upload educational content
5. **Social**: Create posts, chat with other users, view notifications
6. **Profile**: Manage your account settings and profile information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support or questions, please check the documentation or create an issue in the repository.

## 🔄 Deployment

### Backend Deployment
- Ensure MongoDB is running
- Set production environment variables
- Use process managers like PM2 for production

### Frontend Deployment
- Build the React app: `npm run build`
- Deploy the build folder to your hosting service

---

**Note**: Make sure to replace the JWT secret and MongoDB URI with your actual values in production environment.
