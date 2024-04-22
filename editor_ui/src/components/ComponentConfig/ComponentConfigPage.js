import { useLoaderData, useParams } from "react-router";
import Navbar from "../Navbar";


import code from "../../assets/icons/code.svg";
import variables from "../../assets/icons/variables.svg";
import functions from "../../assets/icons/functions.svg";
import cycle from "../../assets/icons/cycle.svg";

import { getComponentConfig, getRunningPort } from "../../services/ConfigService";
import { useState } from "react";
import ProjectSidebar from "../ProjectSidebar";
import HtmlSection from "./HtmlSection";
import StateVarsSection from "./StateVarsSection";
import LifeCycleSection from "./LifeCycleSection";
import FunctionSection from "./FunctionSection";



const sidebarItems = [
    { id: 0, name: "Html Tree", icon: code },
    { id: 1, name: "Variables", icon: variables },
    { id: 2, name: "Functions", icon: functions },
    { id: 3, name:"Life Cycle", icon: cycle}
]


export default function ComponentConfigPage() {
    const componentConfig = useLoaderData()
    console.log(componentConfig)
    const { projectName, componentName } = useParams();
    const [selectedItem, setSelectedItem] = useState(0)
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
    ]

    return (
        <div className="container-fluid vh-100 d-flex flex-column">
            <Navbar leftContent={
                <div className=' d-flex'>
                    <div className=' d-flex align-items-center text-white me-3'>
                        {projectName + " - " + componentName}
                    </div>
                </div>
            }
            />

            <div className="row  flex-grow-1">
                <ProjectSidebar
                    isSidebarExpanded={isSidebarExpanded}
                    sidebarItems={sidebarItems}
                    tagSelection={selectedItem}
                    setSelection={setSelectedItem}
                    toggleSidebar={toggleSidebar}
                    highlightedStyle={highlightedStyle}
                />
                <div className="col d-flex  " >
                    {components[selectedItem]}
                </div>
            </div>

        </div>
    )
}

export async function configLoader({ params }) {

    const projectName = params.projectName
    const componentName = params.componentName
    console.log("Loading component ", projectName, componentName)
    const config = await getComponentConfig(projectName, componentName)
    const port = await getRunningPort(projectName)
    config["port"] = port
    return config

}