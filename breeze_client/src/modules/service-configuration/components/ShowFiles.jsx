import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowFunctions from './ShowFunctions';
import { useParams } from 'react-router-dom';
import { fetchFunctions, generateServiceFile } from '../redux/ApiClientActions';

function ShowFiles({ fileId, moduleId, setSelectedModule, setSelectedApi, setView, moduleName, setSelectedFile }) {
  const file = useSelector((state) => state.services.filesList[fileId]);
  const [isOpen, setIsOpen] = useState(false);
  const { projectName } = useParams();
  const dispatch = useDispatch();
  const toggleFilesExpansion = async () => {
    if (!isOpen) {
      try {
        await dispatch(fetchFunctions({ projectName, payload: { category: 'api_client' } })).unwrap();
      } catch (error) {
        console.error('Error fetching functions:', error);
      }
    }
    setIsOpen((prev) => !prev);
  };
  const handleFunctionClick = (api) => {
    setSelectedModule({
      name: moduleName,
      id: moduleId,
      filename: file.file,
      serviceId: api.id,
    });
    setSelectedApi(api);
    setView('TEST');
  };
  const handleServiceGeneration = async () => {
    await dispatch(
      generateServiceFile({ type: 'ORDINARY', projectName, payload: { filename: fileId, moduleId: moduleId } })
    ).unwrap();
  };
  return (
    <div>
      <div className={`d-flex justify-content-between ${isOpen ? 'br-background-secondary' : 'br-background-primary'}`}>
        <div
          onClick={() => {
            toggleFilesExpansion();
            setSelectedFile(fileId);
          }}
          className="w-75"
        >
          <i className="bi bi-file-earmark-fill" alt="file"></i>
          <span className="mx-2"> {file?.file.length > 30 ? `${file?.file.slice(0, 30)}...` : file?.file}</span>
        </div>
        <i className="bi bi-gear-wide-connected" onClick={handleServiceGeneration} title="generate-service"></i>
      </div>
      {file?.errors && file?.errors.length > 0 && <i className="bi bi-exclamation-circle" style={{ color: 'red' }}></i>}
      {isOpen && file?.functions.length > 0
        ? file['functions'].map((functionId) => (
            <ShowFunctions key={functionId} functionId={functionId} onFunctionClick={handleFunctionClick} />
          ))
        : isOpen && <span className="m-2 br-text-primary">No services found</span>}
    </div>
  );
}

export default ShowFiles;
