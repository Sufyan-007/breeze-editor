import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useTreeContext } from './TreeContext';
import PropTypes from 'prop-types';

const TabContext = createContext();

export const TabProvider = ({ children, projectName }) => {
  const [openTabs, setOpenTabs] = useState(() => {
    const storedInfo = JSON.parse(localStorage.getItem('openTabsInfo')) || {};
    return storedInfo[projectName]?.openTabs || [];
  });

  const [selectedTab, setSelectedTab] = useState(() => {
    const storedInfo = JSON.parse(localStorage.getItem('openTabsInfo')) || {};
    return storedInfo[projectName]?.selectedTab || null;
  });

  const { setSelectedNodeId, setSelectedNode, selectedNode } = useTreeContext();

  useEffect(() => {
    const tabsToStore = openTabs.map(({ id, name, type, extension, tag, activeTab }) => ({
      id,
      name,
      type,
      extension,
      tag,
      activeTab,
    }));

    const storedInfo = JSON.parse(localStorage.getItem('openTabsInfo')) || {};
    storedInfo[projectName] = {
      ...storedInfo[projectName],
      openTabs: tabsToStore,
    };

    localStorage.setItem('openTabsInfo', JSON.stringify(storedInfo));
  }, [openTabs, projectName]);

  useEffect(() => {
    const storedInfo = JSON.parse(localStorage.getItem('openTabsInfo')) || {};
    if (selectedTab) {
      const { id, name, type, extension, tag, activeTab } = selectedTab;
      storedInfo[projectName] = {
        ...storedInfo[projectName],
        selectedTab: { id, name, type, extension, tag, activeTab },
      };
    } else {
      delete storedInfo[projectName].selectedTab;
    }

    localStorage.setItem('openTabsInfo', JSON.stringify(storedInfo));
  }, [selectedTab, projectName]);

  useEffect(() => {
    const storedInfo = JSON.parse(localStorage.getItem('openTabsInfo')) || {};
    storedInfo[projectName] = {
      ...storedInfo[projectName],
      selectedNode,
    };

    localStorage.setItem('openTabsInfo', JSON.stringify(storedInfo));
  }, [selectedNode, projectName]);

  const addTab = useCallback((node, code = '', language = '', activeTab = 'code') => {
    if (node?.type !== 'DIRECTORY' && !node.isNew) {
      setOpenTabs((prevTabs) => {
        const existingTab = prevTabs.find((tab) => tab.id === node.id);
        if (existingTab) return prevTabs;
        const newTab = {
          ...node,
          code: code || '',
          language: language || '',
          activeTab,
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

  const removeAllTabs = useCallback(() => {
    setOpenTabs((prevTabs) => {
      if (prevTabs.length > 1) {
        const firstTab = prevTabs[0];
        setSelectedTab(firstTab);
        setSelectedNode(firstTab);
        setSelectedNodeId(firstTab.id);
        return [firstTab];
      }
      return prevTabs;
    });
  }, [setSelectedNode, setSelectedNodeId]);

  const removeOtherTabs = useCallback((nodeId) => {
    setOpenTabs((prevTabs) => {
      const node = prevTabs.find((tab) => tab.id === nodeId);
      setSelectedTab(node);
      setSelectedNode(node);
      setSelectedNodeId(node.id);
      return [node];
    });
  }, []);

  const removeTabsToTheRight = useCallback((nodeId) => {
    setOpenTabs((prevTabs) => {
      const node = prevTabs.find((tab) => tab.id === nodeId);
      const index = prevTabs.findIndex((tab) => tab.id === nodeId);
      const tabsToTheRight = prevTabs.slice(0, index + 1);
      setSelectedTab(node);
      setSelectedNode(node);
      setSelectedNodeId(node.id);
      return tabsToTheRight;
    });
  }, []);

  const updateTabContent = useCallback((nodeId, code, language) => {
    setOpenTabs((prevTabs) => prevTabs.map((tab) => (tab.id === nodeId ? { ...tab, code, language } : tab)));
  }, []);

  const setActiveConfigTab = useCallback((nodeId, activeTab) => {
    setOpenTabs((prevTabs) => prevTabs.map((tab) => (tab.id === nodeId ? { ...tab, activeTab } : tab)));
  }, []);

  const selectTab = (node) => {
    setSelectedNode(node);
    setSelectedNodeId(node.id);
    setSelectedTab(node);
  };

  return (
    <TabContext.Provider
      value={{
        openTabs,
        selectedTab,
        addTab,
        removeTab,
        selectTab,
        updateTabContent,
        setActiveConfigTab,
        removeAllTabs,
        removeOtherTabs,
        removeTabsToTheRight,
      }}
    >
      {children}
    </TabContext.Provider>
  );
};

export const useTabContext = () => {
  return useContext(TabContext);
};

TabProvider.propTypes = {
  children: PropTypes.node.isRequired,
  projectName: PropTypes.string.isRequired,
};
