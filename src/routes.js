/**
 * Application Routes with Code Splitting
 * 
 * This file defines all application routes with lazy loading
 * to improve initial load performance.
 */

import { lazyRoute } from './utils/dynamic-import';

// Shared components
const LoadingPage = () => (
  <div className="loading-page">
    <div className="spinner-container">
      <div className="spinner"></div>
    </div>
    <p>Loading page...</p>
  </div>
);

const ErrorBoundary = ({ children }) => {
  // In a real app, this would be a proper error boundary component
  return children;
};

// Define routes with lazy loading
const routes = [
  // Public routes
  lazyRoute('/', () => import('./pages/Home'), {
    loading: LoadingPage,
    errorElement: <ErrorBoundary />
  }),
  
  lazyRoute('/login', () => import('./pages/Login'), {
    loading: LoadingPage
  }),
  
  lazyRoute('/register', () => import('./pages/Register'), {
    loading: LoadingPage
  }),
  
  lazyRoute('/forgot-password', () => import('./pages/ForgotPassword'), {
    loading: LoadingPage
  }),
  
  // Protected routes - these will be wrapped with authentication check
  lazyRoute('/dashboard', () => import('./pages/Dashboard'), {
    loading: LoadingPage,
    protected: true
  }),
  
  // Role-specific dashboards
  lazyRoute('/admin', () => import('./pages/admin/Dashboard'), {
    loading: LoadingPage,
    protected: true,
    roles: ['ADMIN']
  }),
  
  lazyRoute('/board', () => import('./pages/board/Dashboard'), {
    loading: LoadingPage,
    protected: true,
    roles: ['BOARD']
  }),
  
  lazyRoute('/gm', () => import('./pages/gm/Dashboard'), {
    loading: LoadingPage,
    protected: true,
    roles: ['GENERAL_MANAGER']
  }),
  
  lazyRoute('/credit-officer', () => import('./pages/credit-officer/Dashboard'), {
    loading: LoadingPage,
    protected: true,
    roles: ['CREDIT_OFFICER']
  }),
  
  lazyRoute('/teller', () => import('./pages/teller/Dashboard'), {
    loading: LoadingPage,
    protected: true,
    roles: ['TELLER']
  }),
  
  // Loan routes
  lazyRoute('/loans/apply', () => import('./pages/loans/Apply'), {
    loading: LoadingPage,
    protected: true
  }),
  
  lazyRoute('/loans/status/:id', () => import('./pages/loans/Status'), {
    loading: LoadingPage,
    protected: true
  }),
  
  lazyRoute('/loans/review/:id', () => import('./pages/loans/Review'), {
    loading: LoadingPage,
    protected: true,
    roles: ['ADMIN', 'CREDIT_OFFICER', 'GENERAL_MANAGER']
  }),
  
  lazyRoute('/loans/agreement/:id', () => import('./pages/loans/Agreement'), {
    loading: LoadingPage,
    protected: true
  }),
  
  lazyRoute('/loans/payment/:id', () => import('./pages/loans/Payment'), {
    loading: LoadingPage,
    protected: true
  }),
  
  // E-Wallet routes
  lazyRoute('/ewallet', () => import('./pages/ewallet/Dashboard'), {
    loading: LoadingPage,
    protected: true
  }),
  
  lazyRoute('/ewallet/qr-payment', () => import('./pages/ewallet/QrPayment'), {
    loading: LoadingPage,
    protected: true
  }),
  
  lazyRoute('/ewallet/transfer', () => import('./pages/ewallet/Transfer'), {
    loading: LoadingPage,
    protected: true
  }),
  
  lazyRoute('/ewallet/damayan', () => import('./pages/ewallet/Damayan'), {
    loading: LoadingPage,
    protected: true
  }),
  
  lazyRoute('/ewallet/security', () => import('./pages/ewallet/Security'), {
    loading: LoadingPage,
    protected: true
  }),
  
  // Catch-all route for 404
  lazyRoute('*', () => import('./pages/NotFound'), {
    loading: LoadingPage
  })
];

export default routes;
