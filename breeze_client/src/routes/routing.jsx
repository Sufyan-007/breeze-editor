import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../modules/authentication/pages/login/Login';
// import ProjectPage from '../modules/project/pages/ProjectPage';
import HomePage from '../modules/home/pages/HomePage';

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
    element: <HomePage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  // {
  //   path: '/project/:projectName',
  //   element: <ProjectPage />,
  // },
]);
