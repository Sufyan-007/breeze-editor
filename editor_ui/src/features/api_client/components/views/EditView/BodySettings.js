import React, { useCallback, useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { getApiSchemaDetails } from "../../../services/ApiService";
import { useParams } from "react-router";
function BodySettings({ bodyData, onChange, moduleId }) {
  console.log(moduleId, "moduleid in bodyyyyyyyyyy");
  const [body, setBody] = useState(bodyData);
  const [schemaList, setSchemaList] = useState([]);
  // const [isExpanded, setIsExpanded] = useState(false);
  const { projectName } = useParams();

  const fetchSchemasList = useCallback(
    async (schemaName, moduleId) => {
      try {
        const result = await getApiSchemaDetails(projectName, schemaName, moduleId);
        if (schemaName) {
          return result;
        } else {
          // needs to be changed later 
          // const combinedSchemaList = result.flatMap(module => module.schemas);

          setSchemaList(result[0].schemas);
        }
        console.log(result, "result");
      } catch (e) {
        console.error(e);
      }
    },
    [projectName]
  );
  useEffect(() => {
    if(moduleId)
    {
      fetchSchemasList(null,moduleId);
    }
  }, [fetchSchemasList, moduleId]);

  const handleSchemaChange = async (value) => {
    const updatedSchema = await fetchSchemasList(value,moduleId);
    console.log(updatedSchema, "updatedSchema");
    setBody((state) => {
      state.schema = updatedSchema;
      state.schema_name = value;
      onChange("body", [state]);
      return { ...state };
    });
  };
  const handleChanges = (prop, value) => {
    console.log(prop, value);
    const newBody = { ...body };
    newBody[prop] = value;
    setBody(newBody);
    onChange("body", [newBody]);
  };
  useEffect(() => {
    setBody(bodyData);
  }, [bodyData]);

  const renderError = (errors) => {
    if (!errors) return null;
    return (
      <div className="text-danger">
        {Object.entries(errors).map(([key, messages]) => (
          <div key={key}>
            {messages.map((message, idx) => (
              <div key={idx}>{key}:{message}</div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  return body ? (
    <>
      <div className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
        <div className="mx-3 mb-2" style={{ width: "30%" }}>
          <Form.Label className="text-white mb-1">Content Type:</Form.Label>
          <Form.Control
            as="select"
            className="text-white"
            size="sm"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={body.content_type}
            onChange={(e) => handleChanges("content_type", e.target.value)}>
            <option value="">Select</option>
            <option value="JSON">Json</option>
            <option value="TEXT">Text</option>
            <option value="HTML">Html</option>
          </Form.Control>
        </div>
        {body.content_type === "TEXT" ? (
          <>
            <div className="mx-1 mb-2" style={{ width: "60%" }}>
              <Form.Label className="text-white mb-1">Value:</Form.Label>
              <Form.Control
                className="text-white"
                size="sm"
                type="text"
                placeholder="Key"
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                }}
                value={body.raw_content}
                onChange={(e) => handleChanges("raw_content", e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="mx-1 mb-2" style={{ width: "30%" }}>
              <Form.Label className="text-white mb-1">Mode:</Form.Label>
              <Form.Control
                as="select"
                className="text-white"
                size="sm"
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                }}
                value={body.mode}
                onChange={(e) => handleChanges("mode", e.target.value)}>
                <option value="">Select</option>
                <option value="RAW">Raw</option>
                <option value="BINARY">Binary</option>
                <option value="URLENCODED">Urlencoded</option>
              </Form.Control>
            </div>
            <div className="mx-1 mb-2" style={{ width: "30%" }}>
              <Form.Label className="text-white mb-1">Schema name:</Form.Label>
              <div className="d-flex">
                <Form.Control
                  as="select"
                  className="text-white"
                  size="sm"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={body.schema_name}
                  onChange={(e) => handleSchemaChange(e.target.value)}>
                  <option value="">Select</option>
                  {schemaList.map((name, index) => (
                    <option key={index} value={name.id}>
                      {name.name}
                    </option>
                  ))}
                </Form.Control>
              </div>
            </div>
          </>
        )}
      </div>
        {renderError(body.errors)}
    </>
  ) : (
    <div className="text-white">-----No Body Present-----</div>
  );
}

export default BodySettings;
