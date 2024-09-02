import "../../css/Settings.css";
import { useState } from "react";
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

  const handleSelect = (section) => {
    setSelected(section);
  };

  const sidebarItems = [
    {
      label: "General Settings",
      key: "general",
      component: <GeneralSettings />,
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
