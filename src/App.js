import './App.css';
import Editor from './components/Editor';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
// import { Navigate } from 'react-router';
import Main from './components/Main';
import configureStore from './store/Store'
import { Provider } from 'react-redux';
import Sidebar from './components/Sidebar';
import DetailedComponent from './components/DetailedComponent';

export const router = createBrowserRouter(
  [
    {
      path: "/editor/:projectName",
      element: <Editor />,
      children:[
        {
          path:"comp/:componentName",
          element: <DetailedComponent />
        },
        {
          path:"",
          element: <Sidebar />
        }
      ]
    },
    {
      path: "/",
      element: <Main />
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
