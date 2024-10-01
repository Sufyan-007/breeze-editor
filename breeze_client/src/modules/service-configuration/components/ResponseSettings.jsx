import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// import { getApiSchemaDetails } from '../services/ApiService';
// import { useParams } from 'react-router';
import { CustomSelectField, CustomTextInput } from '../../../common/fields';

const responseObject = {
  content_type: '',
  status: '',
  schema_name: '',
  schema: {},
  raw_content: '',
  file: '',
  description: '',
  token_store: {
    store_in: '',
    stored_key: '',
  },
};

function ResponseSettings({ responseData, onChange, isAuthApi, title, responseType, moduleId }) {
  const [response, setResponse] = useState(responseData || []);
  const [newResponse, setNewResponse] = useState(responseObject);
  const [expandedProperty, setExpandedProperty] = useState(null);
  // const [schemaList, setSchemaList] = useState([]);
  // const { projectName } = useParams();
  const [properties, setProperties] = useState([]);

  // const fetchSchemasList = useCallback(
  //   async (schemaName, moduleId) => {
  //     try {
  //       const result = await getApiSchemaDetails(projectName, schemaName, moduleId);
  //       if (schemaName) {
  //         return result;
  //       } else {
  //         setSchemaList(result[0].schemas);
  //       }
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   },
  //   [projectName]
  // );

  // useEffect(() => {
  //   if (moduleId) {
  //     fetchSchemasList(null, moduleId);
  //   }
  // }, [fetchSchemasList, moduleId]);

  useEffect(() => {
    setResponse(responseData);
  }, [responseData]);

  const extractProperties = useCallback(
    (schema) => {
      if (schema && schema.properties) {
        const props = Object.entries(schema.properties).map(([key, value]) => ({
          name: key,
          type: value.type,
        }));
        setProperties(props.filter((prop) => prop.type === 'string' || prop.type === 'integer'));

        // Initialize token_store entries for the properties
        if (newResponse.status === 'S_200') {
          const initialTokenStore = {};
          props.forEach((prop) => {
            initialTokenStore[`${prop.name}`] = {
              store_in: 'LOCAL_STORAGE',
              storage_key: '',
            };
          });
          setNewResponse((prevState) => ({ ...prevState, token_store: initialTokenStore }));
        }
      }
    },
    [newResponse.status]
  );

  // useEffect(() => {
  //   if (response && response.length > 0) {
  //     const selectedResponse = response.find((res) => res.status === 'S_200');
  //     if (selectedResponse && selectedResponse.schema_name && selectedResponse.schema) {
  //       extractProperties(selectedResponse.schema);
  //     }
  //   }
  // }, [response, schemaList, extractProperties]);

  useEffect(() => {
    if (newResponse.schema_name && newResponse.schema) {
      extractProperties(newResponse.schema);
    }
  }, [newResponse.schema, newResponse.schema_name, extractProperties]);

  const handleInputChange = (index, field, value, subField = null) => {
    const updatedResponse = [...response];
    if (subField) {
      updatedResponse[index] = {
        ...updatedResponse[index],
        [field]: {
          ...updatedResponse[index][field],
          [subField]: value,
        },
      };
    }
    updatedResponse[index] = { ...updatedResponse[index], [field]: value };
    onChange(responseType, updatedResponse);
  };

  const handleDelete = (index) => {
    const updatedResponse = [...response];
    updatedResponse.splice(index, 1);
    onChange(responseType, updatedResponse);
  };

  const handleAddResponse = () => {
    const updatedResponse = response || [];
    onChange(responseType, [...updatedResponse, newResponse]);
    setNewResponse(responseObject);
  };

  const toggleProperty = (index) => {
    setExpandedProperty(expandedProperty === index ? null : index);
  };

  // const handleSchemaChange = async (value) => {
  //   setNewResponse({ ...newResponse, schema_name: value });
  //   const schema = await fetchSchemasList(value, moduleId);
  //   setNewResponse((prevState) => ({ ...prevState, schema }));

  //   // Update token_store with new schema properties
  //   if (schema && schema.properties) {
  //     const updatedTokenStore = {};
  //     Object.keys(schema.properties).forEach((prop) => {
  //       updatedTokenStore[`${value}.${prop}`] = {
  //         store_in: 'LOCAL_STORAGE',
  //         storage_key: '',
  //       };
  //     });
  //     setNewResponse((prevState) => ({ ...prevState, token_store: updatedTokenStore }));
  //   }
  // };

  const handlePropertyChange = (property, field, value) => {
    const currentTokenStore = newResponse.token_store[`${property}`] || {};
    const updatedTokenStoreEntry = {
      ...currentTokenStore,
      [field]: value,
    };
    setNewResponse({
      ...newResponse,
      token_store: {
        ...newResponse.token_store,
        [`${property}`]: updatedTokenStoreEntry,
      },
    });
  };

  const renderResponses = () => {
    if (!response || response.length === 0) {
      return null;
    }

    return response.map((res, index) => (
      <div
        className="card rounded-0 br-text-primary mt-2 br-background-secondary"
        style={{ border: '1px solid rgba(128, 128, 128, 0.5)' }}
        key={index}
      >
        <div className="card-body d-flex justify-content-between br-text-primary">
          {expandedProperty === index ? (
            <>
              <div className="rounded-0 br-text-primary d-flex align-items-center justify-content-between mb-2 w-100">
                <div style={{ width: '90%' }} className="d-flex align-items-center">
                  <ResponseForm
                    label="Content Type"
                    value={res.content_type}
                    onChange={(e) => handleInputChange(index, 'content_type', e.target.value)}
                    options={['TEXT', 'JSON', 'HTML']}
                  />
                  <ResponseForm
                    label="Status"
                    value={res.status}
                    onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                    options={['S_200', 'S_400', 'S_404', 'S_500']}
                  />
                  <ResponseForm
                    label="Schema"
                    value={res.schema_name}
                    onChange={(e) => handleInputChange(index, 'schema_name', e.target.value)}
                    // options={schemaList}
                  />
                </div>
                {res.status === 'S_200' && isAuthApi && (
                  <div className="mt-3 w-100">
                    <table className="table table-bordered br-background-secondary">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Storage Key</th>
                          <th>Save As</th>
                        </tr>
                      </thead>
                      <tbody>
                        {properties.map((prop, idx) => (
                          <tr key={idx}>
                            <td>{prop.name}</td>
                            <td>
                              <CustomTextInput
                                className=" form-control br-form-control form-control-sm"
                                placeholder="Storage Key"
                                value={res.token_store[`${prop.name}`]?.storage_key || ''}
                                onChange={(e) => handlePropertyChange(prop.name, 'storage_key', e)}
                              />
                              {/* <input
                                type="text"
                                placeholder="Storage Key"
                                className="form-control form-control-sm br-text-primary br-background-primary"
                                style={{ border: '1px solid rgba(128, 128, 128, 0.5)' }}
                                value={res.token_store[`${prop.name}`]?.storage_key || ''}
                                onChange={(e) => handlePropertyChange(prop.name, 'storage_key', e.target.value)}
                              /> */}
                            </td>
                            <td>
                              <CustomSelectField
                                name="valueSelect"
                                value={res.token_store[`${prop.name}`]?.store_in || ''}
                                onChange={(e) => handlePropertyChange(prop.name, 'store_in', e)}
                                options={[
                                  { label: 'Select', value: '' },
                                  { label: 'DontSave', value: 'DontSave' },
                                  { label: 'COOKIE', value: 'COOKIE' },
                                  { label: 'LOCAL STORAGE', value: 'LOCAL_STORAGE' },
                                  { label: 'SESSION', value: 'SESSION' },
                                ]}
                                className="form-select br-form-select form-select-sm mt-3"
                              />
                              {/* <select
                                className="form-control form-select-sm br-text-primary br-background-primary"
                                style={{ border: '1px solid rgba(128, 128, 128, 0.5)' }}
                                value={res.token_store[`${prop.name}`]?.store_in || ''}
                                onChange={(e) => handlePropertyChange(prop.name, 'store_in', e.target.value)}
                              >
                                <option value="">Select</option>
                                <option value="LOCAL_STORAGE">LOCAL_STORAGE</option>
                                <option value="SESSION">SESSION</option>
                                <option value="COOKIE">COOKIE</option>
                                <option value="DontSave">Don't Save</option>
                              </select> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <div>
                  <i
                    className="bi bi-trash3 mt-4 mx-1"
                    alt="delete"
                    height={25}
                    width={25}
                    onClick={() => handleDelete(index)}
                  ></i>
                  <i
                    className="bi bi-pencil-square mt-4 mx-1"
                    alt="edit"
                    height={25}
                    width={25}
                    onClick={() => toggleProperty(index)}
                  ></i>
                </div>
              </div>
            </>
          ) : (
            <>
              {res.status}
              <i
                className="bi bi-pencil-square mx-1"
                alt="edit"
                height={25}
                width={25}
                onClick={() => toggleProperty(index)}
              ></i>
            </>
          )}
        </div>
      </div>
    ));
  };

  return (
    <>
      <div className="row mt-3">
        <div className=" br-text-primary br-background-secondary p-1">
          <span className="mx-2">{title}</span>
        </div>
      </div>
      <div className="rounded-0 br-text-primary br-background-primary mt-2 d-flex align-items-center justify-content-between">
        <div style={{ width: '90%' }} className="d-flex align-items-center flex-wrap">
          <ResponseForm
            label="Content Type"
            value={newResponse.content_type}
            onChange={(e) => setNewResponse({ ...newResponse, content_type: e })}
            options={['TEXT', 'JSON', 'HTML']}
          />
          <ResponseForm
            label="Status"
            value={newResponse.status}
            onChange={(e) => setNewResponse({ ...newResponse, status: e })}
            options={['S_200', 'S_400', 'S_404', 'S_500']}
          />
          <ResponseForm
            label="Schema"
            value={newResponse.schema_name}
            // onChange={(e) => handleSchemaChange(e)}
            // options={schemaList}
          />
          {isAuthApi && newResponse.status === 'S_200' && (
            <>
              {properties.length > 0 && (
                <div className="mt-3 w-100">
                  <table className="table table-bordered br-background-secondary">
                    <thead>
                      <tr>
                        <th>Property</th>
                        <th>Storage Key</th>
                        <th>Save As</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((prop, idx) => (
                        <tr key={idx}>
                          <td>{prop.name}</td>
                          <td>
                            <CustomTextInput
                              className=" form-control br-form-control form-control-sm"
                              placeholder="Storage Key"
                              value={newResponse.token_store[`${prop.name}`]?.storage_key || ''}
                              onChange={(e) => handlePropertyChange(prop.name, 'storage_key', e)}
                            />
                            {/* <input
                              type="text"
                              placeholder="Storage Key"
                              className="form-control form-control-sm br-text-primary br-background-primary"
                              style={{ border: '1px solid rgba(128, 128, 128, 0.5)' }}
                              value={newResponse.token_store[`${prop.name}`]?.storage_key || ''}
                              onChange={(e) => handlePropertyChange(prop.name, 'storage_key', e.target.value)}
                            /> */}
                          </td>
                          <td>
                            <CustomSelectField
                              name="valueSelect"
                              value={newResponse.token_store[`${prop.name}`]?.store_in || ''}
                              onChange={(e) => handlePropertyChange(prop.name, 'store_in', e)}
                              options={[
                                { label: 'Select', value: '' },
                                { label: 'DontSave', value: 'DontSave' },
                                { label: 'COOKIE', value: 'COOKIE' },
                                { label: 'LOCAL STORAGE', value: 'LOCAL_STORAGE' },
                                { label: 'SESSION', value: 'SESSION' },
                              ]}
                              className="form-select br-form-select form-select-sm mt-3"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
        <div className="d-flex align-items-center">
          <i className="bi bi-plus-circle mx-1" width="25" height="25" onClick={handleAddResponse}></i>
        </div>
      </div>
      <div className="p-1">{renderResponses()}</div>
    </>
  );
}

function ResponseForm({ label, value, onChange, options }) {
  return (
    <div className="mx-1" style={{ width: '30%' }}>
      <CustomSelectField
        config={{ label: label, groupClass: 'form-group mb-2 mx-2 w-50' }}
        value={value}
        onChange={onChange}
        options={options.map((option) => ({
          value: option.id ? option.id : option,
          label: option.name ? option.name : option,
        }))}
      />
    </div>
  );
}
ResponseSettings.propTypes = {
  moduleId: PropTypes.string.isRequired,
  responseData: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  isAuthApi: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  responseType: PropTypes.string.isRequired,
};

ResponseForm.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    ])
  ).isRequired,
};
export default ResponseSettings;
