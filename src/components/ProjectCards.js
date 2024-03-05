import { reGenerateProject } from "../services/ProjectService"

export default function ProjectCards({ project, ...props }) {

    function reGenerate(){
        reGenerateProject(project.project_name)
    }

    return (
        <div {...props}>
            <div className="card m-2">
                <div className=" card-header">
                    {project.name}
                    {project.name !== project.project_name ?
                        " (" + project.project_name + ")"
                        : ""
                    }
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
                </div>
            </div>
        </div>
    )
}