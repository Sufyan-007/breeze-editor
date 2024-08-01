import React, { useEffect, useState } from "react";
import { Card, Form, Row } from "react-bootstrap";
import Delete from "../../../../../assets/icons/delete-trash.svg";
import edit from "../../../../../assets/icons/edit-icon.svg";

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

function ResponseSettings({ responseData, onChange, schemaList, isAuthApi, title, responseType }) {
  // console.log(schemaList, "schemaList");
  const [response, setResponse] = useState(responseData);
  const [newResponse, setNewResponse] = useState(responseObject);
  const [expandedProperty, setExpandedProperty] = useState(null);

  useEffect(() => {
    setResponse(responseData);
  }, [responseData]);

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
    onChange(responseType, [...response, newResponse]);
    setNewResponse(responseObject);
  };

  const toggleProperty = (index) => {
    setExpandedProperty(expandedProperty === index ? null : index);
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
                  {isAuthApi && (
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
                  )}
                </div>
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
            onChange={(e) =>
              setNewResponse({ ...newResponse, schema_name: e.target.value })
            }
            options={schemaList}
          />
          {isAuthApi && (
            <>
              <ResponseForm
                label="Save As"
                value={newResponse.store_in}
                onChange={(e) =>
                  setNewResponse({ ...newResponse, store_in: e.target.value })
                }
                options={["localStorage", "sessionStorage", "cookie", "state"]}
              />
              <div className="mx-1 mt-1" style={{ width: "30%" }}>
                <Form.Label className="text-white mb-1">Storage Key</Form.Label>
                <Form.Control
                  as="input"
                  type="text"
                  className="text-white"
                  size="sm"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={newResponse.token_store.store_key}
                  onChange={(e) => setNewResponse((state) => {
                    state.token_store.stored_key = e.target.value;
                    return { ...state }
                  })}
                ></Form.Control>
              </div>
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
