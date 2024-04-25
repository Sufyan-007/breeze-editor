import { useLoaderData, useParams } from "react-router";
import Navbar from "../Navbar";
import code from "../../assets/icons/code.svg";
import variables from "../../assets/icons/variables.svg";
import functions from "../../assets/icons/functions.svg";
import cycle from "../../assets/icons/cycle.svg";
import home from "../../assets/icons/home.svg";
import styles from "../../assets/icons/styles.svg";
import pages from "../../assets/icons/pages.svg";
import routing from "../../assets/icons/routing.svg";
import settings from "../../assets/icons/settings.svg";
import services from "../../assets/icons/services.svg";
import constants from "../../assets/icons/constants.svg";
import apps from "../../assets/icons/apps.svg";

import {
  getComponentConfig,
  getRunningPort,
} from "../../services/ConfigService";
import { useState } from "react";
import ProjectSidebar from "../ProjectSidebar";
import HtmlSection from "./HtmlSection";
import StateVarsSection from "./StateVarsSection";
import LifeCycleSection from "./LifeCycleSection";
import FunctionSection from "./FunctionSection";

const sidebarItems = [
  { id: 0, name: "Home", icon: home, path: "" },
  { id: 1, name: "Pages", icon: pages, path: "pages" },
  { id: 2, name: "Routing", icon: routing, path: "routing" },
  { id: 3, name: "Services", icon: services, path: "services" },
  { id: 4, name: "Constants", icon: constants, path: "constants" },
  { id: 5, name: "Styles", icon: styles, path: "styles" },
  { id: 6, name: "Code", icon: code, path: "code" },
  { id: 7, name: "Third-party App", icon: apps, path: "apps" },
  { id: 8, name: "Settings", icon: settings, path: "settings" },
];

const menu = [
  { id: 0, name: "Html Tree", icon: code },
  { id: 1, name: "Variables", icon: variables },
  { id: 2, name: "Functions", icon: functions },
  { id: 3, name: "Life Cycle", icon: cycle },
];

export default function ComponentConfigPage() {
  const componentConfig = useLoaderData();
  console.log(componentConfig);
  const { projectName, componentName } = useParams();
  const [selectedItem, setSelectedItem] = useState(0);
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const highlightedStyle = { backgroundColor: "#303033" };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  const components = [
    <HtmlSection config={componentConfig} />,
    <StateVarsSection />,
    <FunctionSection />,
    <LifeCycleSection />,
  ];

  return (
    <div className="container-fluid vh-100 d-flex flex-column">
      <Navbar
        leftContent={
          <div className=" d-flex">
            <div className=" d-flex align-items-center text-white me-3">
              {projectName + " - " + componentName}
            </div>
          </div>
        }
      />

      <div className="row d-flex no-wrap h-100">
        <div className="col-auto px-0">
          <ProjectSidebar
            isSidebarExpanded={isSidebarExpanded}
            sidebarItems={sidebarItems}
            tagSelection={selectedItem}
            setSelection={setSelectedItem}
            toggleSidebar={toggleSidebar}
            highlightedStyle={highlightedStyle}
          />
        </div>
        <div className="col px-0">
          <div className="row mx-0 bg-dark p-1">
            <div className="d-flex justify-content-start">
              {menu.map((item, index) => (
                <button
                  key={item.id}
                  className={`btn ${
                    index === selectedMenu
                      ? "btn-outline-secondary border-bottom btn-sm"
                      : "btn-outline-secondary btn-sm"
                  }`}
                  onClick={() => setSelectedMenu(index)}
                  style={{ marginRight: 10, borderRadius: 0 }}
                >
                  <img
                    src={item.icon}
                    alt={item.name}
                    style={{ height: 20, marginRight: 5 }}
                  />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          <div className="row mx-0">
            <div className="col">{components[selectedMenu]}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function configLoader({ params }) {
  const projectName = params.projectName;
  const componentName = params.componentName;
  console.log("Loading component ", projectName, componentName);
  const config = await getComponentConfig(projectName, componentName);
  const port = await getRunningPort(projectName);
  config["port"] = port;
  return config;
}
