import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

// Create the Tree Context
const TreeContext = createContext();

// Hook to use the context
export const useTreeContext = () => useContext(TreeContext);

// Provider component to wrap the tree components
export const TreeProvider = ({ children }) => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNode, setSelectedNode] = useState({});

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
};
