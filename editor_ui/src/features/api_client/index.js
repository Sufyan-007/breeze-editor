import React, { useState } from "react";
import { Navbar, Nav, Container, Alert } from "react-bootstrap";
import ServiceList from "./components/ServiceList";
import { useParams } from "react-router";

import EditServiceFunction from "./components/EditServiceFunction";
import ImportApi from "./components/ImportApi";
import { generateIntermediates } from "./services/IntermediateService";
import Test from "./components/Test";

export default function ApiClient() {
  const [view, setView] = useState("TEST");
  const [selectedServiceInfo, setSelectedServiceInfo] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [show, setShow] = useState(true);
  const appName = useParams();
  const onEditService = (serviceInfo) => {
    setView("EDIT_SERVICE_FUNCTION");
    setSelectedServiceInfo(serviceInfo);
  };

  const onAddService = () => {
    setView("EDIT_SERVICE_FUNCTION");
    setSelectedServiceInfo({});
  };

  const setUpload = (value) => {
    setUploadSuccess(value);
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
        appName.projectName,
        formData
      );
      if (response) {
        setUploadSuccess(true);
        setShow(false);
        setView("LIST_SERVICE");
        event.target.value = "";
      } else {
        throw new Error("Upload failed. Check server logs for details.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <>
      {errorMessage && (
        <Alert>
          <div className="error-message">{errorMessage}</div>
        </Alert>
      )}
      <div
        className="container-fluid d-flex flex-column"
        style={{ height: "100%" }}>
        {/* <Navbar variant="dark" className="justify-content-end" >
          <Container className="mx-0">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end">
              <Nav>
                <Nav.Link
                  onClick={() => {
                    setView("LIST_SERVICE");
                  }}
                  className="mx-3">
                  Services
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    setView("IMPORT_API");
                  }}
                  className="mx-3">
                  Import Api
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    setView("TEST");
                  }}
                  className="mx-3">
                  TEST
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar> */}
        <div
          className="row flex-grow-1 overflow-hidden"
          style={{ height: "100%" }}>
          {view === "LIST_SERVICE" ? (
            <ServiceList
              onEditService={onEditService}
              errorMessage={errorMessage}
              onAddService={onAddService}
              uploadSuccess={uploadSuccess}
              setUpload={setUpload}></ServiceList>
          ) : view === "EDIT_SERVICE_FUNCTION" ? (
            <EditServiceFunction
              selectedServiceInfo={selectedServiceInfo}
              onClose={() => setView("LIST_SERVICE")}></EditServiceFunction>
          ) : view === "IMPORT_API" ? (
            <ImportApi
              show={true}
              onImport={handleUpload}
              onClose={() => {
                setView("LIST_SERVICE");
                setShow(!show);
              }}></ImportApi>
          ) : view === "TEST" ? (
            <Test />
          ) : null}
        </div>
      </div>
    </>
  );
}
