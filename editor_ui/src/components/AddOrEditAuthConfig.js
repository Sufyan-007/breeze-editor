import React, { useState, useEffect } from "react";
import { Form, Button, Col, Row, ButtonGroup } from "react-bootstrap";
import CustomPanel from "./CustomPanel";
import close from "../assets/icons/close.svg";
import "../css/AddOrEditAuthConfig.css"
function AddOrEditAuthConfig({
  availableApis,
  onClose,
  authApis,
  selectedUuid,
  mode,
}) {
  const [selectedApi, setSelectedApi] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedAuthentication, setSelectedAuthentication] = useState("");
  const [selectedFlow, setSelectedFlow] = useState("");
  const [authorizationUrl, setAuthorizationUrl] = useState("");
  const [tokenUrl, setTokenUrl] = useState("");
  const [refreshUrl, setRefreshUrl] = useState("");
  const [selectedTokenStorageMethod, setSelectedTokenStorageMethod] =
    useState("");
  const [localStorageKey, setLocalStorageKey] = useState("");
  const [sessionStorageKey, setSessionStorageKey] = useState("");
  const [cookieStorageKey, setCookieStorageKey] = useState("");

  const available = [
    {
      operation_id: "login",
      tags: ["DummyTag"],
      request: {
        method: "post",
        auth: null,
        headers: [{ key: "Content-Type", value: "text/plain" }],
        parameters: [],
        url: {
          baseurl: "http://localhost:3000/auth/login",
          host: ["localhost"],
          protocol: "http",
          port: "3000",
          path: ["auth", "login"],
        },
        body: {
          mode: "raw",
          content_type: null,
          required: null,
          schema_name: null,
          raw_content:
            '{\n    "useremail" : "newuser@test.com",\n    "password" :  "newuser"\n}',
          file: null,
          schema: {},
          formdata: [],
        },
      },
      response: [],
      summary: "",
      isAuthenticationApi: true,
      isLogin: true,
      isToken: false,
      uuid: "a36f9d86-7ef8-4d79-ba0d-122f1bf3be28",
    },
    {
      operation_id: "signup",
      tags: ["DummyTag"],
      request: {
        method: "post",
        auth: null,
        headers: [],
        parameters: [],
        url: {
          baseurl: "http://localhost:3000/auth/signup",
          host: ["localhost"],
          protocol: "http",
          port: "3000",
          path: ["auth", "signup"],
        },
        body: {
          mode: "raw",
          content_type: null,
          required: null,
          schema_name: null,
          raw_content:
            '{\n    "username": "new user",\n    "useremail": "newuser@test.com",\n    "password": "newuser",\n    "state" : "uk",\n    "role": "admin",\n    "createdby": "admin",\n    "updatedby":"admin"\n}',
          file: null,
          schema: {},
          formdata: [],
        },
      },
      response: [],
      summary: "",
      isAuthenticationApi: false,
      isLogin: false,
      isToken: false,
      uuid: "d8e6169b-d21d-4fd0-a73a-d5e469a8bfc1",
    },
    {
      operation_id: "adding a form",
      tags: ["DummyTag"],
      request: {
        method: "post",
        auth: {
          type: "Bearer",
          content: [
            {
              key: "token",
              value:
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ld3VzZXIyQHRlc3QuY29tIiwidXNlcl9pZCI6IjUiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NDA2MTM5NywiZXhwIjoxNjk0MDY4NTk3fQ.VKK0poB3uIeF6RZ8VGmwSuzt4I6UklvpTgA-uS7PBI8",
              type: "string",
            },
          ],
          login_api: null,
          token_api: null,
        },
        headers: [],
        parameters: [],
        url: {
          baseurl: "http://localhost:3000/admin/add-form",
          host: ["localhost"],
          protocol: "http",
          port: "3000",
          path: ["admin", "add-form"],
        },
        body: {
          mode: "raw",
          content_type: null,
          required: null,
          schema_name: null,
          raw_content:
            '{\n    "title": "form 1",\n    "description": "form for example",\n    "status": "active",\n    "state": "uk",\n     "createdby": "admin",\n     "updatedby": "admin",\n     "version" : 0\n}',
          file: null,
          schema: {},
          formdata: [],
        },
      },
      response: [],
      summary: "",
      isAuthenticationApi: false,
      isLogin: false,
      isToken: false,
      uuid: "0de2c2ae-5287-45e9-a45b-b844d37965f7",
    },
  ];
  const isEditMode = mode === "Edit" ? true : false;
  const selectedAuthApi = Object.values(authApis).find(
    (api) => api.uuid === selectedUuid
  );
  console.log(selectedAuthApi, "selectedAuthapi");
  const handleSave = () => {
    const resultantApi = {
      auth: selectedApi.auth,
      url: selectedApi.url,
      body: selectedApi.body,
      request: selectedApi.request,
      response: selectedApi.response,
      operation_id: selectedApi.operation_id,
      tags: selectedApi.tags,
      summary: selectedApi.summary,
      auth_api_type: selectedType,
      authentication_type: selectedAuthentication.toUpperCase(),
      is_authorization_url: selectedAuthentication === "oauth2" ? true : false,
      flow: {},
    };
  };

  return (
    <div style={{ overflow: "auto", maxHeight: "80vh" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <h2 style={{ color: "white" }}>
          {isEditMode
            ? "Edit Authentication Configuration"
            : "Add Authentication Configuration"}
        </h2>
        <Button variant="secondary" onClick={onClose} size="sm">
          <img src={close} alt="" height={24} className="mx-2" />
        </Button>
      </div>
      {authApis && !isEditMode ? (
        // {it should be available api instead of authapi }
        <div>
          <Form>
            <Form.Group controlId="formApiSelect" className="mt-3">
              <Row>
                <Col sm={3}>
                  <Form.Label style={{ color: "white" }} as="legend">
                    Select an API:
                  </Form.Label>
                </Col>
                <Col sm={9}>
                  <Form.Control
                    className="mx-5"
                    style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                    as="select"
                    value={selectedApi}
                    onChange={(e) => setSelectedApi(e.target.value)}>
                    <option value="">-- Select an API --</option>
                    {Object.values(authApis).map((api) => (
                      <option key={api.operation_id} value={api.operation_id}>
                        {api.operation_id}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
            </Form.Group>
            {selectedApi && (
              <div>
                <Form.Group controlId="formTypeSelect" className="mt-5">
                  <Row>
                    <Col sm={3}>
                      {" "}
                      <Form.Label as="legend" style={{ color: "white" }}>
                        Select Type:
                      </Form.Label>
                    </Col>
                    <Col sm={9}>
                      <ButtonGroup className="mx-5">
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedType("LOGIN")}
                          active={selectedType === "LOGIN"}>
                          Access Token API
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedType("REFRESH")}
                          active={selectedType === "REFRESH"}>
                          Refresh Token API
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedType("LOGOUT")}
                          active={selectedType === "LOGOUT"}>
                          Logout API
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group
                  controlId="formAuthenticationSelect"
                  className="mt-5">
                  <Row>
                    <Col sm={3}>
                      <Form.Label as="legend" style={{ color: "white" }}>
                        Select Authentication Scheme:
                      </Form.Label>
                    </Col>
                    <Col sm={9}>
                      <ButtonGroup className="mx-5">
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedAuthentication("basic")}
                          active={selectedAuthentication === "basic"}>
                          Basic Authentication
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedAuthentication("api_keys")}
                          active={selectedAuthentication === "api_keys"}>
                          API Keys
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            setSelectedAuthentication("bearer-auth")
                          }
                          active={selectedAuthentication === "bearer-auth"}>
                          Bearer Authentication
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setSelectedAuthentication("oauth2")}
                          active={selectedAuthentication === "oauth2"}>
                          OAuth 2.0
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() =>
                            setSelectedAuthentication("cookie-auth")
                          }
                          active={selectedAuthentication === "cookie-auth"}>
                          Cookie Authentication
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </Form.Group>

                {selectedAuthentication === "oauth2" && (
                  <Form.Group
                    controlId="formAuthenticationSelect"
                    className="mt-5">
                        <Row>
                            <Col sm={3}><Form.Label as="legend" style={{ color: "white" }}>
                      Select Flows or Grant Types:
                    </Form.Label></Col>
                    <Col sm={9}><ButtonGroup className="mx-5">
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedFlow("authorizationCode")}
                        active={selectedFlow === "authorizationCode"}>
                        Authorization code
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedFlow("implicit")}
                        active={selectedFlow === "implicit"}>
                        Implicit
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedFlow("password")}
                        active={selectedFlow === "password"}>
                        Password
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => setSelectedFlow("clientCredentials")}
                        active={selectedFlow === "clientCredentials"}>
                        Client Credentials
                      </Button>
                    </ButtonGroup></Col>
                    
                    </Row>
                  </Form.Group>
                )}
                {selectedFlow === "authorizationCode" &&
                  selectedAuthentication === "oauth2" && (
                    <Form.Group controlId="authorizationUrls" className="mt-5">
                        <Row>
                        <Col sm={3}><Form.Label as="legend" style={{ color: "white" }}>
                        Authorization URLs:
                      </Form.Label></Col>
                        <Col sm={9}><Form.Control
                        style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                        type="text"
                        placeholder="Authorization URL"
                        value={authorizationUrl}
                        onChange={(e) => setAuthorizationUrl(e.target.value)}
                        className={`mx-5 mb-2 ${
                          authorizationUrl.trim() === ""
                            ? "border border-danger border-2 border-solid"
                            : ""
                        }`}
                      />
                      <Form.Control
                      style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                        type="text"
                        placeholder="Token URL"
                        value={tokenUrl}
                        onChange={(e) => setTokenUrl(e.target.value)}
                        className={`mx-5 mb-2 ${
                          tokenUrl.trim() === ""
                            ? "border border-danger border-2 border-solid"
                            : ""
                        }`}
                      />
                      <Form.Control
                      style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                        type="text"
                        placeholder="Refresh URL (Optional)"
                        value={refreshUrl}
                        onChange={(e) => setRefreshUrl(e.target.value)}
                        className="mx-5 mb-2"
                      /></Col>
                        </Row>
                        
                      
                      
                    </Form.Group>
                  )}
                {selectedFlow === "implicit" &&
                  selectedAuthentication === "oauth2" && (
                    <Form.Group controlId="authorizationUrls" className="mt-5">
                        <Row>
                       <Col sm={3}>
                       <Form.Label as="legend" style={{ color: "white" }}>
                        Authorization URLs:
                      </Form.Label>
                       </Col>
                       <Col sm={9}><Form.Control
                       style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                        type="text"
                        placeholder="Authorization URL"
                        value={authorizationUrl}
                        onChange={(e) => setAuthorizationUrl(e.target.value)}
                        className={`mx-5 mb-2 ${
                          authorizationUrl.trim() === ""
                            ? "border border-danger border-2 border-solid"
                            : ""
                        }`}
                      />
                      <Form.Control
                      style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                        type="text"
                        placeholder="Refresh URL (Optional)"
                        value={refreshUrl}
                        onChange={(e) => setRefreshUrl(e.target.value)}
                        className="mx-5 mb-2"
                      /></Col>
                      
                        </Row>
                      
                    </Form.Group>
                  )}
                {selectedFlow === "password" &&
                  selectedAuthentication === "oauth2" && (
                    <Form.Group controlId="authorizationUrls" className="mt-5">
                        <Row>
                        <Col sm={3}>
                        <Form.Label as="legend" style={{ color: "white" }}>
                        Authorization URLs:
                      </Form.Label>
                        </Col>
                      <Col sm={9}>
                      <Form.Control
                      style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                        type="text"
                        placeholder="Authorization URL"
                        value={authorizationUrl}
                        onChange={(e) => setAuthorizationUrl(e.target.value)}
                        className={`mx-5 mb-2 ${
                          authorizationUrl.trim() === ""
                            ? "border border-danger border-2 border-solid"
                            : ""
                        }`}
                      />
                      <Form.Control
                      style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                        type="text"
                        placeholder="Refresh URL (Optional)"
                        value={refreshUrl}
                        onChange={(e) => setRefreshUrl(e.target.value)}
                        className="mx-5 mb-2"
                      />
                      </Col>
                        </Row>
                      
                    </Form.Group>
                  )}
                {selectedFlow === "clientCredentials" &&
                  selectedAuthentication === "oauth2" && (
                    <Form.Group controlId="authorizationUrls" className="mt-5">
                        <Row>
                        <Col sm={3}>
                        <Form.Label as="legend" style={{ color: "white" }}>
                        Authorization URLs:
                      </Form.Label>
                        </Col>
                      <Col sm={9}>
                      <Form.Control
                      style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                        type="text"
                        placeholder="Authorization URL"
                        value={authorizationUrl}
                        onChange={(e) => setAuthorizationUrl(e.target.value)}
                        className={`mx-5 mb-2 ${
                          authorizationUrl.trim() === ""
                            ? "border border-danger border-2 border-solid"
                            : ""
                        }`}
                      />
                      <Form.Control
                      style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                        type="text"
                        placeholder="Refresh URL (Optional)"
                        value={refreshUrl}
                        onChange={(e) => setRefreshUrl(e.target.value)}
                        className="mx-5 mb-2"
                      />
                      </Col>
                        </Row>
                      
                    </Form.Group>
                  )}

                <Form.Group controlId="tokenStoreSelect" className="mt-5">
                    <Row>
                    <Col sm={3}>
                    <Form.Label as="legend" style={{ color: "white" }}>
                    Select Token Storage Scheme:
                  </Form.Label>
                    </Col>
                  <Col sm={9}>
                  <ButtonGroup className="mx-5">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setSelectedTokenStorageMethod("localStorage")
                      }
                      active={selectedTokenStorageMethod === "localStorage"}>
                      Local Storage
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setSelectedTokenStorageMethod("sessionStorage")
                      }
                      active={selectedTokenStorageMethod === "sessionStorage"}>
                      Session Storage
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setSelectedTokenStorageMethod("cookie")}
                      active={selectedTokenStorageMethod === "cookie"}>
                      Cookie
                    </Button>
                  </ButtonGroup>
                  </Col>
                    </Row>
                  
                </Form.Group>

                {selectedTokenStorageMethod === "localStorage" && (
                  <Form.Group controlId="localStorageScheme" className="mt-5">
                    <Row>
                    <Col sm={3}>
                    <Form.Label as="legend" style={{ color: "white" }}>
                      Select Key:
                    </Form.Label>
                    </Col>
                    <Col sm={9}>
                    <Form.Control
                    style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                      type="text"
                      placeholder="Local Storage Key"
                      value={localStorageKey}
                      onChange={(e) => setLocalStorageKey(e.target.value)}
                      className={`mx-5 ${
                        localStorageKey.trim() === ""
                          ? "border border-danger border-2 border-solid"
                          : ""
                      }`}
                    />
                    </Col>
                    </Row>
                    
                  </Form.Group>
                )}
                {selectedTokenStorageMethod === "cookie" && (
                  <Form.Group controlId="cookieStorageScheme" className="mt-5">
                    <Row>
                        <Col sm={3}><Form.Label as="legend" style={{ color: "white" }}>
                      Select Cookie Name:
                    </Form.Label></Col>
                        <Col sm={9}> <Form.Control
                        style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                      type="text"
                      placeholder="Cookie Name"
                      value={cookieStorageKey}
                      onChange={(e) => setCookieStorageKey(e.target.value)}
                      className={`mx-5 ${
                        cookieStorageKey.trim() === ""
                          ? "border border-danger border-2 border-solid"
                          : ""
                      }`}
                    /></Col>
                   
                    </Row>
                  </Form.Group>
                    
                    
                )}
                {selectedTokenStorageMethod === "sessionStorage" && (
                  <Form.Group controlId="sessionStorageScheme" className="mt-5">
                    <Row>
                    <Col sm={3}><Form.Label as="legend" style={{ color: "white" }}>
                      Select Session Key:
                    </Form.Label></Col>
                        <Col sm={9}> <Form.Control
                        style={{backgroundColor:"#6c757d", color:"white", border:"none"}}
                      type="text"
                      placeholder="Session Storage Key"
                      value={sessionStorageKey}
                      onChange={(e) => setSessionStorageKey(e.target.value)}
                      className={`mx-5 ${
                        sessionStorageKey.trim() === ""
                          ? "border border-danger border-2 border-solid"
                          : ""
                      }`}
                    /></Col>
                   
                    </Row>
                   
                  </Form.Group>
                )}
              </div>
            )}
            <Button
              className="mt-5"
              variant="secondary"
              style={{ width: "10%" }}
              onClick={handleSave}>
              Save
            </Button>
          </Form>
        </div>
      ) : isEditMode ? (
        <div style={{ overflow: "auto", maxHeight: "80vh" }}>
          <CustomPanel
            dummyData={selectedAuthApi}
            tagsList={["tag1", "tag2", "tag3"]}
          />
        </div>
      ) : (
        <p>
          No authentication APIs available. Please create APIs in the backend.
        </p>
      )}
    </div>
  );
}

export default AddOrEditAuthConfig;
