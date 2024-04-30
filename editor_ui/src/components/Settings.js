import "../CSS/Settings.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { updateProject } from "../services/ProjectService";
import { getAppBasicConfig } from "../services/ConfigService";
import { useParams, useNavigate } from "react-router";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

const GeneralSettings = ({ appDetails, toggleShowSaveToast }) => {

  const navigate = useNavigate();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: appDetails?.projectName,
      author: appDetails?.author,
      description: appDetails?.description,
    },
  });

  const submitForm = (data) => {
    let newAppBasicConfig = {
      newProjectName: data.name,
      newAuthor: data.author,
      newDescription: data.description,
      oldConfig: { ...appDetails },
    };

    updateProject(newAppBasicConfig).then((res) => {
      console.log(res);
      toggleShowSaveToast();
      navigate(`/project/${res.body.name}`, { replace: true });
    });
  };

  return (
    <div>
      {/* General settings form */}
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
      {/* Integrations settings form */}
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
        {/* <button type="submit">Save</button> */}
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
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1 }}>
      <Toast bg={'primary'} show={showSaveToast} onClose={toggleShowSaveToast} delay={2000} autohide>
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
