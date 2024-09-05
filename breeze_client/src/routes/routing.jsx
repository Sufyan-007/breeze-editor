import { createBrowserRouter } from 'react-router-dom';
import Login from '../modules/authentication/pages/login/Login';
import LandingPage from '../modules/landingPage/pages/LandingPage';
import TestingSelectField from '../modules/justTestingNewComponents/TestingSelectField';
import TestingComponent from '../common/form_builder/TestingComponent';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/TestingComps',
    children: [
      { path: 'selectField', element: <TestingSelectField /> },
      {
        path: 'form-builder',
        element: <TestingComponent />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
]);
