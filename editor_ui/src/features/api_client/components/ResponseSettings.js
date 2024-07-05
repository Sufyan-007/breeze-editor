import React, { useState } from "react";
import { Form, Row } from "react-bootstrap";
import Delete from "../../../assets/icons/delete-trash.svg";

const responseObject = {
  content_type: "",
  status: "",
  schema_name: "",
  schema: {},
  raw_content: "",
  file: "",
  description: "",
};

function ResponseSettings({ responseData, onChange }) {
  const [newResponse, setNewResponse] = useState(responseObject);

  const handleInputChange = (index, field, value) => {
    const updatedResponse = [...responseData];
    updatedResponse[index] = { ...updatedResponse[index], [field]: value };
    onChange("response", updatedResponse);
  };

  const handleDelete = (index) => {
    const updatedResponse = [...responseData];
    updatedResponse.splice(index, 1);
    onChange("response", updatedResponse);
  };

  const handleAddResponse = () => {
    onChange("response", [...responseData, newResponse]);
    setNewResponse(responseObject);
  };

  const renderResponses = () => {
    if (!responseData || responseData.length === 0) {
      return null;
    }

    return responseData.map((res, index) => (
      <div
        key={index}
        className="rounded-0 text-white bg-dark d-flex align-items-center justify-content-between mt-2"
      >
        <div style={{ width: "90%" }} className="d-flex align-items-center">
          <ResponseForm
            label="Content Type"
            value={res.content_type}
            onChange={(e) => handleInputChange(index, "content_type", e.target.value)}
          />
          <ResponseForm
            label="Status"
            value={res.status}
            onChange={(e) => handleInputChange(index, "status", e.target.value)}
          />
          <ResponseForm
            label="Schema"
            value={res.schema_name}
            onChange={(e) => handleInputChange(index, "schema_name", e.target.value)}
          />
        </div>
        <div className="d-flex align-items-center">
          <img
            alt="delete"
            className="mt-4"
            height={25}
            width={25}
            src={Delete}
            onClick={() => handleDelete(index)}
            style={{ cursor: "pointer" }}
          />
        </div>
      </div>
    ));
  };

  return (
    <>
      <Row className="mt-2">
        <div className="text-white p-1" style={{ backgroundColor: "#303033" }}>
          Response Settings
        </div>
      </Row>
      <div className="rounded-0 text-white bg-dark d-flex align-items-center justify-content-between">
        <div style={{ width: "90%" }} className="d-flex align-items-center">
          <ResponseForm
            label="Content Type"
            value={newResponse.content_type}
            onChange={(e) => setNewResponse({ ...newResponse, content_type: e.target.value })}
          />
          <ResponseForm
            label="Status"
            value={newResponse.status}
            onChange={(e) => setNewResponse({ ...newResponse, status: e.target.value })}
          />
          <ResponseForm
            label="Schema"
            value={newResponse.schema_name}
            onChange={(e) => setNewResponse({ ...newResponse, schema_name: e.target.value })}
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
      {renderResponses()}
    </>
  );
}

function ResponseForm({ label, value, onChange }) {
  return (
    <div className="mx-1 mt-2" style={{ width: "30%" }}>
      <Form.Label className="text-white mb-1">{label}</Form.Label>
      <Form.Control
        className="text-white"
        size="sm"
        type="text"
        placeholder="Value"
        style={{
          backgroundColor: "#212529",
          border: "1px solid rgba(128, 128, 128, 0.5)",
        }}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default ResponseSettings;
