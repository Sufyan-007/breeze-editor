export const getAvailableTabs = (tag) => {
  switch (tag) {
    case 'COMPONENT':
      return ['code', 'preview'];
    case 'MODULE':
      return ['code', 'config'];
    case 'SERVICE-CONFIG':
      return ['config'];
    case 'ROUTING':
      return ['config'];
    case 'CUSTOM_UPLOAD':
      return ['config'];
    case 'SETTINGS':
      return ['config'];
    default:
      return ['code', 'preview'];
  }
};

export const initCode = `import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './routes/routing';
import { ThemeProvider } from './contexts/ThemeContext';
import { Provider } from 'react-redux';
import breezeStore from './store/breezeStore';

function App() {
  return (
    <Provider store={breezeStore}>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
`;
