import React, { useState, useEffect } from 'react';
import { useLoaderData } from "react-router";
import { useParams } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { getAllConfigs } from "../services/ConfigService";
import { setReducerConfig, setReduxStoreConfig } from "../reducers/ReduxConfigReducer";
import { setServiceConfig } from "../reducers/ServiceConfigReducer";
import { setRouterConfig } from "../reducers/RouterConfigReducer";
import { setConfig } from "../reducers/ConfigReducer";
import { router } from '../App';
//components
import Navbar from "./Navbar";
import ReduxConfig from "./ReduxConfig";
import { ServicePage } from "./ServicePage";
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
import services from "../assets/icons/services.svg";
import config from "../assets/icons/config.svg";
import constants from "../assets/icons/constants.svg";
import apps from "../assets/icons/apps.svg";
import ProjectSidebar from './ProjectSidebar';
import Settings from './Settings';
import Styles from './Styles';
import Code from './Code';
import ThirdPartyApp from './ThirdPartyApp';

export default function ProjectPage() {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [tagSelection, setSelection] = useState(0);
    const highlightedStyle = { backgroundColor: "#303033" };
    const allConfig = useLoaderData();
    const dispatch = useDispatch();
    const {projectName} = useParams();
    const [projectNameFromParams, setProjectName] = useState(projectName);

    useEffect(() => {
        console.log(allConfig)
        dispatch(setReducerConfig(allConfig.reducerConfig));
        dispatch(setReduxStoreConfig(allConfig.reduxStoreConfig));
        dispatch(setServiceConfig(allConfig.serviceConfig));
        dispatch(setRouterConfig(allConfig.routerConfig));
        dispatch(setConfig({...allConfig.componentConfig,port:allConfig.port}));
    }, [allConfig, dispatch]);

    const sidebarItems = [
        { id: 0, name: "Home", icon: home },
        { id: 1, name: "Pages", icon: pages },
        { id: 2, name: "Routing", icon: routing },
        { id: 3, name: "Services", icon: services },
        { id: 4, name: "Constants", icon: constants }, 
        { id: 5, name: "Styles", icon: styles }, 
        { id: 6, name: "Code", icon: code },
        { id: 7, name: "Third-party App", icon: apps },
        { id: 8, name: "Config", icon: config }, 
        { id: 9, name: "Settings", icon: settings }, 

    ];

    const components = [
        <ProjectHome />,
        <ProjectComponents project = {projectName} />,
        <ProjectRouting />,
        <ServicePage />,
        <ReduxConfig />,
        <Styles />,
        <Code />,
        <ThirdPartyApp />,
        <Settings projectName = {projectNameFromParams} changeProjectName = {setProjectName} />,
        <Settings projectName = {projectNameFromParams} changeProjectName = {setProjectName} />
    ];

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            <Navbar leftContent={
                <div className=' d-flex'>
                    <div className=' d-flex align-items-center text-white me-3'>
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