import { useState } from "react";
import * as ProjectService from "../services/ProjectService";
import javascript from "../assets/icons/javascript.svg";
import react from "../assets/icons/react.svg";
import { router } from "../App";

export default function ProjectCards({ project, ...props }) {
  const [deleting, setDeleting] = useState(false);

  function reGenerate() {
    ProjectService.reGenerateProject(project.project_name);
  }

  const handleCardClick = () => {
    router.navigate("/project/" + project.project_name);
  };

  function deleteProject() {
    console.log(project);
    setDeleting(true);
    window.confirm(
      `Are you sure you want to delete project : ${project.name} ?`
    );
    ProjectService.deleteProject(project.name).then((response) => {
      if (response.status === 200) {
        alert("Project deleted successfully");
      } else {
        alert("Failed to delete project");
      }
      setDeleting(false);
    });
  }

  return (
    <div {...props}>
      <div className="card my-2 text-white bg-dark">
        <div className="card-body">
          <h4 className="card-title" style={{fontSize: "22px"}}>{project.projectName}</h4>
          <p className="card-text" style={{ color: "#B7BBC8", fontSize: "14px"}}>{project.description}</p>
        </div>
        <div className="card-footer text-muted d-flex justify-content-between border-top-0">
          <div className="tech d-flex">
            <div className="language">
              <img height={22} src={javascript} alt="JS" className="mr-2" />
            </div>
            <div className="framework">
              <img height={22} src={react} alt="react" className="mx-1" />
            </div>
          </div>
          <div className="stats">
          <button type="button" className="btn btn-secondary btn-sm mx-2" onClick={handleCardClick}>Config</button>
          <button type="button" className="btn btn-danger btn-sm ml-1" onClick={deleteProject}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
}
