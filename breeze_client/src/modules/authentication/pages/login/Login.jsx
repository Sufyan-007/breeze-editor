import { useContext, useRef, useState } from 'react';
import logos from '../../../../assets/svgs/index';
import images from '../../../../assets/images/index';
import ThemeContext from '../../../../contexts/ThemeContext';
import '../../styles/authentication_module.css';
import { router } from '../../../../routes/routing';
import { login } from '../../services/authService';

function Login() {
  const { toggleTheme } = useContext(ThemeContext);
  const [errorMessage, setErrorMessage] = useState('');
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const handleLogin = async (username, password) => {
    try {
      const { accessToken } = await login(username, password);
      console.log('Logged in successfully. Token:', accessToken);
      // Save token to local storage or state management
      localStorage.setItem('accessToken', accessToken);
      // Navigate to home after successful login
      router.navigate('/all-projects');
    } catch (error) {
      setErrorMessage('Invalid username or password');
      console.error('Login error:', error.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage('');

    const username = usernameRef.current.value;
    const password = passwordRef.current.value;

    handleLogin(username, password);
  };

  return (
    <div className="h-100 container-fluid br-background-primary">
      <div className="row h-100 overflow-auto">
        <div className="col-8 left-side d-block br-background-secondary">
          <div className="login-img-fluid">
            <img src={images.DeveloperActivityAmico} alt="Developer Activity Amico" />
          </div>
        </div>

        <div className="col-4 right-side d-flex flex-column justify-content-between">
          <div className="login-header">
            <div className="logo">
              <img src={images.BreezeStudio} alt="Breeze Studio Logo" />
            </div>
            <div className="theme-switch">
              <button
                type="button"
                className="btn btn-theme m-0 p-0"
                onClick={toggleTheme}
                title="Toggle dark/light mode"
              >
                <img src={logos.darkLightModeSwitch} alt="Toggle dark/light mode" />
              </button>
            </div>
          </div>

          <div className="login-form-container px-xxl-5 p-md-4 px-1 mt-4 mt-lg-0">
            <div className="login-form">
              <h2 className="login-text br-text-tertiary">Welcome to Breeze Studio</h2>
              <h3 className="mb-4 login-med-font br-text-primary">Your one-stop React -MS</h3>
              <form className="login-custom-form" onSubmit={handleSubmit}>
                <div className="mb-3 login-form-box">
                  <label htmlFor="username" className="login-text login-med-font mb-1 br-text-primary">
                    Username
                  </label>
                  <input
                    placeholder="Enter Username"
                    type="text"
                    className="form-control br-text-primary"
                    id="username"
                    name="username"
                    ref={usernameRef}
                    required
                  />
                </div>
                <div className="mb-3 login-form-box">
                  <label htmlFor="password" className="login-text login-med-font mb-1 br-text-primary">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control br-text-primary"
                    placeholder="Enter Password"
                    id="password"
                    name="password"
                    ref={passwordRef}
                    required
                  />
                </div>
                {errorMessage && <p className="text-danger">{errorMessage}</p>}
                <div className="mb-3">
                  <input type="checkbox" id="rememberMe" />
                  <label className="login-small-font px-1 br-text-primary" htmlFor="rememberMe">
                    Remember this device
                  </label>
                  <a href="forget-3.html" className="text-decoration-none float-end login-small-font mt-1">
                    Forgot Password?
                  </a>
                </div>
                <button type="submit" className="login-button btn-filled w-100 mb-3">
                  Sign In
                </button>
              </form>
            </div>
          </div>

          <div className="login-footer">
            <h2 className="text-center login-med-font br-text-primary">
              © 2024 Argusoft All rights reserved <br />
              Privacy Policy | Terms and Conditions
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
