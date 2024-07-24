import React, { useMemo, useRef, useState } from "react";
import { createNewProject } from "../services/ProjectService";
import { router } from "../App";
import loadingIcon from "../assets/icons/loading.gif";
import Multiselect from "multiselect-react-dropdown";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, Toast } from "react-bootstrap";

export default function CreateApp({ ...props }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      author: "",
      framework: "react",
      language: "javascript",
      styling: [],
      buildTool: "create-react-app",
      logo: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [selectedValues, setSelectedValues] = React.useState([]);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Uploading...");
  const [showModal, setModalShow] = useState(false);
  const ws = useRef(null);
  const intervalId = useRef(null);

  const progressMessages = useMemo(() => {
    return {
      5: "Initializing your project",
      20: "Installing Packages",
      50: "Configuring Services",
      60: "Setting up your project",
      80: "This might take a while",
      90: "Almost there..",
    };
  }, []);

  React.useEffect(() => {
    ws.current = new WebSocket(
      `ws://${process.env.REACT_APP_DEV_HOST}:${process.env.REACT_APP_DEV_PORT}/ws/project-progress/`
    );
    ws.current.onopen = () => {
      console.log("Connected to the WebSocket");
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const progress = message?.progress;

      if (progress === 20 && intervalId.current === null) {
        incrementProgress();
      } else if (progress === 50) {
        clearInterval(intervalId.current);
        intervalId.current = null;
        setProgress(progress);
      } else {
        setProgress(progress);
      }

      const relatedMessage = progressMessages[progress];
      if (relatedMessage) {
        setMessage(relatedMessage);
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected from the WebSocket");
    };

    return () => {
      ws.current.close();
      console.log("WebSocket connection closed");
    };
  }, [progressMessages]);

  const incrementProgress = () => {
    intervalId.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 45) {
          clearInterval(intervalId.current);
          intervalId.current = null;
          return prevProgress;
        }
        return prevProgress + 1;
      });
    }, 1000);
  };

  const stylingComponents = [
    { id: "bootstrap", name: "Bootstrap" },
    { id: "react-bootstrap", name: "React-bootstrap" },
    { id: "chakra-ui", name: "ChakraUI" },
    { id: "material-ui", name: "Material UI" },
  ];
  const [toasts, setToasts] = useState([]);

  const showToast = (message, variant = "success") => {
    const newToast = { id: new Date().getTime(), message, variant };
    setToasts((currentToasts) => [...currentToasts, newToast]);
  };

  React.useEffect(() => {
    register("styling", { required: true });
  }, [register]);

  const onSelect = (selectedList, selectedItem) => {
    setSelectedValues(selectedList);
    setValue("styling", selectedList);
  };

  const onRemove = (selectedList, removedItem) => {
    setSelectedValues(selectedList);
    setValue("styling", selectedList);
  };

  const onSubmit = (data) => {
    data.styling = selectedValues.map((option) => option.name);
    setLoading(true);
    setModalShow(true);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          command: "start",
          project_id: data.name.toLowerCase().replace(/ /g, "_"),
        })
      );
    }

    const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "logo") {
      if (data[key] && data[key][0]) {
        formData.append(key, data[key][0]); 
      } else {
        formData.append(key, null); 
      }
    } else {
      formData.append(key, data[key]);
    }
  });
    createNewProject(formData)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error);
        }
        setModalShow(false);
        setLoading(false);
        showToast("Project created successfully", "success");
        setTimeout(() => {
          router.navigate("/project/" + response.name);
        }, 2000);
      })
      .catch((error) => {
        setLoading(false);
        if (error.message) {
          console.log("error.message::>>", error.message);
          setError("name", {
            message: error.message,
          });
          return;
        }
        alert("Please try again later!");
      });
  };

  return (
  <>
  <div
    id="Main"
    className="p-4 vh-100"
    style={{ backgroundColor: "#36454F" }}
  >
    <div className="row mt-md-4 mt-3" id="Main-0">
      <div
        className="card col-md-6 col-11 m-auto px-4 py-3"
        id="Main-0-0"
        style={{
          backgroundColor: "#36454F",
          borderColor: "white",
        }}
      >
        <div className="card-body" id="Main-0-0-0">
          <h3 className="card-title mb-3 text-white" id="Main-0-0-0-1">
            Create New Project
          </h3>
          <div className="row" id="Main-0-0-0-0">
            <div className="col-12" id="Main-0-0-0-0-0">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group mb-3" id="Main-0-0-0-0-0-0-0">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Application Name"
                    {...register("name", {
                      required: "This field is required",
                    })}
                  />
                  {errors.name && (
                    <div className="text-danger mt-1">
                      {errors.name.message}
                    </div>
                  )}
                </div>
                <div className="form-group mb-3" id="Main-0-0-0-0-0-0-5">
                  <label 
                    className="text-white mb-1 d-block"
                  >
                    Upload image for project logo
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="logoUpload"
                    accept="image/*"
                    {...register("logo", { required: false })}
                  />
                  {errors.logo && (
                    <div className="text-danger mt-1">
                      This field is required.
                    </div>
                  )}
                </div>
                <div className="form-group mb-3" id="Main-0-0-0-0-0-0-1">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Author"
                    {...register("author")}
                  />
                </div>
                <div className="form-group mb-3" id="Main-0-0-0-0-0-0-2">
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Description"
                    {...register("description")}
                  />
                </div>
                <div className="form-group mb-3" id="Main-0-0-0-0-0-0-3">
                  <select
                    className="form-control"
                    {...register("framework", { required: true })}
                  >
                    <option value="" disabled>
                      Technology
                    </option>
                    <option value="react">React</option>
                    <option value="vue" disabled>
                      Vue
                    </option>
                    <option value="angular" disabled>
                      Angular
                    </option>
                  </select>
                  {errors.framework && (
                    <div className="text-danger mt-1">
                      This field is required.
                    </div>
                  )}
                </div>
                <div className="form-group mb-3" id="Main-0-0-0-0-0-0-4">
                  <select
                    className="form-control"
                    {...register("language", { required: true })}
                  >
                    <option value="" disabled>
                      Language
                    </option>
                    <option value="javascript">Javascript</option>
                    <option value="typescript" disabled>
                      TypeScript
                    </option>
                  </select>
                  {errors.language && (
                    <div className="text-danger mt-1">
                      This field is required.
                    </div>
                  )}
                </div>

                <div className="form-group mb-3" id="Main-0-0-0-0-0-0-5">
                  <Multiselect
                    className="form-control p-0 text-gray"
                    options={stylingComponents}
                    selectedValues={selectedValues}
                    onSelect={onSelect}
                    onRemove={onRemove}
                    displayValue="name"
                    showCheckbox={true}
                    placeholder="Styling Components"
                    style={{}}
                  />
                  {errors.styling && (
                    <div className="text-danger mt-1">
                      This field is required.
                    </div>
                  )}
                </div>
                <div className="form-group mb-3" id="Main-0-0-0-0-0-0-4">
                  <select
                    className="form-control"
                    {...register("buildTool", { required: true })}
                  >
                    <option value="" disabled>
                      Build Tool
                    </option>
                    <option value="create-react-app">
                      Create React App
                    </option>
                    <option value="vite" disabled>
                      Vite
                    </option>
                  </select>
                  {errors.buildTool && (
                    <div className="text-danger mt-1">
                      This field is required.
                    </div>
                  )}
                </div>

                <div
                  className="d-flex justify-content-center align-items-center"
                  id="Main-0-0-0-0-0-0-6"
                >
                  <button
                    type="submit"
                    className="btn btn-primary bg-white"
                    style={{ color: "#152733" }}
                  >
                    Create App
                  </button>
                </div>
              </form>
              {loading && (
                <Modal
                  show={showModal}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                      Creating your project
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="text-center mt-3">
                      <div className="progress">
                        <div
                          className="progress-bar"
                          role="progressbar"
                          aria-valuenow={{ progress }}
                          aria-valuemin="0"
                          aria-valuemax="100"
                          style={{ width: `${progress}%` }}
                          aria-label="project completion bar"
                        >
                          {progress}%
                        </div>
                      </div>
                      <div className="d-flex justify-content-center text center">
                        <div
                          className="loader-wheel"
                          style={{ marginTop: "13px" }}
                        >
                          <img
                            height={20}
                            src={loadingIcon}
                            alt="loading"
                          />
                        </div>
                        <div
                          className="progress-text mt-3"
                          style={{ marginLeft: "10px" }}
                        >
                          {message}
                        </div>
                      </div>
                    </div>
                  </Modal.Body>
                </Modal>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ToastContainer position="top-end" className="p-3">
    {toasts.map((toast) => (
      <Toast
        key={toast.id}
        onClose={() =>
          setToasts((toasts) => toasts.filter((t) => t.id !== toast.id))
        }
        delay={5000}
        autohide
      >
        <Toast.Header>
          <strong className="me-auto">Success</strong>
        </Toast.Header>
        <Toast.Body className="text-success">{toast.message}</Toast.Body>
      </Toast>
    ))}
  </ToastContainer>
</>

  );
}
