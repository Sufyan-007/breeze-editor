import React, { useState, useRef, useEffect } from "react";
import { Button, Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import ServiceList from "./ServiceList";
import AuthApiList from "./AuthApiList";
import EditAuthFunction from "./EditAuthFunction";
import EditServiceFuntion from "./EditServiceFunction";
import { useParams } from "react-router";
import { generateIntermediates } from '../../services/IntermediatesService'

export default function Root() {
  const [view, setView] = useState("LIST_SERVICE");
  const [selectedServiceInfo, setSelectedServiceInfo] = useState({});
  const [selectedAuthServiceId, setSelectedAuthServiceId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputYAML = useRef(null);
  const fileInputPostman = useRef(null);
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

  const handleUpload = async (event, fileType) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await generateIntermediates(fileType,appName.projectName,formData)
      if (response.ok) {
        setView("LIST_SERVICE");
      } else {
        throw new Error("Upload failed. Check server logs for details.");
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  function openFileInput(fileType) {
    if (fileType === "yaml") {
      fileInputYAML.current.click();
    } else if (fileType === "postman") {
      fileInputPostman.current.click();
    }
  }

  return (
    <>
      <div
        className="container-fluid d-flex flex-column"
        style={{ width: "100%" }}>
        <Navbar
          variant="dark"
          style={{ backgroundColor: "#303033" }}
          className="justify-content-end">
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
                <NavDropdown
                  title="Upload"
                  id="basic-nav-dropdown"
                  className="mx-3">
                  <NavDropdown.Item onClick={() => openFileInput("yaml")}>
                    Upload YAML
                  </NavDropdown.Item>
                  <input
                    ref={fileInputYAML}
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleUpload(e, "yml")}
                    accept=".yaml,.yml"
                  />
                  <NavDropdown.Item onClick={() => openFileInput("postman")}>
                    Upload Postman Collection
                  </NavDropdown.Item>
                  <input
                    ref={fileInputPostman}
                    type="file"
                    style={{ display: "none" }}
                    onChange={(e) => handleUpload(e, "postman")}
                    accept=".json"
                  />
                </NavDropdown>
                <Nav.Link
                  onClick={() => {
                    setView("AUTH_API_LIST");
                  }}
                  className="mx-3">
                  Authentication Config
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div
          className="row flex-grow-1 overflow-hidden  "
          style={{ backgroundColor: "#303033" }}>
          {view === "LIST_SERVICE" ? (
            <ServiceList
              onEditService={onEditService}
              errorMessage={errorMessage}
              onAddService={onAddService}></ServiceList>
          ) : view === "AUTH_API_LIST" ? (
            <AuthApiList onEditAuthService={onEditAuthService} onAddAuthService = {onAddAuthService}></AuthApiList>
          ) : view === "EDIT_AUTH_FUNCTION" ? (
            <EditAuthFunction
              selectedAuthServiceId={selectedAuthServiceId}
              onClose={() => {
                setView("AUTH_API_LIST");
              }}></EditAuthFunction>
          ) : view === "EDIT_SERVICE_FUNCTION" ? (
            <EditServiceFuntion
              selectedServiceInfo={selectedServiceInfo}
              onClose={() => setView("LIST_SERVICE")}></EditServiceFuntion>
          ) : null}
        </div>
      </div>
    </>
  );
}
