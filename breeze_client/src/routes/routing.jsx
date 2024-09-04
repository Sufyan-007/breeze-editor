import { createBrowserRouter } from "react-router-dom";
import Login from "../modules/authentication/pages/login/Login";
import LandingPage from "../modules/landingPage/pages/LandingPage";
import TestingSelectField from "../modules/justTestingNewComponents/TestingSelectField";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: "/TestingComps",
    children: [
      { path: "selectField", element: <TestingSelectField /> },
    ]
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
