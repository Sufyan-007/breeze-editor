import { createBrowserRouter } from "react-router-dom";
import Login from "../modules/authentication/pages/login/Login";
import LandingPage from "../modules/landingPage/pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);
