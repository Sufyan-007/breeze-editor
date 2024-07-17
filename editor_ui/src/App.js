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
import ApiClientRoot from "./features/api_client/index";
import ProjectPage, { projectLoader } from "./components/ProjectPage";
import ComponentConfigPage, {
  configLoader,
} from "./components/ComponentConfig/ComponentConfigPage";
import CssEditor from "./components/StylesConfiguration/CssEditor";
import ProjectHome from "./components/ProjectHome";
import ProjectComponents from "./components/ProjectComponents";
import ProjectRouting from "./components/ProjectRouting";
import Styles from "./components/StylesConfiguration/Styles";
import Code from "./components/Code";
import Settings from "./components/Settings";
import DependencyConfig from "./components/DependencyConfiguration/DependencyConfig";
import Resources from "./components/ResourcesConfiguration/Resources";

export const router = createBrowserRouter([
  {
    path: "/project/:projectName",
    element: <ProjectPage />,
    loader: projectLoader,
    children: [
      { index: true, element: <ProjectHome /> },
      { path: "pages", element: <ProjectComponents /> },
      { path: "routing", element: <ProjectRouting /> },
      { path: "services", element: <ApiClientRoot /> },
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
      { path: "apps", element: <DependencyConfig /> },
      { path: "settings", element: <Settings /> },
      { path: "resources", element: <Resources /> },
    ],
  },
  {
    path: "/project/:projectName/component/:componentName",
    element: <ComponentConfigPage />,
    loader: configLoader
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
