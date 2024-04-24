import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown, Row, Col } from "react-bootstrap";
import Body from "./Body.js";
import Urls from "./Urls.js";
import RequestBodycss from "../../css/RequestBody.css";
import { getAuthFileConfig } from "../../services/IntermediatesService.js";

function RequestBody({ onChange, requestBody }) {
  console.log(requestBody, "request body");
  const [method, setMethod] = useState(requestBody.method);
  const [parameters, setParameters] = useState(requestBody.parameters || []);
  const [url, setUrl] = useState(requestBody.url);
  const [headers, setHeaders] = useState(requestBody.headers || []);
  const [auth, setAuth] = useState(
    {
      type: requestBody.auth?.type || "No Auth",
    content: requestBody.auth?.content || [{ key: "", value: "", type: "" }],
    login_api: requestBody.auth ? requestBody.auth.login_api : "",
    token_api: requestBody.auth ? requestBody.auth.token_api : ""
  }
  );
  const [body, setBody] = useState(requestBody.body, []);
  const [showAuthDropdowns, setShowAuthDropdowns] = useState(false);
  const [apis, setApis] = useState("");
  const [loginApis, setLoginApis] = useState([]);
  const [tokenApis, setTokenApis] = useState([]);

  const handleBodyChange = (updatedBody) => {
    const newBody = { ...body, ...updatedBody };
    setBody(newBody);
    onChange({ ...requestBody, body: newBody });
  };

  const handleUrlChange = (updatedUrl) => {
    const newUrl = { ...url, ...updatedUrl };
    setUrl(newUrl);
    onChange({ ...requestBody, url: newUrl });
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
    setShowAuthDropdowns(true);
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
  const handleAuthApiSelect = (e, key) => {
    let auth_new = { ...auth };
    auth_new[key] = e;
    setAuth({ ...auth_new });
    onChange({
      ...requestBody,
      auth: { ...auth_new },
    });
  };

  useEffect(() => {
    const fetchAuthApis = async () => {
      try {
        const data = await getAuthFileConfig("creator");
        setApis(data.data);
      } catch (error) {
        console.error("Error fetching auth APIs:", error);
      }
    };

    fetchAuthApis();
  }, []);

  useEffect(() => {
    // Filter APIs based on auth_api_type
    const loginApisFiltered = Object.values(apis).filter(
      (api) => api.auth_api_type === "Login"
    );
    const tokenApisFiltered = Object.values(apis).filter(
      (api) => api.auth_api_type === "Refresh"
    );

    setLoginApis(loginApisFiltered);
    setTokenApis(tokenApisFiltered);
  }, [apis]);

  console.log(requestBody, "updated req body");
  return (
    <div>
      <div className="mb-3 text-dark requestbody">
        <Form>
          <Form.Group controlId="formMethod">
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">HTTP Method:</Form.Label>
              </Col>
              <Col sm={9}>
                <Dropdown className="mx-5" onSelect={handleMethodChange}>
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
                <Form.Label className="m-3">Parameters:</Form.Label>
              </Col>
              <Col sm={9}>
                {parameters.map((parameter, index) => (
                  <div key={index}>
                    <Form.Check
                      className="mx-5 m-3"
                      type="checkbox"
                      label="Required"
                      style={{ color: "white" }}
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
                      className="mx-5 mb-1"
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
                      className="mx-5 mb-1"
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
                      className="mx-5 mb-1"
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
                      className="mx-5 mb-1"
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
                    className="mx-5 mt-3"
                  >
                    Add Parameter
                  </Button>
                </div>
              </Col>
            </Row>
          </Form.Group>

          <Urls onChange={handleUrlChange} urls={url} />

          <Form.Group controlId="formHeaders" className="mt-3">
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">Headers:</Form.Label>
              </Col>
              <Col sm={9}>
                {headers.map((header, index) => (
                  <div key={index} className="d-flex mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Key"
                      value={header.key}
                      onChange={(e) =>
                        handleHeaderChange(index, "key", e.target.value)
                      }
                      className="mx-5 me-2"
                    />
                    <Form.Control
                      className="value"
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
                  <Button
                    variant="secondary"
                    className="mx-5"
                    onClick={addHeader}
                  >
                    Add Header
                  </Button>
                </div>
              </Col>
            </Row>
          </Form.Group>

          <Form.Group controlId="formAuth" className="mt-3">
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">Authorization:</Form.Label>
              </Col>
              <Col sm={9}>
                <Dropdown
                  className="mx-5 mb-3"
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
                    <Dropdown.Item eventKey="Bearer" className="dropdownitem">
                      Bearer
                    </Dropdown.Item>

                    <Dropdown.Item eventKey="Oauth" className="dropdownitem">
                      Oauth
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="Oauth2" className="dropdownitem">
                      Oauth2
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <>
                  <Row>
                    <Col sm={3}>
                      <Form.Label className="mx-5 m-2">Login API:</Form.Label>
                    </Col>
                    <Col sm={9}>
                      <Dropdown
                        onSelect={(e) => handleAuthApiSelect(e, "login_api")}
                        className="mx-5 m-2"
                      >
                        <Dropdown.Toggle
                          variant="secondary"
                          id="loginApiDropdown"
                        >
                          {auth.login_api ? auth.login_api : "Login Api"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ textAlign: "center" }}>
                          {loginApis.map((api) => (
                            <Dropdown.Item
                              key={api.id}
                              eventKey={api.id}
                              className="dropdownitem"
                            >
                              {api.operation_id}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={3}>
                      <Form.Label className="mx-5 m-2">Token API:</Form.Label>
                    </Col>
                    <Col sm={9}>
                      <Dropdown
                        onSelect={(e) => handleAuthApiSelect(e, "token_api")}
                        className="mx-5 m-2"
                      >
                        <Dropdown.Toggle
                          variant="secondary"
                          id="tokenApiDropdown"
                        >
                          {auth.token_api ? auth.token_api : "Token Api"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu style={{ textAlign: "center" }}>
                          {tokenApis.map((api) => (
                            <Dropdown.Item
                              key={api.id}
                              eventKey={api.id}
                              className="dropdownitem"
                            >
                              {api.operation_id}
                            </Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Col>
                  </Row>
                </>

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
                      className="mx-5 me-2"
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
                      className="mx-5 me-2"
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
                      className="mx-5 ms-2"
                      onClick={() => removeAuthContent(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}

                <Button
                  variant="secondary"
                  className="mx-5 mt-2"
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
