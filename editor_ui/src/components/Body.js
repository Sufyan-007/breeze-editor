import React, { useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

export default function Body({ onChange, body }) {
  console.log(body,"body in body");
  const [mode, setMode] = useState(body.mode);
  const [contentType, setContentType] = useState(
    body.content_type || "application/json"
  );
  const [required, setRequired] = useState(body.required || false);
  const [schemaName, setSchemaName] = useState(body.schema_name || "");
  const [rawContent, setRawContent] = useState(body.raw_content || "");
  // const [file, setFile] = useState(body.file || "");
  const [formdata, setFormData] = useState(body.formdata || []);
  // const fileInputRefBinary = useRef(null);
  const fileInputRefFormData = useRef(null);

  const handleModeChange = (value) => {
    setMode(value);
    onChange({ ...body, mode: value });
  };

  const handleContentTypeChange = (value) => {
    setContentType(value);
    onChange({ ...body, content_type: value });
  };

  const handleRequiredChange = (value) => {
    setRequired(value);
    onChange({ ...body, required: value });
  };

  const handleSchemaNameChange = (value) => {
    setSchemaName(value);
    onChange({ ...body, schema_name: value });
  };

  const handleRawContentChange = (value) => {
    setRawContent(value);
    onChange({ ...body, raw_content: value });
  };

  // const handleFileChange = (value) => {
  //   setFile(value);
  //   onChange({ ...body, file: value });
  // };

  const handleFormDataChange = (index, name, value) => {
    const updatedFormData = [...formdata];
    updatedFormData[index][name] = value;
    setFormData(updatedFormData);
    onChange({ ...body, formdata: updatedFormData });
  };

  // const handleFileInputChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     // Check if the file extension is not .bin
  //     if (!file.name.toLowerCase().endsWith(".bin")) {
  //       // Display an alert to the user
  //       alert("Wrong file selected. Please select a .bin file.");
  //       // Clear the file input field
  //       e.target.value = null;
  //       return;
  //     }
  //     setFile(file);
  //     onChange({ ...body, file: file });
  //   }
  // };

  const removeFormData = (index) => {
    const updatedFormdata = [...formdata];
    updatedFormdata.splice(index, 1);
    setFormData(updatedFormdata);
    onChange({ ...body, formdata: updatedFormdata });
  };

  const addFormData = () => {
    const updatedFormData = [
      ...formdata,
      { key: "", value: "", description: "", type: "", src: "" },
    ];
    setFormData(updatedFormData);
    onChange({ ...body, formdata: updatedFormData }); // Pass the updated formdata state to onChange
  };

  const openFileInputFormData = (index) => {
    fileInputRefFormData.current.click();
  };

  // Define a function to handle the file selection in the form data
  const handleFormDataFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedFormData = [...formdata];
      updatedFormData[index].value = file;
      setFormData(updatedFormData);
      onChange({ ...body, formdata: updatedFormData });
    }
  };

  return (
    <div>
      <Form.Group controlId="formBody">
        <Form.Label className="mt-3" style={{ fontWeight: "bold" }}>
          Body:
        </Form.Label>

        {/* Radio buttons for ModeEnum */}
        <div>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Mode:
          </Form.Label>
          <Form.Check
            type="radio"
            label="Raw"
            name="mode"
            value="raw"
            checked={mode === "raw"}
            onChange={() => handleModeChange("raw")}
            inline
          />
          <Form.Check
            type="radio"
            label="x-www-form-urlencoded"
            name="mode"
            value="urlencoded"
            checked={mode === "urlencoded"}
            onChange={() => handleModeChange("urlencoded")}
            inline
          />
          <Form.Check
            inline
            type="radio"
            label="None"
            name="mode"
            value="none"
            checked={mode === "none"}
            onChange={() => handleModeChange("none")}
          />
          <Form.Check
            inline
            type="radio"
            label="Form Data"
            name="mode"
            value="form-data"
            checked={mode === "form-data"}
            onChange={() => handleModeChange("form-data")}
          />
          <Form.Check
            inline
            type="radio"
            label="File"
            name="mode"
            value="binary"
            checked={mode === "binary"}
            onChange={() => handleModeChange("binary")}
          />
        </div>
        {/* Conditional rendering of file input field */}
        {/* {body.mode === "binary" && (
          <div>
            <Form.Label style={{ fontWeight: "bold" }} className="m-3">
              Upload Binary File (.bin):
            </Form.Label>
            <Form.Control
              type="file"
              accept=".bin"
              ref={fileInputRefBinary}
              onChange={() => handleFileInputChange}
            />
          </div>
        )} */}
        {body.mode === "raw" && (
          <>
            <div>
              <Form.Label style={{ fontWeight: "bold" }} className="m-3">
                Content Type:
              </Form.Label>

              <Form.Check
                inline
                type="radio"
                label="JSON"
                name="content_type"
                value="application/json"
                checked={contentType === "application/json"}
                onChange={() => handleContentTypeChange("application/json")}
              />
              <Form.Check
                inline
                type="radio"
                label="TEXT"
                name="content_type"
                value="text/plain"
                checked={contentType === "text/plain"}
                onChange={() => handleContentTypeChange("text/plain")}
              />
              <Form.Check
                inline
                type="radio"
                label="HTML"
                name="content_type"
                value="text/html"
                checked={contentType === "text/html"}
                onChange={() => handleContentTypeChange("text/html")}
              />
              <Form.Check
                inline
                type="radio"
                label="XML"
                name="content_type"
                value="application/xml"
                checked={contentType === "application/xml"}
                onChange={() => handleContentTypeChange("application/xml")}
              />
              <Form.Check
                inline
                type="radio"
                label="Javascript"
                name="content_type"
                value="application/javascript"
                checked={contentType === "application/javascript"}
                onChange={() =>
                  handleContentTypeChange("application/javascript")
                }
              />
              <Form.Check
                inline
                type="radio"
                label="Form Data"
                name="content_type"
                value="multipart/form-data"
                checked={contentType === "multipart/form-data"}
                onChange={() => handleContentTypeChange("multipart/form-data")}
              />
              <Form.Check
                inline
                type="radio"
                label="Url Encoded"
                name="content_type"
                value="application/x-www-form-urlencoded;charset=UTF-8"
                checked={
                  contentType ===
                  "application/x-www-form-urlencoded;charset=UTF-8"
                }
                onChange={() =>
                  handleContentTypeChange(
                    "application/x-www-form-urlencoded;charset=UTF-8"
                  )
                }
              />
            </div>
            <div>
              <Form.Label style={{ fontWeight: "bold" }} className="m-3">
                Raw Content:
              </Form.Label>
              <Form.Control
                type="text"
                value={rawContent}
                onChange={(e) => handleRawContentChange(e.target.value)}
              />
            </div>
          </>
        )}
        {(body.mode === "urlencoded" || body.mode === "form-data") && (
          <div>
            <Form.Label style={{ fontWeight: "bold" }} className="m-3">
              FormData:
            </Form.Label>
            {formdata.map((formData, index) => (
              <div key={index} className="mb-2">
                <Row>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Key"
                      value={formData.key}
                      onChange={(e) =>
                        handleFormDataChange(index, "key", e.target.value)
                      }
                    />
                  </Col>
                  <Col>
                    {formData.type === "upload_file" ? (
                      // If type is "upload_file", render file input
                      <div>
                        <Form.Control
                          type="file"
                          style={{ display: "none" }} // Hide the file input
                          ref={fileInputRefFormData}
                          onChange={(e) => handleFormDataFileChange(e, index)}
                        />
                        <Form.Control
                          type="text"
                          placeholder="Select File"
                          value={formData.value ? formData.value.name : ""}
                          onClick={() => openFileInputFormData(index)}
                          style={{
                            cursor: "pointer",
                            color: "white",
                            border: "none",
                            padding: "6px 12px",
                            borderRadius: "4px",
                          }}
                        />
                      </div>
                    ) : (
                      // If type is not "upload_file", render regular text input
                      <Form.Control
                        type="text"
                        placeholder="Value"
                        value={formData.value}
                        onChange={(e) =>
                          handleFormDataChange(index, "value", e.target.value)
                        }
                      />
                    )}
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) =>
                        handleFormDataChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <Form.Select
                      value={formData.type}
                      onChange={(e) =>
                        handleFormDataChange(index, "type", e.target.value)
                      }
                    >
                      <option value="">Select Type</option>
                      <option value="text">Text</option>
                      <option value="upload_file">File</option>
                    </Form.Select>
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      placeholder="Source"
                      value={formData.src}
                      onChange={(e) =>
                        handleFormDataChange(index, "src", e.target.value)
                      }
                    />
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      onClick={() => removeFormData(index)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}

            {/* Button to add more Formdata */}
            <div className="m-3">
              <Button
                variant="secondary"
                onClick={addFormData}
                disabled={mode === "binary"}
              >
                Add Formdata
              </Button>
            </div>
          </div>
        )}
        {body.mode !== "binary" && (
          <>
            <div>
              <Form.Check
                style={{ fontWeight: "bold" }}
                className="m-3"
                type="checkbox"
                label="Required"
                id="body-required"
                checked={required}
                onChange={(e) => handleRequiredChange(e.target.checked)}
              />
            </div>
            <div>
              <Form.Label style={{ fontWeight: "bold" }} className="m-3">
                Schema Name:
              </Form.Label>
              <Form.Control
                type="text"
                value={schemaName}
                onChange={(e) => handleSchemaNameChange(e.target.value)}
              />
            </div>
          </>
        )}
      </Form.Group>
    </div>
  );
}
