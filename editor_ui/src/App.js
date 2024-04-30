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
import ProjectPage,{projectLoader} from './components/ProjectPage';
import CssEditor from './components/CssEditor';
import Root from './components/ApiClient/Root';

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
    // {
    //   path: "editor/:projectName/service",
    //   element: <Root />
    // }
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
