import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomSelectField, CustomTextInput } from '../../../common/fields';
import { RESPONSE_OPTIONS, STATUS_CODES } from '../constants/Content-Types';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSchemas } from '../../schema-configuration/redux/schemaConfigActions';

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
  properties: [],
};

function ResponseSettings({ responseData, onChange, isAuthApi, title, responseType, moduleId }) {
  const [response, setResponse] = useState(responseData || []);
  const [newResponse, setNewResponse] = useState(responseObject);
  const [expandedProperty, setExpandedProperty] = useState(null);
  const schemaList = useSelector((state) => state.schemas.schemaList[moduleId]);
  const { status } = useSelector((state) => state.schemas);
  const dispatch = useDispatch();
  const { projectName } = useParams();
  useEffect(() => {
    if (status === 'ready' && moduleId)
      dispatch(fetchSchemas({ projectName, payload: { category: 'models', module: moduleId } })).unwrap();
  }, [dispatch, projectName, moduleId, status]);

  const schemaOptions = schemaList
    ? Object.keys(schemaList)
        .filter((key) => !Object.hasOwn(schemaList[key], 'isUnresolved'))
        .map((key) => ({
          value: key,
          label: schemaList[key].name,
          schema: schemaList[key],
        }))
    : [];
  schemaOptions.push({ label: 'Select', value: '' });
  const extractProperties = useCallback(
    (schema, checkNewRes = false) => {
      if (schema && schema.properties) {
        const props = Object.entries(schema.properties).map(([key, value]) => ({
          name: key,
          type: value.types[0].type,
        }));
        const filteredProps = props.filter((prop) => prop.type === 'string' || prop.type === 'integer');
        if (newResponse.status === 'S_200' && checkNewRes) {
          const initialTokenStore = {};
          filteredProps.forEach((prop) => {
            initialTokenStore[`${prop.name}`] = {
              store_in: 'LOCAL_STORAGE',
              storage_key: '',
            };
          });
          setNewResponse((prevState) => ({
            ...prevState,
            token_store: initialTokenStore,
          }));
        }
        return filteredProps;
      }
    },
    [newResponse.status]
  );

  useEffect(() => {
    const resultantResponse = [];
    if (schemaList && responseData) {
      responseData.forEach((res) => {
        if (res.schema_name && schemaList[res.schema_name]) {
          const schema = schemaList[res.schema_name];
          const props = extractProperties(schema);
          const newRes = {
            ...res,
            properties: props,
          };
          resultantResponse.push(newRes);
        } else {
          resultantResponse.push(res);
        }
      });
      setResponse(resultantResponse);
    }
  }, [responseData, schemaList, extractProperties]);

  useEffect(() => {
    if (newResponse.schema_name && schemaList[newResponse.schema_name]) {
      const schema = schemaList[newResponse.schema_name];
      const props = extractProperties(schema, true);
      setNewResponse((prevState) => ({
        ...prevState,
        schema,
        properties: props,
      }));
    }
  }, [newResponse.schema_name, schemaList, extractProperties]);

  const handleInputChange = (index, field, value, subField = null, subProperty = null) => {
    const updatedResponse = [...response];

    if (field === 'schema_name') {
      const schema = value.schema;
      const properties = schema?.properties
        ? Object.keys(schema.properties).map((key) => ({
            name: key,
            type: schema.properties[key].types[0].type,
          }))
        : [];
      const tokenStore = {};
      properties.forEach((prop) => {
        if (prop.type === 'string' || prop.type === 'integer') {
          tokenStore[prop.name] = {
            store_in: 'LOCAL_STORAGE',
            storage_key: '',
          };
        }
      });

      updatedResponse[index] = {
        ...updatedResponse[index],
        schema: schema,
        schema_name: value.value,
        token_store: tokenStore,
      };

      setResponse(updatedResponse);
      onChange(responseType, updatedResponse);
      return;
    }

    if (subField && subProperty) {
      updatedResponse[index] = {
        ...updatedResponse[index],
        [field]: {
          ...updatedResponse[index][field],
          [subField]: {
            ...updatedResponse[index][field][subField],
            [subProperty]: value,
          },
        },
      };
    } else if (subField) {
      updatedResponse[index] = {
        ...updatedResponse[index],
        [field]: {
          ...updatedResponse[index][field],
          [subField]: value,
        },
      };
    } else {
      updatedResponse[index] = { ...updatedResponse[index], [field]: value };
    }

    setResponse(updatedResponse);
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

  const handleSchemaChange = async (value) => {
    setNewResponse((prevState) => ({
      ...prevState,
      schema_name: value,
    }));
  };

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
                    onChange={(e) => handleInputChange(index, 'content_type', e)}
                    options={RESPONSE_OPTIONS}
                  />
                  <ResponseForm
                    label="Status"
                    value={res.status}
                    onChange={(e) => handleInputChange(index, 'status', e)}
                    options={STATUS_CODES}
                  />
                  <ResponseForm
                    label="Schema"
                    value={res.schema_name}
                    onChange={(e) => handleInputChange(index, 'schema_name', e)}
                    options={schemaOptions}
                    sendSelected={true}
                  />
                </div>
                {res.status === 'S_200' && isAuthApi && (
                  <div className="mt-3 w-100">
                    <table className="table table-bordered br-background-secondary" style={{ borderColor: 'gray' }}>
                      <thead>
                        <tr className="br-background-secondary">
                          {/* <th className="br-background-secondary br-text-primary">Save as Token</th> */}
                          <th className="br-background-secondary br-text-primary">Property</th>
                          <th className="br-background-secondary br-text-primary">Storage Key</th>
                          <th className="br-background-secondary br-text-primary">Save As</th>
                        </tr>
                      </thead>
                      <tbody>
                        {res.properties?.map((prop, idx) => (
                          <tr key={idx}>
                            {/* <td className="br-background-secondary br-text-primary">
                              <input
                                type="checkbox"
                                checked={selectedProperty === prop.name}
                                onChange={() => handlePropertySelection(prop.name)}
                              />
                            </td> */}
                            <td className="br-background-secondary br-text-primary">{prop.name}</td>
                            <td className="br-background-secondary br-text-primary">
                              <CustomTextInput
                                className="form-control br-form-control form-control-sm"
                                placeholder="Storage Key"
                                value={res.token_store[`${prop.name}`]?.storage_key || ''}
                                onChange={(e) => handleInputChange(index, 'token_store', e, prop.name, 'storage_key')}
                              />
                            </td>
                            <td className="br-background-secondary br-text-primary">
                              <CustomSelectField
                                name="valueSelect"
                                value={res.token_store[`${prop.name}`]?.store_in || ''}
                                onChange={(e) => handleInputChange(index, 'token_store', e, prop.name, 'store_in')}
                                options={[
                                  { label: 'Select', value: '' },
                                  { label: 'DontSave', value: 'DontSave' },
                                  { label: 'COOKIE', value: 'COOKIE' },
                                  { label: 'LOCAL STORAGE', value: 'LOCAL_STORAGE' },
                                  { label: 'SESSION', value: 'SESSION' },
                                ]}
                                className="form-select br-form-select form-select-sm"
                              />
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
          <span className="mx-2" style={{ fontSize: '16px' }}>
            {title}
          </span>
        </div>
      </div>
      <div className="rounded-0 br-text-primary br-background-primary mt-2 d-flex align-items-center justify-content-between">
        <div style={{ width: '90%' }} className="d-flex align-items-center flex-wrap">
          <ResponseForm
            label="Content Type"
            value={newResponse.content_type}
            onChange={(e) => setNewResponse({ ...newResponse, content_type: e })}
            options={RESPONSE_OPTIONS}
          />
          <ResponseForm
            label="Status"
            value={newResponse.status}
            onChange={(e) => setNewResponse({ ...newResponse, status: e })}
            options={STATUS_CODES}
          />
          <ResponseForm
            label="Schema"
            value={newResponse.schema_name}
            onChange={(e) => handleSchemaChange(e)}
            options={schemaOptions}
          />
          {isAuthApi && newResponse.status === 'S_200' && newResponse.properties?.length > 0 && (
            <div className="mt-3 w-100">
              <table
                className="table table-bordered br-background-secondary"
                style={{ borderColor: 'gray', fontSize: '14px' }}
              >
                <thead>
                  <tr className="br-background-secondary br-text-primary">
                    {/* <th className="br-background-secondary br-text-primary">Save as Token</th> */}
                    <th className="br-background-secondary br-text-primary">Property</th>
                    <th className="br-background-secondary br-text-primary">Storage Key</th>
                    <th className="br-background-secondary br-text-primary">Save As</th>
                  </tr>
                </thead>
                <tbody>
                  {newResponse.properties?.map((prop, idx) => (
                    <tr key={idx} className="br-background-secondary br-text-primary">
                      {/* <td className="br-background-secondary br-text-primary">
                        <input
                          type="checkbox"
                          checked={selectedProperty === prop.name}
                          onChange={() => handlePropertySelection(prop.name)}
                        />
                      </td> */}
                      <td className="br-background-secondary br-text-primary">{prop.name}</td>
                      <td className="br-background-secondary br-text-primary">
                        <CustomTextInput
                          className="form-control br-form-control form-control-sm"
                          placeholder="Storage Key"
                          value={newResponse.token_store[`${prop.name}`]?.storage_key || ''}
                          onChange={(e) => handlePropertyChange(prop.name, 'storage_key', e)}
                        />
                      </td>
                      <td className="br-background-secondary br-text-primary">
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
                          className="form-select br-form-select form-select-sm"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

function ResponseForm({ label, value, onChange, options, sendSelected }) {
  return (
    <>
      <div className="mx-1" style={{ width: '30%' }}>
        <CustomSelectField
          config={{ label: label, groupClass: 'form-group mb-2 mx-2 w-50' }}
          value={value}
          onChange={onChange}
          options={options}
          sendSelectedOption={sendSelected}
        />
      </div>
    </>
  );
}
ResponseSettings.propTypes = {
  moduleId: PropTypes.string,
  responseData: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  isAuthApi: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  responseType: PropTypes.string.isRequired,
};

ResponseForm.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
      filter: PropTypes.string,
    }).isRequired
  ).isRequired,
  sendSelected: PropTypes.bool,
};
export default ResponseSettings;
