import React, { useState, useRef, useEffect } from "react";
import { Button, Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import ServiceList from "./ServiceList";
import AuthenticationConfig from "./AuthenticationConfig";
import IntermediateFiles from "../IntermediateFiles";
import ServiceEdit from "./ServiceEdit";
import {
  fetchYamlApis,
  fetchPostmanApis,
} from "../../services/yamlPostmanService";
import { fetchIntermediate } from "../../services/IntermediatesService";
import ServiceGeneralSettingCss from "../../css/ServiceGeneralSetting.css";
import { useParams } from "react-router";

export default function ServiceGeneralSetting() {
  const fileInputYAML = useRef(null); // this is created to reference the file input element .
  const fileInputPostman = useRef(null);
  const [yamlApis, setYamlApis] = useState({}); // State to store the list of YAML APIs
  const [yamlUploaded, setYamlUploaded] = useState(false);
  const [postmanApis, setPostmanApis] = useState({}); //state to store the list of postman collection APis
  const [postmanUploaded, setPostmanUploaded] = useState(false);
  const [showServicesList, setShowServicesList] = useState(true);
  const [showAuthenticationConfig, setShowAuthenticationConfig] =
    useState(false);
  const [showIntermediateFiles, setShowIntermediateFiles] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedApi, setSelectedApi] = useState(null);
  const [fetchedIntermediates, setFetchedIntermediates] = useState([]);
  const appName = useParams();

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    try {
      const result = await fetchIntermediate("creator");
      setFetchedIntermediates(result.files_with_apis);
    } catch (error) {
      console.error("Error fetching intermediates:", error);
    }
  };
  const handleSelectedApi = (api) => {
    console.log("received api data ", api);
    setSelectedApi(api);
  };

  const handleEditModeChange = (value) => {
    console.log(value, "value of edit mode");
    setEditMode(value);
  };

  const handleClose = () => {
    setEditMode(false); // Set edit mode to false when editing is closed
    getServices();
  };
  async function fileUpload(file, fileType) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      let apiFunction;
      if (fileType === "yaml") {
        apiFunction = fetchYamlApis;
      } else if (fileType === "postman") {
        apiFunction = fetchPostmanApis;
      }
      const responseData = await apiFunction(formData, appName.projectName);

      if (fileType === "yaml") {
        setYamlApis(responseData);
        await getServices();
        setYamlUploaded(true);
        setShowServicesList(true);
        setEditMode(false);
        setShowAuthenticationConfig(false);
        setShowIntermediateFiles(false);
      } else if (fileType === "postman") {
        setPostmanApis(responseData);
        await getServices();
        setPostmanUploaded(true);
        setShowServicesList(true);
        setEditMode(false);
        setShowAuthenticationConfig(false);
        setShowIntermediateFiles(false);
      }
    } catch (error) {
      alert("Failed to load file, check file syntax");
      console.error(error);
    }
  }

  function openFileInput(fileType) {
    if (fileType === "yaml") {
      fileInputYAML.current.click();

      setPostmanUploaded(false);
    } else if (fileType === "postman") {
      fileInputPostman.current.click();
      setYamlUploaded(false);
    }
  }

  const toggleServicesList = () => {
    setShowServicesList(!showServicesList);
    setShowAuthenticationConfig(false);
    setEditMode(false);
    setShowIntermediateFiles(false);
  };
  const toggleAuthenticationConfig = () => {
    setShowAuthenticationConfig(!showAuthenticationConfig);
    setShowServicesList(false);
    setEditMode(false);
    setShowIntermediateFiles(false);
  };

  const toggleIntermediateFiles = () => {
    setShowIntermediateFiles(!showIntermediateFiles);
    setEditMode(false);
    setShowServicesList(false);
    setShowAuthenticationConfig(false);
  };

  return (
    <>
      <div className="container-fluid d-flex flex-column h-100  ">
        <Navbar
          variant="dark"
          style={{ backgroundColor: "#303033" }}
          className="justify-content-end"
        >
          <Container className="mx-0">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              id="basic-navbar-nav"
              className="justify-content-end"
            >
              <Nav>
                <Nav.Link onClick={toggleServicesList} className="mx-3">
                  Services
                </Nav.Link>

                <NavDropdown
                  title="Upload"
                  className="mx-3"
                  style={{ color: "white" }}
                >
                  <NavDropdown.Item onClick={() => openFileInput("yaml")}>
                    Upload Yaml
                  </NavDropdown.Item>
                  <input
                    ref={fileInputYAML}
                    type="file"
                    accept=".yaml, .yml"
                    hidden
                    onChange={(event) =>
                      fileUpload(event.target.files[0], "yaml")
                    }
                  />

                  <NavDropdown.Item onClick={() => openFileInput("postman")}>
                    Upload Postman Collection
                  </NavDropdown.Item>
                  <input
                    ref={fileInputPostman}
                    type="file"
                    accept=".json"
                    hidden
                    onChange={(event) =>
                      fileUpload(event.target.files[0], "postman")
                    }
                  />

                  {/* <NavDropdown.Item
                  onClick={() => props.handleCustomButtonClick()}
                >
                  Custom
                </NavDropdown.Item> */}
                </NavDropdown>
                <Nav.Link onClick={toggleAuthenticationConfig} className="mx-3">
                  Authentication Config
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <div
          className="row flex-grow-1 overflow-hidden  "
          style={{ backgroundColor: "#303033" }}
        >
          <div className=" overflow-y-auto h-100 fs-6 text-light">
            {showServicesList && !editMode && (
              <ServiceList
                apis={fetchedIntermediates}
                onEditClick={
                  showServicesList && !editMode ? handleEditModeChange : ""
                }
                onApiSelect={
                  showServicesList && !editMode ? handleSelectedApi : ""
                }
              />
            )}{" "}
            {/* Render ServiceLists only when not in edit mode */}
            {editMode && (
              <ServiceEdit
                dummyData={selectedApi}
                onClose={handleClose}
                editMode={editMode}
              />
            )}{" "}
            {/* Render ServiceEdit only when in edit mode */}
            {showAuthenticationConfig && <AuthenticationConfig />}
            {/* {showIntermediateFiles && <IntermediateFiles />} */}
          </div>
        </div>
      </div>
    </>
  );
}
