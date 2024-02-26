import {router} from "../App"
export default function ProjectCards({project,...props}){

    

    return (
        <div {...props}>
            <div className=" card-header">
                {project.name}
                {project.name!==project.project_name?
                    " ("+project.project_name+")"
                    :""
                }
            </div>
            <div className=" card-body">
                {project.description}
            </div>
            <div className=" card-footer">
                <a className=" btn btn-sm btn-primary" href={"/editor/"+project.project_name} target="_blank" rel="noreferrer">
                    Open
                </a>
            </div>
        </div>
    )
}