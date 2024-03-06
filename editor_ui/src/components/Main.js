import { router } from "../App";
import { Fragment, useEffect, useState } from "react";
import ProjectCards from "./ProjectCards";
import Navbar from "./Navbar";

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
                    <Navbar>
                        <div className="text-white">
                            <button className=" btn btn-secondary" onClick={() => router.navigate("/new")}>
                                Add new Project
                            </button>
                        </div>
                    </Navbar>
                    <div className="row m-3 justify-content-between">
                        {
                            Object.values(projects).map((item, index) =>
                                <ProjectCards project={item} className="  p-0 col-3  " />
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