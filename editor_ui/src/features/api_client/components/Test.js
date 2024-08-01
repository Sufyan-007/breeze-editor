import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Toast,
  ToastContainer,
} from "react-bootstrap";
import { useParams } from "react-router";
import file from "../../../assets/icons/file.svg";
// import edit from "../../../assets/icons/edit-icon.svg";
import Delete from "../../../assets/icons/delete-trash.svg";
import {
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
  const [schemaList, setSchemaList] = useState([]);
  const [selectedApi, setSelectedApi] = useState({});
  const [selectedAuthApi, setSelectedAuthApi] = useState({});
  const [selectedServiceInfo, setSelectedServiceInfo] = useState({});
  const { projectName } = useParams();
  const [expandedFilenames, setExpandedFilenames] = useState([]);
  const [view, setView] = useState("TEST");
  const [show, setShow] = useState(true);
  const [showToast, setShowToast] = useState(false);
  // const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchServiceList = useCallback(async () => {
    try {
      const result = await fetchIntermediate(projectName);
      const fetchedApiList = result["files_with_apis"];
      console.log(fetchedApiList, "fetched");
      setApiList(fetchedApiList);

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
  const generateService = async (filename) => {
    try {
      const result = await generateReactService(projectName, filename);
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
    console.log(selectedApi, "selected api");
    console.log(selectedServiceInfo, "selected service info");
    let operation = "ADD";
    if (selectedApi.id) { operation = "UPDATE" }
    e.preventDefault();
    await modifyApiConfig(
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
              apiList
                .filter(
                  (service) =>
                    service.filename !== "allSchemas" &&
                    service.filename !== "auth"
                )
                .map((service, index) => (
                  <div key={index} className="mb-2">
                    <div
                      className="mb-2 p-1"
                      onClick={() => toggleExpand(service.filename)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: expandedFilenames.includes(
                          service.filename
                        )
                          ? "#303033"
                          : "#212529",
                        color: expandedFilenames.includes(service.filename)
                          ? "white"
                          : "white",
                      }}>
                      <div className="d-flex justify-content-between">
                        <div>
                          <img src={file} height={15} width={15} alt="file" />
                          <span className="mx-2">{service.filename}</span>
                          {service.errors && service.errors.length > 0 && (
                            <i
                              class="bi bi-exclamation-circle"
                              style={{ color: "red" }}></i>
                          )}
                        </div>
                        <img
                          onClick={() => generateService(service.filename)}
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
                        }}>
                        {Object.keys(service.apis).length > 0 ? (
                          Object.entries(service.apis).map(([key, value]) => (
                            <div
                              key={key}
                              className="m-1 d-flex justify-content-between"
                            // onClick={() => {
                            //   setSelectedApi(value);
                            //   setView("TEST");
                            // }}
                            >
                              <span
                                className={`overflow-auto ${value.errors &&
                                  value.errors.root_errors.length > 0
                                  ? "text-danger"
                                  : ""
                                  }`}
                                onClick={() => {
                                  setSelectedApi(value);
                                  setSelectedServiceInfo({
                                    id: value.operation_id,
                                    filename: service.filename,
                                  });
                                  setView("TEST");
                                }} style={{ width: "90%" }}>
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
                                    });
                                    setView("TEST_API");
                                  }}
                                />
                                {/* <img
                                  className="mx-1"
                                  width={20}
                                  height={20}
                                  src={edit}
                                  alt="edit"
                                  onClick={() => {
                                    setSelectedApi(value);
                                    setView("TEST");
                                  }}
                                /> */}
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
            {apiList && apiList.length > 0 ? (
              apiList
                .filter(
                  (service) =>
                    service.filename !== "allSchemas" &&
                    service.filename === "auth"
                )
                .map((service, index) => (
                  <div key={index} className="my-2">
                    <div
                      className="mb-2 p-1"
                      onClick={() => toggleExpand(service.filename)}
                      style={{
                        cursor: "pointer",
                        backgroundColor: expandedFilenames.includes(
                          service.filename
                        )
                          ? "#303033"
                          : "#212529",
                        color: expandedFilenames.includes(service.filename)
                          ? "white"
                          : "white",
                      }}>
                      <div className="d-flex justify-content-between">
                        <div>
                          <img src={file} height={15} width={15} alt="file" />
                          <span className="mx-2">{service.filename}</span>
                          {service.errors && service.errors.length > 0 && (
                            <i
                              class="bi bi-exclamation-circle"
                              style={{ color: "red" }}></i>
                          )}
                        </div>
                        <img
                          onClick={() => generateService(service.filename)}
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
                        }}>
                        {Object.keys(service.apis).length > 0 ? (
                          Object.entries(service.apis).map(([key, value]) => (
                            <div
                              key={key}
                              className="m-1 d-flex justify-content-between">
                              <span
                                className={`overflow-auto ${value.errors &&
                                  value.errors.root_errors.length > 0
                                  ? "text-danger"
                                  : ""
                                  }`}
                                onClick={() => {
                                  // setSelectedApi(value);
                                  setSelectedAuthApi(value)
                                  // setView("TEST");
                                  setView("AUTH_API");
                                }} style={{ width: "90%" }}>
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
                                    });
                                    setView("TEST_API");
                                  }}
                                />
                                {/* <img
                                  className="mx-1"
                                  width={20}
                                  height={20}
                                  src={edit}
                                  alt="edit"
                                  onClick={() => {
                                    setSelectedApi(value);
                                    // setView("TEST");
                                    setView("AUTH_API");
                                  }}
                                /> */}
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

              {/* <Row
                className="mt-3 text-white "
                style={{ backgroundColor: "#303033" }}>
                <Col sm={2}>
                  <Form.Label className="text-white mt-1">
                    Is Authentication Api ?
                  </Form.Label>
                </Col>
                <Col sm={10}>
                  <Form.Check
                    className="mt-1"
                    type="checkbox"
                    checked={selectedApi.is_authentication_api}
                    onChange={(e) => {
                      // handleModalChange("AUTH_API", e.target.checked);
                      // setShowModal(!showModal)
                      onApiModelChange("is_authentication_api", e.target.checked);
                      setView("AUTH_API");
                    }}
                  />
                </Col>
              </Row> */}
              <GeneralSettingsCard
                settings={selectedApi}
                onChange={onApiModelChange}
                isAuthApi={false}
              />
              <RequestSettings
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
