import { createBrowserRouter, Navigate } from 'react-router-dom';
import OuterLayout from '../layouts/OuterLayout';
import InnerLayout from '../layouts/InnerLayout';
import Home from '../pages/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';
import Profile from '../pages/user/Profile';
import Settings from '../pages/user/Settings';
import ChangePassword from '../pages/user/ChangePassword';
import CodeEditor from '../pages/codespace/CodeEditor';
import SocialAuthCallback from '../components/auth/SocialAuthCallback';

// Auth guard for protected routes
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Guest guard for auth routes (redirect to dashboard if already logged in)
const GuestRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  // Public routes (OuterLayout)
  {
    path: '/',
    element: <GuestRoute><OuterLayout /></GuestRoute>,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'auth/social-callback',
        element: <SocialAuthCallback />,
      },
    ],
  },

  // Protected routes (InnerLayout)
  {
    path: '/',
    element: <ProtectedRoute><InnerLayout /></ProtectedRoute>,
    children: [
      {
        path: 'dashboard',
        element: <CodeEditor />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      {
        path: 'change-password',
        element: <ChangePassword />,
      },
    ],
  },

  // Fallback route
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
