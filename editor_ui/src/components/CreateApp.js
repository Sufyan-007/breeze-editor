import React, { useState } from "react";
import { createNewProject } from "../services/ProjectService";
import { router } from "../App";
import loadingIcon from "../assets/icons/loading.gif";

export default function CreateApp({ ...props }) {
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    author: "",
    framework: "react",
    language: "javascript",
    styling: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [existingApps, setExistingApps] = useState({});

  const handleComponentChange = (e) => {
    const values = Array.from(e.target.options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    setProjectData((state) => {
      return { ...state, styling: values };
    });
  };

  React.useEffect(() => {
    fetchProjects(); 
  }, []);

  // TO DO : unique app name validation will be handled from backend
  const fetchProjects = React.useCallback(() => {
    fetch("http://localhost:8000/editor/all-projects/")
      .then((response) => response.json())
      .then((data) => setExistingApps(data))
      .catch((error) =>
        console.error("Error fetching existing projects:", error)
      );
  }, []);
  

  const validateAppName = (appName) => {
    appName = appName.toLowerCase().replace(/\s/g, "_");
    if (existingApps === null) {
      fetchProjects(); 
    }
    return !existingApps.hasOwnProperty(appName);
  };

  const updateProjectData = (key, value) => {
    setProjectData((state) => {
      return { ...state, [key]: value };
    });
  }

  const createNewApp = () => {
    if (!projectData.name) {
      setError("Application name is required.");
      return;
    }
    const isUnique = validateAppName(projectData.name);
    if (!isUnique) {
      setError("Application name must be unique.");
      return;
    }
    setError("");
    setLoading(true);
    createNewProject(projectData)
      .then((response) => {
        setLoading(false);
        alert("Project created successfully");
        router.navigate("/editor/" + response.name);
      })
      .catch((error) => {
        setLoading(false);
        alert("Please Try Again.")
      });
  }

  return (
    <div
      id="Main"
      className="p-4 vh-100"
      style={{ backgroundColor: "#152733" }}
    >
      <div className="row mt-md-4 mt-3" id="Main-0">
        <div
          className="card col-md-6 col-11 m-auto px-4 py-3"
          id="Main-0-0"
          style={{
            backgroundColor: "#152733",
            color: "white",
            borderColor: "white",
          }}
        >
          <div className="card-body" id="Main-0-0-0">
            <h3 className="card-title mb-3" id="Main-0-0-0-1">
              Create New Project
            </h3>
            <div className="row" id="Main-0-0-0-0">
              <div className="col-12" id="Main-0-0-0-0-0">
                <form
                  noValidate
                  className="requires-validation"
                  id="Main-0-0-0-0-0-0"
                >
                  <div className="form-group mb-3" id="Main-0-0-0-0-0-0-0">
                    <input
                      required
                      className="form-control"
                      id="Main-0-0-0-0-0-0-0-0"
                      type="text"
                      placeholder="Application Name"
                      value={projectData.name}
                      onChange={(event) =>
                        updateProjectData("name", event.target.value)
                      }
                    ></input>
                    {error && <div className="text-danger mt-1">{error}</div>}
                  </div>
                  <div className="form-group mb-3" id="Main-0-0-0-0-0-0-1">
                    <input
                      className="form-control"
                      id="Main-0-0-0-0-0-0-1-0"
                      type="text"
                      placeholder="Author"
                      value={projectData.author}
                      onChange={(event) =>
                        updateProjectData("author", event.target.value)
                      }
                    ></input>
                    {/* {error && <div className="text-danger mt-1">{error}</div>} */}
                  </div>
                  <div className="form-group mb-3" id="Main-0-0-0-0-0-0-2">
                    <input
                      required
                      className="form-control"
                      id="Main-0-0-0-0-0-0-2-0"
                      type="text"
                      placeholder="Project Description"
                      value={projectData.description}
                      onChange={(event) =>
                        updateProjectData("description", event.target.value)
                      }
                    ></input>
                    {/* {error && <div className="text-danger mt-1">{error}</div>} */}
                  </div>
                  <div className="form-group mb-3" id="Main-0-0-0-0-0-0-3">
                    <select
                      className="form-control"
                      id="Main-0-0-0-0-0-0-3-0"
                      // value={projectData.framework}
                      onChange={(event) =>
                        updateProjectData("framework", event.target.value)
                      }
                    >
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-3-0-0"
                        value=""
                        selected
                        disabled
                      >
                        Technology
                      </option>
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-3-0-1"
                        value="react"
                      >
                        React
                      </option>
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-3-0-2"
                        value="vue"
                        disabled
                      >
                        Vue
                      </option>
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-1-1-3"
                        value="angular"
                        disabled
                      >
                        Angular
                      </option>
                    </select>
                  </div>
                  <div className="form-group mb-3" id="Main-0-0-0-0-0-0-4">
                    <select
                      className="form-control"
                      id="Main-0-0-0-0-0-0-4-0"
                      // value={projectData.language}
                      onChange={(event) =>
                        updateProjectData("language", event.target.value)
                      }
                    >
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-4-1-0"
                        value=""
                        selected
                        disabled
                      >
                        Language
                      </option>
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-4-1-1"
                        value="javascript"
                      >
                        Javascript
                      </option>
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-4-1-2"
                        value="typescript"
                        disabled
                      >
                        TypeScript
                      </option>
                    </select>
                  </div>
                  <div className="form-group mb-4" id="Main-0-0-0-0-0-0-5">
                    <select
                      multiple
                      className="form-control"
                      id="Main-0-0-0-0-0-0-5-0"
                      onChange={handleComponentChange}
                    >
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-5-1-0"
                        value=""
                        selected
                        disabled
                      >
                        Styling Components
                      </option>
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-5-1-0"
                        value="bootstrap"
                      >
                        Bootstrap
                      </option>
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-5-1-1"
                        value="react-bootstrap"
                      >
                        React Bootstrap
                      </option>
                      <option
                        className=""
                        id="Main-0-0-0-0-0-0-5-1-2"
                        value="chakraui"
                      >
                        Chakra UI
                      </option>
                    </select>
                  </div>
                  {loading ? (
                    <div className="text-center mt-3">
                      <div className="loader-wheel mb-10">
                        <img height={30} src={loadingIcon} alt="loading" />
                      </div>
                      <div className="loader-text text-white">
                        <h5>Creating your project ...</h5>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      id="Main-0-0-0-0-0-0-6"
                    >
                      <button
                        type="button"
                        onClick={createNewApp}
                        className="btn btn-primary bg-white"
                        style={{ color: "#152733" }}
                        id="Main-0-0-0-0-0-0-6-0"
                      >
                        Create App
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
