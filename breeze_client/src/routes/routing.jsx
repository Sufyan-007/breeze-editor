import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../modules/authentication/pages/login/Login';
import LandingPage from '../modules/landingPage/pages/LandingPage';
import ProjectPage from '../modules/project/pages/ProjectPage';

const checkAccessToken = () => {
  const token = localStorage.getItem('accessToken');
  return token !== null;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: checkAccessToken() ? <Navigate to="/home" /> : <Navigate to="/login" />,
  },
  {
    path: '/home',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/project',
    element: <ProjectPage />,
  },
]);
