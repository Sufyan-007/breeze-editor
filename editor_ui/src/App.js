import './App.css';
import Editor from './components/Editor';
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
// import { Navigate } from 'react-router';
import Main from './components/Main';
import configureStore from './store/Store'
import { Provider } from 'react-redux';
import Sidebar from './components/Sidebar';
import DetailedComponent from './components/DetailedComponent';
import ReduxConfig from './components/ReduxConfig';
import CreateApp from './components/CreateApp';
import { ServicePage } from './components/ServicePage';
import ProjectPage,{projectLoader} from './components/ProjectPage';
import ComponentConfigPage,{configLoader} from './components/ComponentConfig/ComponentConfigPage';
import CssEditor from './components/CssEditor';

export const router = createBrowserRouter(
  [
    {
      path:"/project/:projectName",
      element: <Outlet />,
      children: [
        {
          index: true,
          element: <ProjectPage />,
          loader:projectLoader,
        },
        {
          path: "styles/add",
          element: <CssEditor mode="add" />
        },
        {
          path: "styles/edit/:css_name",
          element: <CssEditor mode="edit" />
        },
        {
          path: "styles/view/:css_name",
          element: <CssEditor mode="view" />
        }
      ]
    },
    {
      path:"/project/:projectName/component/:componentName",
      element:<ComponentConfigPage />,
      loader:configLoader
    },
    {
      path: "/editor/:projectName",
      element: <Editor />,
      children: [
        {
          path: "comp/:componentName",
          element: <DetailedComponent />
        },
        {
          path: "",
          element: <Sidebar />
        }
      ]
    },
    {
      path: "editor/:projectName/redux",
      element: <ReduxConfig />,
    },
    {
      path: "/",
      element: <Main />
    },
    {
      path: "new"
      , element: <CreateApp />
    },
    {
      path: "editor/:projectName/service",
      element: <ServicePage />
    }
  ]
);

function App() {

  return (
    <Provider store={configureStore}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
