import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import BooksPage from "./pages/BooksPage";
import BookDetailsPage from "./pages/BookDetailsPage";
import CreateBookPage from "./pages/CreateBookPage";
import UsersPage from "./pages/UsersPage";

export default function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/login" />} />

        <Route path="/home" element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/books" element={isAuthenticated ? <BooksPage /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/books/:id" element={isAuthenticated ? <BookDetailsPage /> : <Navigate to="/login" />} />

        <Route
          path="/create-book"
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <CreateBookPage />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/users"
          element={
            isAuthenticated && user?.role === 'admin' ? (
              <UsersPage />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
