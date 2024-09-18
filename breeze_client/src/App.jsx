import { RouterProvider } from 'react-router-dom';
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
