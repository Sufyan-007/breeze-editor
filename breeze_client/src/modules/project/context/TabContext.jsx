import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTreeContext } from './TreeContext';
import PropTypes from 'prop-types';

const TabContext = createContext();

export const TabProvider = ({ children }) => {
  const [openTabs, setOpenTabs] = useState(() => {
    const storedTabs = localStorage.getItem('openTabs');
    return storedTabs ? JSON.parse(storedTabs) : [];
  });

  const [selectedTab, setSelectedTab] = useState(() => {
    const storedSelectedTab = localStorage.getItem('selectedTab');
    return storedSelectedTab ? JSON.parse(storedSelectedTab) : null;
  });

  const { setSelectedNodeId, setSelectedNode } = useTreeContext();

  useEffect(() => {
    const tabsToStore = openTabs.map(({ id, name, type, extension, tag }) => ({ id, name, type, extension, tag }));
    localStorage.setItem('openTabs', JSON.stringify(tabsToStore));
  }, [openTabs]);

  useEffect(() => {
    if (selectedTab) {
      const { id, name, type, extension, tag } = selectedTab;
      const tabToStore = { id, name, type, extension, tag };
      localStorage.setItem('selectedTab', JSON.stringify(tabToStore));
    } else {
      localStorage.removeItem('selectedTab');
    }
  }, [selectedTab]);

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
