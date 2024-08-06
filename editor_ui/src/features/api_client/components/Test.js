import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useParams } from "react-router";
import file from "../../../assets/icons/file.svg";
import edit from "../../../assets/icons/edit-icon.svg";
import Delete from "../../../assets/icons/delete-trash.svg";
import {
  editModuleName,
  fetchIntermediate,
  generateIntermediates,
} from "../services/IntermediateService";
import ImportApi from "./ImportApi";
import GeneralSettingsCard from "./views/EditView/GeneralSettingsCard";
import EditServiceFunction from "./EditServiceFunction";
import RequestSettings from "./views/EditView/RequestSettings";
import ResponseSettings from "./views/EditView/ResponseSettings";
import { generateReactService } from "../services/GeneratedReactAppService";
import AuthConfigSettings from "./views/AuthConfigSettings";
import { getApiSchemaDetails, modifyApiConfig } from "../services/ApiService";
import { appendToAuthApi } from "../services/AuthApiService";
function Test() {
  const [apiList, setApiList] = useState([]);
  const [authApiList, setAuthApiList] = useState([]);
  const [schemaList, setSchemaList] = useState([]);
  const [selectedApi, setSelectedApi] = useState({});
  const [selectedAuthApi, setSelectedAuthApi] = useState({});
  const [selectedServiceInfo, setSelectedServiceInfo] = useState({});
  const { projectName } = useParams();
  const [expandedFilenames, setExpandedFilenames] = useState([]);
  const [expandedModules, setExpandedModules] = useState([]);
  const [view, setView] = useState("TEST");
  const [show, setShow] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  // const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchServiceList = useCallback(async () => {
    try {
      const result = await fetchIntermediate(projectName);
      const fetchedApiList = result["files_with_apis"];
      console.log(fetchedApiList, "fetched");
      setApiList(fetchedApiList);
      setAuthApiList(result["auth_api_files"]);

      // setServiceErrors({"filenames": ["orders"], "functions": ["orders_retrieve"]})
    } catch (error) {
      console.error("Error generating react service:", error);
    }
  }, [projectName]);

  const fetchSchemasList = useCallback(
    async (schemaName) => {
      try {
        const result = await getApiSchemaDetails(projectName, schemaName);
        if (schemaName) {
          return result;
        } else {
          setSchemaList(result);
        }
        // console.log(result, "result");
      } catch (e) {
        console.error(e);
      }
    },
    [projectName]
  );
  const generateService = async (fileType, filename, moduleId) => {
    try {
      const result = await generateReactService(fileType, projectName, filename, moduleId);
      console.log(result, "result");
    } catch (error) {
      console.error("Error generate react service:", error);
    }
  };
  const onApiModelChange = (prop, value) => {
    let model = { ...selectedApi };
    model[prop] = value;
    setSelectedApi({
      ...model,
    });
  };
  const onAuthApiModelChange = (prop, value) => {
    let model = { ...selectedAuthApi };
    if (prop === "authentication_type") {
      model["access_token_request"] = {};
      model["access_token_response"] = [];
      model["refresh_token_request"] = {};
      model["refresh_token_response"] = [];
    }
    model[prop] = value;
    setSelectedAuthApi({
      ...model,
    });
  };

  const handleUpload = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await generateIntermediates(
        fileType,
        projectName,
        formData
      );
      if (response.files_with_apis) {
        fetchServiceList();
        setShow(false);
        setView("TEST");
        event.target.value = "";
      } else {
        setErrorMessage(response.error);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };


  const onSubmit = async (e) => {
    if (!isValidApiStructure(selectedApi)) {
      setShowToast(true)
      setErrorMessage("Please Fill All the Values before Submitting");
      console.log(selectedApi);
      console.error("Invalid API structure");
      return;
    }
    console.log(selectedApi, "selected api");
    console.log(selectedServiceInfo, "selected service info");
    if (selectedApi) {

    }
    let operation = "ADD";
    if (selectedApi.id) { operation = "UPDATE" }
    e.preventDefault();
    const result = await modifyApiConfig(
      selectedApi,
      projectName,
      selectedServiceInfo["filename"]
        ? selectedServiceInfo["filename"]
        : selectedApi["tags"],
      operation
    );
    setSelectedApi({});
    setSelectedServiceInfo({})
    fetchServiceList()
  };

  const isValidApiStructure = (api) => {
    if (!api) return false;

    // Check for top-level properties
    const hasRequiredTopLevelProps = api.operation_id && api.tags;
    if (!hasRequiredTopLevelProps) return false;

    // Check request structure
    if (api.request) {
      const hasValidRequestProps = api.request.method && api.request.url && Array.isArray(api.request.parameters) && Array.isArray(api.request.body);
      if (!hasValidRequestProps) return false;

      // Validate URL structure
      // const url = api.request.url;
      // if (!url.baseurl || !Array.isArray(url.path)) return false;

      // Validate parameters
      for (const param of api.request.parameters) {
        const hasRequiredParamProps = param.param_in && param.name && param.type && param.param_type;
        if (!hasRequiredParamProps) return false;
      }

      // Validate body
      for (const body of api.request.body) {
        const hasRequiredBodyProps = body.content_type && body.mode;
        if (!hasRequiredBodyProps) return false;
      }
    }
    // Check response structure
    if (api.response) {
      for (const resp of api.response) {
        const hasRequiredResponseProps = resp.content_type && resp.status;
        if (!hasRequiredResponseProps) return false;
      }
    }

    return true;
  };

  const onAuthApiSubmit = async (e) => {

    console.log(selectedAuthApi, "onAuthApiSubmit");
    let operation = "ADD";
    if (selectedAuthApi.id) { operation = "UPDATE" }
    selectedAuthApi.tags = "auth";
    e.preventDefault();
    await appendToAuthApi(
      selectedAuthApi,
      operation === "UPDATE" ? true : false,
      projectName
    );
    fetchServiceList()
  }

  useEffect(() => {
    fetchServiceList();
    fetchSchemasList(null);
  }, [fetchServiceList, fetchSchemasList]);

  const toggleExpand = (filename) => {
    if (expandedFilenames.includes(filename)) {
      setExpandedFilenames(expandedFilenames.filter((fn) => fn !== filename));
    } else {
      setExpandedFilenames([...expandedFilenames, filename]);
    }
  };
  const toggleModuleExpand = (moduleTitle) => {
    if (expandedModules.includes(moduleTitle)) {
      setExpandedModules(expandedModules.filter((title) => title !== moduleTitle));
    } else {
      setExpandedModules([...expandedModules, moduleTitle]);
    }
  };
  const handleInputChange = (e) => {
    setNewModuleTitle(e.target.value);
  };
  const startEditing = (title) => {
    setEditingModule(title);
    setNewModuleTitle(title);
  };

  const saveTitle = async(oldTitle, moduleId) => {
    const result = await editModuleName(projectName, moduleId, {title: newModuleTitle})
    if(result.message)
    {
      setShowToast(true);
      setErrorMessage(result.message);
    }
    // const updatedApiList = apiList.map((folder) => {
    //   if (folder.title === oldTitle) {
    //     return { ...folder, title: newModuleTitle };
    //   }
    //   return folder;
    // });
    // setApiList(updatedApiList);
    fetchServiceList();
    setEditingModule(null);
  };

  const cancelEditing = () => {
    setEditingModule(null);
    setNewModuleTitle("");
  };


  return (
    <div className="container-fluid h-100">
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} autohide>
          <Toast.Header>Message</Toast.Header>
          <Toast.Body>{errorMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      <Row className="h-100">
        <Col
          sm={2}
          style={{
            backgroundColor: "#212529",
            borderRight: "1px solid rgba(128, 128, 128, 0.5)",
          }}
          className="h-100 d-flex flex-grow flex-column">
          <div
            id="services-div"
            className="h-50 overflow-auto mb-1"
            style={{ borderBottom: "1px solid gray" }}>
            <div className="d-flex justify-content-between mb-2">
              <span style={{ color: "white" }} className="mt-4 overflow-auto">
                <strong> Services</strong>
              </span>
              <div className="d-flex">
                <img
                  width="25"
                  height="25"
                  className="mx-1 mt-4"
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                  alt="add--v1"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedApi({});
                    setView("TEST");
                  }}
                />
                <img
                  width="25"
                  height="25"
                  className="mx-1 mt-4"
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/import.png"
                  alt="import"
                  style={{ cursor: "pointer" }}
                  onClick={() => setView("IMPORT_API")}
                />
              </div>
            </div>
            {apiList && apiList.length > 0 ? (
              apiList.map((folder, folderIndex) => (
                <div key={folderIndex}>
                  <div
                    className="mb-2 p-1"
                    onClick={() => toggleModuleExpand(folder.title)}
                    style={{
                      cursor: "pointer",
                      backgroundColor: expandedModules.includes(folder.title)
                        ? "#303033"
                        : "#212529",
                      color: expandedModules.includes(folder.title) ? "white" : "white",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>

                        {editingModule === folder.title ? (
                          <>
                            <Form.Control
                              type="text"
                              size="sm"
                              value={newModuleTitle}
                              onChange={handleInputChange}
                              onBlur={() => saveTitle(folder.title, folder.subfolder)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveTitle(folder.title);
                                } else if (e.key === 'Escape') {
                                  cancelEditing();
                                }
                              }}
                              autoFocus
                              style={{
                                backgroundColor: "#303033",
                                color: "white",
                                border: "none",
                                marginLeft: "8px",
                              }}
                            /></>
                        ) : (
                          <div>
                            <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/module.png" alt="module" />
                            <span className="text-white mx-2" >
                              {folder.title}
                            </span>
                          </div>
                        )}
                      </div>
                      <img src={edit} alt="edit" height={15} width={15} onClick={() => startEditing(folder.title)} />
                    </div>
                  </div>
                  {expandedModules.includes(folder.title) && editingModule === null && (
                    <div
                      className="text-white"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#212529",
                        marginLeft: "15px",
                      }}
                    >
                      {folder.files && folder.files.length > 0 ? (
                        folder.files.map((service, index) => (
                          <div key={index} className="my-2">
                            <div
                              className="mb-2 p-1"
                              onClick={() => toggleExpand(service.filename)}
                              style={{
                                cursor: "pointer",
                                backgroundColor: expandedFilenames.includes(service.filename)
                                  ? "#303033"
                                  : "#212529",
                                color: expandedFilenames.includes(service.filename)
                                  ? "white"
                                  : "white",
                              }}
                            >
                              <div className="d-flex justify-content-between">
                                <div>
                                  <img src={file} height={15} width={15} alt="file" />
                                  <span className="mx-2">{service.filename}</span>
                                  {service.errors && service.errors.length > 0 && (
                                    <i className="bi bi-exclamation-circle" style={{ color: "red" }}></i>
                                  )}
                                </div>
                                <img
                                  onClick={() => generateService("ORDINARY", service.filename, folder.subfolder)}
                                  className="mt-1"
                                  width="15"
                                  height="15"
                                  src="https://img.icons8.com/ios-filled/50/FFFFFF/mechanistic-analysis.png"
                                  alt="mechanistic-analysis"
                                />
                              </div>
                            </div>
                            {expandedFilenames.includes(service.filename) && (
                              <div
                                className="text-white"
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "#212529",
                                  marginLeft: "15px",
                                }}
                              >
                                {Object.keys(service.apis).length > 0 ? (
                                  Object.entries(service.apis).map(([key, value]) => (
                                    <div
                                      key={key}
                                      className="m-1 d-flex justify-content-between"
                                    >
                                      <span
                                        className={`overflow-auto ${value.errors && value.errors.root_errors.length > 0
                                          ? "text-danger"
                                          : ""
                                          }`}
                                        onClick={() => {
                                          console.log(folder.subfolder, "subfolderrrrrrrrrr");
                                          setSelectedApi(value);
                                          setSelectedServiceInfo({
                                            id: value.id,
                                            filename: service.filename,
                                            module_id: folder.subfolder
                                          });
                                          setView("TEST");
                                        }} style={{ width: "90%" }}
                                      >
                                        {value.operation_id}
                                      </span>
                                      <div id="actions-div" className="d-flex">
                                        <img
                                          className="mx-1"
                                          width="20"
                                          height="20"
                                          src="https://img.icons8.com/ios-filled/50/FFFFFF/test-passed.png"
                                          alt="test-passed"
                                          onClick={() => {
                                            setSelectedServiceInfo({
                                              id: value.operation_id,
                                              filename: service.filename,
                                              module_id: folder.model_id
                                            });

                                            setView("TEST_API");
                                          }}
                                        />
                                        <img
                                          src={Delete}
                                          alt="delete"
                                          height={20}
                                          width={20}
                                          style={{ cursor: "pointer" }}
                                        />
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <h5 className="no-service">No services found</h5>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <h5 className="no-service text-white">No services found</h5>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <h5 className="no-service text-white">No services found</h5>
            )}

          </div>
          <div id="schemas-div" className="h-50 overflow-auto">
            <div className="text-white mt-2 d-flex justify-content-between">
              <strong>Authentication Config</strong>
              <img
                width="25"
                height="25"
                className="mx-1"
                src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                alt="add--v1"
                style={{ cursor: "pointer" }}
                onClick={() => setView("AUTH_API")}
              />
            </div>
            {authApiList && authApiList.length > 0 ? (
              authApiList
                .map((module, index) => (
                  <div key={index} className="my-2">
                    <div
                      className="mb-2 p-1"
                      onClick={() => toggleExpand(module.title)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: expandedFilenames.includes(
                          module.title
                        )
                          ? "#303033"
                          : "#212529",
                        color: expandedFilenames.includes(module.title)
                          ? "white"
                          : "white",
                      }}>
                      <div className="d-flex justify-content-between">
                        <div>
                          <img width="20" height="20" src="https://img.icons8.com/ios-filled/50/FFFFFF/module.png" alt="module" />
                          <span className="text-white mx-2">{module.title}</span>
                        </div>
                        <img
                          onClick={() => generateService("AUTH", module.title, module.model_id)}
                          className="mt-1"
                          width="15"
                          height="15"
                          src="https://img.icons8.com/ios-filled/50/FFFFFF/mechanistic-analysis.png"
                          alt="mechanistic-analysis"
                        />
                      </div>
                    </div>
                    {expandedFilenames.includes(module.title) && (
                      <div
                        className="text-white"
                        style={{
                          cursor: "pointer",
                          backgroundColor: "#212529",
                          marginLeft: "15px",
                        }}>
                        {module.apis && module.apis.length > 0 ?
                          <>
                            {module.apis.map((api) => (
                              <div
                                key={api.id}
                                className="m-1 d-flex justify-content-between">
                                <span
                                  className={`overflow-auto ${api.errors &&
                                    api.errors.root_errors.length > 0
                                    ? "text-danger"
                                    : "text-white"
                                    }`}
                                  onClick={() => {
                                    // setSelectedApi(value);
                                    setSelectedAuthApi(api)
                                    // setView("TEST");
                                    setView("AUTH_API");
                                  }} style={{ width: "90%" }}>
                                  {api.operation_id}
                                </span>
                                <div id="actions-div" className="d-flex">
                                  <img
                                    className="mx-1"
                                    width="20"
                                    height="20"
                                    src="https://img.icons8.com/ios-filled/50/FFFFFF/test-passed.png"
                                    alt="test-passed"

                                  />

                                  <img
                                    src={Delete}
                                    alt="delete"
                                    height={20}
                                    width={20}
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                              </div>
                            ))}
                          </> : (
                            <h5 className="no-service">No services found</h5>
                          )}
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <h5 className="no-service text-white">No services found</h5>
            )}
          </div>
        </Col>
        <Col sm={10} className="h-100" style={{ backgroundColor: "#212529" }}>
          {view === "TEST" ? (
            <>
              <div className="d-flex justify-content-between">
                <h5 className="text-white mt-4">
                  Service Function Configuration
                </h5>
                <div>
                  <Button
                    variant="secondary"
                    className="mt-3 rounded-0"
                    onClick={onSubmit}>
                    Submit
                  </Button>
                </div>
              </div>
              <GeneralSettingsCard
                selectedServiceInfo={selectedServiceInfo}
                settings={selectedApi}
                onChange={onApiModelChange}
                isAuthApi={false}
                onSuccessfulTransfer={() => { fetchServiceList() }}
              />
              <RequestSettings
                moduleId={selectedServiceInfo.module_id}
                requestData={selectedApi.request ? selectedApi.request : {}}
                onChange={onApiModelChange}
                apiData={selectedApi}
                isAuthApi={false}
                title="Request Settings"
                requestType="request"
              />
              <ResponseSettings
                responseData={selectedApi.response ? selectedApi.response : []}
                onChange={onApiModelChange}
                schemaList={schemaList}
                isAuthApi={false}
                title="Response Settings"
                responseType="response"
              />
            </>
          ) : view === "AUTH_API" ? (
            <>
              <div className="d-flex justify-content-between">
                <h5 className="text-white mt-4">AUTH API Configuration</h5>
                <div>
                  <Button
                    variant="secondary"
                    className="mt-3 rounded-0"
                    onClick={onAuthApiSubmit}>
                    Submit
                  </Button>
                </div>
              </div>

              <GeneralSettingsCard
                settings={selectedAuthApi}
                onChange={onAuthApiModelChange}
                isAuthApi={true}
              />
              <div className="">
                <RequestSettings
                  requestData={selectedAuthApi.access_token_request ? selectedAuthApi.access_token_request : {}}
                  onChange={onAuthApiModelChange}
                  apiData={selectedAuthApi}
                  isAuthApi={true}
                  title="Access Token Request Settings"
                  requestType="access_token_request"
                  moduleId={selectedServiceInfo.module_id}
                />
                <ResponseSettings
                  responseData={selectedAuthApi.access_token_response ? selectedAuthApi.access_token_response : []}
                  onChange={onAuthApiModelChange}
                  schemaList={schemaList}
                  isAuthApi={true}
                  title="Access Token Response Settings"
                  responseType="access_token_response"

                />
              </div>
              {(selectedAuthApi.authentication_type === "BEARER" || selectedAuthApi.authentication_type === "APIKEY" || selectedAuthApi.authentication_type === "OAUTH2") && <>
                <div >
                  <RequestSettings
                    moduleId={selectedServiceInfo.module_id}
                    requestData={selectedAuthApi.refresh_token_request ? selectedAuthApi.refresh_token_request : {}}
                    onChange={onAuthApiModelChange}
                    apiData={selectedAuthApi}
                    isAuthApi={true}
                    title="Refresh Token Request Settings"
                    requestType="refresh_token_request"
                  />
                  <ResponseSettings
                    responseData={selectedAuthApi.refresh_token_response ? selectedAuthApi.refresh_token_response : []}
                    onChange={onAuthApiModelChange}
                    schemaList={schemaList}
                    isAuthApi={true}
                    title="Refresh Token Response Settings"
                    responseType="refresh_token_response"
                  />
                </div>
              </>}
            </>
          ) : view === "IMPORT_API" ? (
            <>
              <ImportApi
                show={true}
                onImport={handleUpload}
                onClose={() => {
                  setView("TEST");
                  setShow(!show);
                }}></ImportApi>
            </>
          ) : view === "TEST_API" ? (
            <EditServiceFunction selectedServiceInfo={selectedServiceInfo} />
          ) : view === "AUTH_CONFIG" ? (
            <AuthConfigSettings selectedApi={selectedApi} />
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

export default Test;
