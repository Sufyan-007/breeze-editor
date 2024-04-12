import React, { useState, useRef } from "react";
import { Form, Button, Row, Col, ButtonGroup } from "react-bootstrap";

export default function Body({ onChange, body }) {
  console.log(body, "body in body");
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

  const handleFormDataChange = (index, name, value) => {
    const updatedFormData = [...formdata];
    updatedFormData[index][name] = value;
    setFormData(updatedFormData);
    onChange({ ...body, formdata: updatedFormData });
  };

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
        <Row>
          <Col sm={3}>
            <Form.Label className="mt-3" style={{ fontWeight: "bold" }}>
              Body:
            </Form.Label>
          </Col>
          <Col sm={9}>
            <div>
              <Row>
                <Col sm={2}>
                  <Form.Label
                    style={{ fontWeight: "bold" }}
                    className="mt-3"
                  >
                    Mode:
                  </Form.Label>
                </Col>
                <Col sm={7}>
                  <ButtonGroup className="mt-1">
                    <Button
                      variant="secondary"
                      onClick={() => handleModeChange("raw")}
                      active={mode === "raw"}
                    >
                      Raw
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleModeChange("urlencoded")}
                      active={mode === "urlencoded"}
                    >
                      x-www-form-urlencoded
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleModeChange("none")}
                      active={mode === "none"}
                    >
                      None
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleModeChange("form-data")}
                      active={mode === "form-data"}
                    >
                      FormData
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleModeChange("binary")}
                      active={mode === "binary"}
                    >
                      File
                    </Button>
                  </ButtonGroup>
                </Col>
              </Row>
            </div>

            {body.mode === "raw" && (
              <>
                <div>
                  <Row>
                    <Col sm={2}>
                      <Form.Label
                        style={{ fontWeight: "bold" }}
                        className="mt-3"
                      >
                        Content Type:
                      </Form.Label>
                    </Col>
                    <Col sm={10}>
                      <ButtonGroup className="mt-1">
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleContentTypeChange("application/json")
                          }
                          active={contentType === "application/json"}
                        >
                          JSON
                        </Button>

                        <Button
                          variant="secondary"
                          onClick={() => handleContentTypeChange("text/plain")}
                          active={contentType === "text/plain"}
                        >
                          TEXT
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleContentTypeChange("text/html")}
                          active={contentType === "text/html"}
                        >
                          HTML
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleContentTypeChange("application/xml")
                          }
                          active={contentType === "application/xml"}
                        >
                          XML
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleContentTypeChange("application/javascript")
                          }
                          active={contentType === "application/javascript"}
                        >
                          Javascript
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleContentTypeChange("multipart/form-data")
                          }
                          active={contentType === "multipart/form-data"}
                        >
                          Form Data
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            handleContentTypeChange(
                              "application/x-www-form-urlencoded;charset=UTF-8"
                            )
                          }
                          active={
                            contentType ===
                            "application/x-www-form-urlencoded;charset=UTF-8"
                          }
                        >
                          Url Encoded
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </div>

                <div>
                  <Row>
                    <Col sm={2}>
                      <Form.Label
                        style={{ fontWeight: "bold" }}
                        className="mt-3"
                      >
                        Raw Content:
                      </Form.Label>
                    </Col>
                    <Col sm={7} className="mt-1">
                      <Form.Control
                        style={{
                          maxWidth: "30vw",
                          border: "none",
                          backgroundColor: " #6C757D",
                        }}
                        type="text"
                        value={rawContent}
                        onChange={(e) => handleRawContentChange(e.target.value)}
                      />
                    </Col>
                  </Row>
                </div>
              </>
            )}

            {(body.mode === "urlencoded" || body.mode === "form-data") && (
              <Form.Group controlId="formData">
                <Row>
                  <Col sm={2}>
                    <Form.Label
                      style={{ fontWeight: "bold" }}
                      className="mt-3 p-1"
                    >
                      FormData:
                    </Form.Label>
                  </Col>
                  <Col sm={10}>
                    {formdata.map((formData, index) => (
                      <div key={index} className="mb-2">
                        <Row>
                          <Col>
                            <Form.Control
                              type="text"
                              placeholder="Key"
                              value={formData.key}
                              onChange={(e) =>
                                handleFormDataChange(
                                  index,
                                  "key",
                                  e.target.value
                                )
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
                                  onChange={(e) =>
                                    handleFormDataFileChange(e, index)
                                  }
                                />
                                <Form.Control
                                  type="text"
                                  placeholder="Select File"
                                  value={
                                    formData.value ? formData.value.name : ""
                                  }
                                  onClick={() => openFileInputFormData(index)}
                                  style={{
                                    cursor: "pointer",

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
                                  handleFormDataChange(
                                    index,
                                    "value",
                                    e.target.value
                                  )
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
                                handleFormDataChange(
                                  index,
                                  "type",
                                  e.target.value
                                )
                              }
                              style={{ color: "#636363" }}
                            >
                              <option value="" style={{ color: "black" }}>
                                Select Type
                              </option>
                              <option value="text" style={{ color: "black" }}>
                                Text
                              </option>
                              <option
                                value="upload_file"
                                style={{ color: "black" }}
                              >
                                File
                              </option>
                            </Form.Select>
                          </Col>
                          <Col>
                            <Form.Control
                              type="text"
                              placeholder="Source"
                              value={formData.src}
                              onChange={(e) =>
                                handleFormDataChange(
                                  index,
                                  "src",
                                  e.target.value
                                )
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
                    <div className="mt-3">
                      <Button
                        variant="secondary"
                        onClick={addFormData}
                        disabled={mode === "binary"}
                      >
                        Add Formdata
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form.Group>
            )}
          </Col>
        </Row>
      </Form.Group>
      {body.mode !== "binary" && (
        <>
          <div>
            <Row>
              <Col sm={3}></Col>
              <Col sm={9}>
                <Form.Check
                  style={{ fontWeight: "bold" }}
                  className="mt-3"
                  type="checkbox"
                  label="Required"
                  id="body-required"
                  checked={required}
                  onChange={(e) => handleRequiredChange(e.target.checked)}
                />
              </Col>
            </Row>
          </div>

          <Row className="mt-3">
            <Col sm={3}>
              <Form.Label style={{ fontWeight: "bold" }}>
                Schema Name:
              </Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Control
                style={{
                  maxWidth: "30vw",
                  backgroundColor: " #6C757D",
                  border: "none"
                }}
                type="text"
                value={schemaName}
                onChange={(e) => handleSchemaNameChange(e.target.value)}
              />
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}
