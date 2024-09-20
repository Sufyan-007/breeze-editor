import { useState } from 'react';
import { BreezeTreeView } from '../../../common/display';
import treeData from '../constants/DirectoryStructure';
import '../styles/ProjectSidebar.css';
import logos from '../../../assets/svgs/index';
import DropdownMenu from './DropdownMenu';
import PropTypes from 'prop-types';

function ProjectSidebar({ setSelectedNode }) {
  const [treedata, setTreeData] = useState(treeData);
  const [draggedNode, setDraggedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [show, setShow] = useState(true);

  const toggleSidebar = () => {
    setShow(!show);
  };

  const options = [
    { label: 'Components', icon: <img src={logos.componentsLogo} alt="Components" /> },
    { label: 'Services', icon: <img src={logos.servicesLogo} alt="Services" /> },
    { label: 'Routes', icon: <img src={logos.routesLogo} alt="Routes" /> },
    { label: 'ApiClients', icon: <i className="bi bi-file-earmark-code" /> },
  ];

  const toggleNode = (nodeId) => {
    setExpandedNodes((prevExpandedNodes) => ({
      ...prevExpandedNodes,
      [nodeId]: !prevExpandedNodes[nodeId],
    }));
  };

  const handleNodeClick = (nodeId) => {
    const selectedNode = findSelectedNode(treedata, nodeId);
    setSelectedNodeId(nodeId);
    setSelectedNode(selectedNode);
  };

  const handleAddButtonClick = () => {
    const selectedNode = findSelectedNode(treeData, selectedNodeId);

    if (selectedNode?.type === 'DIRECTORY') {
      setDropdownVisible((prev) => !prev);
    } else {
      setDropdownVisible(false);
    }
  };

  const findSelectedNode = (nodes, nodeId) => {
    if (!Array.isArray(nodes)) return null;

    for (const node of nodes) {
      if (node.id === nodeId) return node;

      if (Array.isArray(node.children)) {
        // Check if node.children is an array
        const childNode = findSelectedNode(node.children, nodeId);
        if (childNode) return childNode;
      }
    }
    return null;
  };

  const handleDropdownOptionClick = (option) => {
    if (['Components', 'Services', 'Routes', 'ApiClients'].includes(option)) {
      addNodeToTree({ type: 'FILE', parentId: selectedNodeId });
      setDropdownVisible(false);
    }
  };

  const addNodeToTree = ({ type, parentId }) => {
    setTreeData((prevTreeData) => [
      ...prevTreeData,
      {
        id: Date.now().toString(),
        name: '',
        tempName: '',
        isEditing: true,
        isNew: true,
        type,
        parentId,
        children: [],
      },
    ]);
    setExpandedNodes((prev) => ({
      ...prev,
      [parentId]: true,
    }));
  };

  const handleDragStart = (node) => setDraggedNode(node);

  const handleDrop = (destinationNode) => {
    if (!draggedNode) return;

    setTreeData((prevTreeData) =>
      prevTreeData.map((node) => {
        if (node.id === draggedNode.id) {
          return { ...draggedNode, parentId: destinationNode ? destinationNode.id : null };
        }
        return node;
      })
    );

    setDraggedNode(null);
  };

  const handleRename = (nodeId) => {
    updateNodeState(nodeId, { isEditing: true, tempName: (node) => node.name });
  };

  const handleInputChange = (nodeId, value) => {
    updateNodeState(nodeId, { tempName: value });
  };

  const handleInputSubmit = (nodeId) => {
    updateNodeState(nodeId, { name: (node) => node.tempName, isEditing: false, tempName: '' });
  };

  const handleInputCancel = (nodeId) => {
    updateNodeState(nodeId, { isEditing: false, tempName: (node) => node.name });
  };

  const handleRemoveNode = (nodeId) => {
    setTreeData((prevTreeData) => removeNode(prevTreeData, nodeId));
  };

  const removeNode = (nodes, id) =>
    nodes.filter((node) => {
      if (node.id === id) return false;
      if (node.children) node.children = removeNode(node.children, id);
      return true;
    });

  const updateNodeState = (nodeId, updates) => {
    setTreeData((prevTreeData) => {
      const updateNode = (nodes) =>
        nodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              ...Object.fromEntries(
                Object.entries(updates).map(([key, value]) => [key, typeof value === 'function' ? value(node) : value])
              ),
            };
          }
          if (node.children) {
            return { ...node, children: updateNode(node.children) };
          }
          return node;
        });
      return updateNode(prevTreeData);
    });
  };

  // Add specific file and folder functions
  const handleAddFile = (parentId) => addNodeToTree({ type: 'FILE', parentId });
  const handleAddFolder = (parentId) => addNodeToTree({ type: 'DIRECTORY', parentId });

  const states = { selectedNodeId };
  const methods = {
    setSelectedNodeId: handleNodeClick,
    handleDragStart,
    handleDrop,
    handleInputChange,
    handleInputSubmit,
    handleInputCancel,
    handleRemoveNode,
    handleRename,
    handleAddFile,
    handleAddFolder,
  };

  if (!show) {
    return (
      <div>
        <div className="collapsed-sidebar-button br-background-primary" onClick={toggleSidebar}>
          <i className="bi bi-box-arrow-in-right br-text-primary"></i>
        </div>
      </div>
    );
  }
  return (
    <aside id="sidebar" className="br-background-primary">
      <div
        className="project-sidebar pb-2"
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => {
          handleDrop(null);
        }}
      >
        <div>
          <div className="sidebar-header d-flex justify-content-between align-items-center">
            <h2 className="mb-0 med-font br-text-primary collapsible">PROJECT</h2>
            <div className="sidebar-action-buttons">
              <span className="badge breeze-badge collapsible" onClick={handleAddButtonClick}>
                <i className="small-font bi bi-plus-circle"></i>
                <span className="small-font ms-1">Add</span>
              </span>
              <DropdownMenu
                dropdownVisible={dropdownVisible}
                options={options}
                onOptionClick={handleDropdownOptionClick}
              />
              <button
                className="btn toggle-btn btn-theme br-text-primary p-0"
                type="button"
                data-bs-theme="dark"
                onClick={toggleSidebar}
              >
                <i className="large-font bi bi-box-arrow-in-left"></i>
              </button>
            </div>
          </div>
          <form className="sidebar-search">
            <input
              className="form-control br-background-secondary"
              type="text"
              placeholder="Search"
              aria-label="Search"
            />
          </form>
          <ul className="sidebar-nav">
            <BreezeTreeView
              treeDataObject={treedata}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              parentStates={states}
              parentMethods={methods}
            />
          </ul>
        </div>
        <div className="bottom-nav py-2">
          <a href="#">
            <img src={logos.settingsIcon} alt="settings" />
          </a>
          <a href="#">
            <img src={logos.StackIcon} alt="stack" />
          </a>
          <a href="#">
            <img src={logos.RestartClockIcon} alt="history" />
          </a>
          <a href="#">
            <img src={logos.AppsIcon} alt="components" />
          </a>
          <a href="#" className="run-btn med-font">
            Run
          </a>
        </div>
      </div>
    </aside>
  );
}

ProjectSidebar.propTypes = {
  setSelectedNode: PropTypes.func.isRequired,
};

export default ProjectSidebar;
