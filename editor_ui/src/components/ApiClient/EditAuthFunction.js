import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Toast } from "react-bootstrap";
import close from "../../assets/icons/close.svg";
import {
  getAuthApiConfig,
  appendToAuthApi,
} from "../../services/IntermediatesService.js";

import CustomButtonGroup from "../CustomButtonGroup.js";
import CustomFormControl from "../CustomFormControl.js";
import { useParams } from "react-router";
import Request from "./Request.js";
import Response from "./Response.js";

function EditAuthFunction({ onClose, selectedAuthServiceId }) {
  const [selectedApiInfo, setSelectedApiInfo] = useState({});
  const appName = useParams();
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
      const [parent, nestedProperty] = name.split(".");
      setSelectedApiInfo((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [nestedProperty]: value,
        },
      }));
    } else {
      setSelectedApiInfo((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleAddResponse = () => {
    const newResponse = {
      id: Date.now(),
    };
    setSelectedApiInfo({
      ...selectedApiInfo,
      response: selectedApiInfo.response
        ? [...selectedApiInfo.response, newResponse]
        : [newResponse],
    });
  };
  const removeResponse = (indexToRemove) => {
    if (selectedApiInfo.response && selectedApiInfo.response.length > 0) {
      const updatedRes = selectedApiInfo.response.filter(
        (_, index) => index !== indexToRemove
      );
      setSelectedApiInfo((prevState) => ({
        ...prevState,
        response: updatedRes,
      }));
    }
  };
  const handleResponseBodyChange = (index, newData) => {
    let responses = selectedApiInfo["response"];
    responses[index] = newData;
    setSelectedApiInfo({
      ...selectedApiInfo,
      response: responses,
    });
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
              content_type: "NONE",
              required: "",
              schema_name: "",
              raw_content: "",
              file: "",
              schema: "",
              formdata: "",
            },
          },
      response: selectedApiInfo.response ? selectedApiInfo.response : [],
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

    const result = await appendToAuthApi(
      resultantApi,
      operation,
      appName.projectName
    );
    if (result.list) {
      onClose();
    }
  };

  return (
    <>
      <div
        style={{
          overflowY: "auto",
          overflowX: "hidden",
        }}>
        <Row className="d-flex justify-content-between align-items-center w-100 mb-3">
        <Col></Col>
          <Col md={{span:1}}>
          <Button variant="secondary" onClick={onClose} size="sm" className="my-3">
            <img src={close} alt="" height={24} className="mx-2" />
          </Button>
          </Col>
          <Col md={{span:1}}>
          <Button
                className="my-3"
                variant="secondary"
                onClick={handleSave}>
                Save
              </Button>
          </Col>
        </Row>
        {selectedApiInfo ? (
          <div>
            <Form>
              <Form.Group>
                <Row>
                  <Col sm={3} className="mt-4">
                    <Form.Label className="mx-3">Selected Api</Form.Label>
                  </Col>
                  <Col sm={9}>
                    <Form.Control
                      className=""
                      style={{ width: "100%" }}
                      type="text"
                      value={selectedApiInfo.operation_id}
                      name="operation_id"
                      onChange={(e) =>
                        onValueChanges("operation_id", e.target.value)
                      }
                    />
                  </Col>
                </Row>
              </Form.Group>
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

                  <Row>
                    <Col sm={3}></Col>
                    <Col sm={9}>
                      <CustomFormControl
                        options={AuthUrls}
                        onChange={onValueChanges}
                        controlId="selectedAuthUrl"
                        flow_type={selectedApiInfo.flow_type} // Pass the flow object
                      />
                    </Col>
                  </Row>
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
                <Row>
                  <Col sm={3}></Col>
                  <Col sm={9}>
                    <CustomFormControl
                      options={selectKeys}
                      onChange={onValueChanges}
                      controlId="selectedKey"></CustomFormControl>
                  </Col>
                </Row>
              )}
              {selectedApiInfo.request && (
                <Form.Group
                  className="mb-3 custom-form-group"
                  controlId="request">
                  <Request
                    loginApis={""}
                    tokenApis={""}
                    onChange={onValueChanges}
                    requestBody={selectedApiInfo.request}
                  />
                </Form.Group>
              )}
              {selectedApiInfo["response"] && (
                <Row>
                  <Col sm={3}>
                    <Form.Label className="mx-3 mt-3">Response</Form.Label>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleAddResponse}>
                      <img
                        width="24"
                        height="24"
                        src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                        alt="add--v1"
                      />
                    </Button>
                  </Col>
                  <Col
                    sm={9}
                    className="d-flex flex-wrap mt-3 p-2 "
                    style={{
                      
                      
                      backgroundColor: "rgba(239, 239, 239, 0.5)",
                    }}>
                    {selectedApiInfo["response"].map((res, index) => (
                      <Response
                        key={res.id}
                        index={index}
                        onChange={handleResponseBodyChange}
                        responseData={res}
                        onRemove={removeResponse}
                      />
                    ))}
                  </Col>
                </Row>
              )}
              
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
