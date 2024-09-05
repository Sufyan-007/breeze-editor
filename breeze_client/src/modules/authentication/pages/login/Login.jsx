import { useContext } from 'react';
import darkLightModeSwitch from '../../../../assets/svgs/dark-light-mode-switch.svg';
import DeveloperActivityAmico from '../../../../assets/images/Developer activity-amico 1.png';
import BreezeStudio from '../../../../assets/images/Breeze Studio.png';
import ThemeContext from '../../../../contexts/ThemeContext';
import '../../styles/authentication_module.css';
// import CustomFormBuilder from '../../../../common/form_builder/CustomFormBuilder';
// import { loginMappings } from '../../../../common/form_builder/mappings/TestMappings';
function Login() {
  const { toggleTheme } = useContext(ThemeContext);
  // const [loginData, setLoginData] = useState({
  //   username: '',
  //   password: '',
  //   rememberMe: true,
  // });
  // const handleLoginChange = ({ name, value }) => {
  //   setLoginData((prevValues) => ({
  //     ...prevValues,
  //     [name]: value,
  //   }));
  // };
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  // const customStyles = {
  //   form: 'login-custom-form',
  //   fieldWrapper: 'login-form-box mb-3',
  //   label: 'login-text login-med-font mb-1 br-text-primary',
  //   text: { input: 'form-control', label: 'login-text login-med-font mb-1 br-text-primary', div: 'mb-3' },
  //   button: 'button login-btn-filled w-100 mb-3',
  //   select: { padding: '8px', fontSize: '16px' },
  // };

  return (
    <div className="h-100 container-fluid br-background-primary">
      <div className="row h-100 overflow-auto">
        <div className="col-8 left-side d-block br-background-secondary">
          <div className="login-img-fluid">
            <img src={DeveloperActivityAmico} alt="Developer Activity Amico" />
          </div>
        </div>

        <div className="col-4 right-side d-flex flex-column justify-content-between">
          <div className="login-header">
            <div className="logo">
              <img src={BreezeStudio} alt="Breeze Studio Logo" />
            </div>
            <div className="login-theme-switch">
              <button
                type="button"
                className="btn btn-theme m-0 p-0"
                onClick={toggleTheme}
                title="Toggle dark/light mode"
              >
                <img src={darkLightModeSwitch} alt="Toggle dark/light mode" />
              </button>
            </div>
          </div>

          <div className="login-form-container px-xxl-5 p-md-4 px-1 mt-4 mt-lg-0">
            <div className="login-form">
              <h2 className="login-text br-text-primary">Welcome to Breeze Studio</h2>
              <h3 className="mb-4 login-med-font br-text-secondary">Your one-stop React -MS</h3>
              <form className="login-custom-form">
                <div className="mb-3 login-form-box">
                  <label htmlFor="username" className="login-text login-med-font mb-1 br-text-primary">
                    Username
                  </label>
                  <input type="text" className="form-control" id="username" name="username" required />
                </div>
                <div className="mb-3 login-form-box">
                  <label htmlFor="password" className="login-text login-med-font mb-1 br-text-primary">
                    Password
                  </label>
                  <input type="password" className="form-control" id="password" name="password" required />
                </div>
                <div className="mb-3">
                  <input type="checkbox" id="rememberMe" />
                  <label className="login-small-font px-1 br-text-primary" htmlFor="rememberMe">
                    Remember this device
                  </label>
                  <a href="forget-3.html" className="text-decoration-none float-end login-small-font mt-1">
                    Forgot Password?
                  </a>
                </div>
                <button className="button login-btn-filled w-100 mb-3" onClick={handleSubmit}>
                  Sign In
                </button>
              </form>
              {/* 
              <CustomFormBuilder
                config={loginMappings}
                formValues={loginData}
                onFormValueChange={handleLoginChange}
                styles={customStyles}
              /> */}
            </div>
          </div>

          <div className="login-footer">
            <h2 className="text-center br-text-secondary">
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
