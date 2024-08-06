import "../../css/Settings.css";
import { useEffect, useState } from "react";
import { getAppBasicConfig } from "../../services/ConfigService";
import { useParams } from "react-router";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import IntegrationsSettings from "./IntegrationsSettings";
import EnvironmentSettings from "./EnvironmentSettings";
import GeneralSettings from "./GeneralSettings";

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
    {
      label: "Environment Settings",
      key: "environment",
      component: <EnvironmentSettings />,
    }
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
