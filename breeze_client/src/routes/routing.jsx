import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../modules/authentication/pages/login/Login';
import AllProjects from '../modules/project/pages/AllProjects';
import PropTypes from 'prop-types';
import UserManagement from '../modules/user-management/pages/UserManagement';
import RoleManagement from '../modules/role-management/pages/RoleManagement';
import { OffcanvasProvider } from '../contexts/OffcanvasContext';
import ProjectPageWrapper from '../modules/project/pages/ProjectPageWrapper';
const isAuthenticated = () => {
  return !!localStorage.getItem('accessToken');
};

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const authenticated = isAuthenticated();
  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

const LoginPageWrapper = () => {
  if (isAuthenticated()) {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('refreshToken');
  }
  return <Login />;
};

// Router configuration
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={isAuthenticated() ? '/all-projects' : '/login'} />,
  },
  {
    path: '/login',
    element: <LoginPageWrapper />,
  },
  {
    path: '/all-projects',
    element: (
      // <ProtectedRoute>
      <AllProjects />
      // </ProtectedRoute>
    ),
  },
  {
    path: '/user-management',
    element: (
      // <ProtectedRoute>
      <UserManagement />
      // </ProtectedRoute>
    ),
  },
  {
    path: '/role-management',
    element: (
      // <ProtectedRoute>
      <RoleManagement />
      // </ProtectedRoute>
    ),
  },
  {
    path: '/project/:projectName',
    element: (
      // <ProtectedRoute>
      <OffcanvasProvider>
        <ProjectPageWrapper />
      </OffcanvasProvider>
      // </ProtectedRoute>
    ),
  },
]);
