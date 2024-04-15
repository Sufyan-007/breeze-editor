import React, { useState, useEffect, useRef } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getAllConfigs } from "../services/ConfigService";
import {
  setReducerConfig,
  setReduxStoreConfig,
} from "../reducers/ReduxConfigReducer";
import { setServiceConfig } from "../reducers/ServiceConfigReducer";
import { setRouterConfig } from "../reducers/RouterConfigReducer";
import { router } from "../App";
//components
import Navbar from "./Navbar";
import ReduxConfig from "./ReduxConfig";
import ServicePage from "./ServicePage";
import ProjectComponents from "./ProjectComponents";
import ProjectRouting from "./ProjectRouting";
import ProjectHome from "./ProjectHome";

//icons
import styles from "../assets/icons/styles.svg";
import home from "../assets/icons/home.svg";
import code from "../assets/icons/code.svg";
import pages from "../assets/icons/pages.svg";
import routing from "../assets/icons/routing.svg";
import settings from "../assets/icons/settings.svg";
import apps from "../assets/icons/apps.svg";
import ProjectSidebar from "./ProjectSidebar";
import { Col, Row } from "react-bootstrap";
import ServicePageNavbar from "./ServicePageNavbar";
import Custom from "./Custom";
import ServiceLists from "./ServiceList";

export default function ProjectPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [tagSelection, setSelection] = useState(0);
  const fileInputYAML = useRef(null); // this is created to reference the file input element .
  const fileInputPostman = useRef(null);
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [yamlApis, setYamlApis] = useState({}); // State to store the list of YAML APIs
  const [yamlUploaded, setYamlUploaded] = useState(false);
  const [postmanApis, setPostmanApis] = useState({}); //state to store the list of postman collection APis
  const [postmanUploaded, setPostmanUploaded] = useState(false);
  const [serviceListMode, setServiceListMode] = useState("Navbar");
  const [tagsList, setTagsList] = useState([]);
  // const [displayNav, setDisplayNav] = useState(false);
  const highlightedStyle = { backgroundColor: "#303033" };
  const allConfig = useLoaderData();
  const dispatch = useDispatch();
  const { projectName } = useParams();
  useEffect(() => {
    dispatch(setReducerConfig(allConfig.reducerConfig));
    dispatch(setReduxStoreConfig(allConfig.reduxStoreConfig));
    dispatch(setServiceConfig(allConfig.serviceConfig));
    dispatch(setRouterConfig(allConfig.reducerConfig));
  }, [allConfig, dispatch]);
 const navigate = useNavigate();
  const sidebarItems = [
    { id: 0, name: "Home", icon: home },
    { id: 1, name: "Pages", icon: pages },
    { id: 2, name: "Routing", icon: routing },
    { id: 3, name: "Services", icon: settings },
    { id: 4, name: "Constants", icon: pages }, //icon
    { id: 5, name: "Styles", icon: styles },
    { id: 6, name: "Code", icon: code },
    { id: 7, name: "Third-party App", icon: apps },
    { id: 8, name: "Config", icon: pages }, //icon
  ];

  const components = [
    <ProjectHome />,
    <ProjectComponents />,
    <ProjectRouting />,
    <ServicePage />,
    <ReduxConfig />,
    //rest to be added
  ];


  async function fileUpload(file, fileType) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      let apiUrl = "";
      if (fileType === "yaml") {
        apiUrl =
          "http://127.0.0.1:8000/api-client-generator/convert-starndard-json/openapi";
      } else if (fileType === "postman") {
        apiUrl =
          "http://127.0.0.1:8000/api-client-generator/convert-starndard-json/postman";
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();

        if (fileType === "yaml") {
          setYamlApis(responseData);
          setYamlUploaded(true);
          
        } else if (fileType === "postman") {
          setPostmanApis(responseData);
          setPostmanUploaded(true);
        }
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (error) {
      alert("Failed to load file, check file syntax");
      console.error(error);
    }
  }

  function openFileInput(fileType) {
    if (fileType === "yaml") {
      fileInputYAML.current.click();
      setShowCustomPanel(false);
      setPostmanUploaded(false);
    } else if (fileType === "postman") {
      fileInputPostman.current.click();
      setShowCustomPanel(false);
      setYamlUploaded(false);
    }
  }

  const handleCustomButtonClick = () => {
    setShowCustomPanel((prevState) => !prevState);
    setYamlUploaded(false);
    setPostmanUploaded(false);
  };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  console.log(yamlApis,"yamlapis");
  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <Navbar
        leftContent={
          <button
            className="btn btn-outlined"
            style={{ color: "white" }}
            onClick={() => router.navigate("/")}>
            All Apps
          </button>
        }
      />
      <div className="row flex-grow-1">
        <ProjectSidebar
          isSidebarExpanded={isSidebarExpanded}
          sidebarItems={sidebarItems}
          tagSelection={tagSelection}
          setSelection={setSelection}
          toggleSidebar={toggleSidebar}
          highlightedStyle={highlightedStyle}
        />
        <div className="col m-0 p-0" style={{ backgroundColor: "#303033" }}>
          <Row>
            <Col sm={1}>
              {" "}
              <h4 className="text-white m-2">{projectName}</h4>
            </Col>
            {tagSelection === 3 && (
              <Col sm={11}>
                <ServicePageNavbar
                  openFileInput={openFileInput}
                  fileInputYAML={fileInputYAML}
                  fileInputPostman={fileInputPostman}
                  fileUpload={fileUpload}
                  yamlUploaded={yamlUploaded}
                  handleCustomButtonClick={handleCustomButtonClick}
                  serviceMode = {"Navbar"}
                />
              </Col>
            )}
            </Row>
            <Row>
              <div >
            {showCustomPanel && (
              <div className="custom-panel-container">
                <Custom />
              </div>
            )}
            {yamlUploaded && (
              <div>
                <ServiceLists apis={yamlApis} tagsList={["tag1","tag2"]} />
              </div>
            )}
            {postmanUploaded && (
              <div>
                <ServiceLists apis={postmanApis} serviceMode={"Upload"} />
              </div>
            )}
          </div>
          </Row>
          

          {tagSelection !== 3 && (
            <hr className="mt-0" style={{ color: "white" }} />
          )}
          {components[tagSelection]}
        </div>
      </div>
    </div>
  );
}

export async function projectLoader({ params }) {
  const projectName = params.projectName;

  console.log("Loading project ", projectName);
  const config = await getAllConfigs(projectName);
  return config;
}
