import PropTypes from 'prop-types';
import { useState } from 'react';
import { CustomTextInput, CustomTextArea } from '../../../common/fields';
import {
  technologyOptions,
  languageOptions,
  stylingOptions,
  buildToolOptions,
  initialNewProjectFormConfig,
} from '../constants/CreateNewProjectFormConstants';
import { BreezeModal } from '../../../common/display';

const CreateProjectForm = ({ handleSubmit, isCreateProjectModalOpen, setIsCreateProjectModalOpen }) => {
  const [formValues, setFormValues] = useState(initialNewProjectFormConfig);
  const [errors, setErrors] = useState({});

  const closeModal = () => {
    setIsCreateProjectModalOpen(false);
    setFormValues(initialNewProjectFormConfig);
    setErrors({});
  };

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBadgeSelection = (name, selectedValue) => {
    setFormValues((prevFormValues) => {
      if (name === 'styling') {
        const currentStyling = prevFormValues.styling;
        const isSelected = currentStyling.includes(selectedValue);
        return {
          ...prevFormValues,
          styling: isSelected
            ? currentStyling.filter((item) => item !== selectedValue)
            : [...currentStyling, selectedValue],
        };
      } else {
        return {
          ...prevFormValues,
          [name]: prevFormValues[name] === selectedValue ? '' : selectedValue,
        };
      }
    });
  };

  const validateAndSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    for (const [key, value] of Object.entries(formValues)) {
      if (
        !value &&
        (key === 'name' || key === 'author' || key === 'technology' || key === 'language' || key === 'buildTool')
      ) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      }
      if (key === 'styling' && value.length === 0) {
        newErrors[key] = 'At least one styling component is required';
      }
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
    } else {
      handleSubmit(formValues);
      closeModal();
    }
  };

  const modalHeader = {
    title: 'Create New Project',
    showCloseButton: true,
  };

  const modalFooter = {
    buttons: [
      {
        label: 'Cancel',
        onClick: closeModal,
        className: 'btn br-text-primary med-font',
      },
      {
        label: 'Create',
        onClick: validateAndSubmit,
        className: 'btn btn-filled med-font',
      },
    ],
  };

  return (
    <BreezeModal isOpen={isCreateProjectModalOpen} onClose={closeModal} header={modalHeader} footer={modalFooter}>
      <form className="home-custom-form">
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3 home-form-box">
              <CustomTextInput
                name="name"
                value={formValues.name}
                onChange={(value) => handleInputChange('name', value)}
                config={{ label: 'Application Name' }}
                required
              />
              {errors.name && <p className="small-font text-danger">{errors.name}</p>}
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 home-form-box">
              <CustomTextInput
                name="author"
                value={formValues.author}
                onChange={(value) => handleInputChange('author', value)}
                config={{ label: 'Author' }}
                required
              />
              {errors.author && <p className="small-font text-danger">{errors.author}</p>}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-3 home-form-box">
              <label htmlFor="logo" className="med-font color-text mb-1 fw-semibold">
                Upload image for project logo
              </label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                id="logo"
                onChange={(e) => handleInputChange('logo', e.target.files[0])}
              />
              <p className="color-text small-font">Suggested dimensions: 512x512</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3 home-form-box">
              <CustomTextArea
                name="description"
                value={formValues.description}
                onChange={(value) => handleInputChange('description', value)}
                config={{ label: 'Description' }}
                required
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="mb-3 home-form-box">
            <label className="med-font color-text mb-1 fw-semibold">
              Technology <span className="text-danger">*</span>
            </label>
            <div className="home-badges-wrapper">
              {technologyOptions.map((option) => (
                <span
                  className={`home-badge home-theme-badge ${formValues.technology === option.label ? 'breeze-badge-active' : ''}`}
                  key={option.label}
                  onClick={() => handleBadgeSelection('technology', option.label)}
                >
                  <img src={option.logo} alt={`${option.label} logo`} />
                  <span className="med-font ms-1">{option.label}</span>
                </span>
              ))}
            </div>
            {errors.technology && <p className="small-font text-danger">{errors.technology}</p>}
          </div>
        </div>
        <div className="row">
          <div className="mb-3 home-form-box">
            <label className="med-font color-text mb-1 fw-semibold">
              Language <span className="text-danger">*</span>
            </label>
            <div className="home-badges-wrapper">
              {languageOptions.map((option) => (
                <span
                  className={`home-badge home-theme-badge ${formValues.language === option.label ? 'breeze-badge-active' : ''}`}
                  key={option.label}
                  onClick={() => handleBadgeSelection('language', option.label)}
                >
                  <img src={option.logo} alt={`${option.label} logo`} />
                  <span className="med-font ms-1">{option.label}</span>
                </span>
              ))}
            </div>
            {errors.language && <p className="small-font text-danger">{errors.language}</p>}
          </div>
        </div>
        <div className="row">
          <div className="mb-3 home-form-box">
            <label className="med-font color-text mb-1 fw-semibold">Styling Components</label>
            <div className="home-badges-wrapper">
              {stylingOptions.map((option) => (
                <span
                  className={`home-badge home-theme-badge ${formValues.styling.includes(option.label) ? 'breeze-badge-active' : ''}`}
                  key={option.label}
                  onClick={() => handleBadgeSelection('styling', option.label)}
                >
                  <img src={option.logo} alt={`${option.label} logo`} />
                  <span className="med-font ms-1">{option.label}</span>
                </span>
              ))}
            </div>
            {errors.styling && <p className="small-font text-danger">{errors.styling}</p>}
          </div>
        </div>
        <div className="row">
          <div className="mb-3 home-form-box">
            <label className="med-font color-text mb-1 fw-semibold">
              Build Tool <span className="text-danger">*</span>
            </label>
            <div className="home-badges-wrapper">
              {buildToolOptions.map((option) => (
                <span
                  className={`home-badge home-theme-badge ${formValues.buildTool === option.label ? 'breeze-badge-active' : ''}`}
                  key={option.label}
                  onClick={() => handleBadgeSelection('buildTool', option.label)}
                >
                  <img src={option.logo} alt={`${option.label} logo`} />
                  <span className="med-font ms-1">{option.label}</span>
                </span>
              ))}
            </div>
            {errors.buildTool && <p className="small-font text-danger">{errors.buildTool}</p>}
          </div>
        </div>
        <div className="row">
          <div className="mb-3 home-form-box">
            <label htmlFor="layout" className="med-font color-text mb-1 fw-semibold">
              Layout
            </label>
            <div className="home-badges-wrapper">
              <span className="home-badge home-theme-badge">
                <div className="home-block"></div>
              </span>
              <span className="home-badge home-theme-badge">
                <div className="home-block"></div>
              </span>
            </div>
          </div>
        </div>
      </form>
      <hr className="m-0" />
    </BreezeModal>
  );
};

CreateProjectForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isCreateProjectModalOpen: PropTypes.bool.isRequired,
  setIsCreateProjectModalOpen: PropTypes.func.isRequired,
};

export default CreateProjectForm;
