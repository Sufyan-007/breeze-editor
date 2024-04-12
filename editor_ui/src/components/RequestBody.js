import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown, Row, Col } from "react-bootstrap";
import Body from "./Body.js";
import RequestBodycss from "../css/RequestBody.css";

function RequestBody({ onChange, requestBody }) {
  const [method, setMethod] = useState(requestBody.method);
  const [parameters, setParameters] = useState(requestBody.parameters || []);
  const [url, setUrl] = useState({
    baseurl: requestBody.url?.baseurl || "",
    host: requestBody.url?.host || "",
    protocol: requestBody.url?.protocol || "",
    port: requestBody.url?.port || 443,
    path: requestBody.url?.path || [],
  });
  const [headers, setHeaders] = useState(requestBody.headers || []);
  const [auth, setAuth] = useState({
    type: requestBody.auth?.type || "No Auth",
    content: requestBody.auth?.content || [{ key: "", value: "", type: "" }],
  });
  const [body, setBody] = useState(requestBody.body);
const [showAuthDropdowns, setShowAuthDropdowns] = useState(false);

  const handleBodyChange = (updatedBody) => {
    const newBody = { ...body, ...updatedBody };
    setBody(newBody);
    onChange({ ...requestBody, body: newBody });
  };

  const handleMethodChange = (selectedMethod) => {
    setMethod(selectedMethod);
    onChange({ ...requestBody, method: selectedMethod });
  };

  const handleAddParameter = () => {
    const newParameter = {
      param_in: "",
      name: "",
      type: "",
      required: false,
      description: "",
    };
    const updatedParameters = [...parameters, newParameter];
    setParameters(updatedParameters);
    onChange({ ...requestBody, parameters: updatedParameters });
  };

  const handleParameterChange = (index, name, value) => {
    // Update the value of a specific parameter in the parameters state
    const updatedParameters = [...parameters];
    updatedParameters[index][name] = value;
    setParameters(updatedParameters);
    onChange({ ...requestBody, parameters: updatedParameters });
  };

  const handleUrlChange = (name, value) => {
    // Update the specified property of the URL in the state
    setUrl({
      ...url,
      [name]: value,
    });
    onChange({ ...requestBody, url: { ...url, [name]: value } }); //pass the updated state of the url
  };

  const handleHeaderChange = (index, name, value) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index][name] = value;
    setHeaders(updatedHeaders);
    onChange({ ...requestBody, headers: updatedHeaders });
  };

  const addHeader = () => {
    const updatedHeaders = [...headers];
    updatedHeaders.push({ key: "", value: "" });
    setHeaders(updatedHeaders);
    onChange({ ...requestBody, headers: updatedHeaders });
  };

  // Handle change for AuthTypeEnum dropdown
  const handleAuthChange = (property, value) => {
    setAuth({
      ...auth,
      [property]: value,
    });
    onChange({ ...requestBody, auth: { ...auth, [property]: value } });
  };

  const handleAuthDropdownSelect = (value) => {
    handleAuthChange("api", value); // Update auth API
  };

  // Handle change for individual AuthContent in the list
  const handleAuthContentChange = (index, property, value) => {
    const updatedAuthContent = [...auth.content];
    updatedAuthContent[index][property] = value;

    setAuth({
      ...auth,
      content: updatedAuthContent,
    });
    onChange({ ...requestBody, auth: updatedAuthContent });
  };

  // Remove AuthContent from the list
  const removeAuthContent = (index) => {
    const updatedAuthContent = auth.content.filter((_, i) => i !== index);

    setAuth({
      ...auth,
      content: updatedAuthContent,
    });
    onChange({ ...requestBody, auth: updatedAuthContent });
  };

  // Add a new AuthContent to the list
  const addAuthContent = () => {
    setAuth({
      ...auth,
      content: [...auth.content, { key: "", value: "", type: "" }],
    });
    // Notify the parent component about the change in the auth state
    onChange({
      ...requestBody,
      auth: {
        ...auth,
        content: [...auth.content, { key: "", value: "", type: "" }],
      },
    });
  };
  return (
    <div>
      <div className="mb-3 text-dark requestbody">
        <Form>
          <Form.Group controlId="formMethod">
            <Row>
              <Col sm={3}>
                <Form.Label style={{ fontWeight: "bold" }}>
                  HTTP Method:
                </Form.Label>
              </Col>
              <Col sm={9}>
                <Dropdown onSelect={handleMethodChange}>
                  <Dropdown.Toggle variant="secondary" id="dropdown-method">
                    {method}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ textAlign: "center" }}>
                    <Dropdown.Item eventKey="GET" className="dropdownitem">
                      GET
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="POST" className="dropdownitem">
                      POST
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="PUT" className="dropdownitem">
                      PUT
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="DELETE" className="dropdownitem">
                      DELETE
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="formParameters">
            <Row>
              <Col sm={3}>
                <Form.Label style={{ fontWeight: "bold" }} className="mt-3">
                  Parameters:
                </Form.Label>
              </Col>
              <Col sm={9}>
                {parameters.map((parameter, index) => (
                  <div key={index}>
                    <Form.Check
                      className="m-3"
                      type="checkbox"
                      label="Required"
                      checked={parameter.required}
                      onChange={(e) =>
                        handleParameterChange(
                          index,
                          "required",
                          e.target.checked
                        )
                      }
                    />
                    <Form.Control
                      className="mb-1"
                      style={{
                        maxWidth: "50vw",
                        backgroundColor: "#6C757D",
                        border: "none",
                      }}
                      as="select"
                      placeholder="Parameter In"
                      value={parameter.param_in}
                      onChange={(e) =>
                        handleParameterChange(index, "param_in", e.target.value)
                      }
                    >
                      <option value="" disabled>
                        Select Param in:{" "}
                      </option>
                      <option value="query">Query</option>
                      <option value="path">Path</option>
                    </Form.Control>

                    <Form.Control
                      className="mb-1"
                      style={{
                        maxWidth: "50vw",
                        backgroundColor: "#6C757D",
                        border: "none",
                      }}
                      type="text"
                      placeholder="Name"
                      value={parameter.name}
                      onChange={(e) =>
                        handleParameterChange(index, "name", e.target.value)
                      }
                    />
                    <Form.Control
                      className="mb-1"
                      style={{
                        maxWidth: "50vw",
                        backgroundColor: "#6C757D",
                        border: "none",
                      }}
                      type="text"
                      placeholder="Type"
                      value={parameter.type}
                      onChange={(e) =>
                        handleParameterChange(index, "type", e.target.value)
                      }
                    />
                    <Form.Control
                      className="mb-1"
                      style={{
                        maxWidth: "50vw",
                        backgroundColor: "#6C757D",
                        border: "none",
                      }}
                      type="text"
                      placeholder="Description"
                      value={parameter.description}
                      onChange={(e) =>
                        handleParameterChange(
                          index,
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                ))}
                <div>
                  <Button
                    variant="secondary"
                    type="button"
                    onClick={handleAddParameter}
                    className="mt-3"
                  >
                    Add Parameter
                  </Button>
                </div>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="formUrls" className="mt-3">
            <Row>
              <Col sm={3}>
                <Form.Label style={{ fontWeight: "bold" }}>URL:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="mb-1"
                  style={{
                    maxWidth: "50vw",
                    backgroundColor: "#6C757D",
                    border: "none",
                  }}
                  type="text"
                  placeholder="www.example.com"
                  value={url.baseurl}
                  onChange={(e) => handleUrlChange("baseurl", e.target.value)}
                />
                <Form.Control
                  className="mb-1"
                  style={{
                    maxWidth: "50vw",
                    backgroundColor: "#6C757D",
                    border: "none",
                  }}
                  type="text"
                  placeholder="example.com"
                  value={url.host}
                  onChange={(e) => handleUrlChange("host", e.target.value)}
                />
                <Form.Control
                  className="mb-1"
                  style={{
                    maxWidth: "50vw",
                    backgroundColor: "#6C757D",
                    border: "none",
                  }}
                  type="text"
                  placeholder="https"
                  value={url.protocol}
                  onChange={(e) => handleUrlChange("protocol", e.target.value)}
                />
                <Form.Control
                  className="mb-1"
                  style={{
                    maxWidth: "50vw",
                    backgroundColor: "#6C757D",
                    border: "none",
                  }}
                  type="number"
                  placeholder="Port"
                  value={url.port}
                  onChange={(e) =>
                    handleUrlChange("port", parseInt(e.target.value, 10))
                  }
                />
                <Form.Control
                  className="mb-1"
                  style={{
                    maxWidth: "50vw",
                    backgroundColor: "#6C757D",
                    border: "none",
                  }}
                  type="text"
                  placeholder="path1 , path2 "
                  value={url.path || [].join(", ")}
                  onChange={(e) =>
                    handleUrlChange(
                      "path",
                      e.target.value.split(",").map((p) => p.trim())
                    )
                  }
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="formHeaders" className="mt-3">
            <Row>
              <Col sm={3}>
                <Form.Label style={{ fontWeight: "bold" }} className="mt-3">
                  Headers:
                </Form.Label>
              </Col>
              <Col sm={9}>
                {headers.map((header, index) => (
                  <div key={index} className="d-flex mb-2">
                    <Form.Control
                      style={{
                        maxWidth: "24.5vw",
                        backgroundColor: "#6C757D",
                        border: "none",
                      }}
                      type="text"
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) =>
                        handleHeaderChange(index, "key", e.target.value)
                      }
                      className="me-2"
                    />
                    <Form.Control
                      style={{
                        maxWidth: "24.5vw",
                        backgroundColor: "#6C757D",
                        border: "none",
                      }}
                      type="text"
                      placeholder="Value"
                      value={header.value}
                      onChange={(e) =>
                        handleHeaderChange(index, "value", e.target.value)
                      }
                    />
                  </div>
                ))}
                <div>
                  <Button variant="secondary" onClick={addHeader}>
                    Add Header
                  </Button>
                </div>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="formAuth" className="mt-3">
            <Row>
              <Col sm={3}>
                <Form.Label style={{ fontWeight: "bold" }}>
                  Authorization:
                </Form.Label>
              </Col>
              <Col sm={9}>
                <Dropdown
                  className="mb-3"
                  onSelect={(value) => handleAuthChange("type", value)}
                >
                  <Dropdown.Toggle variant="secondary" id="authTypeDropdown">
                    {auth.type}
                  </Dropdown.Toggle>

                  <Dropdown.Menu style={{ textAlign: "center" }}>
                    <Dropdown.Item eventKey="No Auth" className="dropdownitem">
                      No Auth
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Basic" className="dropdownitem">
                      Basic
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Oauth" className="dropdownitem">
                      Oauth
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Oauth2" className="dropdownitem">
                      Oauth2
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

 {showAuthDropdowns && (
  <>
          <Form.Label style={{ fontWeight: "bold" }} className="mt-3">
            {auth.type === "Basic" ? "Login API:" : "Token API:"}
          </Form.Label>
          <Dropdown onSelect={handleAuthDropdownSelect}>
            <Dropdown.Toggle variant="secondary" id="apiDropdown">
              Select API
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ textAlign: "center" }}>
              <Dropdown.Item eventKey="Login API" className="dropdownitem">Login API</Dropdown.Item>
              <Dropdown.Item eventKey="Token API" className="dropdownitem">Token API</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </>
      )}
    

                {/* List of AuthContent inputs */}
                {auth.content.map((authContent, index) => (
                  <div key={index} className="d-flex mb-2">
                    <Form.Control
                      style={{
                        maxWidth: "13vw",
                        backgroundColor: "#6C757D",
                        border: "none",
                      }}
                      type="text"
                      placeholder="Key"
                      value={authContent.key}
                      onChange={(e) =>
                        handleAuthContentChange(index, "key", e.target.value)
                      }
                      className="me-2"
                    />
                    <Form.Control
                      style={{
                        maxWidth: "13vw",
                        backgroundColor: "#6C757D",
                        border: "none",
                      }}
                      type="text"
                      placeholder="Value"
                      value={authContent.value}
                      onChange={(e) =>
                        handleAuthContentChange(index, "value", e.target.value)
                      }
                      className="me-2"
                    />
                    <Form.Control
                      style={{
                        maxWidth: "13vw",
                        backgroundColor: "#6C757D",
                        border: "none",
                      }}
                      type="text"
                      placeholder="Type"
                      value={authContent.type}
                      onChange={(e) =>
                        handleAuthContentChange(index, "type", e.target.value)
                      }
                    />
                    <Button
                      variant="secondary"
                      className="ms-2"
                      onClick={() => removeAuthContent(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  className="mt-2"
                  onClick={addAuthContent}
                >
                  Add AuthContent
                </Button>
              </Col>
            </Row>
          </Form.Group>

          <Body onChange={handleBodyChange} body={body} />
        </Form>
      </div>
    </div>
  );
}

export default RequestBody;
