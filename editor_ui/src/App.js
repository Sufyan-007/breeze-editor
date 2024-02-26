import './App.css';
import Editor from './components/Editor';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import { Navigate } from 'react-router';
import Main from './components/Main';
import configureStore from './store/Store'
import { Provider } from 'react-redux';
import Sidebar from './components/Sidebar';
import DetailedComponent from './components/DetailedComponent';
import ReduxConfig from './components/ReduxConfig';
import CreateApp from './components/CreateApp';

export const router = createBrowserRouter(
  [
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
