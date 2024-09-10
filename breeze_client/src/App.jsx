import { RouterProvider } from 'react-router-dom';
import './App.css';
import { router } from './routes/routing';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
