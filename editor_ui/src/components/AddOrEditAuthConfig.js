import React, { useState, useEffect } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import CustomPanel from "./CustomPanel";
import close from "../assets/icons/close.svg"
function AddOrEditAuthConfig({ availableApis, onClose, authApis, selectedUuid, mode}) {
  const [selectedApi, setSelectedApi] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const available = [
    {
        "operation_id": "login",
        "tags": ["DummyTag"],
        "request": {
          "method": "post",
          "auth": null,
          "headers": [{ "key": "Content-Type", "value": "text/plain" }],
          "parameters": [],
          "url": {
            "baseurl": "http://localhost:3000/auth/login",
            "host": ["localhost"],
            "protocol": "http",
            "port": "3000",
            "path": ["auth", "login"]
          },
          "body": {
            "mode": "raw",
            "content_type": null,
            "required": null,
            "schema_name": null,
            "raw_content": "{\n    \"useremail\" : \"newuser@test.com\",\n    \"password\" :  \"newuser\"\n}",
            "file": null,
            "schema": {},
            "formdata": []
          }
        },
        "response": [],
        "summary": "",
        "isAuthenticationApi": true,
        "isLogin": true,
        "isToken": false,
        "uuid": "a36f9d86-7ef8-4d79-ba0d-122f1bf3be28"
      },
      {
        "operation_id": "signup",
        "tags": ["DummyTag"],
        "request": {
          "method": "post",
          "auth": null,
          "headers": [],
          "parameters": [],
          "url": {
            "baseurl": "http://localhost:3000/auth/signup",
            "host": ["localhost"],
            "protocol": "http",
            "port": "3000",
            "path": ["auth", "signup"]
          },
          "body": {
            "mode": "raw",
            "content_type": null,
            "required": null,
            "schema_name": null,
            "raw_content": "{\n    \"username\": \"new user\",\n    \"useremail\": \"newuser@test.com\",\n    \"password\": \"newuser\",\n    \"state\" : \"uk\",\n    \"role\": \"admin\",\n    \"createdby\": \"admin\",\n    \"updatedby\":\"admin\"\n}",
            "file": null,
            "schema": {},
            "formdata": []
          }
        },
        "response": [],
        "summary": "",
        "isAuthenticationApi": false,
        "isLogin": false,
        "isToken": false,
        "uuid": "d8e6169b-d21d-4fd0-a73a-d5e469a8bfc1"
      },
      {
        "operation_id": "adding a form",
        "tags": ["DummyTag"],
        "request": {
          "method": "post",
          "auth": {
            "type": "Bearer",
            "content": [
              {
                "key": "token",
                "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5ld3VzZXIyQHRlc3QuY29tIiwidXNlcl9pZCI6IjUiLCJyb2xlIjoidXNlciIsImlhdCI6MTY5NDA2MTM5NywiZXhwIjoxNjk0MDY4NTk3fQ.VKK0poB3uIeF6RZ8VGmwSuzt4I6UklvpTgA-uS7PBI8",
                "type": "string"
              }
            ],
            "login_api": null,
            "token_api": null
          },
          "headers": [],
          "parameters": [],
          "url": {
            "baseurl": "http://localhost:3000/admin/add-form",
            "host": ["localhost"],
            "protocol": "http",
            "port": "3000",
            "path": ["admin", "add-form"]
          },
          "body": {
            "mode": "raw",
            "content_type": null,
            "required": null,
            "schema_name": null,
            "raw_content": "{\n    \"title\": \"form 1\",\n    \"description\": \"form for example\",\n    \"status\": \"active\",\n    \"state\": \"uk\",\n     \"createdby\": \"admin\",\n     \"updatedby\": \"admin\",\n     \"version\" : 0\n}",
            "file": null,
            "schema": {},
            "formdata": []
          }
        },
        "response": [],
        "summary": "",
        "isAuthenticationApi": false,
        "isLogin": false,
        "isToken": false,
        "uuid": "0de2c2ae-5287-45e9-a45b-b844d37965f7"
      }
  ];

  const handleSave = () => {
    console.log("Selected API:", selectedApi);
    console.log("Selected Type:", selectedType);
  };
  const isEditMode = mode === "Edit"? true : false;
  const selectedAuthApi = authApis.find(api => api.uuid === selectedUuid);
  console.log(selectedAuthApi, "selectedAuthapi");
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2 style={{ color: "white" }}>
        {isEditMode ? 'Edit Authentication Configuration' : 'Add Authentication Configuration'}
      </h2>
      <Button variant="secondary" onClick={onClose} size="sm">
      <img src={close} alt="" height={24} className="mx-2" />
      </Button>
      </div>
      {available.length > 0 && !isEditMode ? (
        <Form>
          <Form.Group controlId="formApiSelect" className="mt-3">
            <Form.Label style={{ color: "white" }} as="legend">Select an API:</Form.Label>
            <Form.Control
              className="mt-3"
              as="select"
              value={selectedApi}
              onChange={(e) => setSelectedApi(e.target.value)}>
              <option value="">-- Select an API --</option>
              {available.map((api) => (
                <option key={api.operation_id} value={api.operation_id}>
                  {api.operation_id}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          {selectedApi && (
            <Form.Group controlId="formTypeSelect" className="mt-5">
              <Form.Label as="legend" style={{ color: "white" }}>
                Select Type:
              </Form.Label>
              <div >
                <Form.Check
                  inline
                  type="radio"
                  label="Access Token API"
                  name="formType"
                  id="access-token"
                  value="access_token"
                  checked={selectedType === "access_token"}
                  onChange={() => setSelectedType("access_token")}
                  style={{ color: "white"}}
                  className="mt-3"
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Refresh Token API"
                  name="formType"
                  id="refresh-token"
                  value="refresh_token"
                  checked={selectedType === "refresh_token"}
                  onChange={() => setSelectedType("refresh_token")}
                  style={{ color: "white", marginLeft: "10px" }}
                />
                <Form.Check
                  inline
                  type="radio"
                  label="Logout API"
                  name="formType"
                  id="logout"
                  value="logout"
                  checked={selectedType === "logout"}
                  onChange={() => setSelectedType("logout")}
                  style={{ color: "white", marginLeft: "20px" }}
                />
              </div>
            </Form.Group>
          )}
          <Button className="mt-5" variant="secondary" style={{width: "10%"}} onClick={handleSave}>
            Save  
          </Button>
          
        </Form>
      )
      : isEditMode ? (
      <div style={{overflow: "auto", maxHeight:"80vh"}}>
        <CustomPanel dummyData={selectedAuthApi} tagsList={["tag1", "tag2", "tag3"]} />
      </div>
      ) 
      : (
        <p>
          No authentication APIs available. Please create APIs in the backend.
        </p>
      )}
    </div>
  );
}

export default AddOrEditAuthConfig;
