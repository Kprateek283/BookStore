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

### Authentication Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User Routes
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

### Book Routes
- `GET /api/books` - Get all books
- `POST /api/books` - Create a new book
- `GET /api/books/:id` - Get book by ID
- `PUT /api/books/:id` - Update book
- `DELETE /api/books/:id` - Delete book

### Review Routes
- `POST /api/reviews` - Create a review
- `GET /api/reviews/book/:bookId` - Get reviews for a book
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

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
