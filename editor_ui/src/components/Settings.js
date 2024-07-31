import "../css/Settings.css";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { updateProject } from "../services/ProjectService";
import { getAppBasicConfig } from "../services/ConfigService";
import { useParams, useNavigate } from "react-router";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";

const GeneralSettings = ({ appDetails, toggleShowSaveToast }) => {
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: appDetails?.projectName,
      author: appDetails?.author,
      description: appDetails?.description,
      logo: appDetails?.logo,
    },
  });

  const [logoPreview, setLogoPreview] = useState(appDetails?.logo || "");
  const [logoFile, setLogoFile] = useState(null);
  const [logoDeleted, setLogoDeleted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (appDetails?.logo) {
      const logoUrl = `http://localhost:8000/editor/file-upload/${appDetails.name}/${appDetails.logo}`;
      setLogoPreview(logoUrl);
    }
  }, [appDetails]);

  const handleUploadIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const submitForm = (data) => {
    const formData = new FormData();
    formData.append("newProjectName", data.name);
    formData.append("newAuthor", data.author);
    formData.append("newDescription", data.description);
    formData.append("oldConfig", JSON.stringify(appDetails));

    if (logoFile) {
      formData.append("logo", logoFile);
    } else if (logoDeleted) {
      formData.append("logo", "null");
    }

    updateProject(formData).then((res) => {
      toggleShowSaveToast();
      navigate(`/project/${res.body.name}/settings`, { replace: true });
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoDelete = () => {
    setLogoFile(null);
    setLogoPreview("");
    setValue("logo", "");
    setLogoDeleted(true);
  };

  return (
    <div>
      <h2>General Settings</h2>
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="col-lg-5 col-md-7">
              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Application Name:</div>
                <div className="form-group" id="">
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Name of the Application"
                    {...register("name")}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Author Name:</div>
                <div className="form-group" id="">
                  <input
                    className="form-control form-control-sm"
                    type="text"
                    placeholder="Author"
                    {...register("author")}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Description:</div>
                <div className="form-group" id="">
                  <textarea
                    className="form-control form-control-sm"
                    type="textarea"
                    placeholder="Description"
                    {...register("description")}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center m-2">
                <div className="">Logo:</div>
                <div className="form-group" id="">
                  <div
                    className="logo-container"
                    style={!logoPreview ? { cursor: "pointer" } : {}}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={!logoPreview ? handleUploadIconClick : undefined}
                  >
                    {logoPreview ? (
                      <>
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="custom-img-thumbnail"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        {isHovered && (
                          <i
                            type="button"
                            style={{color: "red", fontSize:"x-large"}}
                            className="bi bi-trash delete-logo-button"
                            onClick={handleLogoDelete}
                          ></i>
                        )}
                      </>
                    ) : (
                      <i className="bi bi-upload upload-icon"></i>
                    )}
                  </div>
                  {!logoPreview && (
                    <input
                      ref={fileInputRef}
                      className="form-control form-control-sm"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      style={{ display: "none" }}
                    />
                  )}
                </div>
              </div>
            </div>
            <button className="btn btn-primary my-3" type="submit">
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const IntegrationsSettings = () => {
  return (
    <div>
      <h2>Integration Settings</h2>
      <form>
        <div className="mx-2 my-3">
          <label>Integration Option 1:</label>
          <img
            className="integration-image mx-2"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaxvccJFzTUJIhDhuVY6W0xssuGtObjxuJ0CJDrH2e_A&s"
            alt="GitHub"
          />
        </div>
        <div className="my-3 mx-2">
          <label>Integration Option 2:</label>
          <img
            className="integration-image mx-2"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsbBdQ3E6MriVeab8qrMmaCMRHAdCkS68wo8oPRFYlLg&s"
            alt="Gitlabs"
          />
        </div>
      </form>
    </div>
  );
};

const Sidebar = ({ items, selected, onSelect }) => {
  return (
    <div className="sidebar bg-secondary btn btn-radius text-white">
      <div className="sidebar-header">Application Settings</div>
      <hr />
      {items.map((item) => (
        <div
          key={item.key}
          className={`sidebar-item ${item.key === selected ? "active" : ""}`}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

const Content = ({ selected, items }) => {
  const selectedItem = items.find((item) => item.key === selected);
  return selectedItem ? selectedItem.component : null;
};

const Settings = () => {
  const [selected, setSelected] = useState("general");
  const [appBasicConfig, setAppBasicConfig] = useState();
  const { projectName } = useParams();
  const [showSaveToast, setShowSaveToast] = useState(false);

  const toggleShowSaveToast = () => setShowSaveToast(!showSaveToast);
  const handleSelect = (section) => {
    setSelected(section);
  };
  useEffect(() => {
    const fetchAppBasicConfig = () => {
      getAppBasicConfig(projectName).then((res) => {
        setAppBasicConfig(res);
      });
    };
    fetchAppBasicConfig();
  }, [projectName]);

  const sidebarItems = [
    {
      label: "General Settings",
      key: "general",
      component: appBasicConfig ? (
        <GeneralSettings
          appDetails={appBasicConfig}
          toggleShowSaveToast={toggleShowSaveToast}
        />
      ) : null,
    },
    {
      label: "Integrations",
      key: "integrations",
      component: <IntegrationsSettings />,
    },
  ];

  return (
    <div className="container-fluid text-white">
      <div className="settings">
        <Sidebar
          onSelect={handleSelect}
          items={sidebarItems}
          selected={selected}
        />
        <div className="content">
          <Content items={sidebarItems} selected={selected} />
        </div>
      </div>
      <div>
        <ToastContainer
          position="top-end"
          className="p-3"
          style={{ zIndex: 1 }}
        >
          <Toast
            bg={"primary"}
            show={showSaveToast}
            onClose={toggleShowSaveToast}
            delay={2000}
            autohide
          >
            <Toast.Header closeButton={false}>
              <strong>Success..!</strong>
            </Toast.Header>
            <Toast.Body>Project Details are Updated</Toast.Body>
          </Toast>
        </ToastContainer>
      </div>
    </div>
  );
};

export default Settings;
