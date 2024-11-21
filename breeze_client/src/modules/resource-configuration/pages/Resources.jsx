import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import ResourcesUploadCanvas from '../components/ResourcesUploadCanvas.jsx';
import CustomTable from '../../../common/display/datatable/BreezeCustomTable.jsx';
import CustomModal from '../../../common/display/modal/BreezeModal.jsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFiles, uploadFileAction, deleteFileAction, downloadFileAction } from '../redux/resourcesActions.js';
import { fetchFolderConfig } from '../../../redux/directory_management/directory_actions.js';
import { useTabContext } from '../../project/context/TabContext.jsx';

const Resources = () => {
  const [fileToDelete, setFileToDelete] = useState(null);
  const { removeTab } = useTabContext();

  const { projectName } = useParams();
  const dispatch = useDispatch();

  const files = useSelector((state) => state.resources.files);
  useEffect(() => {
    if (files.length === 0) {
      dispatch(fetchFiles({ projectName }));
    }
  }, [dispatch, projectName, files.length]);

  const handleUpload = async (formData) => {
    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });
    try {
      await dispatch(uploadFileAction({ payload, projectName })).unwrap();
      await dispatch(fetchFolderConfig({ id: 'ROOT', projectName })).unwrap();
      dispatch(fetchFiles({ projectName }));
    } catch (error) {
      console.error('An error occurred while uploading the file:', error);
    }
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;
    try {
      await dispatch(deleteFileAction({ file: fileToDelete, projectName })).unwrap();
      removeTab(fileToDelete.id);
      await dispatch(fetchFolderConfig({ id: 'ROOT', projectName })).unwrap();
    } catch (error) {
      console.error('An error occurred while deleting the file:', error);
    } finally {
      setFileToDelete(null);
    }
  };

  const handleDownload = async (file) => {
    try {
      await dispatch(downloadFileAction({ file, projectName })).unwrap();
    } catch (error) {
      console.error('An error occurred while downloading the file:', error);
    }
  };

  const columns = [
    { header: 'File Name', accessor: 'name', align: 'left' },
    { header: 'File Type', accessor: 'type', align: 'left' },
  ];

  const actions = (item) => (
    <div>
      <i
        className="bi bi-trash mx-3"
        alt="Delete icon"
        onClick={() => setFileToDelete(item)}
        style={{ cursor: 'pointer', color: 'red', fontSize: '18px' }}
      />
      <i
        className="bi bi-download"
        alt="Download icon"
        onClick={() => handleDownload(item)}
        style={{ cursor: 'pointer', color: 'blue', fontSize: '18px' }}
      />
    </div>
  );

  return (
    <>
      <div className="container-fluid py-2 px-3">
        <div className="col-12 my-3 d-flex justify-content-between">
          <h3>Resources</h3>
          <ResourcesUploadCanvas onSubmit={handleUpload} />
        </div>
        <CustomTable columns={columns} data={files} actions={actions} actionPlacement="end" />
      </div>
      <CustomModal
        isOpen={!!fileToDelete}
        onClose={() => setFileToDelete(null)}
        header={{ title: 'Confirm Deletion' }}
        footer={{
          buttons: [
            { label: 'Cancel', onClick: () => setFileToDelete(null), type: 'button' },
            { label: 'Delete', onClick: handleDelete, className: 'btn btn-danger' },
          ],
        }}
      >
        <p>{fileToDelete ? `Are you sure you want to delete ${fileToDelete.name}?` : 'No file selected.'}</p>
      </CustomModal>
    </>
  );
};

export default Resources;
