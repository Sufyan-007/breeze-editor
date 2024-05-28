import React, { useState } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import ServiceList from "./ServiceList";
import AuthApiList from "./AuthApiList";
import EditAuthFunction from "./EditAuthFunction";
// import EditServiceFuntion from "./EditServiceFunction";
// import "../../css/ServiceRoot.css";
import { useParams } from "react-router";
import { generateIntermediates } from "../../services/IntermediatesService";
import EditServiceFunctionNew from "./EditServiceFunctionNew";
import ImportApi from "./ImportApi";

export default function ApiClientRoot() {
  const [view, setView] = useState("LIST_SERVICE");
  const [selectedServiceInfo, setSelectedServiceInfo] = useState({});
  const [selectedAuthServiceId, setSelectedAuthServiceId] = useState(null);
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

  const onEditAuthService = (serviceId) => {
    setView("EDIT_AUTH_FUNCTION");
    setSelectedAuthServiceId(serviceId);
  };

  const onAddAuthService = () => {
    setView("EDIT_AUTH_FUNCTION");
    setSelectedAuthServiceId(null);
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
      <div className="container-fluid d-flex flex-column" style={{height:"100%"}}>
        <Navbar variant="dark" className="justify-content-end">
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
                {/* <Nav.Link
                  onClick={() => {
                    setView("AUTH_API_LIST");
                  }}
                  className="mx-3">
                  Authentication Config
                </Nav.Link> */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div className="row flex-grow-1 overflow-hidden" style={{height:"100%"}}>
          {view === "LIST_SERVICE" ? (
            <ServiceList
              onEditService={onEditService}
              errorMessage={errorMessage}
              onAddService={onAddService}
              uploadSuccess={uploadSuccess}
              setUpload={setUpload}></ServiceList>
          ) 
          // : view === "AUTH_API_LIST" ? (
          //   <AuthApiList
          //     onEditAuthService={onEditAuthService}
          //     onAddAuthService={onAddAuthService}></AuthApiList>
          // ) 
          // : view === "EDIT_AUTH_FUNCTION" ? (
          //   <EditAuthFunction
          //     selectedAuthServiceId={selectedAuthServiceId}
          //     onClose={() => {
          //       setView("AUTH_API_LIST");
          //     }}></EditAuthFunction>
          // )
           : view === "EDIT_SERVICE_FUNCTION" ? (
            // <EditServiceFuntion
            //   selectedServiceInfo={selectedServiceInfo}
            //   onClose={() => setView("LIST_SERVICE")}></EditServiceFuntion>
            <EditServiceFunctionNew selectedServiceInfo={selectedServiceInfo} onClose={()=> setView("LIST_SERVICE")}></EditServiceFunctionNew>
          ) 
           : view === "IMPORT_API" ? (
            <ImportApi
              show={true}
              onImport={handleUpload}
              onClose={() => {
                setView("LIST_SERVICE");
                setShow(!show);
              }}></ImportApi>
          ) : null}
        </div>
      </div>
    </>
  );
}
