import { router } from "../App";
import { Fragment, useEffect, useState } from "react";
import ProjectCards from "./ProjectCards";
import Navbar from "./Navbar";

export default function Main() {
  const [projects, setProjects] = useState();

  useEffect(() => {
    const loadProjects = async () => {
      const projects = await (
        await fetch(
          `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/all-projects/`
        )
      ).json();
      setProjects(projects);
    };
    loadProjects();
  }, []);

  const removeProject = (projectName) => {
    setProjects((prevProjects) => {
      const newProjects = { ...prevProjects };
      delete newProjects[projectName];
      return newProjects;
    });
  };

  return (
    <Fragment>
      {projects ? (
        <div className="container-fluid vh-100 bg-dark-subtle">
          <Navbar
            rightContent={
              <div className="text-white">
                <button
                  className=" btn btn-secondary"
                  onClick={() => router.navigate("/new")}
                >
                  Add new Project
                </button>
              </div>
            }
          />

          <div className="row mt-3">
            {Object.values(projects).map((item, index) => (
              <ProjectCards
                key={index}
                project={item}
                removeProject={removeProject}
                className="col-12 col-sm-6 col-md-4 col-lg-3"
              />
            ))}
          </div>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </Fragment>
  );
}
