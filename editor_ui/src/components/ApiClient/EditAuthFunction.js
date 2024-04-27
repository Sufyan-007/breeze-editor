import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Toast } from "react-bootstrap";
import close from "../../assets/icons/close.svg";
import { getAuthApiConfig } from "../../services/IntermediatesService.js";
import { appendToAuthApi } from "../../services/IntermediatesService.js";
import CustomButtonGroup from "../CustomButtonGroup.js";
import CustomFormControl from '../CustomFormControl.js';
import { useParams } from "react-router";

function EditAuthFunction({ onClose, selectedAuthServiceId }) {
  const [selectedApiInfo, setSelectedApiInfo] = useState({});
  const appName = useParams()
  let selectTypes = [
    {
      name: "LOUGOUT",
      label: "Logout",
      variant: "secondary",
    },
    {
      name: "REFRESH",
      label: "Refresh",
      variant: "secondary",
    },
    {
      name: "LOGIN",
      label: "Login",
      variant: "secondary",
    },
  ];
  let authenticationTypes = [
    {
      name: "BASIC",
      label: "Basic",
      variant: "secondary",
    },
    {
      name: "OAUTH2",
      label: "OAUTH2",
      variant: "secondary",
    },
    {
      name: "BEARER",
      label: "Bearer",
      variant: "secondary",
    },
    {
      name: "APIKEY",
      label: "ApiKey",
      variant: "secondary",
    },
    {
      name: "OAUTH",
      label: "Oauth",
      variant: "secondary",
    },
  ];
  let tokenStorageSchemes = [
    {
      name: "LOCAL_STORAGE",
      label: "Local Storage",
      variant: "secondary",
    },
    {
      name: "SESSION",
      label: "Session Storage",
      variant: "secondary",
    },
    {
      name: "COOKIE",
      label: "Cookie",
      variant: "secondary",
    },
  ];
  let selectFlow = [
    {
      name: "authorization_code",
      label: "Authorization Code",
      variant: "secondary",
    },
    {
      name: "implicit",
      label: "Implicit",
      variant: "secondary",
    },
    {
      name: "password",
      label: "Password",
      variant: "secondary",
    },
    {
      name: "clientCredentials",
      label: "Client Credentials",
      variant: "secondary",
    },
  ];

  let AuthUrls = [
    {
      name: "flow.authorizationUrl",
      label: "Authorization Url",
      variant: "secondary",
      value: selectedApiInfo.flow ? selectedApiInfo.flow.authorizationUrl : "",
    },
    {
      name: "flow.tokenUrl",
      label: "Token Url",
      variant: "secondary",
      value: selectedApiInfo.flow ? selectedApiInfo.flow.tokenUrl : "",
    },
    {
      name: "flow.refreshUrl",
      label: "Refresh Url",
      variant: "secondary",
      value: selectedApiInfo.flow ? selectedApiInfo.flow.refreshUrl : "",
    },
  ];
  let selectKeys = [
    {
      name: "token_store.access_token_key",
      label: "Access Token Key",
      value: selectedApiInfo.token_store
        ? selectedApiInfo.token_store.access_token_key
        : "",
    },
    {
      name: "token_store.refresh_token_key",
      label: "Refresh Token Key",
      value: selectedApiInfo.token_store
        ? selectedApiInfo.token_store.refresh_token_key
        : "",
    },
  ];

  const onValueChanges = (name, value) => {
    // Check if the property is nested
    if (name.includes(".")) {
      // Split the nested property name into parts
      const [parent, nestedProperty] = name.split(".");
      // Update the nested property
      setSelectedApiInfo((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [nestedProperty]: value,
        },
      }));
    } else {
      // If not nested, update the property directly
      setSelectedApiInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchAuthApi = async () => {
      if (selectedAuthServiceId) {
        let rs = await getAuthApiConfig("creator", selectedAuthServiceId);
        setSelectedApiInfo({ ...rs.data });
      }
    };
    fetchAuthApi();
  }, [selectedAuthServiceId]);
  const handleSave = async () => {
    let resultantApi = {
      request: selectedApiInfo.request
        ? selectedApiInfo.request
        : {
          method: "POST",
          auth: {
            type: "",
            content: "",
            login_api: "",
            token_api: "",
          },
          headers: [],
          parameters: [],
          url: {
            baseurl: "",
            host: "",
            protocol: "",
            port: "",
            path: "",
            url_env: "",
          },
          body: {
            mode: "",
            content_type: "",
            required: "",
            schema_name: "",
            raw_content: "",
            file: "",
            schema: "",
            formdata: "",
          },
        },
      response: selectedApiInfo.response ? [selectedApiInfo.response] : [],
      operation_id: selectedApiInfo.operation_id,
      tags: selectedApiInfo.tags ? selectedApiInfo.tags : [],
      summary: selectedApiInfo.summary ? selectedApiInfo.summary : "",
      auth_api_type: selectedApiInfo.auth_api_type
        ? selectedApiInfo.auth_api_type
        : "",
      authentication_type: selectedApiInfo.authentication_type
        ? selectedApiInfo.authentication_type
        : "",
      is_authorization_url: selectedApiInfo.is_authorization_url
        ? selectedApiInfo.is_authorization_url
        : false,
      flow: selectedApiInfo.flow ? selectedApiInfo.flow : {},
      token_store: selectedApiInfo.token_store
        ? selectedApiInfo.token_store
        : {},
    };
    let operation = null;
    if (selectedAuthServiceId) {
      resultantApi = { ...resultantApi, id: selectedAuthServiceId };
      operation = "update";
      console.log(resultantApi, "resulsdkf");
    }

    const result = await appendToAuthApi(resultantApi, operation, appName.projectName);
  };

  return (
    <>
      <div
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: "80vh",
          maxWidth: "100%",
        }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <Button variant="secondary" onClick={onClose} size="sm">
            <img src={close} alt="" height={24} className="mx-2" />
          </Button>
        </div>
        {selectedApiInfo && console.log(selectedApiInfo)}
        {selectedApiInfo ? (
          <div>
            <Form>
              <Row>
                <Col sm={3} className="mt-4">
                  <Form.Label>Selected Api</Form.Label>
                </Col>
                <Col sm={9}>
                  <Form.Control
                    className="formControl mx-5 mt-4"
                    type="text"
                    value={selectedApiInfo.operation_id}
                    name="operation_id"
                    onChange={(e) =>
                      onValueChanges("operation_id", e.target.value)
                    }
                  />
                </Col>
              </Row>
              <CustomButtonGroup
                options={selectTypes}
                selectedButton={selectedApiInfo.auth_api_type}
                onButtonClick={onValueChanges}
                formId="auth_api_type"
                title="Select Type:"></CustomButtonGroup>
              <CustomButtonGroup
                options={authenticationTypes}
                selectedButton={selectedApiInfo.authentication_type}
                onButtonClick={onValueChanges}
                formId="authentication_type"
                title="Authentication Scheme:"></CustomButtonGroup>

              {selectedApiInfo.authentication_type === "OAUTH2" && (
                <>
                  <CustomButtonGroup
                    options={selectFlow}
                    selectedButton={
                      selectedApiInfo.flow_type ? selectedApiInfo.flow_type : ""
                    }
                    onButtonClick={onValueChanges}
                    formId="flow_type"
                    title="Select Flow or Grant Types:"></CustomButtonGroup>

                  <CustomFormControl
                    options={AuthUrls}
                    onChange={onValueChanges}
                    controlId="selectedAuthUrl"
                    flow_type={selectedApiInfo.flow_type} // Pass the flow object
                  />
                </>
              )}
              <CustomButtonGroup
                options={tokenStorageSchemes}
                selectedButton={
                  selectedApiInfo.token_store
                    ? selectedApiInfo.token_store.store_in
                    : ""
                }
                onButtonClick={onValueChanges}
                formId="token_store.store_in"
                title="Select Token Storage Scheme"></CustomButtonGroup>
              {selectedApiInfo.token_store && (
                <CustomFormControl
                  options={selectKeys}
                  onChange={onValueChanges}
                  controlId="selectedKey"></CustomFormControl>
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
        ) : (
          <p>
            No authentication APIs available. Please create APIs in the backend.
          </p>
        )}
      </div>
    </>
  );
}

export default EditAuthFunction;
