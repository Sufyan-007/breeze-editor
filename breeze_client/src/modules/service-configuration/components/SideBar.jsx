import PropTypes from 'prop-types';

import ShowFunctions from './ShowFunctions';
import ShowModules from './ShowModules';
import { useSelector } from 'react-redux';

function SideBar({ setView, setSelectedApi, setSelectedModule, saveTitle, setSelectedFile, setSelectedAuthApi }) {
  const { moduleList } = useSelector((state) => state.services);

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
          <h5 className="mt-4" style={{ fontSize: '18px' }}>
            Services
          </h5>
          <div className="d-flex pe-1">
            <i
              className="bi bi-plus-circle mx-2 mt-4"
              title="add-module"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                setView('ADD_MODULE');
              }}
            ></i>
            <i
              className="bi bi-upload mx-1 mt-4"
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
          <span className="m-2 br-text-primary" style={{ fontSize: '14px' }}>
            No services found
          </span>
        )}
      </div>
      <div id="auth-div" className="h-50 overflow-auto">
        <div className="br-text-primary mt-2 d-flex justify-content-between">
          <h5 style={{ fontSize: '18px' }}>Authentication Config</h5>
          <i
            className="bi bi-plus-circle mx-1 "
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
                {
                  Object.keys(value['auth_apis'])?.length > 0
                    ? Object.entries(value['auth_apis']).map(([funcId, funcVal]) => (
                        <ShowFunctions
                          key={funcId}
                          functionId={funcId}
                          onFunctionClick={() => onAuthSelect(funcVal, value.title, folderKey)}
                          isAuth={true}
                          moduleId={folderKey}
                          setSelectedAuthApi={setSelectedAuthApi}
                        />
                      ))
                    : null
                  // <span className="mx-4 my-2 br-text-primary" style={{ fontSize: '14px' }}>
                  //   No functions found
                  // </span>
                }
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
      title: PropTypes.string,
      id: PropTypes.string,
    })
  ),
  setView: PropTypes.func.isRequired,
  setSelectedApi: PropTypes.func.isRequired,
  setSelectedModule: PropTypes.func.isRequired,
  saveTitle: PropTypes.func.isRequired,
  setSelectedFile: PropTypes.func.isRequired,
  setSelectedAuthApi: PropTypes.func.isRequired,
  generateService: PropTypes.func.isRequired,
};

export default SideBar;
