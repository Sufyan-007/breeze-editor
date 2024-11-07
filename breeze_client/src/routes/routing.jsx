import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../modules/authentication/pages/login/Login';
import ProjectPage from '../modules/project/pages/ProjectPage';
import AllProjects from '../modules/project/pages/AllProjects';
import PropTypes from 'prop-types';
import { OffcanvasProvider } from '../contexts/OffcanvasContext';
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
    path: '/project/:projectName',
    element: (
      // <ProtectedRoute>
      <OffcanvasProvider>
        <ProjectPage />
      </OffcanvasProvider>
      // </ProtectedRoute>
    ),
  },
]);
