import { useCallback, useState } from 'react';
import { CustomTextInput } from '../../../common/fields';
import { fetchIntermediates } from '../services/IntermediateServices';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
function SideBar({
  apiList,
  setView,
  setSelectedApi,
  setSelectedModule,
  saveTitle,
  setSelectedFile,
  setSelectedAuthApi,
  generateService,
}) {
  const { projectName } = useParams();
  const [expandedModules, setExpandedModules] = useState([]);
  const [editingModule, setEditingModule] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [expandedFilenames, setExpandedFilenames] = useState([]);
  const [availableFiles, setAvailableFiles] = useState([]);
  const [availableFunctions, setAvailableFunctions] = useState([]);
  const [availableAuthFunctions, setAvailableAuthFunctions] = useState([]);

  const toggleExpansion = (moduleTitle, filename, moduleId = null, fileId = null, api_type = null) => {
    if (moduleTitle) {
      if (moduleId) {
        fetchFilesAndFunctions({ category: 'api_client', module: moduleId });
      }
      if (expandedModules.includes(moduleTitle)) {
        setExpandedModules(expandedModules.filter((title) => title !== moduleTitle));
      } else {
        setExpandedModules([...expandedModules, moduleTitle]);
      }
    } else {
      if (fileId) {
        fetchFilesAndFunctions({ category: 'api_client', module: moduleId, files: fileId });
        setSelectedFile(fileId);
      } else if (api_type) {
        fetchFilesAndFunctions({ category: 'api_client' }, true, moduleId);
      }
      if (expandedFilenames.includes(filename)) {
        setExpandedFilenames(expandedFilenames.filter((fn) => fn !== filename));
      } else {
        setExpandedFilenames([...expandedFilenames, filename]);
      }
    }
  };

  const fetchFilesAndFunctions = useCallback(async (payload, isAuth = null, selectedModule = null) => {
    try {
      const result = await fetchIntermediates(projectName, payload);
      if (isAuth) {
        const authApis = Object.entries(result.data)
          .filter(([key, value]) => key === selectedModule)
          .flatMap(([key, value]) => (value.auth_apis ? Object.values(value.auth_apis) : []));
        // console.log(authApis, 'authApiList');
        setAvailableAuthFunctions(authApis);
      } else {
        if (payload.files) {
          const functionList = Object.entries(result.data).map(([key, value]) => ({
            ...value,
          }));
          setAvailableFunctions(functionList);
        } else if (payload.module) {
          const filesList = Object.entries(result.data).map(([key, value]) => ({
            id: key,
            title: value.file,
          }));
          setAvailableFiles(filesList);
        }
      }
    } catch (error) {
      console.error('Error generating react service:', error);
    }
  }, []);

  const handleInputChange = (value) => {
    setNewModuleTitle(value);
  };

  const toggleEditing = (title) => {
    if (editingModule === title) {
      setEditingModule(null);
      setNewModuleTitle('');
    } else {
      setEditingModule(title);
      setNewModuleTitle(title);
    }
  };

  return (
    <>
      <div
        id="services-div"
        className="h-50 overflow-auto mb-1 br-background-primary"
        style={{ borderBottom: '1px solid gray' }}
      >
        <div className="d-flex justify-content-between mb-2 br-background-primary">
          {/* <span className="mt-4 overflow-auto br-text-primary">
            <strong> Services</strong>
          </span> */}
          <h5 className="mt-4">Services</h5>
          <div className="d-flex">
            <i
              className="bi bi-plus-circle mx-1 mt-4"
              width={25}
              height={25}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setView('TEST');
                setSelectedApi({});
                setSelectedModule({});
              }}
            ></i>
            <i
              className="bi bi-file-earmark-arrow-down-fill mx-1 mt-4"
              width="25"
              height="25"
              onClick={() => setView('IMPORT_API')}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
        </div>
        {apiList && apiList.length > 0 ? (
          apiList.map((folder, folderIndex) => (
            <div key={folderIndex} className="my-2">
              <div
                className={`mb-2 p-1 br-text-primary ${expandedModules.includes(folder.title) ? 'br-background-secondary' : 'br-background-primary'}`}
                onClick={() => toggleExpansion(folder.title, null, folder.id, null, null)}
                style={{
                  cursor: 'pointer',
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {editingModule === folder.title ? (
                      <CustomTextInput
                        value={newModuleTitle}
                        className="form-control form-control-sm br-text-primary br-background-primary"
                        onChange={handleInputChange}
                        onBlur={() => saveTitle(folder.title, folder.id, newModuleTitle)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveTitle(folder.title, folder.id, newModuleTitle);
                          } else if (e.key === 'Escape') {
                            toggleEditing(folder.title);
                          }
                        }}
                        autoFocus
                      />
                    ) : (
                      <div className="">
                        <img
                          width="20"
                          height="20"
                          src="https://img.icons8.com/ios-filled/50/AAAAAA/module.png"
                          alt="module"
                        />
                        <span className="mx-2 br-text-primary">{folder.title}</span>
                      </div>
                    )}
                  </div>
                  <i
                    className="bi bi-pencil-square"
                    alt="edit"
                    height={30}
                    width={15}
                    onClick={() => toggleEditing(folder.title)}
                  ></i>
                </div>
              </div>
              {expandedModules.includes(folder.title) && editingModule === null && (
                <div
                  className="br-background-primary br-text-primary"
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  {availableFiles && availableFiles.length > 0 ? (
                    availableFiles.map((service) => (
                      <div key={service.id} className="my-2">
                        <div
                          className={`mb-2 p-1 ${expandedFilenames.includes(service.title) ? 'br-background-secondary' : 'br-background-primary'}`}
                          onClick={() => toggleExpansion(null, service.title, folder.id, service.id, null)}
                          style={{
                            cursor: 'pointer',
                          }}
                        >
                          <div className="d-flex justify-content-between">
                            <div>
                              <i className="bi bi-file-earmark-fill" height={15} width={15} alt="file"></i>
                              <span className="mx-2">{service.title}</span>
                              {service.errors && service.errors.length > 0 && (
                                <i className="bi bi-exclamation-circle" style={{ color: 'red' }}></i>
                              )}
                            </div>
                            <i
                              className="bi bi-gear-wide-connected"
                              onClick={() => generateService('ORDINARY', service.id, folder.id)}
                              width={15}
                              height={15}
                            ></i>
                          </div>
                        </div>
                        {expandedFilenames.includes(service.title) && (
                          <div
                            className="br-text-primary br-background-primary"
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            {availableFunctions.length > 0 ? (
                              availableFunctions.map((func) => (
                                <div key={func.id} className="m-1 d-flex justify-content-between">
                                  <span
                                    className={`overflow-auto ${func.errors && func.errors.root_errors.length > 0 ? 'text-danger' : ''}`}
                                    onClick={() => {
                                      setSelectedModule({
                                        name: folder.title,
                                        id: folder.id,
                                        filename: service.title,
                                        serviceId: func.id,
                                      });
                                      setSelectedApi(func);
                                      setView('TEST');
                                    }}
                                    style={{ width: '90%' }}
                                  >
                                    {func.operation_id}
                                  </span>
                                  <div id="actions-div" className="d-flex">
                                    <i className="bi bi-trash3" alt="delete" height={20} width={20}></i>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <span className=" m-2 br-text-primary">No services found</span>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <span className="m-2 br-text-primary">No services found</span>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <span className="m-2 br-text-primary">No services found</span>
        )}
      </div>
      <div id="schemas-div" className="h-50 overflow-auto">
        <div className="br-text-primary mt-2 d-flex justify-content-between">
          <h5>Authentication Config</h5>
          <i
            className="bi bi-plus-circle mx-1 mt-1"
            width="25"
            height="25"
            onClick={() => {
              setView('AUTH_API');
              setSelectedAuthApi({});
              setSelectedModule(null);
            }}
          ></i>
        </div>
        {apiList && apiList.length > 0 ? (
          apiList.map((module, index) => (
            <div key={index} className="my-2">
              <div
                className={`mb-2 p-1 br-text-primary ${expandedFilenames.includes(module.title) ? 'br-background-secondary' : 'br-background-primary'}`}
                onClick={() => toggleExpansion(null, module.title, module.id, null, 'auth')}
                style={{
                  cursor: 'pointer',
                }}
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <img
                      width="20"
                      height="20"
                      src="https://img.icons8.com/ios-filled/50/AAAAAA/module.png"
                      alt="module"
                    />
                    <span className=" br-text-primary mx-2">{module.title}</span>
                  </div>
                  <i
                    className="bi bi-gear-wide-connected"
                    onClick={() => generateService('AUTH', module.title, module.model_id)}
                    width={15}
                    height={15}
                  ></i>
                </div>
              </div>
              {expandedFilenames.includes(module.title) && (
                <div
                  className=" br-text-primary br-background-primary"
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  {availableAuthFunctions && availableAuthFunctions.length > 0 ? (
                    <>
                      {availableAuthFunctions.map((api) => (
                        <div key={api.id} className="m-1 d-flex justify-content-between">
                          <span
                            className={`overflow-auto ${api.errors && api.errors.root_errors.length > 0 ? 'text-danger' : 'br-text-primary'}`}
                            onClick={() => {
                              setSelectedModule({
                                name: module.title,
                                id: module.id,
                                filename: '',
                                serviceId: api.id,
                              });
                              setSelectedAuthApi(api);
                              setView('AUTH_API');
                            }}
                            style={{ width: '90%' }}
                          >
                            {api.operation_id}
                          </span>
                          <div id="actions-div" className="d-flex">
                            <i className="bi bi-trash3" alt="delete" height={20} width={20}></i>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : (
                    <span className="m-2 br-text-primary">No services found</span>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <span className="m-2 br-text-primary">No services found</span>
        )}
      </div>
    </>
  );
}

SideBar.propTypes = {
  apiList: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      id: PropTypes.string.isRequired,
    })
  ).isRequired,
  setView: PropTypes.func.isRequired,
  setSelectedApi: PropTypes.func.isRequired,
  setSelectedModule: PropTypes.func.isRequired,
  saveTitle: PropTypes.func.isRequired,
  setSelectedFile: PropTypes.func.isRequired,
  setSelectedAuthApi: PropTypes.func.isRequired,
  generateService: PropTypes.func.isRequired,
};

export default SideBar;
