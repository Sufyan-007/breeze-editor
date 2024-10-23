import { createContext, useCallback, useContext, useState } from 'react';
import { useTreeContext } from './TreeContext';
import PropTypes from 'prop-types';

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [openTabs, setOpenTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  const { setSelectedNode } = useTreeContext();

  const addTab = useCallback((node) => {
    if (node?.type !== 'DIRECTORY') {
      setOpenTabs((prevTabs) => {
        if (prevTabs.find((tab) => tab.id === node.id)) return prevTabs;
        return [...prevTabs, node];
      });
      setSelectedTab(node);
    }
  }, []);

  const removeTab = useCallback(
    (nodeId) => {
      setOpenTabs((prevTabs) => {
        if (prevTabs.length === 1) {
          return prevTabs;
        }
        const openTabs = prevTabs.filter((tab) => tab.id !== nodeId);
        if (selectedTab?.id === nodeId) {
          const remainingTabs = openTabs.filter((tab) => tab.id !== nodeId);
          const node = remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1] : null;
          setSelectedNode(node);
          setSelectedTab(node);
        }
        return openTabs;
      });
    },
    [selectedTab, setSelectedNode]
  );
  const selectTab = (node) => {
    setSelectedNode(node);
    setSelectedTab(node);
  };

  return (
    <TabContext.Provider value={{ openTabs, selectedTab, addTab, removeTab, selectTab }}>
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  return useContext(TabContext);
};

TabProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
