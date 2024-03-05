import Navbar from "./Navbar";
import home from "../assets/icons/home.svg"
import code from "../assets/icons/code.svg"
import pages from "../assets/icons/pages.svg"
import redux from "../assets/icons/redux.svg"
import routing from "../assets/icons/routing.svg"
import { useEffect, useState } from "react";
import ProjectHome from "./ProjectHome";
import ProjectComponents from "./ProjectComponents";
import { setReducerConfig,setReduxStoreConfig } from "../reducers/ReduxConfigReducer";
import { setServiceConfig } from "../reducers/ServiceConfigReducer";
import ProjectRouting from "./ProjectRouting";
import ReduxConfig from "./ReduxConfig";
import { ServicePage } from "./ServicePage";
import { useLoaderData } from "react-router";
import { getAllConfigs } from "../services/ConfigService";
import { useDispatch } from "react-redux";
import { setRouterConfig } from "../reducers/RouterConfigReducer";

export default function ProjectPage(){
    const [tagSelection,setSelection] = useState(0)
    const highlightedStyle={ backgroundColor: "#303033"}
    const allConfig= useLoaderData()
    const dispatch = useDispatch()
    

    useEffect(() =>{
        dispatch(setReducerConfig(allConfig.reducerConfig))
        dispatch(setReduxStoreConfig(allConfig.reduxStoreConfig))
        dispatch(setServiceConfig(allConfig.serviceConfig))
        dispatch(setRouterConfig(allConfig.reducerConfig))
    },[allConfig,dispatch])

    return (
        <div className=" container-fluid vh-100 d-flex flex-column">
            <Navbar  />
            <div className="row flex-grow-1">
                <div className="col" style={{maxWidth:"3rem",backgroundColor: "#151518"}}>
                    <div className="row   py-2" onClick={()=>setSelection(0)} style={tagSelection===0?highlightedStyle:{}}>
                        <img src={home} alt="" height={24}/>
                    </div>
                    <div className="row mt-1 py-2" onClick={()=>setSelection(1)} style={tagSelection===1?highlightedStyle:{}}>
                        <img src={pages} alt="" height={24}/>
                    </div>
                    <div className="row mt-1 py-2" onClick={()=>setSelection(2)} style={tagSelection===2?highlightedStyle:{}}>
                        <img src={routing} alt="" height={24}/>
                    </div>
                    <div className="row mt-1 py-2" onClick={()=>setSelection(3)} style={tagSelection===3?highlightedStyle:{}}>
                        <img src={redux} alt="" height={24}/>
                    </div>
                    <div className="row mt-1 py-2" onClick={()=>setSelection(4)} style={tagSelection===4?highlightedStyle:{}}>
                        <img src={code} alt="" height={24}/>
                    </div>
                </div>
                <div className="col m-0 p-0 " style={{ backgroundColor: "#303033"}}>
                    {tagSelection===0?<ProjectHome />:null}
                    {tagSelection===1?<ProjectComponents />:null}
                    {tagSelection===2?<ProjectRouting />:null}
                    {tagSelection===3?<ReduxConfig />:null}
                    {tagSelection===4?<ServicePage/>:null}
                </div>
            </div>
        </div>
    )
}

export async function projectLoader({params}){
    const projectName= params.projectName

    console.log("Loading project ", projectName)
    const config=await getAllConfigs(projectName)
    return config
}