import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { BreezeTable, BreezeModal } from '../../../common/display/index';
import '../styles/CustomZipPackage.css';
import CustomTextInput from '../../../common/fields/f.textInput';
import CustomFileUploadField from '../../../common/fields/f.upload-file-button';
import columns from '../constants/TableStructure';

import { fetchZipFilesAction, uploadZipFileAction, deleteZipFileAction } from '../redux/customZipActions';
import { fetchFolderConfig } from '../../../redux/directory_management/directory_actions';

function CustomZipPackagePage() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { projectName } = useParams();
  const [formData, setFormData] = useState({
    filename: '',
    description: '',
    file: null,
  });
  const [error, setError] = useState('');

  const dispatch = useDispatch(); //Initialize dispatch

  const { zipFiles, status } = useSelector((state) => state.zip);

  //fetch the list of zip files on component mount
  useEffect(() => {
    if (zipFiles.length === 0) {
      dispatch(fetchZipFilesAction(projectName));
    }
  }, [dispatch, projectName, zipFiles]);

  if (status === 'loading') {
    return;
  }

  if (status === 'failed') {
    return;
  }
  const actions = (item) => (
    <i
      className="bi bi-trash"
      alt="Delete icon"
      onClick={() => {
        setFileToDelete(item);
        setShowDeleteModal(true);
      }}
      style={{ cursor: 'pointer', color: 'red', fontSize: '18px' }}
    />
  );

  const handleDelete = () => {
    if (fileToDelete) {
      // Dispatch delete action
      dispatch(deleteZipFileAction({ fileName: fileToDelete.fileName, projectName: projectName })).then(() => {
        dispatch(fetchZipFilesAction(projectName));
      });
    }
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const handleModal = () => {
    setShowModal(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const fileInput = document.querySelector('input[type="file"]');

    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];

      // Update formData with the projectId and the selected file
      formData.projectId = projectName;
      formData.file = selectedFile; // Set the selected file in formData

      const submitData = new FormData();
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && key !== 'file') {
          submitData.append(key, formData[key]);
        }
      }
      submitData.append('file', formData.file); // Append the file

      // Dispatch the upload action
      dispatch(uploadZipFileAction({ formData: submitData, projectName: projectName })).then(() => {
        // Fetch updated list of zip files after successful upload
        dispatch(fetchZipFilesAction(projectName));
        dispatch(fetchFolderConfig({ id, projectName })).unwrap();
      });

      // Reset form and hide modal
      resetForm();
      setShowModal(false);
    } else {
      setError('Please select a file.');
    }
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

  // Map the folders array to the desired format
  const folders = zipFiles?.folders || [];
  const filesData = folders.map((folder) => ({
    fileName: folder.name,
    lastModified: folder.lastModified,
  }));

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
