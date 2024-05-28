import React, { useEffect, useState } from "react";
import { Button, Form, Nav, Navbar } from "react-bootstrap";
import { useParams } from "react-router";
// import Parameter from './Parameter'
import "../../css/NewTest.css";
import {
  getAuthFileApis,
  getApiConfig,
  modifyApiConfig,
} from "../../services/IntermediatesService";
import NewParam from "./NewParam";
import NewBody from "./NewBody";
import NewHeaders from "./NewHeaders";
import NewAuthentication from "./NewAuthentication";
import NewResponse from "./NewResponse";
function EditServiceFunctionNew({ selectedServiceInfo, onClose }) {
  const [activeTab, setActiveTab] = useState("parameters");
  const [apiModel, setApiModel] = useState({});
  const [request, setRequest] = useState({});
  const [loginApis, setLoginApis] = useState([]);
  const [tokenApis, setTokenApis] = useState([]);
  const appName = useParams();
  useEffect(() => {
    setAuthApis();
    if (selectedServiceInfo["id"] && selectedServiceInfo["filename"]) {
      fetchModelConfig(selectedServiceInfo);
    }
  }, []);
  useEffect(() => {
    console.log(apiModel, "apimodel");
  }, [apiModel]);
  const setAuthApis = async () => {
    const result = await getAuthFileApis(appName.projectName, null);
    let login_api = [];
    let token_api = [];
    if (!Array.isArray(result.data)) {
      console.error("Data is not an array:", result.data);
      return;
    }
    console.log(result.data, "result data ");
    for (let i = 0; i < result["data"].length; i++) {
      let api = result.data[i];
      if (api.auth_api_type === "LOGIN") {
        login_api.push({
          id: api["id"],
          operation_id: api.operation_id,
        });
      }
      if (api.auth_api_type === "REFRESH") {
        token_api.push({
          id: api["id"],
          operation_id: api.operation_id,
        });
      }
    }
    setLoginApis(login_api);
    setTokenApis(token_api);
    console.log(login_api, "login api", token_api, " token apis");
  };
  const fetchModelConfig = async (selectedServiceInfo) => {
    try {
      const result = await getApiConfig(
        appName.projectName,
        selectedServiceInfo["filename"],
        selectedServiceInfo["id"]
      );
      const updatedModel = result["data"];
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
      console.error("Error generate react service:", error);
    }
  };
  const onValueChange = (prop, value) => {
    let r = request;
    r[prop] = value;
    setRequest({
      ...r,
    });
    onApiModelChange("request", r);
    // console.log(apiModel, "afterchange");
  };
  const onApiModelChange = (prop, value) => {
    let model = { ...apiModel };
    model[prop] = value;
    setApiModel({
      ...model,
    });
    // console.log(apiModel, "afterchange");
  };
  const deleteAuthProps = (properties) => {
    console.log(properties, "properties");
    properties.map((prop) => apiModel[prop] && delete apiModel[prop]);
  };
  async function saveApi(e) {
    console.log(apiModel, "submitted");
    let operation = "ADD";
    if(apiModel.id){
      operation = "UPDATE"
    }
    e.preventDefault();
    const result = await modifyApiConfig(
      apiModel,
      appName.projectName,
      selectedServiceInfo["filename"] ? selectedServiceInfo["filename"] : apiModel["tags"],
      operation
    );
    console.log(result, "resultttttt");
    setApiModel({});
    onClose()
  }
  return (
    <div id="main" className="test-w-full test-h-full test-d-flex">
      <div id="left-panel" className="test-h-full test-w-80 test-border-white">
        <div id="left-top-panel" className="test-h-70 test-w-full">
          <div id="method-and-url" className="test-d-flex test-h-8">
            <Form.Select
              className="p-1 mt-2 test-h-70 test-w-5 test-d-inline-block test-border-radius-0 test-margin-left"
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
              className="p-1 mt-2 test-h-70 test-w-85 test-d-inline-block test-border-radius-0 "
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
              className="p-1 mt-2 test-w-8 test-h-70 test-d-inline-block test-border-radius-0"
              onClick={saveApi}>
              Save
            </Button>
          </div>
          <div id="request-settings" className="test-request-settings">
            <Navbar bg="dark" variant="dark" className="test-h-10">
              <Nav
                activeKey={activeTab}
                onSelect={(selectedKey) => setActiveTab(selectedKey)}>
                <Nav.Link eventKey="parameters">Parameters</Nav.Link>
                <Nav.Link eventKey="body">Body</Nav.Link>
                <Nav.Link eventKey="headers">Headers</Nav.Link>
                <Nav.Link eventKey="authentication">Authentication</Nav.Link>
              </Nav>
            </Navbar>
            <div className="test-h-90">
              {activeTab &&
                (activeTab === "parameters" ? (
                  <NewParam
                    parameterData={
                      apiModel.request && apiModel.request.parameters
                        ? apiModel.request.parameters
                        : []
                    }
                    onChange={onValueChange}
                  />
                ) : activeTab === "body" ? (
                  <NewBody
                    bodyData={
                      apiModel.request && apiModel.request.body
                        ? apiModel.request.body
                        : []
                    }
                    onChange={onValueChange}
                  />
                ) : activeTab === "headers" ? (
                  <NewHeaders
                    headerData={
                      apiModel.request && apiModel.request.headers
                        ? apiModel.request.headers
                        : []
                    }
                    onChange={onValueChange}
                  />
                ) : activeTab === "authentication" ? (
                  <NewAuthentication
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
                    flow={apiModel.flow? apiModel.flow: {}}
                    flow_type={apiModel.flow_type ? apiModel.flow_type : ''}
                    deleteAuthProps={deleteAuthProps}
                  />
                ) : null)}
            </div>
          </div>
        </div>
        <div id="left-bottom-panel" className="test-h-30 test-border-white">
          <NewResponse
            responseData={apiModel.response ? apiModel.response : []}
            onChange={onApiModelChange}
          />
        </div>
      </div>

      <div
        id="right-panel"
        className="test-border-white test-h-full test-w-20 test-color-white">
        <Form.Label className="test-w-40 p-1">Function Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="function name"
          className="p-1 mt-2 mx-3 test-w-50 test-d-inline-block test-border-radius-0 "
          value={apiModel.operation_id ? apiModel.operation_id : ""}
          onChange={(e) => {
            onApiModelChange("operation_id", e.target.value);
          }}
        />
        <Form.Label className="test-w-40 p-1">Service Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Service Name"
          className="p-1 mt-2 mx-3 test-w-50 test-d-inline-block test-border-radius-0 "
          value={apiModel.tags ? apiModel.tags : ""}
          onChange={(e) => {
            onApiModelChange("tags", e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default EditServiceFunctionNew;
