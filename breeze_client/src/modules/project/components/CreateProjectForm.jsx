import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { CustomTextInput, CustomTextArea } from '../../../common/fields';
import {
  technologyOptions,
  languageOptions,
  stylingOptions,
  buildToolOptions,
  initialNewProjectFormConfig,
} from '../constants/CreateNewProjectFormConstants';
import { BreezeModal } from '../../../common/display';
import CustomBadge from '../../../common/fields/f.badge';
import { validator } from '../../../utils/Validator';

const CreateProjectForm = ({ handleSubmit, isCreateProjectModalOpen, setIsCreateProjectModalOpen }) => {
  const [formValues, setFormValues] = useState(initialNewProjectFormConfig);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(isCreateProjectModalOpen);

  useEffect(() => {
    if (isCreateProjectModalOpen) setIsModalOpen(true);
  }, [isCreateProjectModalOpen]);

  const closeModal = () => {
    setIsCreateProjectModalOpen(false);
    setFormValues(initialNewProjectFormConfig);
    setIsSubmitted(false);
  };

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
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
    setIsSubmitted(true);

    const isFormValid = [
      formValues.name,
      formValues.author,
      formValues.technology,
      formValues.language,
      formValues.styling.length > 0,
      formValues.buildTool,
    ].every(Boolean);

    if (!isFormValid) {
      return;
    }

    handleSubmit(formValues);
    closeModal();
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
    isModalOpen && (
      <BreezeModal
        isOpen={isCreateProjectModalOpen}
        afterClosed={() => setIsModalOpen(false)}
        onClose={closeModal}
        header={modalHeader}
        footer={modalFooter}
      >
        <form className="home-custom-form">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3 home-form-box">
                <CustomTextInput
                  name="name"
                  value={formValues.name}
                  onChange={(value) => handleInputChange('name', value)}
                  config={{ label: 'Application Name' }}
                  isSubmitted={isSubmitted}
                  customValidations={[validator.REQUIRED, validator.PROJECT_NAME_VALIDATION]}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3 home-form-box">
                <CustomTextInput
                  name="author"
                  value={formValues.author}
                  onChange={(value) => handleInputChange('author', value)}
                  config={{ label: 'Author' }}
                  customValidations={[validator.REQUIRED]}
                  isSubmitted={isSubmitted}
                />
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
                />
              </div>
            </div>
          </div>
          <div className="row">
            <CustomBadge
              label="Technology"
              options={technologyOptions}
              selectedValue={formValues.technology}
              onBadgeSelect={(value) => handleBadgeSelection('technology', value)}
              isRequired={true}
              isSubmitted={isSubmitted}
              config={{
                groupClass: 'mb-3 home-form-box',
                labelClass: 'med-font color-text mb-1 fw-semibold',
                badgeWrapperClass: 'home-badges-wrapper',
              }}
            />
          </div>
          <div className="row">
            <CustomBadge
              label="Language"
              options={languageOptions}
              selectedValue={formValues.language}
              onBadgeSelect={(value) => handleBadgeSelection('language', value)}
              isRequired={true}
              isSubmitted={isSubmitted}
              errorMessage="Choose a language!"
              config={{
                groupClass: 'mb-3 home-form-box',
                labelClass: 'med-font color-text mb-1 fw-semibold',
                badgeWrapperClass: 'home-badges-wrapper',
              }}
            />
          </div>
          <div className="row">
            <CustomBadge
              label="Styling Components"
              options={stylingOptions}
              selectedValue={formValues.styling}
              isRequired={true}
              isSubmitted={isSubmitted}
              onBadgeSelect={(value) => handleBadgeSelection('styling', value)}
              config={{
                groupClass: 'mb-3 home-form-box',
                labelClass: 'med-font color-text mb-1 fw-semibold',
                badgeWrapperClass: 'home-badges-wrapper',
              }}
            />
          </div>
          <div className="row">
            <CustomBadge
              label="Build Tool"
              options={buildToolOptions}
              selectedValue={formValues.buildTool}
              onBadgeSelect={(value) => handleBadgeSelection('buildTool', value)}
              isRequired={true}
              isSubmitted={isSubmitted}
              config={{
                groupClass: 'mb-3 home-form-box',
                labelClass: 'med-font color-text mb-1 fw-semibold',
                badgeWrapperClass: 'home-badges-wrapper',
              }}
            />
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
    )
  );
};

CreateProjectForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isCreateProjectModalOpen: PropTypes.bool.isRequired,
  setIsCreateProjectModalOpen: PropTypes.func.isRequired,
};

export default CreateProjectForm;
