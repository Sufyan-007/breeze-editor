import { useState } from 'react';
import deleteicon from '../../../assets/svgs/deleteIcon.svg';
import { BreezeTable, BreezeModal } from '../../../common/display/index';
import '../styles/CustomZipPackage.css';
import CustomTextInput from '../../../common/fields/f.textInput';
import CustomFileUploadField from '../../../common/fields/f.upload-file-button';
import filesData from '../constants/FilesData';
import columns from '../constants/TableStructure';

function CustomZipPackagePage() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [formData, setFormData] = useState({
    filename: '',
    description: '',
    file: null,
  });
  const [error, setError] = useState('');

  const actions = (item) => (
    <i
      class="bi bi-trash"
      alt="Delete icon"
      onClick={() => {
        setFileToDelete(item);
        setShowDeleteModal(true);
      }}
      style={{ cursor: 'pointer', color: 'red', fontSize: '18px' }}
    />
  );

  const handleDelete = () => {
    // Implement the actual file deletion logic here
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const handleModal = () => {
    setShowModal(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Implement your file upload logic here
    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormData({
      filename: '',
      description: '',
      file: null,
    });
  };

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    if (files) {
      const file = files[0];
      // Check if the file size exceeds 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB. Please select a smaller file.');
        return;
      }
      setFormData((prevData) => ({
        ...prevData,
        filename: file.name,
        [name]: file,
      }));
      setError('');
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(filesData.length / pageSize)) {
      setCurrentPage(newPage);
    }
  };

  const handleFileSelect = (file) => {
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        file,
        filename: file.name, // Set file name once file is selected
      }));
    }
  };
  const header = { title: 'Upload File' };
  const footer = {
    buttons: [
      {
        label: 'Cancel',
        onClick: () => setShowModal(false),
        className: 'btn br-text-primary med-font',
      },
      {
        label: 'Upload',
        onClick: handleSubmit,
        className: 'btn br-text-primary btn-filled med-font',
      },
    ],
  };

  const deleteModalHeader = { title: 'Confirm Deletion?' };
  const deleteModalFooter = {
    buttons: [
      {
        label: 'Cancel',
        onClick: () => setShowDeleteModal(false),
        className: 'btn br-text-primary med-font',
      },
      {
        label: 'Delete',
        onClick: handleDelete,
        className: 'btn br-text-primary med-font btn-delete',
      },
    ],
  };
  return (
    <div>
      <div className="container-fluid py-2 px-3">
        <div className="col-12 d-flex justify-content-between">
          <h3 className="my-2">Custom Packages</h3>
          <div className="d-flex">
            <button className="upload-zip med-font" onClick={() => handleModal()}>
              Upload Zip
            </button>
          </div>
        </div>

        <div className="my-2">
          <BreezeTable
            columns={columns}
            data={filesData}
            actions={actions}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            sortBy="filename"
            sortDirection="asc"
            actionPlacement={'end'}
          />
        </div>
      </div>
      <BreezeModal isOpen={showModal} onClose={() => setShowModal(false)} header={header} footer={footer}>
        <form onSubmit={handleSubmit}>
          {error && <p className="text-danger">{error}</p>}
          <div className="row">
            <div className="col mb-3">
              <CustomFileUploadField
                onFileSelect={handleFileSelect}
                accept=".zip"
                config={{
                  label: 'Choose File',
                  groupClass: 'form-group',
                  className: 'btn br-text-primary med-font',
                }}
              />
            </div>
          </div>

          <div className="row">
            <div className="col mb-3">
              <CustomTextInput
                name="description"
                value={formData.description}
                onChange={(value) => handleChange({ target: { name: 'description', value } })}
                config={{
                  label: 'Description',
                  groupClass: 'form-group',
                }}
                required
              />
            </div>
          </div>
          <div className="mb-3">
              <CustomTextInput
                name="filename"
                value={formData.filename}
                onChange={(value) => handleChange({ target: { name: 'filename', value } })}
                config={{
                  label: 'File Name',
                  groupClass: 'form-group',
                }}
                required
              />
            </div>
          
        </form>
      </BreezeModal>

      <BreezeModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        header={deleteModalHeader}
        footer={deleteModalFooter}
      >
        <p>Are you sure you want to delete {fileToDelete?.fileName}?</p>
      </BreezeModal>
    </div>
  );
}

export default CustomZipPackagePage;
