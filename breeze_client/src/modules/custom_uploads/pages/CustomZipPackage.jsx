import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { BreezeTable, BreezeModal, BreezeToaster } from '../../../common/display/index';
import '../styles/CustomZipPackage.css';
import { CustomButtonField, CustomTextInput } from '../../../common/fields';
import CustomFileUploadField from '../../../common/fields/f.upload-file-button';
import CustomPropsList from '../components/CustomPropList';

import {
  fetchZipFilesAction,
  uploadZipFileAction,
  deleteZipFileAction,
  fetchZipFileComponentsAction,
} from '../redux/customZipActions';
import { fetchFolderConfig } from '../../../redux/directory_management/directory_actions';
import BreezeOffCanvas from '../../../common/display/offcanvas/BreezeOffcanvas';
import CustomUploadSidebar from '../components/CustomUploadSidebar';

function CustomZipPackagePage() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [selectedFilename, setSelectedFilename] = useState(null);
  const[selectedComponent, setSelectedComponent] =  useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const { projectName } = useParams();
  const [formData, setFormData] = useState({
    filename: '',
    description: '',
    file: null,
  });
  const [error, setError] = useState('');
  const [uploadStatus, setUploadStatus] = useState({});
  const wsStatus = useRef(null);
  const dispatch = useDispatch();
  const { zipFiles, fileId, components, props } = useSelector((state) => state.zip);

  useEffect(() => {
    wsStatus.current = new WebSocket(`${import.meta.env.VITE_SOCKET_URL}/ws/external-comp-status/`);

    wsStatus.current.onopen = () => {
      console.log('Connected to the WebSocket of external component status');
      if (wsStatus.current && wsStatus.current.readyState === WebSocket.OPEN) {
        wsStatus.current.send(
          JSON.stringify({
            command: 'external_comp_status',
            project_id: projectName.toLowerCase().replace(/ /g, '_'),
          })
        );
      }
    };
    wsStatus.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      const fileStatuses = message?.file_status?.file_statuses; 
      if (fileStatuses) {
     
        setUploadStatus((prevStatuses) => ({
          ...prevStatuses,
          ...fileStatuses,
        }));
      }

    };
    wsStatus.current.onclose = () => {
      console.log('Disconnected from the WebSocket');
    };
  }, []);

  useEffect(() => {
    const folders = zipFiles?.folders || [];

    const initialUploadStatus = { ...uploadStatus };

    folders.forEach((folder) => {
      initialUploadStatus[folder.zip_file_id] = folder.status;
    });

    setUploadStatus(initialUploadStatus);
  }, [fileId, zipFiles]);

  useEffect(() => {
    if (zipFiles.length === 0) {
      dispatch(fetchZipFilesAction(projectName));
    }
  }, [dispatch, projectName, zipFiles]);

  const getComponents = async (filename) => {
    try {
      await dispatch(fetchZipFileComponentsAction({ filename, projectName }));
    } catch (error) {
      console.error('Error fetching components:', error);
    }
  };

  const handleDelete = () => {
    if (fileToDelete) {
      // Dispatch delete action
      dispatch(
        deleteZipFileAction({
          fileName: fileToDelete.name,
          fileId: fileToDelete.zip_file_id,
          projectName: projectName,
        })
      ).then(() => {
        dispatch(fetchZipFilesAction(projectName));
      });
    }
    setShowDeleteModal(false);
    setFileToDelete(null);
  };

  const handleModal = () => {
    setShowModal(true);
  };

  const handleOffCanvasClose = () => setShowOffCanvas(false);

  const handleSubmit = async (event) => {
    if (event) {
      event.preventDefault();
    }

    const fileInput = document.querySelector('input[type="file"]');

    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];

      const MAX_FILE_SIZE = 5 * 1024 * 1024;
      if (selectedFile.size > MAX_FILE_SIZE) {
        setError('File size exceeds');
        return;
      }

      // Update formData with the projectId and the selected file
      formData.projectId = projectName;
      formData.file = selectedFile;

      const submitData = new FormData();
      for (const key in formData) {
        if (formData.hasOwnProperty(key) && key !== 'file') {
          submitData.append(key, formData[key]);
        }
      }
      submitData.append('file', formData.file);

      try {
        setShowModal(false);
        await dispatch(uploadZipFileAction({ formData: submitData, projectName }));

        await dispatch(fetchZipFilesAction(projectName));
        await dispatch(fetchFolderConfig({ id: 'ROOT', projectName })).unwrap();

        // Reset the form and close the modal
        resetForm();
      } catch (error) {
        console.error('Error during file upload or fetching folder config:', error);
      }
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
    zipFileId: folder.zip_file_id,
    lastModified: folder.lastModified,
    actions: (
      <div className="d-flex align-items-center">
        {uploadStatus[folder.zip_file_id] === 'extracting...' ||
        uploadStatus[folder.zip_file_id] === 'file uploading...' ? (
          <div className="ws-progress-status d-flex align-items-center">
            <div
              className="spinner-border spinner-border-sm"
              role="status"
              style={{ width: '1rem', height: '1rem' }}
            ></div>
            <p style={{ marginLeft: '8px', marginBottom: '0', lineHeight: '1rem' }}>
              {uploadStatus[folder.zip_file_id]}
            </p>
          </div>
        ) : uploadStatus[folder.zip_file_id] === 'success' ? (
          <>
            <CustomButtonField
              label={<i className="bi bi-trash" />}
              onClick={() => {
                setFileToDelete(folder);
                setShowDeleteModal(true);
              }}
              className="btn toggle-btn btn-outline-danger settings-no-outline-button"
            />
            <CustomButtonField
              label={<i className="bi bi-three-dots-vertical" />}
              onClick={() => {
                setShowOffCanvas(true);
                getComponents(folder.name);
                setSelectedFilename(folder.name);
              }}
              className="btn toggle-btn br-text-primary"
            />
          </>
        ) : uploadStatus[folder.zip_file_id] === 'components upload failed' ||
          uploadStatus[folder.zip_file_id] === 'file upload failed' ? (
          <>
            <CustomButtonField
              label={<i className="bi bi-trash" />}
              onClick={() => {
                setFileToDelete(folder);
                setShowDeleteModal(true);
              }}
              className="btn toggle-btn btn-outline-danger settings-no-outline-button"
            />
            <span className="badge breeze-badge">
              <span className="med-font">{uploadStatus[folder.zip_file_id]}</span>
            </span>
          </>
        ) : null}
      </div>
    ),
  }));
 //fileid- component id , filename- zip file name 
  const handleClick = (component_id, filename) => {
    setSelectedComponent(component_id)
    const payload = {
      resource: component_id,
      select: ['props'],
    };
    dispatch(fetchZipFileComponentsAction({ filename, projectName, payload }));
  };

  const columns = [
    {
      header: 'File Name',
      accessor: 'fileName',
      width: '40%',
    },
    {
      header: 'Last Modified',
      accessor: 'lastModified',
      width: '40%',
    },
    {
      header: 'Actions',
      accessor: 'actions',
      width: '20%',
      align: 'right',
      headerRenderer: () => <div style={{ display: 'flex', justifyContent: 'space-between' }}>Actions</div>,
    },
  ];

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
            currentPage={currentPage}
            onPageChange={handlePageChange}
            sortBy="filename"
            sortDirection="asc"
          />
        </div>
      </div>
      <BreezeModal isOpen={showModal} onClose={() => setShowModal(false)} header={header} footer={footer}>
        <form onSubmit={handleSubmit}>
          {error && <BreezeToaster message={error} type="error" duration={5000} />}
          <div className="row">
            <div className="col mb-3">
              <CustomFileUploadField
                onFileSelect={handleFileSelect}
                style={{
                  borderColor: '#666666',
                  color: 'br-text-primary',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                }}
                spanStyle={{
                  display: 'inline-block',
                  textAlign: 'left',
                  marginLeft: '20px',
                  color: 'br-text-primary',
                }}
                accept=".zip"
                config={{
                  innerlabel: 'Choose File',
                  outerlabel: 'Choose File',
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

      <BreezeOffCanvas
        show={showOffCanvas}
        onClose={handleOffCanvasClose}
        placement="end"
        size="50%"
        title="Component Configuration"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: '1', paddingRight: '20px', maxWidth: '20%' }}>
            <CustomUploadSidebar
              components={components}
              selectedFilename={selectedFilename}
              handleClick={handleClick}
            />
          </div>

          <div style={{ flex: '1', paddingLeft: '20px', maxWidth: '80%' }}>
            {props && <CustomPropsList selectedFile={selectedFilename} selectedComponentId={selectedComponent} components={components} props={props} />}
          </div>
        </div>
      </BreezeOffCanvas>
    </div>
  );
}

export default CustomZipPackagePage;
