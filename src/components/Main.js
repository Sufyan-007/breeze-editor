
import arrowReturn from "../assets/icons/arrow-return-left.svg";
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"

import threeDots from "../assets/icons/three_dots_icon.svg"
import { Form } from "react-bootstrap"
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