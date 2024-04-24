import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Row, Col, ButtonGroup } from "react-bootstrap";
import BodyCss from "../../css/Body.css";

export default function Body({ onChange, body }) {
  // console.log(body,"body in body");
  const [bodyDetails, setBodyDetails] = useState([]);

  useEffect(() => {
  const initialBody =
    body.length > 0
      ? body.map((bodyDetails) => ({
          mode: bodyDetails.mode || "",
          contentType: bodyDetails.contentType || "application/json",
          required: bodyDetails.required || false,
          schemaName: bodyDetails.schemaName || "",
          rawContent: bodyDetails.rawContent || "",
          formdata: bodyDetails.formdata || [],
        }))
      : [
          {
            mode: "",
            contentType: "application/json",
            required: false,
            schemaName: "",
            rawContent: "",
            formdata: [],
          },
        ];

  setBodyDetails(initialBody);
  }, [body]);


  const contentTypeOptions = [
    { value: "application/json", label: "JSON" },
    { value: "text/plain", label: "TEXT" },
    { value: "text/html", label: "HTML" },
    { value: "application/xml", label: "XML" },
    { value: "application/javascript", label: "Javascript" },
    {
      value: "application/x-www-form-urlencoded;charset=UTF-8",
      label: "Url Encoded",
    },
  ];
  const handleChange = (index, property, value) => {
    const updatedBodyDetails = [...bodyDetails];
    updatedBodyDetails[index][property] = value;
    setBodyDetails(updatedBodyDetails);
    onChange(updatedBodyDetails);
  };

// console.log(bodyDetails,"body details");
  return (
    <div>
      <Form.Group controlId="formBody">
        {bodyDetails.map((body, index) => (
          <div key={index}>
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">Body:</Form.Label>
              </Col>
              <Col sm={9}>
                <div>
                  <Row>
                    <Col sm={2}>
                      <Form.Label className="mx-5 mt-3">Mode:</Form.Label>
                    </Col>
                    <Col sm={7}>
                      <ButtonGroup className="mx-5 mt-3">
                        {["raw", "urlencoded", "none", "binary"].map(
                          (modeOption) => (
                            <Button
                              key={modeOption}
                              variant="secondary"
                              onClick={() =>
                                handleChange(index, "mode", modeOption)
                              }
                              active={body.mode === modeOption}
                            >
                              {modeOption === "urlencoded"
                                ? "x-www-form-urlencoded"
                                : modeOption}
                            </Button>
                          )
                        )}
                      </ButtonGroup>
                    </Col>
                  </Row>
                </div>

                {body.mode === "raw" && (
                  <>
                    <div>
                      <Row>
                        <Col sm={2}>
                          <Form.Label className="mx-5 mt-3">
                            Content Type:
                          </Form.Label>
                        </Col>
                        <Col sm={10}>
                          <ButtonGroup className="mx-5 mt-3">
                            {contentTypeOptions.map((option) => (
                              <Button
                                key={option.value}
                                variant="secondary"
                                onClick={() =>
                                  handleChange(
                                    index,
                                    "contentType",
                                    option.value
                                  )
                                }
                                active={body.contentType === option.value}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </ButtonGroup>
                        </Col>
                      </Row>
                    </div>

                    <div>
                      <Row>
                        <Col sm={2}>
                          <Form.Label className="mx-5 mt-3">
                            Raw Content:
                          </Form.Label>
                        </Col>
                        <Col sm={7} className="mx-5 mt-3">
                          <Form.Control
                            style={{
                              maxWidth: "30vw",
                              border: "none",
                              backgroundColor: " #6C757D",
                            }}
                            type="text"
                            value={body.rawContent}
                            onChange={(e) =>
                              handleChange(index, "rawContent", e.target.value)
                            }
                          />
                        </Col>
                      </Row>
                    </div>
                  </>
                )}

                {/* {body.mode === "urlencoded" && (
                  <Form.Group controlId="formData">
                    <Row>
                      <Col sm={2}>
                        <Form.Label className="mt-3 p-1">FormData:</Form.Label>
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
                                        formData.value
                                          ? formData.value.name
                                          : ""
                                      }
                                      onClick={() =>
                                        openFileInputFormData(index)
                                      }
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
                                  <option
                                    value="text"
                                    style={{ color: "black" }}
                                  >
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
                )} */}
              </Col>
            </Row>
          </div>
        ))}
      </Form.Group>
      {bodyDetails.map((body, index) => (
        <div key={index}>
          {body.mode !== "binary" && (
            <>
              <div>
                <Row>
                  <Col sm={3}></Col>
                  <Col sm={9}>
                    <Form.Check
                      style={{ color: "white" }}
                      className="mx-5 mt-3"
                      type="checkbox"
                      label="Required"
                      id="body-required"
                      checked={body.required}
                      onChange={(e) =>
                        handleChange(index, "required", e.target.checked)
                      }
                    />
                  </Col>
                </Row>
              </div>

              <Row className="mt-3">
                <Col sm={3}>
                  <Form.Label className="m-3">Schema Name:</Form.Label>
                </Col>
                <Col sm={9}>
                  <Form.Control
                    style={{
                      maxWidth: "30vw",
                      backgroundColor: " #6C757D",
                      border: "none",
                    }}
                    className="mx-5"
                    type="text"
                    value={body.schemaName}
                    onChange={(e) =>
                      handleChange(index, "schemaName", e.target.value)
                    }
                  />
                </Col>
              </Row>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
