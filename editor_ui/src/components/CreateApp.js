
import React, {  useState } from "react";
import { createNewProject } from "../services/ProjectService";
import { router } from "../App";
import loadingIcon from "../assets/icons/loading.gif"

export default function CreateApp({ ...props }) {
    const [projectData, setProjectData] = useState({
        name: "",
        description: "",
        author: "",
        defaultComponent: "Main",
        framework: "",
        buildTool: "",
        language: "",
        styling: "",
        path: ""
    });
    const [ loading, setLoading] = useState(false)
    const [firstForm, setFirstForm] = useState(true);


    function updateProjectData(key, value) {
        setProjectData(state => {
            return { ...state, [key]: value };
        })
    }
    function toggleFirstForm() {
        setFirstForm(state => {
            state = !state
            return state
        });
    }


    function createNewApp() {
        setLoading(true)
        createNewProject(projectData).then((response) => {
            alert("Project created successfully")
            router.navigate("/editor/" + response.name)
        })
    }


    return (
        <div
            className=" container-fluid d-flex flex-column  vh-100"
            style={{ background: 'linear-gradient(90deg, #103970 0%, #0b2850 100%)' }}
        >

            <div className="row my-4"></div>
            <div className="row flex-grow-1 ">
                <div className="col-10 d-flex flex-column offset-1 rounded-5"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                >
                    <div className="row flex-grow-1">

                        <div className="col-5">
                            <div className="row text-white h-100 align-items-center">
                                <div className=" text-center fs-1">
                                    Breeze
                                    <br />
                                    Studio
                                </div>

                            </div>
                        </div>
                        {firstForm ?
                            <div className="col mt-5 px-5">

                                <div className="row fs-2 text-white justify-content-around">
                                    Create New App
                                </div>
                                <div className="form ">
                                    <div className="form-floating mt-4 text-black-50">
                                        <input value={projectData.name} onChange={(event) => updateProjectData("name", event.target.value)} className="form-control"></input>
                                        <label>Project Name</label>
                                    </div>

                                    <div className="form-floating mt-4 text-black-50">
                                        <input value={projectData.author} onChange={(event) => updateProjectData("author", event.target.value)} className="form-control"></input>
                                        <label>Author</label>
                                    </div>
                                    <div className="form-floating mt-4 text-black-50">
                                        <textarea value={projectData.description} onChange={(event) => updateProjectData("description", event.target.value)} className="form-control" />
                                        <label>Description</label>
                                    </div>
                                    <div class="form-floating">
                                        <select class="form-select mt-4" value={projectData.framework} onChange={(event) => updateProjectData("framework", event.target.value)}>
                                            <option value="" hidden />
                                            <option value="react">React</option>
                                            {/* <option value="angular">Angular</option>
                                            <option value="vue">Vue</option> */}
                                        </select>
                                        <label >Project FrameWork</label>
                                    </div>
                                    <div className=" mt-4 text-end">
                                        <button className="btn btn-primary" onClick={toggleFirstForm}>
                                            Next
                                        </button>
                                    </div>

                                </div>
                            </div>
                            :
                            <div className="col mt-5 px-5">
                                <div className="row fs-2 text-white justify-content-around">
                                    Project Settings
                                </div>
                                <div className="form ">

                                    <div value={projectData.path} onChange={(event) => updateProjectData("path", event.target.value)} className="form-floating mt-4 text-black-50">
                                        <input className="form-control"></input>
                                        <label>Project Path</label>
                                    </div>
                                    <div class="form-floating">
                                        <select class="form-select mt-4" value={projectData.buildTool} onChange={(event) => updateProjectData("buildTool", event.target.value)} >
                                            <option value="" hidden />
                                            <option value="cra">Create React App</option>
                                            {/* <option value="vite">Vite</option> */}
                                        </select>
                                        <label >Project Build Tool</label>
                                    </div>
                                    <div class="form-floating">
                                        <select class="form-select mt-4" value={projectData.language} onChange={(event) => updateProjectData("language", event.target.value)} >
                                            <option value="" hidden />
                                            <option value="js">JavaScript</option>
                                            {/* <option value="ts">TypeScript</option> */}
                                        </select>
                                        <label >Language</label>
                                    </div>
                                    <div class="form-floating">
                                        <select class="form-select mt-4" value={projectData.styling} onChange={(event) => updateProjectData("styling", event.target.value)} >
                                            <option value="" hidden />
                                            <option value="bootstrap">BootStrap</option>
                                            {/* <option value="tailwind">Tailwild</option> */}
                                        </select>
                                        <label >Styling Tools</label>
                                    </div>
                                    <div className=" mt-4  ">
                                        <button className="btn btn-primary" onClick={toggleFirstForm}>
                                            Back
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-5 text-center">
                                    <button style={{width:'9rem'}} className=" btn btn-lg btn-success" disabled={loading} onClick={createNewApp}>
                                        {loading?
                                        <img height={26} src={loadingIcon} alt="loading" />
                                        :'Create App' 
                                        }
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <div className="row my-4"></div>
        </div>
    );
}