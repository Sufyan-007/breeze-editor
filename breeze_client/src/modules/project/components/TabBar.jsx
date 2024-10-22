import PropTypes from 'prop-types';
import { getIconClass } from '../constants/ExtensionBasedIcon';

function TabBar({ openTabs, selectedTab, handleTabSelect, handleTabClose }) {
  return (
    <div>
      {' '}
      <div className="project-tab-bar d-flex small-font">
        {openTabs.map((tab) => (
          <div
            key={tab.id}
            className={`project-tab-item me-1 ${selectedTab?.id === tab.id ? 'active' : ''}`}
            onClick={() => handleTabSelect(tab)}
          >
            <i
              className={`bi ${getIconClass(tab?.extension).iconClass} me-1`}
              style={{ color: getIconClass(tab?.extension).color }}
            />
            {tab.name}
            {tab.extension && <span>.{tab.extension === 'SX' ? 'jsx' : tab.extension}</span>}
            <span
              className="close-icon mx-1"
              onClick={(e) => {
                e.stopPropagation();
                handleTabClose(tab.id);
              }}
            >
              &times;
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

TabBar.propTypes = {
  openTabs: PropTypes.array,
  selectedTab: PropTypes.object,
  handleTabSelect: PropTypes.func,
  handleTabClose: PropTypes.func,
};

export default TabBar;
