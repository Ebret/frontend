/**
 * Main App Component
 *
 * This is the root component of the application that sets up routing,
 * theme provider, and other global providers.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import ThemeSwitcher from './components/ThemeSwitcher';

// Import styles
import './styles/global.css';
import './styles/auth.css';

/**
 * App Component
 * @returns {JSX.Element} App component
 */
const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/theme-demo" element={<ThemeDemoPage />} />

          {/* Fallback route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

/**
 * Protected Route Component
 * @param {Object} props - Component props
 * @returns {JSX.Element} Protected route component
 */
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = true; // Replace with actual auth check

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children within layout
  return <MainLayout>{children}</MainLayout>;
};

/**
 * Login Page Component
 * @returns {JSX.Element} Login page component
 */
const LoginPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Login</h1>
        <p>Welcome to the Credit Cooperative System</p>
        <div className="theme-switcher-container">
          <ThemeSwitcher variant="icon" />
        </div>
        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <button className="btn btn-primary btn-full-width">Login</button>
        </div>
        <div className="auth-links">
          <a href="/forgot-password">Forgot Password?</a>
          <a href="/register">Create Account</a>
        </div>
      </div>
    </div>
  );
};

/**
 * Register Page Component
 * @returns {JSX.Element} Register page component
 */
const RegisterPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Register</h1>
        <p>Create a new account</p>
        <div className="theme-switcher-container">
          <ThemeSwitcher variant="icon" />
        </div>
        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input type="text" id="name" placeholder="Enter your full name" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" placeholder="Enter your password" />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" placeholder="Confirm your password" />
          </div>
          <button className="btn btn-primary btn-full-width">Register</button>
        </div>
        <div className="auth-links">
          <a href="/login">Already have an account? Login</a>
        </div>
      </div>
    </div>
  );
};

/**
 * Forgot Password Page Component
 * @returns {JSX.Element} Forgot password page component
 */
const ForgotPasswordPage = () => {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Forgot Password</h1>
        <p>Enter your email to reset your password</p>
        <div className="theme-switcher-container">
          <ThemeSwitcher variant="icon" />
        </div>
        <div className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Enter your email" />
          </div>
          <button className="btn btn-primary btn-full-width">Reset Password</button>
        </div>
        <div className="auth-links">
          <a href="/login">Back to Login</a>
        </div>
      </div>
    </div>
  );
};

/**
 * Theme Demo Page Component
 * @returns {JSX.Element} Theme demo page component
 */
const ThemeDemoPage = () => {
  return (
    <div className="theme-demo-page">
      <h1>Theme Demo</h1>
      <div className="theme-switcher-container">
        <ThemeSwitcher variant="dropdown" showCustomizer />
      </div>
      <div className="theme-demo-content">
        <h2>This is a demo of the theme system</h2>
        <p>Try switching between themes to see how the UI adapts.</p>
      </div>
    </div>
  );
};

/**
 * Not Found Page Component
 * @returns {JSX.Element} Not found page component
 */
const NotFoundPage = () => {
  return (
    <div className="not-found-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/dashboard" className="btn btn-primary">Go to Dashboard</a>
    </div>
  );
};

export default App;
