import React, { useState, Fragment } from "react";
// import { saveAppConfiguration } from "service/ConfigService.js";
// import { getPost } from "service/PostService.js";
// import axios from "axios";
import { useEffect } from "react";
import "components/createdapppage.css"
const CreateAppPage = (props) => {
  const [projectData, setProjectData] = useState({
    name: "",
    description: "",
    author: "",
    defaultComponent: "",
    strictMode: "FALSE",
    path: "",
    component_src_dir: "src",
    dependencies: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    console.log();
  }, []);

  const handleInputChange = (prop, value) => {
    console.log(prop, value);
    setProjectData({ ...projectData, [prop]: value });
  };

  const saveApiConfigMapper = (reactStateObj, id) => {
    let mappingObj = {
      name: reactStateObj.appName,
      description: reactStateObj.description,
      path: reactStateObj.path,
      author: reactStateObj.author,
      defaultComponent: reactStateObj.defaultComponent,
      dependencies: {
        name: reactStateObj.appDependencies.name,
        value: reactStateObj.appDependencies.value,
      },
    };
    let parametersObj = { postId: id };
    return {
      mappingObj: mappingObj,
      parametersObj: parametersObj,
    };
  };

  const saveAppConfig = async () => {
    console.log(projectData);
    setIsSaving(true);
    // await saveAppConfiguration(projectData);
    setIsSaving(false);
  };

  return (
    <Fragment>
      <div>
        <div className="align-items-center d-flex justify-content-center">
          <div
            style={{
              padding: "50px",
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
            className="form"
          >
            <div className="title text-center">Creator App</div>
            <div className="subtitle text-center">Let's create your app!</div>
            <div className="input-container ic1">
              <input
                type="text"
                name="name"
                id="name"
                className="input"
                placeholder=" "
                onChange={(event) => {
                  handleInputChange("name", event.target.value);
                }}
              ></input>
              <label htmlFor="name" className="placeholder">
                Project name
              </label>
            </div>
            <div className="input-container ic2">
              <textarea
                name="description"
                id="{{appCongig.id}}"
                cols="30"
                rows="10"
                placeholder=" "
                className="input"
                onChange={(event) => {
                  handleInputChange("description", event.target.value);
                }}
              ></textarea>
              <label htmlFor="description" className="placeholder">
                Description
              </label>
            </div>
            <div className="input-container ic2">
              <input
                name="author"
                id="author"
                type="text"
                placeholder=" "
                className="input"
                onChange={(event) => {
                  handleInputChange("author", event.target.value);
                }}
              ></input>
              <label htmlFor="author" className="placeholder">
                Author Name
              </label>
            </div>
            <div className="input-container ic2">
              <input
                name="defaultComponent"
                id="defaultComponent"
                className="input"
                placeholder=" "
                onChange={(event) => {
                  handleInputChange("defaultComponent", event.target.value);
                }}
              ></input>
              <label htmlFor="defaultComponent" className="placeholder">
                Default Component Name
              </label>
            </div>
            <div className="input-container ic2">
              <input
                type="text"
                name="path"
                id="path"
                className="input"
                placeholder=" "
                onChange={(event) => {
                  handleInputChange("path", event.target.value);
                }}
              ></input>
              <label htmlFor="path" className="placeholder">
                Project Path
              </label>
            </div>
            <div style={{ marginTop: "40px" }} className="text-center">
              <button
                style={{
                  padding: "10px",
                  backgroundColor: "#7A0059",
                  borderRadius: "5px",
                  border: "none",
                  fontSize: "16px",
                  color: "white",
                }}
                className="btn btn-primary fw-bold"
                name="file"
                id="file"
                type="file"
                onClick={(event) => {
                  saveAppConfig();
                }}
              >
                Create App
              </button>
            </div>
            <div>
              {projectData.dependencies.map((dep) => {
                const a = 1;
                return (
                  <div>
                    {dep.name}:{dep.version}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateAppPage;
