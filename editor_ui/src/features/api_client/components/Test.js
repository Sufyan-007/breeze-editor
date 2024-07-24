import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Row, Toast, ToastContainer } from "react-bootstrap";
import { useParams } from "react-router";
import file from "../../../assets/icons/file.svg";
import edit from "../../../assets/icons/edit-icon.svg";
import Delete from "../../../assets/icons/delete-trash.svg";
import {
  fetchIntermediate,
  generateIntermediates,
} from "../services/IntermediateService";
import { getApiSchemaDetails } from "../services/ApiService";
import ImportApi from "./ImportApi";
import GeneralSettingsCard from "./views/EditView/GeneralSettingsCard";
import EditServiceFunction from "./EditServiceFunction";
import RequestSettings from "./views/EditView/RequestSettings";
import ResponseSettings from "./views/EditView/ResponseSettings";
import SchemaSettings from "../components/views/EditView/SchemaSettings";
import { addSchema, deleteSchema, editSchema } from "../services/SchemaService";
import { generateReactService } from "../services/GeneratedReactAppService";
function Test() {
  const [apiList, setApiList] = useState([]);
  const [schemaList, setSchemaList] = useState([]);
  const [selectedApi, setSelectedApi] = useState({});
  const [serviceErrors, setServiceErrors] = useState({});
  const [selectedSchemaDetails, setSelectedSchemaDetails] = useState({});
  const [selectedServiceInfo, setSelectedServiceInfo] = useState({});
  const { projectName } = useParams();
  const [expandedFilenames, setExpandedFilenames] = useState([]);
  const [view, setView] = useState("TEST");
  const [show, setShow] = useState(true);
  const [showToast, setShowToast] = useState(false);
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
  const onSubmit = () => {
    console.log(selectedApi, "selected api");
  };
  const handleSchemaChanges = async (operation, data) => {
    console.log(operation);
    if (operation === "add") {
      const result = await addSchema(projectName, data);
      if (result.data) {
        setShowToast(true);
        setErrorMessage(result.data);
        fetchSchemasList(null);
      } else {
        setErrorMessage(result.error);
      }
    } else if (operation === "edit") {
      const result = await editSchema(
        projectName,
        data,
        selectedSchemaDetails.name
      );
      if (result.data) {
        setShowToast(true);
        setErrorMessage(result.data);
        fetchSchemasList(null);
      } else {
        setErrorMessage(result.error);
      }
    }
  };
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
  const handleSchemaOperations = async (operation, schema, index) => {
    if (operation === "edit") {
      const details = await fetchSchemasList(schema);
      // console.log(details, "details");
      setSelectedSchemaDetails((state) => {
        state.name = schema;
        state.type = "object";
        state.details = details;
        return { ...state };
      });
      setView("SCHEMA");
    } else if (operation === "delete") {
      console.log(schema, index, "schema and index");
      const result = await deleteSchema(projectName, schema);
      if (result.message) {
        setShowToast(true);
        setErrorMessage(result.message);
        fetchSchemasList(null);
      }
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
                .filter((service) => service.filename !== "allSchemas")
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
                              className="m-1 d-flex justify-content-between">
                              <span
                                className={`overflow-auto ${
                                  value.errors.root_errors.length > 0
                                    ? "text-danger"
                                    : ""
                                }`}>
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
                                <img
                                  className="mx-1"
                                  width={20}
                                  height={20}
                                  src={edit}
                                  alt="edit"
                                  onClick={() => {
                                    setSelectedApi(value);
                                    setView("TEST");
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
          <div id="schemas-div" className="h-50 overflow-auto">
            <div className="text-white mt-2 d-flex justify-content-between">
              <strong>Schemas</strong>
              <img
                width="25"
                height="25"
                className="mx-1"
                src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                alt="add--v1"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedSchemaDetails({
                    id: "",
                    type: "",
                    details: {
                      type: "object",
                      properties: {},
                      required: [],
                      name: "",
                    },
                  });
                  setView("SCHEMA");
                }}
              />
            </div>
            {schemaList.length > 0 ? (
              <div>
                {schemaList.map((schema, index) => (
                  <div
                    key={index}
                    className="text-white mt-2 d-flex justify-content-between">
                    <span className="overflow-auto">{schema.name}</span>
                    <div className="d-flex">
                      <img
                        src={edit}
                        alt="edit"
                        height={20}
                        width={20}
                        style={{ cursor: "pointer" }}
                        className="mx-1"
                        onClick={() =>
                          handleSchemaOperations("edit", schema.id, null)
                        }
                      />
                      <img
                        src={Delete}
                        alt="delete"
                        height={20}
                        width={20}
                        style={{ cursor: "pointer" }}
                        className="mx-1"
                        onClick={() =>
                          handleSchemaOperations("delete", schema.id, index)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <h5 className="no-service text-white">No schemas found</h5>
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
                settings={selectedApi}
                onChange={onApiModelChange}
              />
              <RequestSettings
                requestData={selectedApi.request ? selectedApi.request : {}}
                onChange={onApiModelChange}
              />
              <ResponseSettings
                responseData={selectedApi.response ? selectedApi.response : []}
                onChange={onApiModelChange}
                schemaList={schemaList}
              />
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
          ) : view === "SCHEMA" ? (
            <>
              {console.log(selectedSchemaDetails)}
              <SchemaSettings
                key={selectedSchemaDetails.name}
                schemaId={selectedSchemaDetails.name}
                schemaData={selectedSchemaDetails.details}
                onChange={handleSchemaChanges}
                availableSchemas={schemaList}
              />
            </>
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

export default Test;
