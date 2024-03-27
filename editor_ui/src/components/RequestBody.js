import React, { useState , useEffect} from "react";
import { Form, Button, Dropdown} from "react-bootstrap";
import Body from "./Body.js";

function RequestBody({ onChange, requestBody}) {
  const [method, setMethod] = useState(requestBody.method || "GET");
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
  const [body, setBody]=useState({})

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
    onChange({ ...requestBody,  auth: { ...auth, [property]: value } });
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
    onChange({...requestBody, auth: updatedAuthContent });
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
      <div
        className="mb-3 text-dark"
        style={{ backgroundColor: "#e0e0e0", padding: "20px" }}
      >
        <Form>
          <Form.Group controlId="formMethod">
            <Form.Label style={{ fontWeight: "bold" }}>HTTP Method:</Form.Label>
            <Dropdown onSelect={handleMethodChange}>
              <Dropdown.Toggle variant="secondary" id="dropdown-method">
                {method}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="GET">GET</Dropdown.Item>
                <Dropdown.Item eventKey="POST">POST</Dropdown.Item>
                <Dropdown.Item eventKey="PUT">PUT</Dropdown.Item>
                <Dropdown.Item eventKey="DELETE">DELETE</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form.Group>
          <Form.Group controlId="formParameters">
            <Form.Label style={{ fontWeight: "bold" }} className="mt-3">
              Parameters:
            </Form.Label>
            {parameters.map((parameter, index) => (
              <div key={index}>
                <Form.Check
                  type="checkbox"
                  label="Required"
                  checked={parameter.required}
                  onChange={(e) =>
                    handleParameterChange(index, "required", e.target.checked)
                  }
                />
                <Form.Control
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
                  type="text"
                  placeholder="Name"
                  value={parameter.name}
                  onChange={(e) =>
                    handleParameterChange(index, "name", e.target.value)
                  }
                />
                <Form.Control
                  type="text"
                  placeholder="Type"
                  value={parameter.type}
                  onChange={(e) =>
                    handleParameterChange(index, "type", e.target.value)
                  }
                />
                <Form.Control
                  type="text"
                  placeholder="Description"
                  value={parameter.description}
                  onChange={(e) =>
                    handleParameterChange(index, "description", e.target.value)
                  }
                />
              </div>
            ))}
            <div className="mb-3">
              <Button
                variant="secondary"
                type="button"
                onClick={handleAddParameter}
              >
                Add Parameter
              </Button>
            </div>
          </Form.Group>

          <Form.Group controlId="formUrls">
            <Form.Label style={{ fontWeight: "bold" }}>URL:</Form.Label>
            <Form.Control
              type="text"
              placeholder="www.example.com"
              value={url.baseurl}
              onChange={(e) => handleUrlChange("baseurl", e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="example.com"
              value={url.host}
              onChange={(e) => handleUrlChange("host", e.target.value)}
            />
            <Form.Control
              type="text"
              placeholder="https"
              value={url.protocol}
              onChange={(e) => handleUrlChange("protocol", e.target.value)}
            />
            <Form.Control
              type="number"
              placeholder="Port"
              value={url.port}
              onChange={(e) =>
                handleUrlChange("port", parseInt(e.target.value, 10))
              }
            />
            <Form.Control
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
          </Form.Group>

          <Form.Group controlId="formHeaders">
            <Form.Label style={{ fontWeight: "bold" }} className="mt-3">
              Headers:
            </Form.Label>
            {headers.map((header, index) => (
              <div key={index} className="d-flex mb-2">
                <Form.Control
                  type="text"
                  placeholder="Key"
                  value={header.key}
                  onChange={(e) =>
                    handleHeaderChange(index, "key", e.target.value)
                  }
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Value"
                  value={header.value}
                  onChange={(e) =>
                    handleHeaderChange(index, "value", e.target.value)
                  }
                />
              </div>
            ))}
            <div className="m-3">
              <Button variant="secondary" onClick={addHeader}>
                Add Header
              </Button>
            </div>
          </Form.Group>

          <Form.Group controlId="formAuth">
            <Form.Label style={{ fontWeight: "bold" }}>
              Authorization:
            </Form.Label>

            <Dropdown
              onSelect={(value) => handleAuthChange("type", value)}
              className="m-3"
            >
              <Dropdown.Toggle variant="secondary" id="authTypeDropdown">
                {auth.type}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item eventKey="No Auth">No Auth</Dropdown.Item>
                <Dropdown.Item eventKey="Basic">Basic</Dropdown.Item>
                <Dropdown.Item eventKey="Oauth">Oauth</Dropdown.Item>
                <Dropdown.Item eventKey="Oauth2">Oauth2</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* List of AuthContent inputs */}
            {auth.content.map((authContent, index) => (
              <div key={index} className="d-flex mb-2">
                <Form.Control
                  type="text"
                  placeholder="Key"
                  value={authContent.key}
                  onChange={(e) =>
                    handleAuthContentChange(index, "key", e.target.value)
                  }
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  placeholder="Value"
                  value={authContent.value}
                  onChange={(e) =>
                    handleAuthContentChange(index, "value", e.target.value)
                  }
                  className="me-2"
                />
                <Form.Control
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
              className="m-3"
              onClick={addAuthContent}
            >
              Add AuthContent
            </Button>
          </Form.Group>

          <Body onChange = {handleBodyChange}
          body={requestBody.body}/>
        </Form>
      </div>
    </div>
  );
}

export default RequestBody;
