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
import { setConfig } from "../reducers/ConfigReducer";
//components
import Navbar from "./Navbar";
import ReduxConfig from "./ReduxConfig";
import ProjectComponents from "./ProjectComponents";
import ProjectRouting from "./ProjectRouting";
import ProjectHome from "./ProjectHome";
import Root from "./ApiClient/Root";
//icons
import styles from "../assets/icons/styles.svg";
import home from "../assets/icons/home.svg";
import code from "../assets/icons/code.svg";
import pages from "../assets/icons/pages.svg";
import routing from "../assets/icons/routing.svg";
import settings from "../assets/icons/settings.svg";
import services from "../assets/icons/services.svg";
import constants from "../assets/icons/constants.svg";
import apps from "../assets/icons/apps.svg";
import ProjectSidebar from './ProjectSidebar';
import Settings from './Settings';
import Styles from './Styles';
import Code from './Code';
import ThirdPartyApp from './ThirdPartyApp';
import { router } from '../App';

export default function ProjectPage() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [tagSelection, setSelection] = useState(0);
    const highlightedStyle = { backgroundColor: "#303033" };
    const allConfig = useLoaderData();
    const dispatch = useDispatch();
    const {projectName} = useParams();

    useEffect(() => {
        console.log(allConfig)
        dispatch(setReducerConfig(allConfig.reducerConfig));
        dispatch(setReduxStoreConfig(allConfig.reduxStoreConfig));
        dispatch(setServiceConfig(allConfig.serviceConfig));
        dispatch(setRouterConfig(allConfig.routerConfig));
        dispatch(setConfig({...allConfig.componentConfig,port:allConfig.port}));
    }, [allConfig, dispatch]);

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

    const components = [
        <ProjectHome />,
        <ProjectComponents/>,
        <ProjectRouting />,
        <Root />,
        <ReduxConfig />,
        <Styles />,
        <Code />,
        <ThirdPartyApp />,
        <Settings />
    ];

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            <Navbar leftContent={
                <div className=' d-flex'>
                    <div className=' d-flex align-items-center text-white me-3'  onClick={() => { router.navigate(`/project/${projectName}`);}}>
                        {projectName}
                    </div>
                    {/* <button className="btn btn-outlined text-white-50" style={{ color: "white" }} onClick={() => router.navigate("/")}>
                        All Apps
                    </button> */}
                </div>
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
                <div className="col m-0 p-2" style={{ backgroundColor: "#303033" }}>
                    {components[tagSelection]}
                </div>
            </div>
        </div>
       );
}


export async function projectLoader({ params }) {
    const projectName = params.projectName

    console.log("Loading project ", projectName)
    const config = await getAllConfigs(projectName)
    return config
}
