import { useCallback, useEffect, useState } from 'react';
import RenderObject from '../components/RenderObject';
// import { getApiSchemaDetails } from '../../../services/ApiService';
import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchModules } from '../../service-configuration/redux/ApiClientActions';
// import { addSchema, deleteSchema, editSchema } from '../../../services/SchemaService';

const defaultSchemaObjectTemplate = {
  type: 'object',
  properties: {},
  required: [],
  name: '',
};

function SchemaSettings() {
  const { moduleList } = useSelector((state) => state.services);

  const [defaultSchemaObj, setDefaultSchemaObj] = useState(defaultSchemaObjectTemplate);
  const [id, setId] = useState();
  const [module, setModule] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [schemaList, setSchemaList] = useState([]);
  const [renderSchemaList, setRenderSchemaList] = useState([]);
  const [expandedModule, setExpandedModule] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const { projectName } = useParams();
  const dispatch = useDispatch();

  // const fetchSchemasList = useCallback(
  //   async (schemaId, module_id) => {
  //     try {
  //       const result = await getApiSchemaDetails(projectName, schemaId, module_id);
  //       if (schemaId || module_id) {
  //         return result;
  //       } else {
  //         setSchemaList(result);
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [projectName]
  // );

  // const handleModuleSelect = async (event) => {
  //   const selectedOption = event.target.selectedOptions[0];
  //   const moduleName = selectedOption.dataset.name;
  //   const moduleId = selectedOption.dataset.id;
  //   setModule({ name: moduleName, id: moduleId });
  //   const res = await fetchSchemasList(null, moduleId);
  //   setRenderSchemaList(res[0].schemas);
  // };

  // useEffect(() => {
  //   fetchSchemasList(null, null);
  // }, [fetchSchemasList]);

  useEffect(() => {
    dispatch(fetchModules({ projectName, payload: { category: 'api_client' } })).unwrap();
  }, [dispatch, projectName]);

  const addProperty = () => {
    setId(null);
    const newPropertyKey = `property${Object.keys(defaultSchemaObj.properties).length + 1}`;
    const newProperty = {
      type: '',
      required: false,
      example: '',
      objectType: '',
    };

    setDefaultSchemaObj({
      ...defaultSchemaObj,
      properties: {
        ...defaultSchemaObj.properties,
        [newPropertyKey]: newProperty,
      },
    });
  };

  const editProperty = (key, newValue, newKey) => {
    if (newValue) {
      if (newKey) {
        setDefaultSchemaObj((state) => {
          delete state.properties[key];
          state.properties[newKey] = newValue;
          return { ...state };
        });
      } else {
        setDefaultSchemaObj((state) => {
          state.properties[key] = newValue;
          return { ...state };
        });
      }
    } else {
      setDefaultSchemaObj((prevState) => {
        delete prevState.properties[key];
        return { ...prevState };
      });
    }
  };

  const onSubmit = async (e) => {
    if (!module) {
      setErrorMessage('Please select a module.');
      setShowToast(true);
      return;
    }
    e.preventDefault();
    const finalSchema = { id, details: defaultSchemaObj };
    const operation = id ? 'edit' : 'add';
    if (operation === 'add') {
      // const result = await addSchema(projectName, finalSchema, module.id);
      // if (result.message) {
      //   setErrorMessage(result.message);
      //   // fetchSchemasList(null, null);
      // } else {
      //   setErrorMessage(result.error);
      // }
      setShowToast(true);
    } else {
      // const result = await editSchema(projectName, finalSchema, id, module.id);
      // if (result.message) {
      //   // fetchSchemasList(null, null);
      //   setErrorMessage(result.message);
      // } else {
      //   setErrorMessage(result.error);
      // }
      setShowToast(true);
    }
    setDefaultSchemaObj(defaultSchemaObjectTemplate);
    setModule(null);
  };

  const handleSchemaOperations = async (operation, schema, module_id, module_name) => {
    if (operation === 'edit') {
      setId(schema.id);
      setModule({ id: module_id, name: module_name });
      // const details = await fetchSchemasList(schema.id, module_id);
      // setDefaultSchemaObj(details);
    } else if (operation === 'delete') {
      // const result = await deleteSchema(projectName, schema.id, module_id);
      // if (result.message) {
      //   setErrorMessage(result.message);
      //   setShowToast(true);
      //   // fetchSchemasList(null, null);
      // }
    }
  };

  const toggleModuleExpand = (moduleId) => {
    setExpandedModule((prevExpandedModule) => {
      if (prevExpandedModule.includes(moduleId)) {
        return prevExpandedModule.filter((id) => id !== moduleId);
      } else {
        return [...prevExpandedModule, moduleId];
      }
    });
  };

  return (
    defaultSchemaObj && (
      <div className="container-fluid h-100">
        <div className="toast-container position-fixed top-0 end-0 p-3" style={{ zIndex: 1 }}>
          <div className={`toast ${showToast ? 'show' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
            <div className="toast-header">
              <strong className="me-auto">Message</strong>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowToast(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="toast-body">{errorMessage}</div>
          </div>
        </div>
        <div className="row h-100 br-background-primary">
          <div
            className="col-sm-3 h-100 "
            id="left-panel"
            style={{
              borderRight: '1px solid rgba(128, 128, 128, 0.5)',
            }}
          >
            <div className="br-text-primary mt-2 d-flex justify-content-between">
              <strong>Schemas</strong>
            </div>
            {Object.keys(moduleList).length > 0 ? (
              <div>
                {Object.entries(moduleList).map(([folderKey, value]) => (
                  <div key={folderKey} className="br-text-primary mt-2">
                    <div
                      className={`d-flex my-3 br-text-primary ${expandedModule.includes(folderKey) ? 'br-background-secondary' : 'br-background-primary'}`}
                      onClick={() => toggleModuleExpand(folderKey)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: expandedModule.includes(folderKey) ? '#303033' : '#212529',
                      }}
                    >
                      <img
                        width="20"
                        height="20"
                        src="https://img.icons8.com/ios-filled/50/FFFFFF/module.png"
                        alt="module"
                        className="mt-1"
                      />
                      <span className="overflow-auto mx-2">
                        {value.title.length > 30 ? `${value.title.slice(0, 30)}...` : value.title}
                      </span>
                    </div>
                    {/* {expandedModule.includes(folderKey) && (
                      <div>
                        {module.schemas.map((schema) => (
                          <div key={schema.id} className="d-flex justify-content-between mt-1">
                            <span className="br-text-primary mx-2">{schema.name}</span>
                            <div className="d-flex">
                              <i
                                className="bi bi-pencil-square"
                                onClick={() => handleSchemaOperations('edit', schema, module.module_id, module.title)}
                              ></i>
                              <i
                                className="bi bi-trash3"
                                alt="delete"
                                onClick={() => handleSchemaOperations('delete', schema, module.module_id, module.title)}
                              ></i>
                            </div>
                          </div>
                        ))}
                      </div>
                    )} */}
                  </div>
                ))}
              </div>
            ) : (
              <h5 className="no-service br-text-primary">No schemas found</h5>
            )}
          </div>
          <div className="col-sm-9" id="right-panel">
            <div className="d-flex justify-content-between">
              <h6 className="br-text-primary mt-4">Schema Configuration</h6>
              <div className="d-flex align-items-center">
                <select
                  className="form-select form-select-sm rounded-0 mx-2 mt-3 text-white"
                  value={module ? module.name : ''}
                  style={{ backgroundColor: '#6c757d', border: 'none', color: 'white' }}
                  // onChange={handleModuleSelect}
                >
                  <option value="" data-name="" data-id="">
                    Select Module
                  </option>
                  {schemaList && schemaList.length > 0 ? (
                    schemaList.map((schema, index) => (
                      <option
                        className="br-text-primary"
                        key={index}
                        value={schema.title}
                        data-name={schema.title}
                        data-id={schema.module_id}
                      >
                        {schema.title}
                      </option>
                    ))
                  ) : (
                    <option value="" data-name="" data-id="">
                      No modules available
                    </option>
                  )}
                </select>
                <button className="btn btn-secondary rounded-0 mt-3" onClick={onSubmit}>
                  Submit
                </button>
              </div>
            </div>

            <div className="row mb-2 mt-4">
              <div className="col-sm-3 br-text-primary">Schema Name:</div>
              <div className="col-sm-9">
                <input
                  className="form-control form-control-sm br-text-primary br-background-primary"
                  size="sm"
                  type="text"
                  placeholder="Value"
                  value={defaultSchemaObj.name}
                  onChange={(e) =>
                    setDefaultSchemaObj({
                      ...defaultSchemaObj,
                      name: e.target.value,
                    })
                  }
                  style={{
                    // backgroundColor: '#212529',
                    border: '1px solid rgba(128, 128, 128, 0.5)',
                  }}
                />
              </div>
            </div>
            <div className="mb-2 mt-2 d-flex">
              <div className="br-text-primary p-1 br-background-secondary">
                <span className="mx-2">Properties</span>
                <i className="bi bi-plus-circle mx-1" width="25" height="25" onClick={addProperty}></i>
              </div>
            </div>
            {defaultSchemaObj.properties &&
              Object.entries(defaultSchemaObj.properties).map(([key, value]) => (
                <RenderObject
                  key={key}
                  propertyName={key}
                  value={value}
                  updateParent={(value, newKey = null) => editProperty(key, value, newKey)}
                  schemaList={module ? renderSchemaList : []}
                />
              ))}

            <div className="mb-2 mt-4 mx-2 h-50" style={{ border: '1px solid white' }}>
              <span className="br-text-primary">Example:</span>
              <div id="schema-example"></div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}

export default SchemaSettings;
