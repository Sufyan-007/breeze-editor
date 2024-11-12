import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';

const TreeContext = createContext();

export const useTreeContext = () => useContext(TreeContext);

// Provider component to wrap the tree components
export const TreeProvider = ({ children, projectName }) => {
  const [selectedNodeId, setSelectedNodeId] = useState(() => {
    const storedInfo = JSON.parse(localStorage.getItem('openTabsInfo')) || {};
    return storedInfo[projectName]?.selectedNode?.id || 'INDEX_HTML';
  });

  const [selectedNode, setSelectedNode] = useState(() => {
    const storedInfo = JSON.parse(localStorage.getItem('openTabsInfo')) || {};
    return (
      storedInfo[projectName]?.selectedNode || {
        name: 'index',
        parentId: 'ROOT',
        extension: 'html',
        id: 'INDEX_HTML',
        tag: 'INDEX_HTML',
        type: 'FILE',
      }
    );
  });

  useEffect(() => {
    const storedInfo = JSON.parse(localStorage.getItem('openTabsInfo')) || {};
    storedInfo[projectName] = {
      ...storedInfo[projectName],
      selectedNode: { ...selectedNode, id: selectedNodeId },
    };
    localStorage.setItem('openTabsInfo', JSON.stringify(storedInfo));
  }, [selectedNodeId, selectedNode, projectName]);

  useEffect(() => {
    const storedInfo = JSON.parse(localStorage.getItem('openTabsInfo')) || {};
    storedInfo[projectName] = {
      ...storedInfo[projectName],
      selectedNode,
    };
    localStorage.setItem('openTabsInfo', JSON.stringify(storedInfo));
  }, [selectedNode, projectName]);

  const contextValue = {
    selectedNodeId,
    selectedNode,
    setSelectedNodeId,
    setSelectedNode,
  };

  return <TreeContext.Provider value={contextValue}>{children}</TreeContext.Provider>;
};

TreeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  projectName: PropTypes.string.isRequired,
};
