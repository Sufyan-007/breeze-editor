import React, { useCallback, useEffect, useState } from "react";
import { Card, Form, Row, Table } from "react-bootstrap";
import Delete from "../../../../../assets/icons/delete-trash.svg";
import edit from "../../../../../assets/icons/edit-icon.svg";
import { getApiSchemaDetails } from "../../../services/ApiService";
import { useParams } from "react-router";

const responseObject = {
  content_type: "",
  status: "",
  schema_name: "",
  schema: {},
  raw_content: "",
  file: "",
  description: "",
  token_store: {
    "store_in": "",
    "stored_key": ""
  }
};

function ResponseSettings({ responseData, onChange, isAuthApi, title, responseType, moduleId }) {
  const [response, setResponse] = useState(responseData || []);
  const [newResponse, setNewResponse] = useState(responseObject);
  const [expandedProperty, setExpandedProperty] = useState(null);
  const [schemaList, setSchemaList] = useState([]);
  const { projectName } = useParams();
  const [properties, setProperties] = useState([]);

  const fetchSchemasList = useCallback(
    async (schemaName, moduleId) => {
      try {
        const result = await getApiSchemaDetails(projectName, schemaName, moduleId);
        if (schemaName) {
          return result;
        } else {
          setSchemaList(result[0].schemas);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [projectName]
  );
  useEffect(() => {
    if (moduleId) {
      fetchSchemasList(null, moduleId);
    }
  }, [fetchSchemasList, moduleId]);

  useEffect(() => { setResponse(responseData); }, [responseData])

  const extractProperties = useCallback((schema) => {
    if (schema && schema.properties) {
      const props = Object.entries(schema.properties).map(([key, value]) => ({
        name: key,
        type: value.type,
      }));
      setProperties(props.filter(prop => prop.type === 'string' || prop.type === 'integer'));

      // Initialize token_store entries for the properties
      if (newResponse.status === 'S_200') {
        const initialTokenStore = {};
        props.forEach(prop => {
          initialTokenStore[`${prop.name}`] = {
            store_in: 'LOCAL_STORAGE', 
            storage_key: '', 
          };
        });
        setNewResponse(prevState => ({ ...prevState, token_store: initialTokenStore }));
      }
    }
  }, [newResponse.status]);
  useEffect(() => {
    if (response && response.length > 0) {
      const selectedResponse = response.find(res => res.status === "S_200");
      if (selectedResponse && selectedResponse.schema_name && selectedResponse.schema) {
        extractProperties(selectedResponse.schema);
      }
    }
  }, [response, schemaList, extractProperties]);


  useEffect(() => {
    if (newResponse.schema_name && newResponse.schema) {
      console.log("insideee functionnnnnnnnn");
      extractProperties(newResponse.schema);
    }
  }, [newResponse.schema, newResponse.schema_name, extractProperties])
  const handleInputChange = (index, field, value, subField = null) => {
    const updatedResponse = [...response];
    if (subField) {
      updatedResponse[index] = {
        ...updatedResponse[index],
        [field]: {
          ...updatedResponse[index][field],
          [subField]: value,
        }
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
    console.log(newResponse, "new response");
    onChange(responseType, [...updatedResponse, newResponse]);
    setNewResponse(responseObject);
  };

  const toggleProperty = (index) => {
    setExpandedProperty(expandedProperty === index ? null : index);
  };
  const handleSchemaChange = async (event) => {
    const schemaName = event.target.value;
    setNewResponse({ ...newResponse, schema_name: schemaName });
    const schema = await fetchSchemasList(schemaName, moduleId);
    setNewResponse(prevState => ({ ...prevState, schema }));

    // Update token_store with new schema properties
    if (schema && schema.properties) {
      const updatedTokenStore = {};
      Object.keys(schema.properties).forEach(prop => {
        updatedTokenStore[`${schemaName}.${prop}`] = {
          store_in: 'LOCAL_STORAGE',
          storage_key: '',
        };
      });
      setNewResponse(prevState => ({ ...prevState, token_store: updatedTokenStore }));
    }
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
        [`${property}`]: updatedTokenStoreEntry
      }
    });
  };
  

  const renderResponses = () => {
    if (!response || response.length === 0) {
      return null;
    }

    return response.map((res, index) => (
      <Card
        className="rounded-0 text-white mt-2"
        bg="dark"
        style={{ border: "1px solid rgba(128, 128, 128, 0.5)" }}
        key={index}>
        <Card.Body className="d-flex justify-content-between text-white">
          {expandedProperty === index ? (
            <>
              <div
                className="rounded-0 text-white bg-dark d-flex align-items-center justify-content-between mb-2"
                style={{ width: "100%" }}>
                <div
                  style={{ width: "90%" }}
                  className="d-flex align-items-center">
                  <ResponseForm
                    label="Content Type"
                    value={res.content_type}
                    onChange={(e) =>
                      handleInputChange(index, "content_type", e.target.value)
                    }
                    options={["TEXT", "JSON", "HTML"]}
                  />
                  <ResponseForm
                    label="Status"
                    value={res.status}
                    onChange={(e) =>
                      handleInputChange(index, "status", e.target.value)
                    }
                    options={["S_200", "S_400", "S_404", "S_500"]}
                  />
                  <ResponseForm
                    label="Schema"
                    value={res.schema_name}
                    onChange={(e) =>
                      handleInputChange(index, "schema_name", e.target.value)
                    }
                    options={schemaList}
                  />
                  {/* {isAuthApi && (
                    <>
                      <ResponseForm
                        label="Save As"
                        value={res.token_store.store_in}
                        onChange={(e) =>
                          handleInputChange(index, "token_store", e.target.value, "store_in")
                        }
                        options={[
                          "LOCAL_STORAGE",
                          "SESSION",
                          "COOKIE"
                        ]}
                      />
                      <div className="mx-1 mt-1" style={{ width: "30%" }}>
                        <Form.Label className="text-white mb-1">
                          Storage Key
                        </Form.Label>
                        <Form.Control
                          as="input"
                          type="text"
                          className="text-white"
                          size="sm"
                          style={{
                            backgroundColor: "#212529",
                            border: "1px solid rgba(128, 128, 128, 0.5)",
                          }}
                          value={res.token_store.stored_key}
                          onChange={(e) =>
                            handleInputChange(index, "token_store", e.target.value, "stored_key")
                          }
                        ></Form.Control>
                      </div>
                    </>
                  )} */}
                </div>
                {res.status === 'S_200' && isAuthApi && (
                <div className="mt-3 w-100">
                  <Table bordered hover variant="dark">
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
                            <Form.Control
                              as="input"
                              type="text"
                              placeholder="Storage Key"
                              className="text-white"
                              size="sm"
                              style={{
                                backgroundColor: "#212529",
                                border: "1px solid rgba(128, 128, 128, 0.5)",
                              }}
                              value={res.token_store[`${prop.name}`]?.storage_key || ""}
                              onChange={(e) =>
                                handlePropertyChange(prop.name, "storage_key", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <Form.Control
                              as="select"
                              className="text-white"
                              size="sm"
                              style={{
                                backgroundColor: "#212529",
                                border: "1px solid rgba(128, 128, 128, 0.5)",
                              }}
                              value={res.token_store[`${prop.name}`]?.store_in || ""}
                              onChange={(e) =>
                                handlePropertyChange(prop.name, "store_in", e.target.value)
                              }
                            >
                              <option value="">Select</option>
                              <option value="LOCAL_STORAGE">LOCAL_STORAGE</option>
                              <option value="SESSION">SESSION</option>
                              <option value="COOKIE">COOKIE</option>
                              <option value="DontSave">Don't Save</option>
                            </Form.Control>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                )}
                <div>
                  <img
                    alt="delete"
                    className="mt-4 mx-1"
                    height={25}
                    width={25}
                    src={Delete}
                    onClick={() => handleDelete(index)}
                    style={{ cursor: "pointer" }}
                  />
                  <img
                    alt="edit"
                    className="mt-4 mx-1"
                    height={25}
                    width={25}
                    src={edit}
                    onClick={() => toggleProperty(index)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {res.status}
              <img
                alt="edit"
                className="mx-1"
                height={25}
                width={25}
                src={edit}
                onClick={() => toggleProperty(index)}
                style={{ cursor: "pointer" }}
              />
            </>
          )}
        </Card.Body>
      </Card>
    ));
  };

  return (
    <>
      <Row className="mt-3">
        <div className="text-white p-1" style={{ backgroundColor: "#303033" }}>
          <span className="mx-2">{title}</span>
        </div>
      </Row>
      <div className="rounded-0 text-white bg-dark d-flex align-items-center justify-content-between">
        <div
          style={{ width: "90%" }}
          className="d-flex align-items-center flex-wrap">
          <ResponseForm
            label="Content Type"
            value={newResponse.content_type}
            onChange={(e) =>
              setNewResponse({ ...newResponse, content_type: e.target.value })
            }
            options={["TEXT", "JSON", "HTML"]}
          />
          <ResponseForm
            label="Status"
            value={newResponse.status}
            onChange={(e) =>
              setNewResponse({ ...newResponse, status: e.target.value })
            }
            options={["S_200", "S_400", "S_404", "S_500"]}
          />
          <ResponseForm
            label="Schema"
            value={newResponse.schema_name}
            onChange={(e) => handleSchemaChange(e)}
            options={schemaList}
          />
          {isAuthApi && newResponse.status === 'S_200' && (
            <>
              {properties.length > 0 && (
                <div className="mt-3 w-100">
                  <Table bordered hover variant="dark">
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
                            <Form.Control
                              as="input"
                              type="text"
                              placeholder="Storage Key"
                              className="text-white"
                              size="sm"
                              style={{
                                backgroundColor: "#212529",
                                border: "1px solid rgba(128, 128, 128, 0.5)",
                              }}
                              value={newResponse.token_store[`${prop.name}`]?.storage_key || ""}
                              onChange={(e) =>
                                handlePropertyChange(prop.name, "storage_key", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <Form.Control
                              as="select"
                              className="text-white"
                              size="sm"
                              style={{
                                backgroundColor: "#212529",
                                border: "1px solid rgba(128, 128, 128, 0.5)",
                              }}
                              value={newResponse.token_store[`${prop.name}`]?.store_in || ""}
                              onChange={(e) =>
                                handlePropertyChange(prop.name, "store_in", e.target.value)
                              }
                            >
                              <option value="">Select</option>
                              <option value="LOCAL_STORAGE">LOCAL_STORAGE</option>
                              <option value="SESSION">SESSION</option>
                              <option value="COOKIE">COOKIE</option>
                              <option value="DontSave">Don't Save</option>
                            </Form.Control>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </div>
        <div className="d-flex align-items-center">
          <img
            className="mx-1 mt-4"
            width="25"
            height="25"
            src="https://img.icons8.com/ios/50/FFFFFF/add--v1.png"
            alt="add--v1"
            onClick={handleAddResponse}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
      <div className="p-1">{renderResponses()}</div>
    </>
  );
}

function ResponseForm({ label, value, onChange, options }) {
  return (
    <div className="mx-1 mt-1" style={{ width: "30%" }}>
      <Form.Label className="text-white mb-1">{label}</Form.Label>
      <Form.Control
        as="select"
        className="text-white"
        size="sm"
        style={{
          backgroundColor: "#212529",
          border: "1px solid rgba(128, 128, 128, 0.5)",
        }}
        value={value}
        onChange={onChange}>
        <option value="">Select</option>
        {options &&
          options.length > 0 &&
          options.map((name, index) => (
            <option key={index} value={name.id ? name.id : name}>
              {name.name ? name.name : name}
            </option>
          ))}
      </Form.Control>
    </div>
  );
}

export default ResponseSettings;
