import { useSelector } from 'react-redux';
import { CustomButtonField, CustomTextArea, CustomTextInput } from '../../../common/fields';
import { useState } from 'react';

function ModuleSettings({ moduleId }) {
  const moduleData = useSelector((state) => state.services.moduleList[moduleId]);
  console.log(moduleData, moduleId);
  const [availableServers, setAvailableServers] = useState(moduleData.servers_info || []);

  const handleServersChange = (operation, index = null, value = null) => {
    if (operation === 'add') {
      const newServers = [...availableServers, { url: '' }];
      setAvailableServers(newServers);
    }
    if (operation === 'remove') {
      const newServers = [...availableServers];
      newServers.splice(index, 1);
      setAvailableServers(newServers);
    }
    if (operation === 'update') {
      const newServers = [...availableServers];
      newServers[index] = { url: value };
      setAvailableServers(newServers);
    }
  };
  return (
    <div className="row h-100">
      <div className="d-flex justify-content-between flex-column">
        <div className="col mt-2 d-flex flex-column">
          {/* Header Section */}
          <div className="br-background-secondary d-flex justify-content-center">
            <h5 className="mt-1 br-text-primary">Module Settings</h5>
          </div>

          {/* Name Field Section */}
          <div className="row my-3">
            <div className="col-sm-3">
              <label className="br-text-primary" htmlFor="module-name">
                Name:
              </label>
            </div>
            <div className="col-sm-9">
              <CustomTextInput
                id="module-name"
                className="form-control br-form-control form-control-sm"
                placeholder="Enter module name"
                value={moduleData?.title || ''}
                // onChange={(value) => handleChange(value)} // Uncomment if you want to handle changes
              />
            </div>
          </div>

          {/* Additional Settings Sections (if any) */}
          <div className="row">
            <div className="col-sm-3">
              <label className="br-text-primary" htmlFor="module-name">
                Description:
              </label>
            </div>
            <div className="col-sm-9">
              <CustomTextArea
                name="description"
                value={moduleData?.description}
                // onChange={(value) => handleChange('description', value)}
                config={{ groupClass: 'form-group my-2' }}
              />
            </div>
          </div>
          {/* {available servers info } */}
          <div className="row">
            <div className="col-sm-3">
              <label className="br-text-primary" htmlFor="module-name">
                Available Servers:
              </label>
              <i
                className="bi bi-plus-circle mx-2 mt-4"
                title="add-server"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                  handleServersChange('add');
                }}
              ></i>
            </div>
            <div className="col-sm-9">
              {availableServers.length > 0 ? (
                availableServers.map((server, index) => (
                  <div key={index} className="row">
                    <div className="col-sm-11">
                      <CustomTextInput
                        key={index}
                        value={server.url}
                        className="form-control br-form-control form-control-sm my-1"
                        onChange={(value) => {
                          handleServersChange('update', index, value);
                        }}
                      />
                    </div>
                    <i
                      className="bi bi-trash3 col-sm-1 my-1 br-cursor-pointer"
                      alt="delete"
                      onClick={() => handleServersChange('remove', index)}
                    ></i>
                  </div>
                ))
              ) : (
                <p>No servers available</p>
              )}
            </div>

            {/* {Interceptors Section } */}
            <div className="row">
              <div className="col-sm-3">
                <label className="br-text-primary" htmlFor="module-name">
                  Interceptors:
                </label>
                <i
                  className="bi bi-plus-circle mx-2 mt-4"
                  title="add-interceptors"
                  style={{ cursor: 'pointer' }}
                  onClick={() => {}}
                ></i>
              </div>
              <div className="col-sm-9"></div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mb-3">
          <CustomButtonField label="Update" className="btn btn-filled med-font" />
        </div>
      </div>
    </div>
  );
}

export default ModuleSettings;
