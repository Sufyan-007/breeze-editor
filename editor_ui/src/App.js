import "./App.css";
import Editor from "./components/Editor";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
// import { Navigate } from 'react-router';
import Main from "./components/Main";
import configureStore from "./store/Store";
import { Provider } from "react-redux";
import Sidebar from "./components/Sidebar";
import DetailedComponent from "./components/DetailedComponent";
import ReduxConfig from "./components/ReduxConfig";
import CreateApp from "./components/CreateApp";
import  ApiClientRoot  from "./features/api_client/index";
import ProjectPage, { projectLoader } from "./components/ProjectPage";
import ComponentConfigPage, {
  configLoader,
} from "./components/ComponentConfig/ComponentConfigPage";
import CssEditor from "./components/CssEditor";
import ProjectHome from "./components/ProjectHome";
import ProjectComponents from "./components/ProjectComponents";
import ProjectRouting, { routerConfigLoader } from "./components/ProjectRouting";
import Styles from "./components/Styles";
import Code from "./components/Code";
import ThirdPartyApp from "./components/ThirdPartyApp";
import Settings from "./components/Settings";

export const router = createBrowserRouter([
  {
    path: "/project/:projectName",
    element: <ProjectPage />,
    loader: projectLoader,
    children: [
      { index: true, element: <ProjectHome /> },
      { path: "pages", element: <ProjectComponents /> },
      { path: "routing", element: <ProjectRouting /> },
      { path: "services", element: <ApiClientRoot/> },
      { path: "constants", element: <ReduxConfig /> },
      {
        path: "styles",
        element: <Outlet />,
        children: [
          { index: true, element: <Styles /> },
          { path: "add", element: <CssEditor mode="add" /> },
          { path: "edit/:css_name", element: <CssEditor mode="edit" /> },
          { path: "view/:css_name", element: <CssEditor mode="view" /> },
        ],
      },
      { path: "code", element: <Code /> },
      { path: "apps", element: <ThirdPartyApp /> },
      { path: "settings", element: <Settings /> },
    ],
  },
  {
    path: "/project/:projectName/component/:componentName",
    element: <ComponentConfigPage />,
    loader: configLoader,
    children: [
      { index: true, element: <ProjectHome /> },
      { path: "pages", element: <ProjectComponents /> },
      { path: "routing", element: <ProjectRouting /> },
      { path: "services", element: <ApiClientRoot /> },
    ]
  },
  {
    path: "/editor/:projectName",
    element: <Editor />,
    children: [
      {
        path: "comp/:componentName",
        element: <DetailedComponent />,
      },
      {
        path: "",
        element: <Sidebar />,
      },
    ],
  },
  {
    path: "editor/:projectName/redux",
    element: <ReduxConfig />,
  },
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "new",
    element: <CreateApp />,
  },
  {
    path: "editor/:projectName/service",
    element: <ApiClientRoot />,
  },
]);

function App() {
  return (
    <Provider store={configureStore}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
