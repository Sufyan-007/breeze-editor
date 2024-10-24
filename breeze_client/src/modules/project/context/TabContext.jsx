import { createContext, useCallback, useContext, useState } from 'react';
import { useTreeContext } from './TreeContext';
import PropTypes from 'prop-types';

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [openTabs, setOpenTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  const { setSelectedNodeId, setSelectedNode } = useTreeContext();

  const addTab = useCallback((node, code = '', language = '') => {
    if (node?.type !== 'DIRECTORY') {
      setOpenTabs((prevTabs) => {
        const existingTab = prevTabs.find((tab) => tab.id === node.id);
        if (existingTab) return prevTabs;
        const newTab = {
          ...node,
          code: code || '',
          language: language || '',
        };

        return [...prevTabs, newTab];
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
          setSelectedNodeId(node?.id);
          setSelectedTab(node);
        }
        return openTabs;
      });
    },
    [selectedTab, setSelectedNode, setSelectedNodeId]
  );

  const updateTabContent = useCallback((nodeId, code, language) => {
    setOpenTabs((prevTabs) => prevTabs.map((tab) => (tab.id === nodeId ? { ...tab, code, language } : tab)));
  }, []);

  const selectTab = (node) => {
    setSelectedNode(node);
    setSelectedNodeId(node.id);
    setSelectedTab(node);
  };

  return (
    <TabContext.Provider value={{ openTabs, selectedTab, addTab, removeTab, selectTab, updateTabContent }}>
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
