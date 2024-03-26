import "../CSS/Settings.css";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { updateProject } from "../services/ProjectService";
import { getAppBasicConfig } from "../services/ConfigService";

const GeneralSettings = ({ appDetails, changeProjectName }) => {
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
      changeProjectName(data.name);
    });
  };

  return (
    <div>
      {/* General settings form */}
      <h2>General Settings</h2>
      <div className="row">
        <div className="col-12">
          <form onSubmit={handleSubmit(submitForm)}>
            <div className="d-flex align-items-center my-2">
              <div className="">Application Name:</div>
              <div className="form-group" id="">
                <input
                  className="form-control form-control-sm mx-2"
                  type="text"
                  placeholder="Name of the Application"
                  {...register("name")}
                />
              </div>
            </div>

            <div className="d-flex align-items-center my-2">
              <div className="">Author Name:</div>
              <div className="form-group" id="">
                <input
                  className="form-control form-control-sm mx-2"
                  type="text"
                  placeholder="Author"
                  {...register("author")}
                />
              </div>
            </div>

            <div className="d-flex align-items-center my-2">
              <div className="">Description:</div>
              <div className="form-group" id="">
                <textarea
                  className="form-control form-control-sm mx-2"
                  type="textarea"
                  placeholder="Description"
                  {...register("description")}
                />
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
          <label>
            Integration Option 1:
            <img className="integration-image mx-2" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaxvccJFzTUJIhDhuVY6W0xssuGtObjxuJ0CJDrH2e_A&s" alt="GitHub" />
          </label>
        </div>
        <div className="my-3 mx-2">
          <label>
            Integration Option 2:
            <img className="integration-image mx-2" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsbBdQ3E6MriVeab8qrMmaCMRHAdCkS68wo8oPRFYlLg&s" alt="Gitlabs" />
          </label>
        </div>
        {/* <button type="submit">Save</button> */}
      </form>
    </div>
  );
};

const Sidebar = ({ items, selected, onSelect }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">Application Settings</div>
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

const Settings = (props) => {
  const [selected, setSelected] = useState("general");
  const [appBasicConfig, setAppBasicConfig] = useState();
  const handleSelect = (section) => {
    setSelected(section);
  };

  useEffect(() => {
    const fetchAppBasicConfig = () => {
      getAppBasicConfig(props.projectName.replace(/ /g, "_")).then((res) => {
        setAppBasicConfig(res);
      });
    };
    fetchAppBasicConfig();
  }, [props.projectName]);

  const sidebarItems = [
    {
      label: "General Settings",
      key: "general",
      component: appBasicConfig ? (
        <GeneralSettings
          appDetails={appBasicConfig}
          changeProjectName={props.changeProjectName}
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
    </div>
  );
};

export default Settings;
