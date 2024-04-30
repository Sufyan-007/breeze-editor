import Main from "components/Main";
import CreateAppPage from "components/CreateAppPage";
import ReactBootstrap from "components/ReactBootstrap";

import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Main />} index />

      <Route path="create-app-page" element={<CreateAppPage />} />

      <Route path="react-bootstrap" element={<ReactBootstrap />} />
    </Route>,
  ),
);
function App() {
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.origin === "http://localhost:3000") {
        const id = event.data.id;
        const highlight = event.data.highlight;
        const elements = document.querySelectorAll(`[id="${event.data.id}"]`);
        for (const elem of elements) {
          if (highlight) {
            elem.classList.add("custom-highlight");
          } else {
            elem.classList.remove("custom-highlight");
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
