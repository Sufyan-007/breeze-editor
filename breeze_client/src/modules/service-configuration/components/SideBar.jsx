import { useCallback, useEffect, useState } from 'react';
import { CustomTextInput } from '../../../common/fields';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthFunctions, fetchFiles, fetchFunctions } from '../redux/ApiClientActions';
import ShowFiles from './ShowFiles';
import ShowFunctions from './ShowFunctions';
import ShowModules from './ShowModules';

const customComparator = (oldKeyList, newKeyList) => {
  // code to compare if all entries are equal
  return true;
};

const customSelectFunctions = (state) => {
  return Object.entries(state.services.filesList);
};

function SideBar({
  setView,
  setSelectedApi,
  setSelectedModule,
  saveTitle,
  setSelectedFile,
  setSelectedAuthApi,
  generateService,
}) {
  const { projectName } = useParams();
  const dispatch = useDispatch();
  const { moduleList } = useSelector((state) => state.services);
  // console.log(moduleList, 'moduleList');

  const [expandedModules, setExpandedModules] = useState([]);
  const [expandedAuthModules, setExpandedAuthModules] = useState([]);
  const [editingModule, setEditingModule] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  const toggleModuleExpansion = async (module) => {
    const isExpanded = expandedModules.includes(module);
    await fetchFilesAndFunctions({ category: 'api_client', module: module });
    setExpandedModules((prev) => (isExpanded ? prev.filter((title) => title !== module) : [...prev, module]));
  };
  const toggleAuthModuleExpansion = (module) => {
    const isExpanded = expandedAuthModules.includes(module);
    setExpandedAuthModules((prev) => (isExpanded ? prev.filter((title) => title !== module) : [...prev, module]));
  };
  const fetchFilesAndFunctions = useCallback(
    async (payload, isAuth = null, selectedModule = null) => {
      try {
        if (isAuth) {
          await dispatch(fetchAuthFunctions({ projectName, payload, moduleId: selectedModule })).unwrap();
        } else {
          if (payload.files) {
            await dispatch(fetchFunctions({ projectName, payload })).unwrap();
          } else if (payload.module) {
            await dispatch(fetchFiles({ projectName, payload })).unwrap();
          }
        }
      } catch (error) {
        console.error('Error generating react service:', error);
      }
    },
    [projectName, dispatch]
  );

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
  const onAuthSelect = (api, moduleName, moduleId) => {
    setSelectedModule({
      name: moduleName,
      id: moduleId,
      filename: '',
      serviceId: api.id,
    });
    setSelectedAuthApi(api);
    setView('AUTH_API');
  };
  const onNormalSelect = (name, folderKey) => {
    setView('TEST');
    setSelectedApi({});
    setSelectedModule({ name: name, id: folderKey });
  };
  return (
    <>
      <div
        id="services-div"
        className="h-50 overflow-auto mb-1 br-background-primary"
        style={{ borderBottom: '1px solid gray' }}
      >
        <div className="d-flex justify-content-between mb-2 br-background-primary">
          <h5 className="mt-4">Services</h5>
          <div className="d-flex pe-1">
            <i
              className="bi bi-plus-circle mx-1 mt-4"
              title="add-module"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setView('ADD_MODULE');
              }}
            ></i>
            <i
              className="bi bi-cloud-arrow-up-fill mx-1 mt-4"
              title="upload-file"
              style={{ cursor: 'pointer' }}
              onClick={() => setView('IMPORT_API')}
            ></i>
          </div>
        </div>
        {Object.keys(moduleList).length > 0 ? (
          Object.entries(moduleList).map(([folderKey, value]) => (
            <div key={folderKey} className="my-2">
              <div
                className={`mb-2 p-1 br-text-primary ${expandedModules.includes(folderKey) ? 'br-background-secondary' : 'br-background-primary'}`}
                onClick={() => toggleModuleExpansion(folderKey)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    {editingModule === value.title ? (
                      <CustomTextInput
                        value={newModuleTitle}
                        className="form-control form-control-sm br-text-primary br-background-primary"
                        onChange={handleInputChange}
                        onBlur={() => {
                          saveTitle(value.title, folderKey, newModuleTitle);
                          // toggleEditing(value.title);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            saveTitle(value.title, folderKey, newModuleTitle);
                          } else if (e.key === 'Escape') {
                            toggleEditing(value.title);
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
                        <span className="mx-2 br-text-primary">
                          {value.title.length > 30 ? `${value.title.slice(0, 30)}...` : value.title}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <i
                      className="bi bi-plus-circle mx-1"
                      style={{ cursor: 'pointer' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setView('TEST');
                        setSelectedApi({});
                        setSelectedModule({ name: value.title, id: folderKey });
                      }}
                      title="add-to-module"
                    ></i>
                    <i
                      className="bi bi-pencil-square mx-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEditing(value.title);
                      }}
                      title="edit-module-name"
                    ></i>
                  </div>
                </div>
              </div>
              {expandedModules.includes(folderKey) && editingModule === null && (
                <div className="br-background-primary br-text-primary" style={{ cursor: 'pointer' }}>
                  {value['files']?.length > 0 ? (
                    value['files'].map((fileId) => (
                      <ShowFiles
                        key={fileId}
                        fileId={fileId}
                        moduleId={folderKey}
                        moduleName={value.title}
                        setSelectedApi={setSelectedApi}
                        setSelectedFile={setSelectedFile}
                        setSelectedModule={setSelectedModule}
                        setView={setView}
                      />
                    ))
                  ) : (
                    <span className="m-2 br-text-primary">No services found</span>
                  )}
                </div>
              )}
            </div>
            // <ShowModules
            //   key={folderKey}
            //   folderKey={folderKey}
            //   value={value}
            //   saveTitle={saveTitle}
            //   setSelectedApi={setSelectedApi}
            //   setSelectedFile={setSelectedFile}
            //   setSelectedModule={setSelectedModule}
            //   setView={setView}
            //   onAdd={onNormalSelect}
            // />
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
            onClick={() => {
              setView('AUTH_API');
              setSelectedAuthApi({});
              setSelectedModule(null);
            }}
          ></i>
        </div>

        {Object.keys(moduleList).length > 0
          ? Object.entries(moduleList).map(([folderKey, value]) => (
              <div key={folderKey} className="my-2">
                <div
                  className={`mb-2 p-1 br-text-primary ${expandedModules.includes(folderKey) ? 'br-background-secondary' : 'br-background-primary'}`}
                  onClick={() => toggleAuthModuleExpansion(folderKey)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      {editingModule === value.title ? (
                        <CustomTextInput
                          value={newModuleTitle}
                          className="form-control form-control-sm br-text-primary br-background-primary"
                          onChange={handleInputChange}
                          onBlur={() => saveTitle(value.title, folderKey, newModuleTitle)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              saveTitle(value.title, folderKey, newModuleTitle);
                            } else if (e.key === 'Escape') {
                              toggleEditing(value.title);
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
                          <span className="mx-2 br-text-primary">
                            {value.title.length > 30 ? `${value.title.slice(0, 30)}...` : value.title}
                          </span>
                        </div>
                      )}
                    </div>
                    <i className="bi bi-pencil-square" onClick={() => toggleEditing(value.title)}></i>
                  </div>
                </div>
                {expandedAuthModules.includes(folderKey) && editingModule === null && (
                  <div className="br-background-primary br-text-primary" style={{ cursor: 'pointer' }}>
                    {Object.keys(value['auth_apis'])?.length > 0 ? (
                      Object.entries(value['auth_apis']).map(([funcId, funcVal]) => (
                        <ShowFunctions
                          key={funcId}
                          functionId={funcId}
                          onFunctionClick={() => onAuthSelect(funcVal, value.title, folderKey)}
                          isAuth={true}
                          moduleId={folderKey}
                        />
                      ))
                    ) : (
                      <span className="m-2 br-text-primary">No services found</span>
                    )}
                  </div>
                )}
              </div>
            ))
          : null}
      </div>
    </>
  );
}

SideBar.propTypes = {
  moduleList: PropTypes.arrayOf(
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
