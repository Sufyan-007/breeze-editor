import { router } from "../App";
import {
  React,
  Fragment,
  useEffect,
  useState,
  useRef,
  useCallback,
} from "react";
import ProjectCards from "./ProjectCards";
import Navbar from "./Navbar";

export default function Main() {
  const [projects, setProjects] = useState({});
  const ws = useRef(null);

  const fetchProjectStatus = useCallback((projectsList) => {
    ws.current = new WebSocket(
      `${process.env.REACT_APP_SOCKET_URL}/ws/app-status/`
    );

    ws.current.onopen = () => {
      console.log("Connected to the WebSocket");

      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        Object.values(projectsList).forEach((project) => {
          ws.current.send(
            JSON.stringify({
              command: "status",
              project_id: project.name,
            })
          );
        });
      }
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);

      const { project_id, status } = message?.status || {};
      if (project_id && status) {
        setProjects((prevProjects) => ({
          ...prevProjects,
          [project_id]: {
            ...prevProjects[project_id],
            status,
          },
        }));
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected from the WebSocket");
    };

    return () => {
      if (ws.current) {
        ws.current.close();
        console.log("WebSocket connection closed");
      }
    };
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      const allProjects = await (
        await fetch(
          `${process.env.REACT_APP_BREEZE_BACKEND_HOST}/editor/all-projects/`
        )
      ).json();
      setProjects(allProjects);
      return allProjects;
    };
    loadProjects().then((res) => {
      fetchProjectStatus(res);
    });
  }, [fetchProjectStatus]);

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
