import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ShowFunctions from './ShowFunctions';
import { useParams } from 'react-router-dom';
import { fetchFunctions, generateServiceFile } from '../redux/ApiClientActions';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';

function ShowFiles({ fileId, moduleId, setSelectedModule, setSelectedApi, setView, moduleName, setSelectedFile }) {
  const loading = useRef(0);
  const file = useSelector((state) => state.services.filesList[fileId]);
  const [isOpen, setIsOpen] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);
  const { projectName } = useParams();
  const dispatch = useDispatch();
  const availableFunctions = file?.functions;

  const functions = useSelector(
    (state) => state.services.functionsList,
    (prevFunctions, nextFunctions) => {
      return isEqual(prevFunctions, nextFunctions);
    }
  );

  const checkForErrors = useCallback(
    (functionIds) => {
      for (const funcId of functionIds) {
        const func = functions[funcId];
        if (func?.errors?.root_errors?.length > 0) {
          return true;
        }
      }
      return false;
    },
    [functions]
  );

  const toggleFilesExpansion = async () => {
    setIsOpen((prev) => !prev);
  };

  const fetchFunctionsIfNeeded = useCallback(async () => {
    if (availableFunctions && availableFunctions.length > 0) {
      const missingFunctions = availableFunctions.filter((functionId) => !functions[functionId]);
      if (missingFunctions.length > 0 && loading.current === 0) {
        console.log(missingFunctions);
        loading.current = 1;
        await dispatch(
          fetchFunctions({ projectName, payload: { category: 'api_client', module: moduleId, files: fileId } })
        ).unwrap();
        loading.current = 0;
      }
    }
  }, [dispatch, availableFunctions, functions, projectName, moduleId, fileId]);

  useEffect(() => {
    fetchFunctionsIfNeeded();
  }, [fetchFunctionsIfNeeded]);

  // useEffect(() => {
  //   if (Object.keys(functions).length === 0)
  //     dispatch(fetchFunctions({ projectName, payload: { category: 'api_client', module: moduleId, files: fileId } }));
  // }, [dispatch, fileId, projectName, moduleId, functions]);

  useEffect(() => {
    if (file?.functions) {
      const hasError = checkForErrors(file.functions);
      setHasErrors(hasError);
    }
  }, [file?.functions, functions, checkForErrors]);

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
      <div
        className={`d-flex justify-content-between ${isOpen ? 'br-background-secondary' : 'br-background-primary'} p-1`}
      >
        <div
          onClick={() => {
            toggleFilesExpansion();
            setSelectedFile(fileId);
          }}
          className="w-75 mx-2"
        >
          <i className="bi bi-file-earmark-fill" alt="file"></i>
          <span className={`${hasErrors ? 'text-danger' : ''} mx-2`}>
            {file?.file.length > 30 ? `${file?.file.slice(0, 30)}...` : file?.file}
          </span>{' '}
        </div>
        <i className="bi bi-gear-wide-connected" onClick={handleServiceGeneration} title="generate-service"></i>
      </div>
      {file?.errors && file?.errors.length > 0 && <i className="bi bi-exclamation-circle" style={{ color: 'red' }}></i>}
      {isOpen && file?.functions.length > 0
        ? file.functions.map((functionId) => (
            <ShowFunctions key={functionId} functionId={functionId} onFunctionClick={handleFunctionClick} />
          ))
        : isOpen && <span className="m-2 br-text-primary">No services found</span>}
    </div>
  );
}
ShowFiles.propTypes = {
  fileId: PropTypes.string.isRequired,
  moduleId: PropTypes.string.isRequired,
  setSelectedModule: PropTypes.func.isRequired,
  setSelectedApi: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  moduleName: PropTypes.string.isRequired,
  setSelectedFile: PropTypes.func.isRequired,
};
export default ShowFiles;
