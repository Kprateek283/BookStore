# Book Management System

A full-stack web application for managing books, reviews, and user interactions. Built with modern web technologies and best practices.

## Tech Stack

### Frontend
- React.js (v19)
- Vite (v6.3.5)
- React Router DOM (v7.6.0)
- TailwindCSS (v4.1.7)
- Flowbite (v3.1.2)
- Axios (v1.9.0)

### Backend
- Node.js
- Express.js (v5.1.0)
- MongoDB with Mongoose (v8.15.0)
- JWT Authentication
- Cloudinary for image storage
- Multer for file uploads
- Bcryptjs for password hashing

## Features
- User authentication (Signup/Login)
- Book management (CRUD operations)
- Review system
- User profile management
- Image upload functionality
- Responsive design

## Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Cloudinary account
- Git

## Installation

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
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

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## API Routes

### Authentication Routes (`/auth`)
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login user

### User Routes (`/users`)
- `GET /users/:id` - Get user by ID (protected)
- `PUT /users/:id` - Update user by ID (protected)
- `GET /users` - Get all users (admin only)

### Book Routes (`/books`)
- `GET /books/featured/get` - Get featured books (protected)
- `GET /books` - Get all books (protected)
- `GET /books/:id` - Get book by ID (protected)
- `POST /books` - Create a new book (admin only, supports image and PDF upload)
- `DELETE /books/:id` - Delete book (admin only)

### Review Routes (`/reviews`)
- `GET /reviews/:bookId` - Get all reviews for a book (protected)
- `POST /reviews/:bookId` - Create a new review for a book (protected)

Note: All routes except authentication routes require a valid JWT token in the Authorization header.

## Frontend Pages
- Home Page - Display featured books and recent reviews
- Books Page - List all books with filtering and search
- Book Details Page - Show book information and reviews
- Profile Page - User profile management
- Authentication Pages - Login and Registration
- Add/Edit Book Page - Book management interface

## Deployment
The application is configured for deployment on Vercel:

### Backend Deployment
- Uses `vercel.json` for serverless function configuration
- Environment variables should be set in Vercel dashboard

### Frontend Deployment
- Configured with Vite for optimal production build
- Environment variables should be set in Vercel dashboard

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License
This project is licensed under the ISC License.
