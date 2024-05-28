import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import close from "../../assets/icons/close.svg";
import {
  getAuthApiConfig,
  appendToAuthApi,
} from "../../services/IntermediatesService.js";

import CustomButtonGroup from "../CustomButtonGroup.js";
import { useParams } from "react-router";
import Request from "./Request.js";
import Response from "./Response.js";
import CustomFormGroup from "../CustomFormGroup.js";

function EditAuthFunction({ onClose, selectedAuthServiceId }) {
  const [selectedApiInfo, setSelectedApiInfo] = useState({});
  const appName = useParams();
  let controls = [
    {
      label: "Selected Api",
      type: "text",
      value: selectedApiInfo.operation_id ? selectedApiInfo.operation_id : "",
      onChange: (value) => onValueChanges("operation_id", value),
      placeholder: "Enter Function Name",
      width: "90%",
      labelColWidth: 3,
      inputColWidth: 9,
    },
  ];
  let selectTypes = [
    {
      name: "LOGOUT",
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
    console.log(name, value, "see the changes ");
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
    console.log(selectedApiInfo, "see the flow type");
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
      flow_type: selectedApiInfo.flow_type ? selectedApiInfo.flow_type : "",
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
        }}
      >
        <div className="custom-grid d-flex justify-content-end align-items-center w-100 mb-3">
          <div className="custom-grid-item"></div>
          <div className="custom-grid-item one">
            <Button variant="secondary" onClick={onClose} className="my-3">
              Close
            </Button>
          </div>
          <div className="custom-grid-item one">
            <Button className="my-3" variant="secondary" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>

        <div>
          <Form>
            <CustomFormGroup controls={controls} />

            <CustomFormGroup
              controls={[
                {
                  label: "Select Type:",
                  type: "buttongroup",
                  selectedButton: selectedApiInfo.auth_api_type
                    ? selectedApiInfo.auth_api_type
                    : "",
                  onButtonClick: (e) => {
                    onValueChanges("auth_api_type", e);
                  },
                  width: "90%",
                  labelColWidth: 3,
                  inputColWidth: 9,
                  buttonGroupOptions: selectTypes,
                  formId: "auth_api_type",
                },
              ]}
            />

            <CustomFormGroup
              controls={[
                {
                  label: "Authentication Scheme ",
                  type: "buttongroup",
                  selectedButton: selectedApiInfo.authentication_type
                    ? selectedApiInfo.authentication_type
                    : "",
                  onButtonClick: (e) => {
                    onValueChanges("authentication_type", e);
                  },
                  width: "90%",
                  labelColWidth: 3,
                  inputColWidth: 9,
                  buttonGroupOptions: authenticationTypes,
                  formId: "authentication_type",
                },
              ]}
            />
            {selectedApiInfo.authentication_type === "OAUTH2" && (
              <>
                <CustomFormGroup
                  controls={[
                    {
                      label: "Select Flow or Grant Types: ",
                      type: "buttongroup",
                      selectedButton: selectedApiInfo.flow_type
                        ? selectedApiInfo.flow_type
                        : "",
                      onButtonClick: (e) => {
                        onValueChanges("flow_type", e);
                      },
                      width: "90%",
                      labelColWidth: 3,
                      inputColWidth: 9,
                      buttonGroupOptions: selectFlow,
                      formId: "flow_type",
                    },
                  ]}
                />
              </>
            )}
            {selectedApiInfo.authentication_type === "OAUTH2" &&
              selectedApiInfo.flow_type === "authorization_code" && (
                <>
                  {/* Authorization URL Input */}
                  <CustomFormGroup
                    controls={[
                      {
                        label: "Authorization URL: ",
                        type: "text",
                        value:
                          selectedApiInfo.flow &&
                          selectedApiInfo.flow.authorization_url
                            ? selectedApiInfo.flow.authorization_url
                            : "",
                        onChange: (e) =>
                          onValueChanges("flow.authorization_url", e),
                        width: "90%",
                        labelColWidth: 3,
                        inputColWidth: 9,
                      },
                    ]}
                  />

                  {/* Refresh URL Input */}
                  <CustomFormGroup
                    controls={[
                      {
                        label: "Refresh URL: ",
                        type: "text",
                        value:
                          selectedApiInfo.flow &&
                          selectedApiInfo.flow.refresh_url
                            ? selectedApiInfo.flow.refresh_url
                            : "",
                        onChange: (e) => {
                          onValueChanges("flow.refresh_url", e);
                        },
                        width: "90%",
                        labelColWidth: 3,
                        inputColWidth: 9,
                      },
                    ]}
                  />

                  {/* Token URL Input */}
                  <CustomFormGroup
                    controls={[
                      {
                        label: "Token URL: ",
                        type: "text",
                        value:
                          selectedApiInfo.flow && selectedApiInfo.flow.token_url
                            ? selectedApiInfo.flow.token_url
                            : "",
                        onChange: (e) => {
                          onValueChanges("flow.token_url", e);
                        },
                        width: "90%",
                        labelColWidth: 3,
                        inputColWidth: 9,
                      },
                    ]}
                  />
                </>
              )}

            {selectedApiInfo.authentication_type === "OAUTH2" &&
              selectedApiInfo.flow_type &&
              selectedApiInfo.flow_type !== "authorization_code" && (
                <>
                  {/* Refresh URL Input */}
                  <CustomFormGroup
                    controls={[
                      {
                        label: "Refresh URL: ",
                        type: "text",
                        value: selectedApiInfo.flow.refresh_url
                          ? selectedApiInfo.flow.refresh_url
                          : "",
                        onChange: (e) => {
                          onValueChanges("flow.refresh_url", e);
                        },
                        width: "90%",
                        labelColWidth: 3,
                        inputColWidth: 9,
                      },
                    ]}
                  />

                  {/* Token URL Input */}
                  <CustomFormGroup
                    controls={[
                      {
                        label: "Token URL: ",
                        type: "text",
                        value: selectedApiInfo.flow.token_url
                          ? selectedApiInfo.flow.token_url
                          : "",
                        onChange: (e) => {
                          console.log(e, "fsdfsdfdsx");
                          onValueChanges("flow.token_url", e);
                        },
                        width: "90%",
                        labelColWidth: 3,
                        inputColWidth: 9,
                      },
                    ]}
                  />
                </>
              )}

            <CustomFormGroup
              controls={[
                {
                  label: "Select Token Storage Scheme ",
                  type: "buttongroup",
                  selectedButton: selectedApiInfo.token_store
                    ? selectedApiInfo.token_store.store_in
                    : "",
                  onButtonClick: (e) => {
                    onValueChanges("token_store.store_in", e);
                  },
                  width: "90%",
                  labelColWidth: 3,
                  inputColWidth: 9,
                  buttonGroupOptions: tokenStorageSchemes,
                  formId: "token_store.store_in",
                },
              ]}
            />
            {selectedApiInfo.token_store && (
              <>
                <CustomFormGroup
                  controls={[
                    {
                      label: "Refresh Token Key: ",
                      type: "text",
                      value: selectedApiInfo.token_store
                        ? selectedApiInfo.token_store.refresh_token_key
                        : "",
                      onChange: (e) => {
                        onValueChanges("token_store.refresh_token_key", e);
                      },
                      width: "90%",
                      labelColWidth: 3,
                      inputColWidth: 9,
                      formId: "token_store.refresh_token_key",
                    },
                  ]}
                />

                <CustomFormGroup
                  controls={[
                    {
                      label: "Access Token Key: ",
                      type: "text",
                      value: selectedApiInfo.token_store
                        ? selectedApiInfo.token_store.access_token_key
                        : "",
                      onChange: (e) => {
                        onValueChanges("token_store.access_token_key", e);
                      },
                      width: "90%",
                      labelColWidth: 3,
                      inputColWidth: 9,
                      formId: "token_store.access_token_key",
                    },
                  ]}
                />
              </>
            )}

            <section className="divider-sec mt-3">
              <p>Request Body</p>
            </section>
            <Form.Group className="mb-3 custom-form-group" controlId="request">
              <Request
                loginApis={""}
                tokenApis={""}
                onChange={onValueChanges}
                requestBody={selectedApiInfo.request || { body: [], auth: [] }}
                renderAuth={false}
              />
            </Form.Group>
            <section className="divider-sec">
              <p>Response Body</p>
            </section>
            <div className="custom-grid">
              <div className="custom-grid-item three">
                <Form.Label className="mx-3 mt-3">Response</Form.Label>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddResponse}
                >
                  <img
                    width="24"
                    height="24"
                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                    alt="add--v1"
                  />
                </Button>
              </div>
              <div className="custom-grid-item nine d-flex flex-wrap mt-3 p-2 ">
                {selectedApiInfo["response"] &&
                  selectedApiInfo["response"].map((res, index) => (
                    <Response
                      key={res.id}
                      index={index}
                      onChange={handleResponseBodyChange}
                      responseData={res}
                      onRemove={removeResponse}
                    />
                  ))}
              </div>
            </div>
          </Form>
        </div>

        {/* <p>
            No authentication APIs available. Please create APIs in the backend.
          </p> */}
      </div>
    </>
  );
}

export default EditAuthFunction;
