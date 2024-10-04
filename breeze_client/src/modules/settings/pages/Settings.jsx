import PropTypes from 'prop-types';
import '../styles/Settings.css';
import { useState } from 'react';
import IntegrationsSettings from '../components/IntegrationsSettings';
import EnvironmentSettings from '../components/EnvironmentSettings';
import GeneralSettings from '../components/GeneralSettings';

const Sidebar = ({ items, selected, onSelect }) => {
  return (
    <div className="settings-sidebar bg-secondary btn btn-radius text-white">
      <div className="settings-sidebar-header">Application Settings</div>
      <hr />
      {items.map((item) => (
        <div
          key={item.key}
          className={`settings-sidebar-item ${item.key === selected ? 'active' : ''}`}
          onClick={() => onSelect(item.key)}
        >
          {item.label}
        </div>
      ))}
    </div>
  );
};

// PropTypes validation for Sidebar component
Sidebar.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      component: PropTypes.element.isRequired,
    })
  ).isRequired,
  selected: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const Content = ({ selected, items }) => {
  const selectedItem = items.find((item) => item.key === selected);
  return selectedItem ? selectedItem.component : null;
};

// PropTypes validation for Content component
Content.propTypes = {
  selected: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      component: PropTypes.element.isRequired,
    })
  ).isRequired,
};

const Settings = () => {
  const [selected, setSelected] = useState('general');

  const handleSelect = (section) => {
    setSelected(section);
  };

  const sidebarItems = [
    {
      label: 'General Settings',
      key: 'general',
      component: <GeneralSettings />,
    },
    {
      label: 'Integrations',
      key: 'integrations',
      component: <IntegrationsSettings />,
    },
    {
      label: 'Environment Settings',
      key: 'environment',
      component: <EnvironmentSettings />,
    },
  ];

  return (
    <div className="container-fluid settings-br-text-tertiary">
      <div className="settings-settings">
        <Sidebar onSelect={handleSelect} items={sidebarItems} selected={selected} />
        <div className="settings-content">
          <Content items={sidebarItems} selected={selected} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
