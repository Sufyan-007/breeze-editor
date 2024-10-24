import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './routes/routing';
import { ThemeProvider } from './contexts/ThemeContext';
import { Provider } from 'react-redux';
import breezeStore from './store/breezeStore';
import { OffcanvasProvider } from './contexts/OffcanvasContext';
function App() {
  return (
    <Provider store={breezeStore}>
      <ThemeProvider>
        <OffcanvasProvider>
          <RouterProvider router={router} />
        </OffcanvasProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
