import { useEffect, useState } from 'react';
import CustomFormBuilder from './CustomFormBuilder';
import { sampleMap, loginMappings } from './mappings/TestMappings';

const TestingComponent = () => {
  const [userData, setUserData] = useState({
    name: '',
    age: 0,
    role: '',
    gender: '',
    subscribed: false,
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    rememberMe: true,
  });

  const handleFormValueChange = ({ name, value }) => {
    setUserData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleLoginChange = ({ name, value }) => {
    setLoginData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  useEffect(() => {
    console.log(userData, 'new user data');
    console.log(loginData, 'new login data');
  }, [userData, loginData]);

  const customStyles = {
    form: 'login-custom-form',
    fieldWrapper: 'login-form-box',
    label: 'login-text login-med-font mb-1 br-text-primary',
    input: 'form-control',
    button: { padding: '8px 16px', fontSize: '16px', backgroundColor: 'gray' },
    select: { padding: '8px', fontSize: '16px' },
  };

  return (
    <div>
      <h1>Custom Form Builder</h1>
      <h2>Sample</h2>
      <CustomFormBuilder
        config={sampleMap}
        formValues={userData}
        onFormValueChange={handleFormValueChange}
        styles={customStyles}
      />
      <h2>Login Form</h2>
      <CustomFormBuilder
        config={loginMappings}
        formValues={loginData}
        onFormValueChange={handleLoginChange}
        styles={customStyles}
      />
    </div>
  );
};

export default TestingComponent;
