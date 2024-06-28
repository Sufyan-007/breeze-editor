import React, { useCallback, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useParams } from "react-router";
import file from "../../../assets/icons/file.svg";
import edit from "../../../assets/icons/edit-icon.svg";
import {
  fetchIntermediate,
  generateIntermediates,
} from "../services/IntermediateService";
import ImportApi from "./ImportApi";
import GeneralSettingsCard from "./GeneralSettingsCard";
import RequestSettings from "./RequestSettings";
import ResponseSettings from "./ResponseSettings";

function Test() {
  const [apiList, setApiList] = useState([]);
  const [selectedApi, setSelectedApi] = useState({});
  const { projectName } = useParams();
  const [expandedFilenames, setExpandedFilenames] = useState([]);
  const [view, setView] = useState("TEST");
  const [show, setShow] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchServiceList = useCallback(async () => {
    try {
      const result = await fetchIntermediate(projectName);
      setApiList(result["files_with_apis"]);
    } catch (error) {
      console.error("Error generating react service:", error);
    }
  }, [projectName]);

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
      if (response) {
        fetchServiceList();
        setShow(false);
        setView("TEST");
        event.target.value = "";
      } else {
        throw new Error("Upload failed. Check server logs for details.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

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

  return (
    <div className="container-fluid h-100">
      <Row className="h-100">
        <Col
          sm={2}
          style={{
            backgroundColor: "#212529",
            borderRight: "1px solid rgba(128, 128, 128, 0.5)",
          }}
          className="h-100">
          <div className="d-flex justify-content-between mb-2">
            <span style={{ color: "white" }} className="mt-4">
              <strong> Services</strong>
            </span>
            <div>
              <img
                width="25"
                height="25"
                className="mx-1 mt-4"
                src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
                alt="add--v1"
                style={{ cursor: "pointer" }}
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

          {apiList.length > 0 ? (
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
                    <img src={file} height={15} width={15} alt="file" />
                    <span className="mx-2">{service.filename}</span>
                  </div>
                  {expandedFilenames.includes(service.filename) && (
                    <div
                      className="text-white mx-4"
                      style={{ cursor: "pointer", backgroundColor: "#212529" }}>
                      {Object.keys(service.apis).length > 0 ? (
                        Object.entries(service.apis).map(([key, value]) => (
                          <div
                            key={key}
                            className="m-2 d-flex justify-content-between">
                            {value.operation_id}
                            <div id="actions-div" className="d-flex">
                              <img
                                className="mx-1"
                                width="15"
                                height="15"
                                src="https://img.icons8.com/ios-filled/50/FFFFFF/test-passed.png"
                                alt="test-passed"
                              />
                              <img
                                className="mx-1"
                                width={15}
                                height={15}
                                src={edit}
                                alt="edit"
                                onClick={()=> setSelectedApi(value)}
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
        </Col>
        <Col sm={10} className="h-100" style={{ backgroundColor: "#212529" }}>
          {view === "TEST" ? (
            <>
              <h5 className="text-white mt-4">
                Service Function Configuration
              </h5>
              <GeneralSettingsCard settings={selectedApi} onChange={onApiModelChange} />
              <RequestSettings request={selectedApi.request ? selectedApi.request : {} }  onChange={onApiModelChange} />
              {/* <ResponseSettings /> */}
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
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

export default Test;
