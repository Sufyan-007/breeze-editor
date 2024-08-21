import { useLoaderData, useParams } from "react-router";
import Navbar from "../Navbar";
import code from "../../assets/icons/code.svg";
import home from "../../assets/icons/home.svg";
import styles from "../../assets/icons/styles.svg";
import pages from "../../assets/icons/pages.svg";
import routing from "../../assets/icons/routing.svg";
import settings from "../../assets/icons/settings.svg";
import services from "../../assets/icons/services.svg";
import constants from "../../assets/icons/constants.svg";
import upload from "../../assets/icons/upload.svg";

import apps from "../../assets/icons/apps.svg";
import folder from "../../assets/icons/folder.svg";

import {
  getComponentConfig,
  getRunningPort,
} from "../../services/ConfigService";
import { createContext, useMemo, useState } from "react";
import ProjectSidebar from "../ProjectSidebar";
import HtmlSection from "./HtmlSection/HtmlSection";
import SidebarService from "../../services/SidebarService";


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
  { id: 9, name: "Resources", icon: upload, path: "resources" },
  { id: 10, name: "Folder Structure", icon: folder , path:"folderstructure"} 
];

export const ComponentContext = createContext({
  componentConfig: null,
  setComponentConfig: null,
  componentName: null,
  sidebarService: null
})

export default function ComponentConfigPage() {
  const componentConfigInit = useLoaderData();
  const [ componentConfig, setComponentConfig] = useState(componentConfigInit)
  const { projectName, componentName } = useParams();
  const [selectedItem, setSelectedItem] = useState(1);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const sidebarService = useMemo(() => {
    return new SidebarService()
  }, [])
  
  const highlightedStyle = { backgroundColor: "#303033" };

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (

    <ComponentContext.Provider value={{ componentConfig, setComponentConfig, componentName, sidebarService }}>
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
        <div className="row flex-grow-1 overflow-hidden">
          <div className="col-auto h-100 px-0">
            <ProjectSidebar
              isSidebarExpanded={isSidebarExpanded}
              sidebarItems={sidebarItems}
              tagSelection={selectedItem}
              setSelection={setSelectedItem}
              toggleSidebar={toggleSidebar}
              highlightedStyle={highlightedStyle}
            />
          </div>
          <div className="col px-0 d-flex flex-column h-100">
            <div className="row mx-0 flex-grow-1">
              <div className="d-flex">{< HtmlSection />}</div>
            </div>
          </div>
        </div>
      </div>
    </ComponentContext.Provider>
  );
}

export async function configLoader({ params }) {
  const projectName = params.projectName;
  const componentName = params.componentName;
  const config = await getComponentConfig(projectName, componentName);
  const port = await getRunningPort(projectName);
  config["port"] = port;
  return config;
}
