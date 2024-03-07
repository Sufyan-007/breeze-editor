import { useState } from "react"
import * as ProjectService from "../services/ProjectService"
import loadingGif from "../assets/icons/loading.gif"

export default function ProjectCards({ project, ...props }) {
    const [deleting,setDeleting] = useState(false)

    function reGenerate(){
        ProjectService.reGenerateProject(project.project_name)
    }

    function deleteProject(){
        console.log(project)
        setDeleting(true)
        window.confirm(`Are you sure you want to delete project : ${project.name} ?`)
        ProjectService.deleteProject(project.name).then((response)=>{
            if(response.status ===200){
                alert("Project deleted successfully");
            }else{
                alert("Failed to delete project");
            }
            setDeleting(false)
        })
    }

    return (
        <div {...props}>
            {/* <div hidden={!deleting} className="" >
                <img src={loadingGif} alt=""  height={40}/>
            </div> */}
            <div className="card m-2">
                <div className=" card-header">
                    {project.projectName}
                    
                </div>
                <div className=" card-body">
                    {project.description}
                    
                </div>
                <div className=" card-footer d-flex justify-content-between">
                    <a className=" btn btn-sm btn-primary" href={"/project/" + project.project_name} >
                        Open
                    </a>
                    <button onClick={reGenerate}  className="btn btn-sm btn-secondary">
                        Re-Generate
                    </button>
                    <button onClick={deleteProject}  className="btn btn-sm btn-danger">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    )
}