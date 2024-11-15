import { useState } from 'react';
import { CustomTextInput } from '../../../common/fields';
import PropTypes from 'prop-types';

import ShowFunctions from './ShowFunctions';
import ShowModules from './ShowModules';
import { useSelector } from 'react-redux';

function SideBar({ setView, setSelectedApi, setSelectedModule, saveTitle, setSelectedFile, setSelectedAuthApi }) {
  const { moduleList } = useSelector((state) => state.services);

  const [expandedAuthModules, setExpandedAuthModules] = useState([]);
  const [editingModule, setEditingModule] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  const toggleAuthModuleExpansion = (module) => {
    const isExpanded = expandedAuthModules.includes(module);
    setExpandedAuthModules((prev) => (isExpanded ? prev.filter((title) => title !== module) : [...prev, module]));
  };

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
            <ShowModules
              key={folderKey}
              folderKey={folderKey}
              value={value}
              saveTitle={saveTitle}
              setSelectedApi={setSelectedApi}
              setSelectedFile={setSelectedFile}
              setSelectedModule={setSelectedModule}
              setView={setView}
              onAdd={onNormalSelect}
            />
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
                <div onClick={() => toggleAuthModuleExpansion(folderKey)} style={{ cursor: 'pointer' }}>
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
