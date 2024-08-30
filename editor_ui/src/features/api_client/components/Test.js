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
import { modifyApiConfig } from "../services/ApiService";
import { appendToAuthApi } from "../services/AuthApiService";
function Test() {
  const [apiList, setApiList] = useState([]);
  const [authApiList, setAuthApiList] = useState([]);
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
  const [errorMessage, setErrorMessage] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  const fetchServiceList = useCallback(async () => {
    try {
      const result = await fetchIntermediate(projectName);
      const fetchedApiList = result["files_with_apis"];
      console.log(fetchedApiList, "fetched");
      setApiList(fetchedApiList);
      setAuthApiList(result["auth_api_files"]);
    } catch (error) {
      console.error("Error generating react service:", error);
    }
  }, [projectName]);

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
    console.log(prop, value, "prop and value");
    let model = { ...selectedAuthApi };
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
      return;
    }
    if (!selectedModule) {
      setShowToast(true)
      setErrorMessage("Please Select a Module first");
      return;
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
      operation,
      selectedModule.id
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
      const url = api.request.url;
      if (!Array.isArray(url.path)) return false;
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
    if (!isValidApiStructure(selectedAuthApi)) {
      setShowToast(true)
      setErrorMessage("Please Fill All the Values before Submitting");
      return;
    }
    if (!selectedModule) {
      setShowToast(true)
      setErrorMessage("Please Select a Module first");
      return;
    }
    let operation = "ADD";
    if (selectedAuthApi.id) { operation = "UPDATE" }
    selectedAuthApi.tags = "auth";
    e.preventDefault();
    await appendToAuthApi(
      selectedAuthApi,
      operation === "UPDATE" ? true : false,
      projectName,
      selectedModule.id
    );
    fetchServiceList()
  }

  useEffect(() => {
    fetchServiceList();
  }, [fetchServiceList]);

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

  const saveTitle = async (oldTitle, moduleId) => {
    if (oldTitle !== newModuleTitle) {
      const result = await editModuleName(projectName, moduleId, { title: newModuleTitle })
      if (result.message) {
        setShowToast(true);
        setErrorMessage(result.message);
      }
      fetchServiceList();
    }
    setEditingModule(null);
  };

  const cancelEditing = () => {
    setEditingModule(null);
    setNewModuleTitle("");
  };
  const handleModuleSelect = (event) => {
    const selectedOption = event.target.selectedOptions[0];
    const moduleName = selectedOption.dataset.name;
    const moduleId = selectedOption.dataset.id;
    setSelectedModule({ "name": moduleName, "id": moduleId });
    setShowDropdown(false);
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
                  className="mx-1 mt-4"
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                  alt="add"
                  style={{ cursor: "pointer" }}
                  onClick={() => { setView("TEST"); setSelectedApi({}); setSelectedModule({}) }}
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
                                  saveTitle(folder.title, folder.subfolder);
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
                      <img src={edit} alt="edit" height={30} width={15} onClick={() => {
                        startEditing(folder.title);
                      }} />
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
                                          setSelectedModule({ "name": folder.title, "id": folder.subfolder, "filename": service.filename, "serviceId": value.id })
                                          setSelectedApi(value);
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
                onClick={() => { setView("AUTH_API"); setSelectedAuthApi({}); setSelectedModule(null); }}
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
                                    setSelectedModule({ "name": module.title, "id": module.model_id, "filename": '', "serviceId": api.id })
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
                <div className="d-flex align-items-center">

                  <Form.Select
                    aria-label="Select Module"
                    className="rounded-0 mx-2 mt-3 text-white"
                    value={selectedModule ? selectedModule.name : ""}
                    style={{ "backgroundColor": "#6c757d", "border": "none", "color": "white" }}
                    onChange={handleModuleSelect}
                  >
                    <option value="" data-name="" data-id="">
                      Select Module
                    </option>
                    {apiList && apiList.length > 0 ? (
                      apiList.map((folder, index) => (
                        <option
                          className="text-white"
                          key={index}
                          value={folder.title}
                          data-name={folder.title}
                          data-id={folder.subfolder}
                        >
                          {folder.title}
                        </option>
                      ))
                    ) : (
                      <option value="" data-name="" data-id="">
                        No modules available
                      </option>
                    )}
                  </Form.Select>
                  <Button
                    variant="secondary"
                    className="mt-3 rounded-0 mx-3"
                    onClick={onSubmit}
                  >
                    Submit
                  </Button>
                </div>
              </div>
              <GeneralSettingsCard
                selectedServiceInfo={selectedModule}
                settings={selectedApi}
                onChange={onApiModelChange}
                isAuthApi={false}
                onSuccessfulTransfer={() => { fetchServiceList(); setErrorMessage("Function Transferred Successfully"); setShowToast(true) }}
              />
              <RequestSettings
                moduleId={selectedModule && selectedModule.id}
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
                // schemaList={schemaList}
                moduleId={selectedModule && selectedModule.id}
                isAuthApi={false}
                title="Response Settings"
                responseType="response"
              />
            </>
          ) : view === "AUTH_API" ? (
            <>
              <div className="d-flex justify-content-between">
                <h5 className="text-white mt-4">AUTH API Configuration</h5>
                <div className="d-flex align-items-center">
                  <Form.Select
                    aria-label="Select Module"
                    className="rounded-0 mx-2 mt-3 text-white"
                    value={selectedModule ? selectedModule.name : ""}
                    style={{ "backgroundColor": "#6c757d", "border": "none", "color": "white" }}
                    onChange={handleModuleSelect}
                  >
                    <option value="" data-name="" data-id="">
                      Select Module
                    </option>
                    {authApiList && authApiList.length > 0 ? (
                      authApiList.map((folder, index) => (
                        <option
                          className="text-white"
                          key={index}
                          value={folder.title}
                          data-name={folder.title}
                          data-id={folder.model_id}
                        >
                          {folder.title}
                        </option>
                      ))
                    ) : (
                      <option value="" data-name="" data-id="">
                        No modules available
                      </option>
                    )}
                  </Form.Select>
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
                  requestData={selectedAuthApi.request ? selectedAuthApi.request : {}}
                  onChange={onAuthApiModelChange}
                  apiData={selectedAuthApi}
                  isAuthApi={true}
                  title="Request Settings"
                  requestType="request"
                  moduleId={selectedModule && selectedModule.id}
                />
                <ResponseSettings
                  responseData={selectedAuthApi.response ? selectedAuthApi.response : []}
                  onChange={onAuthApiModelChange}
                  // schemaList={schemaList}
                  moduleId={selectedModule && selectedModule.id}
                  isAuthApi={true}
                  title="Response Settings"
                  responseType="response"

                />
              </div>

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
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

export default Test;
