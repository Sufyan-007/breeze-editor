import PropTypes from 'prop-types';
import { CustomButtonField, CustomTextInput } from '../../../common/fields';
import { validator } from '../../../utils/Validator';
import CustomMultiSelectDropdown from '../../../common/fields/f.custom-multiselect';

const AddNewUser = ({ userData, setUserData, onSubmit, onCancel }) => {
  const rolesOptions = [
    { value: '1', label: 'User' },
    { value: '2', label: 'Admin' },
    { value: '3', label: 'Editor' },
    { value: '4', label: 'Viewer' },
  ];

  const projectOptions = [
    { value: 'Project A', label: 'Project A' },
    { value: 'Project B', label: 'Project B' },
    { value: 'Project C', label: 'Project C' },
    { value: 'Project D', label: 'Project D' },
  ];

  const handleInputChange = (field, value) => {
    setUserData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleRoleChange = (selectedValues) => {
    setUserData((prevData) => ({ ...prevData, roles: selectedValues }));
  };

  const handleProjectsChange = (selectedValues) => {
    setUserData((prevData) => ({ ...prevData, projects: selectedValues }));
  };
  const formIsValid = [userData.username, userData.email, userData.phone_number, userData.password].every(Boolean);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (formIsValid) {
      onSubmit({ id: new Date().getTime(), ...userData });
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <CustomTextInput
        name="username"
        value={userData.username}
        onChange={(value) => handleInputChange('username', value)}
        placeholder="Enter user name"
        config={{ label: 'Name' }}
        autoComplete="username"
        customValidations={[validator.REQUIRED]}
      />
      <CustomTextInput
        name="email"
        value={userData.email}
        onChange={(value) => handleInputChange('email', value)}
        placeholder="Enter email"
        config={{ label: 'Email', groupClass: 'mt-2' }}
        customValidations={[validator.REQUIRED, validator.EMAIL_VALIDATION]}
      />
      <CustomTextInput
        name="phone_number"
        value={userData.phone_number}
        onChange={(value) => handleInputChange('phone_number', value)}
        placeholder="Enter phone number"
        config={{ label: 'Phone Number', groupClass: 'mt-2' }}
        autoComplete="tel"
        customValidations={[validator.REQUIRED, validator.PHONE_VALIDATION]}
      />
      <CustomTextInput
        name="password"
        value={userData.password}
        onChange={(value) => handleInputChange('password', value)}
        placeholder="Enter password"
        type="password"
        autoComplete="new-password"
        config={{ label: 'Password', groupClass: 'mt-2' }}
        customValidations={[validator.REQUIRED, validator.PASSWORD_VALIDATION]}
      />
      <CustomTextInput
        name="confirmPassword"
        value={userData.confirmPassword}
        onChange={(value) => handleInputChange('confirmPassword', value)}
        placeholder="Confirm password"
        type="password"
        autoComplete="new-password"
        config={{ label: 'Confirm Password', groupClass: 'mt-2' }}
        customValidations={[
          validator.REQUIRED,
          (value) => validator.CONFIRM_PASSWORD_VALIDATION(value, userData.password),
        ]}
      />
      <CustomMultiSelectDropdown
        name="roles"
        values={userData.roles}
        onChange={handleRoleChange}
        options={rolesOptions}
        config={{
          label: 'Role',
          groupClass: 'mt-2',
        }}
      />
      <CustomMultiSelectDropdown
        name="projects"
        values={userData.projects}
        onChange={handleProjectsChange}
        options={projectOptions}
        config={{
          label: 'Projects',
          groupClass: 'mt-2',
        }}
      />
      <div className="d-flex justify-content-end mt-3">
        <CustomButtonField id="cancelButton" label="Cancel" onClick={onCancel} className="me-2 btn btn-secondary" />
        <CustomButtonField
          id="submitButton"
          label="Submit"
          type="submit"
          className="btn btn-primary"
          disabled={!formIsValid}
        />
      </div>
    </form>
  );
};

AddNewUser.propTypes = {
  userData: PropTypes.object.isRequired,
  setUserData: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddNewUser;
