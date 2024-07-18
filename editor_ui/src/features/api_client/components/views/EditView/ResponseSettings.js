import React, { useEffect, useState } from "react";
import { Card, Form, Row } from "react-bootstrap";
import Delete from "../../../../../assets/icons/delete-trash.svg";
// import edit from "../../../../assets/icons/edit-trash.svg";
import edit from "../../../../../assets/icons/edit-icon.svg";
const responseObject = {
  content_type: "",
  status: "",
  schema_name: "",
  schema: {},
  raw_content: "",
  file: "",
  description: "",
};

function ResponseSettings({ responseData, onChange, schemaList }) {
  const [response, setResponse] = useState(responseData);
  const [newResponse, setNewResponse] = useState(responseObject);
  const [expandedProperty, setExpandedProperty] = useState(null);

  // console.log(response, "response");
  useEffect(() => {
    setResponse(responseData);
  }, [responseData]);
  const handleInputChange = (index, field, value) => {
    const updatedResponse = [...response];
    updatedResponse[index] = { ...updatedResponse[index], [field]: value };
    onChange("response", updatedResponse);
  };

  const handleDelete = (index) => {
    const updatedResponse = [...response];
    updatedResponse.splice(index, 1);
    onChange("response", updatedResponse);
  };

  const handleAddResponse = () => {
    // console.log(newResponse, "newResponse");
    onChange("response", [...response, newResponse]);
    setNewResponse(responseObject);
  };
  const toggleProperty = (index) => {
    console.log(index, "index");
    if (expandedProperty === index) {
      setExpandedProperty(null);
    } else {
      setExpandedProperty(index);
    }
  };

  const renderResponses = () => {
    if (!response || response.length === 0) {
      return null;
    }
    // console.log(response, "inside loop");
    return response.map((res, index) => (
      <Card
        className="rounded-0 text-white mt-2"
        bg="dark"
        style={{ border: "1px solid rgba(128, 128, 128, 0.5)" }}>
        <Card.Body className="d-flex justify-content-between text-white">
          {expandedProperty === index ? (
            <>
              <div
                key={index}
                className="rounded-0 text-white bg-dark d-flex align-items-center justify-content-between  mb-2"
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
                    // options={schemaList}
                  />
                </div>
                <div className="">
                  <img
                    alt="delete"
                    className="mt-4 mx-1 "
                    height={25}
                    width={25}
                    src={Delete}
                    onClick={() => handleDelete(index)}
                    style={{ cursor: "pointer" }}
                  />
                  <img
                    alt="edit"
                    className="mt-4 mx-1 "
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
              {res.status}{" "}
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
          Response Settings
        </div>
      </Row>
      <div className="rounded-0 text-white bg-dark d-flex align-items-center justify-content-between">
        <div style={{ width: "90%" }} className="d-flex align-items-center">
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
