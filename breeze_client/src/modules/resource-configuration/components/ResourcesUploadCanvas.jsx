import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import CustomModal from '../../../common/display/modal/BreezeModal';
import BreezeDirectory from '../../../common/directory/BreezeDirectory';
import { CustomButtonField, CustomTextInput } from '../../../common/fields';
import BreezeOffCanvas from '../../../common/display/offcanvas/BreezeOffcanvas';
import CustomFileUploadField from '../../../common/fields/f.upload-file-button';
import { validator } from '../../../utils/Validator';

const ResourcesUploadCanvas = ({ onSubmit }) => {
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [tempSelectedFolderId, setTempSelectedFolderId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    filename: '',
    selectedFolderId: null,
    description: '',
    file: null,
  });
  const [showFolderModal, setShowFolderModal] = useState(false);

  useEffect(() => {
    setFormData((prevData) => ({
      ...prevData,
      selectedFolderId: selectedFolderId,
    }));
  }, [selectedFolderId]);

  const handleInputChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (file) => {
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        filename: file.name,
        file: file,
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    const formIsValid = [formData.selectedFolderId].every(Boolean);

    if (formIsValid) {
      onSubmit(formData);
      resetForm();
      setShowOffCanvas(false);
    }
  };

  const handleFolderSelection = () => {
    setSelectedFolderId(tempSelectedFolderId);
    setShowFolderModal(false);
  };

  const resetForm = () => {
    setSelectedFolderId(null);
    setTempSelectedFolderId(null);
    setFileInputKey(Date.now());
    setFormData({
      filename: '',
      selectedFolderId: null,
      description: '',
      file: null,
    });
    setIsSubmitted(false);
  };

  const closeOffCanvas = () => {
    resetForm();
    setShowOffCanvas(false);
  };

  return (
    <>
      <button onClick={() => setShowOffCanvas(true)} className="btn btn-primary">
        Upload File
      </button>
      <BreezeOffCanvas
        show={showOffCanvas}
        onClose={closeOffCanvas}
        title="Upload File"
        placement="end"
        backdrop={true}
        size="50%"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-3 resources-form-box">
            <CustomFileUploadField
              key={fileInputKey}
              onFileSelect={handleFileChange}
              config={{
                label: 'Choose File',
                groupClass: 'form-group',
                className: 'btn br-text-primary med-font',
              }}
            />
          </div>
          <div className="mb-3">
            <CustomTextInput
              name="selectedFolderId"
              value={formData.selectedFolderId || 'No Folder Selected'}
              config={{ label: 'Selected Folder' }}
              // customValidations={[validator.REQUIRED]}
              isSubmitted={isSubmitted}
              onClick={() => setShowFolderModal(true)}
              readOnly
            />
          </div>
          <div className="mb-3">
            <CustomTextInput
              name="description"
              value={formData.description}
              onChange={(value) => handleInputChange('description', value)}
              config={{ label: 'Description' }}
            />
          </div>
          {formData.filename && (
            <div className="mb-3">
              <CustomTextInput
                name="filename"
                value={formData.filename}
                onChange={(value) => handleInputChange('filename', value)}
                config={{ label: 'File Name' }}
              />
            </div>
          )}
          <div className="d-flex justify-content-end">
            <CustomButtonField
              type="submit"
              label="Upload"
              className="btn br-text-tertiary mx-1"
              style={{ backgroundColor: 'green' }}
            />
            <CustomButtonField
              type="button"
              label="Cancel"
              onClick={closeOffCanvas}
              className="btn br-background-secondary br-text-tertiary"
            />
          </div>
        </form>
      </BreezeOffCanvas>

      <CustomModal
        isOpen={showFolderModal}
        onClose={() => setShowFolderModal(false)}
        size="lg"
        header={{ title: 'Select file location', showCloseButton: true }}
      >
        <div style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
          <BreezeDirectory setSelectedFolderId={setTempSelectedFolderId} selectedFolderId={tempSelectedFolderId} />
          <div className="d-flex justify-content-end mt-2">
            <button className="btn btn-primary" onClick={handleFolderSelection} disabled={!tempSelectedFolderId}>
              Select as path
            </button>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

ResourcesUploadCanvas.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default ResourcesUploadCanvas;
