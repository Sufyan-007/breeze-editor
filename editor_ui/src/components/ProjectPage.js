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
import ServicePage from "./Services/ServicePage";
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
import ServiceGeneralSetting from "./Services/ServiceGeneralSetting";
import Custom from "./Services/Custom";
import ServiceLists from "./Services/ServiceList";
export default function ProjectPage() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [tagSelection, setSelection] = useState(0);
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
    <ServiceGeneralSetting />,
    <ReduxConfig />,
    //rest to be added
  ];
  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };
  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <Navbar
        leftContent={
          <button
            className="btn btn-outlined"
            style={{ color: "white" }}
            onClick={() => router.navigate("/")}
          >
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
            </Col>
            {tagSelection === 3 && (
              <Col sm={11}>
              </Col>
            )}
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