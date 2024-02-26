import React, { useState } from "react";
import { createNewProject } from "../services/ProjectService";
import { router } from "../App";

export default function CreateApp({ ...props }) {
    const [projectData, setProjectData] = useState({
        name: "",
        description: "",
        author: "",
        defaultComponent: "",
        path: ""
    });

    function updateProjectData(key, value) {
        setProjectData(state=>{
            return {...state,[key]: value};
        })
    }

    function updateDefaultComponent(defaultComponent){
        setProjectData(state=>{
            return {...state,defaultComponent}
        })
    }

    function  createNewApp(){
        createNewProject(projectData).then((response)=>{
            alert("Project created successfully")
            router.navigate("/editor/"+response.name)
        })
    }


    return (
        <div
            className=" container-fluid  vh-100"
        >
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 col-xxl-5">
                    <div className=" card bg-dark text-white">
                        <div className="card-body py-3 px-5 text-center">
                            <div className="mb-5 mt-4 pb-2">
                                <h2 className="fw-bold mb-1 text-uppercase">Create New App</h2>
                                <div className="form ">
                                    <div className="form-floating mt-3 text-black-50">
                                        <input value={projectData.name} onChange={(event)=>updateProjectData("name",event.target.value)} className="form-control"></input>
                                        <label>Project Name</label>
                                    </div>

                                    <div className="form-floating mt-3 text-black-50">
                                        <input value={projectData.description} onChange={(event)=>updateProjectData("description",event.target.value)} className="form-control"></input>
                                        <label>Description</label>
                                    </div>

                                    <div value={projectData.author} onChange={(event)=>updateProjectData("author",event.target.value)} className="form-floating mt-3 text-black-50">
                                        <input className="form-control"></input>
                                        <label>Author</label>
                                    </div>
                                    <div value={projectData.defaultComponent} onChange={(event)=>updateDefaultComponent(event.target.value)} className="form-floating mt-3 text-black-50">
                                        <input className="form-control"></input>
                                        <label>Default Component</label>
                                    </div>

                                    <div value={projectData.path} onChange={(event)=>updateProjectData("path",event.target.value)} className="form-floating mt-3 text-black-50">
                                        <input className="form-control"></input>
                                        <label>Path</label>
                                    </div>
                                    <button onClick={()=>createNewApp()} className="btn btn-primary mt-5 btn-lg px-5">
                                        Create
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className=""></div>
        </div>
    );
};

