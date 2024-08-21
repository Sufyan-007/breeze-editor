import React, { useCallback, useEffect, useState } from "react";
import { Button, Form, Nav, Navbar } from "react-bootstrap";
import { useParams } from "react-router";
// import "../../../css/NewTest.css";
import "../api_client.css";
import { getAuthFileApis } from "../services/AuthApiService";
import { getApiConfig, modifyApiConfig } from "../services/ApiService";
import { appendToAuthApi } from "../services/AuthApiService";
import Param from "./Param";
import Body from "./Body";
import Headers from "./Headers";
import Authentication from "./Authentication";
import Response from "./Response";
function EditServiceFunction({ selectedServiceInfo, onClose }) {
  const [activeTab, setActiveTab] = useState("parameters");
  const [apiModel, setApiModel] = useState({});
  const [request, setRequest] = useState({});
  const [loginApis, setLoginApis] = useState([]);
  const [tokenApis, setTokenApis] = useState([]);
  const appName = useParams();

  const setAuthApis = useCallback(async () => {
    const result = await getAuthFileApis(appName.projectName, null);
    let login_api = [];
    let token_api = [];
    if (!Array.isArray(result.data)) {
      console.error("Data is not an array:", result.data);
      return;
    }

    for (let api of result.data) {
      if (api.auth_api_type === "LOGIN") {
        login_api.push({
          id: api.id,
          operation_id: api.operation_id,
        });
      }
      if (api.auth_api_type === "REFRESH") {
        token_api.push({
          id: api.id,
          operation_id: api.operation_id,
        });
      }
    }
    setLoginApis(login_api);
    setTokenApis(token_api);
  }, [appName.projectName]);
  const fetchModelConfig = useCallback(
    async (selectedServiceInfo) => {
      try {
        const result = await getApiConfig(
          appName.projectName,
          selectedServiceInfo.filename,
          selectedServiceInfo.id
        );
        const updatedModel = result.data;
        if (updatedModel.response && updatedModel.response.length > 0) {
          const updatedRes = updatedModel.response.map((res) => ({
            ...res,
            id: Date.now() + Math.random(),
          }));
          updatedModel.response = updatedRes;
        }
        setApiModel(updatedModel);
        setRequest(updatedModel.request);
      } catch (error) {
        console.error("Error generating react service:", error);
      }
    },
    [appName.projectName]
  );
  useEffect(() => {
    setAuthApis();
    if (selectedServiceInfo["id"] && selectedServiceInfo["filename"]) {
      fetchModelConfig(selectedServiceInfo);
    }
  }, [selectedServiceInfo, fetchModelConfig, setAuthApis]);
  useEffect(() => {
    console.log(apiModel, "apimodel");
  }, [apiModel]);
  const onValueChange = (prop, value) => {
    let r = request;
    r[prop] = value;
    setRequest({
      ...r,
    });
    onApiModelChange("request", r);
  };
  const onApiModelChange = (prop, value) => {
    let model = { ...apiModel };
    model[prop] = value;
    setApiModel({
      ...model,
    });
  };
  const deleteAuthProps = (properties) => {
    properties.map((prop) => apiModel[prop] && delete apiModel[prop]);
  };
  async function saveApi(e) {
    console.log(apiModel, "befor submission");
    let operation = "ADD";
    if (apiModel.id) {
      operation = "UPDATE";
    }
    if (apiModel.is_authentication_api) {
      apiModel.tags = "auth";
      e.preventDefault();
      await appendToAuthApi(
        apiModel,
        operation === "UPDATE" ? true : false,
        appName.projectName
      );
    } else {
      e.preventDefault();
      await modifyApiConfig(
        apiModel,
        appName.projectName,
        selectedServiceInfo["filename"]
          ? selectedServiceInfo["filename"]
          : apiModel["tags"],
        operation
      );
    }
    setApiModel({});
    onClose();
  }
  return (
    <div
      id="main"
      className="api-client-w-full api-client-h-full api-client-d-flex">
      <div
        id="left-panel"
        className="api-client-h-full api-client-w-80 api-client-border-white">
        <div id="left-top-panel" className="api-client-h-70 api-client-w-full">
          <div id="method-and-url" className="api-client-d-flex api-client-h-8">
            <Form.Select
              className="p-1 mt-2 api-client-h-70 api-client-w-5 api-client-d-inline-block api-client-border-radius-0 api-client-margin-left"
              value={apiModel.request ? apiModel.request.method : ""}
              onChange={(e) => {
                const updatedReq = { ...apiModel.request };
                updatedReq.method = e.target.value;
                onApiModelChange("request", updatedReq);
              }}>
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
            </Form.Select>
            <Form.Control
              type="text"
              placeholder="URL"
              className="p-1 mt-2 api-client-h-70 api-client-w-85 api-client-d-inline-block api-client-border-radius-0 "
              value={
                apiModel.request && apiModel.request.url
                  ? apiModel.request.url.baseurl
                  : ""
              }
              onChange={(e) => {
                const updatedReq = apiModel.request
                  ? { ...apiModel.request }
                  : {};
                console.log(updatedReq, "updated req");
                if (updatedReq.url) {
                  updatedReq.url.baseurl = e.target.value;
                } else {
                  updatedReq.url = {
                    baseurl: e.target.value,
                    servers: [],
                    host: [],
                    protocol: "",
                    path: [],
                    port: "",
                    url_env: "",
                  };
                }
                onApiModelChange("request", updatedReq);
              }}
            />
            <Button
              variant="secondary"
              className="p-1 mt-2 api-client-w-8 api-client-h-70 api-client-d-inline-block api-client-border-radius-0"
              onClick={saveApi}>
              Save
            </Button>
          </div>
          <div id="request-settings" className="api-client-request-settings">
            <Navbar bg="dark" variant="dark" className="api-client-h-10">
              <Nav
                activeKey={activeTab}
                onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                <Nav.Link eventKey="parameters">Parameters</Nav.Link>
                <Nav.Link eventKey="body">Body</Nav.Link>
                <Nav.Link eventKey="headers">Headers</Nav.Link>
                <Nav.Link eventKey="authentication">Authentication</Nav.Link>
              </Nav>
            </Navbar>
            <div className="api-client-h-90">
              {activeTab &&
                (activeTab === "parameters" ? (
                  <Param
                    parameterData={
                      apiModel.request && apiModel.request.parameters
                        ? apiModel.request.parameters
                        : []
                    }
                    onChange={onValueChange}
                  />
                ) : activeTab === "body" ? (
                  <Body
                    bodyData={
                      apiModel.request && apiModel.request.body
                        ? apiModel.request.body
                        : []
                    }
                    onChange={onValueChange}
                  />
                ) : activeTab === "headers" ? (
                  <Headers
                    headerData={
                      apiModel.request && apiModel.request.headers
                        ? apiModel.request.headers
                        : []
                    }
                    onChange={onValueChange}
                  />
                ) : activeTab === "authentication" ? (
                  <Authentication
                    isAuthApi={apiModel.is_authentication_api}
                    authApiType={apiModel.auth_api_type}
                    authType={apiModel.authentication_type}
                    loginApis={loginApis}
                    tokenApis={tokenApis}
                    tokenStore={apiModel.token_store}
                    authArray={
                      apiModel.request && apiModel.request.auth
                        ? apiModel.request.auth
                        : []
                    }
                    onChange={onApiModelChange}
                    onReqChange={onValueChange}
                    flow={apiModel.flow ? apiModel.flow : {}}
                    flow_type={apiModel.flow_type ? apiModel.flow_type : ""}
                    deleteAuthProps={deleteAuthProps}
                  />
                ) : null)}
            </div>
          </div>
        </div>
        <div
          id="left-bottom-panel"
          className="api-client-h-30 api-client-border-white">
          <Response
            responseData={apiModel.response ? apiModel.response : []}
            onChange={onApiModelChange}
          />
        </div>
      </div>

      <div
        id="right-panel"
        className="api-client-border-white api-client-h-full api-client-w-20 api-client-color-white">
        <Form.Label className="api-client-w-40 p-1">Function Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="function name"
          className="p-1 mt-2 mx-3 api-client-w-50 api-client-d-inline-block api-client-border-radius-0 "
          value={apiModel.operation_id ? apiModel.operation_id : ""}
          onChange={(e) => {
            onApiModelChange("operation_id", e.target.value);
          }}
        />
        <Form.Label className="api-client-w-40 p-1">Service Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Service File"
          className="p-1 mt-2 mx-3 api-client-w-50 api-client-d-inline-block api-client-border-radius-0 "
          value={apiModel.tags ? apiModel.tags : ""}
          readOnly={apiModel.is_authentication_api}
          onChange={(e) => {
            onApiModelChange("tags", e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default EditServiceFunction;
