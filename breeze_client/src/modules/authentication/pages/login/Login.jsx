import { useContext, useState } from 'react';
import logos from '../../../../assets/svgs/index';
import images from '../../../../assets/images/index';
import ThemeContext from '../../../../contexts/ThemeContext';
import '../../styles/authentication_module.css';
import { router } from '../../../../routes/routing';
import { login } from '../../services/authService';
import { CustomButtonField, CustomTextInput } from '../../../../common/fields';
import { validator } from '../../../../utils/Validator';

function Login() {
  const { toggleTheme } = useContext(ThemeContext);
  const [userDetails, setUserDetails] = useState({
    username: '',
    password: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleInputChange = (name, value) => {
    setUserDetails({ ...userDetails, [name]: value });
    setUsernameError('');
    setPasswordError('');
  };

  const handleLogin = async (username, password) => {
    try {
      const response = await login(username, password);
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('userId', response.user_id);
        localStorage.setItem('refreshToken', response.refreshToken);

        router.navigate('/all-projects');
      } else {
        const errorMessage = response.non_field_errors?.[0];

        if (errorMessage) {
          setUsernameError(errorMessage.includes('User does not exist.') ? errorMessage : '');
          setPasswordError(errorMessage.includes('Incorrect password.') ? errorMessage : '');
        }
      }
    } catch (error) {
      console.error('Login error:', error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const formIsValid = [userDetails.username, userDetails.password].every(Boolean);

    if (formIsValid) {
      handleLogin(userDetails.username, userDetails.password);
    }
  };

  return (
    <div className="h-100 container-fluid br-background-primary">
      <div className="row h-100 overflow-auto">
        <div className="col-8 left-side d-block br-background-secondary">
          <div className="authentication-img-fluid">
            <img src={images.DeveloperActivityAmico} alt="Developer Activity Amico" />
          </div>
        </div>

        <div className="col-4 right-side d-flex flex-column justify-content-between">
          <div className="authentication-header">
            <div className="logo">
              <img src={images.BreezeStudio} alt="Breeze Studio Logo" />
            </div>
            <div className="theme-switch">
              <CustomButtonField
                type="button"
                onClick={toggleTheme}
                className="btn btn-theme m-0 p-0"
                icon={<img src={logos.darkLightModeSwitch} alt="Toggle dark/light mode" />}
                title="Toggle dark/light mode"
              />
            </div>
          </div>

          <div className="authentication-form-container px-xxl-5 p-md-4 px-1 mt-4 mt-lg-0">
            <div className="authentication-form">
              <h2 className="authentication-text br-text-tertiary mb-3">Welcome to Breeze Studio</h2>
              <form className="authentication-custom-form" onSubmit={handleSubmit}>
                <div className="mb-3 authentication-form-box">
                  <CustomTextInput
                    name="username"
                    value={userDetails.username}
                    onChange={(value) => handleInputChange('username', value)}
                    config={{
                      label: 'Username',
                      className: 'form-control br-text-primary',
                    }}
                    placeholder="Enter Username"
                    customValidations={[validator.REQUIRED, validator.USERNAME_VALIDATION]}
                    isSubmitted={isSubmitted}
                  />
                  {usernameError && <div className="text-danger small-font mt-1">{usernameError}</div>}{' '}
                </div>
                <div className="mb-3 authentication-form-box">
                  <CustomTextInput
                    name="password"
                    value={userDetails.password}
                    onChange={(value) => handleInputChange('password', value)}
                    config={{
                      label: 'Password',
                      className: 'form-control br-text-primary',
                    }}
                    placeholder="Enter Password"
                    type="password"
                    customValidations={[validator.REQUIRED]}
                    isSubmitted={isSubmitted}
                  />
                  {passwordError && <div className="text-danger small-font mt-1">{passwordError}</div>}{' '}
                </div>

                <div className="">
                  <a className="text-decoration-none float-end authentication-small-font mb-3">Forgot Password?</a>
                </div>
                <CustomButtonField
                  type="submit"
                  className="authentication-button btn-filled w-100 mb-3"
                  label="Sign In"
                />
              </form>
            </div>
          </div>

          <div className="authentication-footer">
            <h2 className="text-center authentication-med-font br-text-primary">
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
