import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown, Row, Col } from "react-bootstrap";
import Body from "./Body.js";
import Urls from "./Urls.js";
import Auth from "./Auth.js";
import RequestBodycss from "../../css/RequestBody.css";
import { getAuthFileConfig } from "../../services/IntermediatesService.js";

function RequestBody({ onChange, requestBody }) {
  // console.log(requestBody, "request body");
  const [method, setMethod] = useState(requestBody.method || "GET");
  const [parameters, setParameters] = useState(requestBody.parameters || []);
  const [url, setUrl] = useState(requestBody.url);
  const [headers, setHeaders] = useState(requestBody.headers || []);
  const [auth, setAuth] = useState(requestBody.auth, []);
  const [body, setBody] = useState(requestBody.body, []);

  const handleAuthChange = (updatedAuth) => {
    console.log("auth in request", auth, updatedAuth);
    setAuth([...updatedAuth]);
    onChange({ ...requestBody, auth: [...updatedAuth] });
  };
  const handleBodyChange = (updatedBody) => {
    setBody([...updatedBody]);
    onChange({ ...requestBody, body: [...updatedBody] });
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

  // console.log(requestBody, "updated req body");
  // console.log(auth, "auth in req body");
  // console.log(body, "body in request body ");
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
                <Dropdown className="mt-3 mx-5" onSelect={handleMethodChange}>
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

      

          <Auth onChange={handleAuthChange} auth={auth} />
          <Body onChange={handleBodyChange} body={body} />
        </Form>
      </div>
    </div>
  );
}

export default RequestBody;
