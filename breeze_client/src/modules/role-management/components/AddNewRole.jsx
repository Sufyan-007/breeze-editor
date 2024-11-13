import { useState } from 'react';
import PropTypes from 'prop-types';
import { CustomButtonField, CustomTextInput } from '../../../common/fields';
import CustomMultiSelectDropdown from '../../../common/fields/f.custom-multiselect';

const AddNewRole = ({ onSubmit, onCancel }) => {
  const [roleName, setRoleName] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const featuresOptions = [
    { value: 'Full Access', label: 'Full Access' },
    { value: 'Read only Access', label: 'Read only Access' },
    { value: 'Edit Access', label: 'Edit Access' },
  ];

  const handleRoleNameChange = (e) => {
    setRoleName(e);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ roleName, selectedFeatures });
    setRoleName('');
    setSelectedFeatures([]);
  };

  return (
    <div>
      <form onSubmit={handleFormSubmit}>
        <CustomTextInput
          name="roleName"
          value={roleName}
          onChange={handleRoleNameChange}
          placeholder="Enter role name"
          config={{
            label: (
              <>
                Role Name <span className="text-danger">*</span>
              </>
            ),
          }}
        />

        <CustomMultiSelectDropdown
          config={{
            label: (
              <>
                Features <span className="text-danger">*</span>
              </>
            ),
            groupClass: 'mt-3',
            placeholder: 'Select features',
          }}
          name="features"
          values={selectedFeatures}
          onChange={setSelectedFeatures}
          options={featuresOptions}
        />

        <div className="d-flex justify-content-end mt-3">
          <CustomButtonField label="Cancel" onClick={onCancel} className="me-2 btn btn-secondary" />
          <CustomButtonField label="Submit" type="submit" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
};

AddNewRole.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default AddNewRole;
