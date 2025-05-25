import express from 'express';
import cors from 'cors';
import path from 'path';
import DBConnection from './config/mongoConfig.js';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import testCloudinaryConnection from './config/testCloudinary.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

DBConnection();
testCloudinaryConnection();

app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.set('trust proxy', true);

// Serve uploaded files statically (images, pdfs, etc)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Serve root folder statically (for defaultImage.jpg)
app.use(express.static(path.join(process.cwd())));

app.use("/auth", authRoutes);
app.use("/books", bookRoutes);
app.use("/users", userRoutes);
app.use("/reviews", reviewRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
