import { router } from "../App";
import { Fragment, useEffect, useState } from "react";
import ProjectCards from "./ProjectCards";

export default function Main() {
    const [projects, setProjects] = useState()
    console.log(projects)

    useEffect(() => {
        const loadProjects = async () => {
            const projects = await (
                await fetch("http://localhost:8000/editor/all-projects")
            ).json();
            setProjects(projects)
        }
        loadProjects()
        console.log("In use Effect")
    }, [])

    return (
        <Fragment>
            {projects ?
                <div className="container-fluid vh-100 bg-dark-subtle">
                    <div className=" navbar row" style={{ backgroundColor: "#151518" }}>
                        <div className="container-fluid">
                            <div className=" navbar-brand text-white">
                                Breeze Studio
                            </div>
                            <div className="text-white">
                                <button className=" btn btn-secondary" onClick={()=>router.navigate("/new")}>
                                    Add new Project
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="row m-3 justify-content-between">
                        {
                            Object.values(projects).map((item, index) =>
                                <ProjectCards project={item} className=" card p-0 col-2 m-2 " />
                            )
                        }
                    </div>

                </div>
                :
                <div>Loading...</div>
            }
        </Fragment>
    )
}