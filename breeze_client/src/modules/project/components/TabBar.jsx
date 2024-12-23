import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { useTabContext } from '../context/TabContext';
import CustomContextMenu from '../../../common/display/context-menu/BreezeContextMenu';
import { getIconClass } from '../constants/ExtensionBasedIcon';

function TabBar() {
  const { openTabs, selectedTab, selectTab, removeTab, removeAllTabs, removeOtherTabs, removeTabsToTheRight } =
    useTabContext();
  const [menuItems, setMenuItems] = useState([]);
  const contextMenuRef = useRef(null);

  const handleTabSelect = (tab) => {
    selectTab(tab);
  };

  const handleTabClose = (tabId) => {
    removeTab(tabId);
  };

  const handleContextMenu = (event, tab) => {
    event.preventDefault();

    const isLastTab = openTabs[openTabs.length - 1].id === tab.id;
    const isSingleTab = openTabs.length === 1;

    const menuOptions = [
      { label: 'Close Tab', value: () => handleTabClose(tab.id), hasChildren: false },
      ...(isSingleTab
        ? []
        : [
            {
              label: 'Close Other Tabs',
              value: () => removeOtherTabs(tab.id),
              hasChildren: false,
            },
            {
              label: 'Close All Tabs',
              value: removeAllTabs,
              hasChildren: false,
            },
          ]),
      ...(isLastTab || isSingleTab
        ? []
        : [
            {
              label: 'Close Tabs to the Right',
              value: () => removeTabsToTheRight(tab.id),
              hasChildren: false,
            },
          ]),
    ];
    setMenuItems(menuOptions);
    contextMenuRef.current?.handleEvent(event);
  };

  useEffect(() => {
    const handleMiddleClick = (event) => {
      if (event.button === 1) {
        const tabElement = event.target.closest('.project-tab-item');
        if (tabElement) {
          const tabId = tabElement.getAttribute('data-id');
          if (tabId) {
            handleTabClose(tabId);
          }
        }
      }
    };

    document.addEventListener('mousedown', handleMiddleClick);
    return () => {
      document.removeEventListener('mousedown', handleMiddleClick);
    };
  }, []);

  return (
    <div className="mb-2">
      <div className="project-tab-bar d-flex small-font">
        <CustomContextMenu
          ref={contextMenuRef}
          menuItems={menuItems}
          onSelection={(value) => {
            value();
          }}
          width={180}
        />
        {openTabs.map((tab) => (
          <div
            key={tab.id}
            className={`project-tab-item me-1 ${selectedTab?.id === tab.id ? 'active' : ''}`}
            data-id={tab.id}
            onClick={() => handleTabSelect(tab)}
            onContextMenu={(e) => handleContextMenu(e, tab)}
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
