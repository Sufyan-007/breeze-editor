import { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/BreezeTreeView.css';
import { useTreeContext } from '../../context/TreeContext';
import CustomContextMenu from '../../../../common/display/context-menu/BreezeContextMenu';
import { addFileOptions, fileOptions, folderOptions } from '../../constants/contextMenuOptions';
import { getIconClass } from '../../constants/ExtensionBasedIcon';

function TreeNode({ node, level, toggleNode, expandedNodes, getChildren, hasChildren, isExpanded, parentMethods }) {
  const { selectedNodeId } = useTreeContext();
  const isSelected = selectedNodeId === node.id;
  const isEditing = node.isEditing;
  const contextMenuRef = useRef(null);
  const [menuItems, setMenuItems] = useState([]);

  const childNodes = getChildren(node.id);

  const inputRef = useRef(null);
  const handleContextMenuSelection = (nodeId) => {
    parentMethods.addNodeToTree({ type: 'FILE', parentId: nodeId });
    if (!isExpanded(nodeId)) {
      toggleNode(nodeId);
      return;
    }
    toggleNode(nodeId);
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    toggleNode(node.id);
  };

  const handleInputChange = (e) => {
    parentMethods.handleInputChange(node.id, e.target.value);
  };

  const handleInputSubmit = () => {
    if (node?.tempName.trim()) {
      parentMethods.handleInputSubmit(node.id);
      // parentMethods.handleNodeClick(null);
    }
  };

  const handleInputCancel = () => {
    parentMethods.handleInputCancel(node.id);
  };

  const nodeIsSelected = () => {
    parentMethods.handleNodeClick(node.id);
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    parentMethods.handleDragStart(node);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.stopPropagation();
    parentMethods.handleDrop(node);
  };

  const handleAddFileClick = (e) => {
    e.stopPropagation();
    setMenuItems(addFileOptions(node.id, handleContextMenuSelection));
    contextMenuRef.current?.handleEvent(e);
  };

  const handleContextMenu = (e) => {
    contextMenuRef.current?.handleEvent(e);
    setMenuItems(
      node.type === 'DIRECTORY'
        ? folderOptions(node.id, handleContextMenuSelection, parentMethods.handleRename)
        : fileOptions(node.id, parentMethods.handleRename, parentMethods.handleRemoveNode)
    );
  };

  return (
    <div
      style={{ marginLeft: `${level * 10}px` }}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div
        className={`tree-node ${isSelected ? 'selected-node' : ''}`}
        onClick={() => {
          handleToggle();
          nodeIsSelected();
        }}
        onContextMenu={handleContextMenu}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <CustomContextMenu
          ref={contextMenuRef}
          menuItems={menuItems}
          onSelection={(value) => {
            value();
          }}
          width={180}
        />
        <span className="tree-node-icon">
          {node.type === 'DIRECTORY' ? (
            <i className={`bi ${isExpanded(node.id) ? 'bi-folder2-open' : 'bi-folder'}`} style={{ color: '#FFC700' }} />
          ) : (
            <i
              className={`bi ${getIconClass(node?.extension).iconClass}`}
              style={{ color: getIconClass(node?.extension).color }}
            />
          )}
        </span>
        <span className="tree-node-content">
          {isEditing ? (
            <div>
              <input
                className="node-input br-text-primary"
                type="text"
                value={node.tempName}
                onChange={handleInputChange}
                onClick={(e) => e.stopPropagation()}
                ref={inputRef}
                placeholder="Enter name"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleInputSubmit();
                }}
                type="button"
                className="node-input br-text-primary"
              >
                <i className="bi bi-check" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleInputCancel();
                }}
                className="node-input br-text-primary"
              >
                <i className="bi bi-x" />
              </button>
            </div>
          ) : (
            <>
              {node.name}
              {node.extension && <span>.{node.extension === 'SX' ? 'jsx' : node.extension}</span>}
            </>
          )}
        </span>
        <span className="tree-node-state">
          {!isEditing && node.type === 'DIRECTORY' && !node.isProtected && (
            <>
              <i className="bi bi-file-earmark-plus node-icon" title="Add File" onClick={handleAddFileClick} />
              <i
                className="bi bi-folder-plus node-icon"
                title="Add Folder"
                onClick={(e) => {
                  e.stopPropagation();
                  parentMethods.handleAddFolder(node.id);
                }}
              />
            </>
          )}
          {!isEditing && !node.isProtected && (
            <>
              <i
                className="bi bi-pencil node-icon"
                title="Rename"
                onClick={(e) => {
                  e.stopPropagation();
                  parentMethods.handleRename(node.id);
                }}
              />
              {!node.isProtected && (
                <i
                  className="bi bi-trash node-icon"
                  title="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    parentMethods.handleRemoveNode(node.id);
                  }}
                />
              )}
            </>
          )}
        </span>
      </div>
      {hasChildren(node) && isExpanded(node.id) && (
        <div className="tree-node-children">
          {childNodes
            .filter((childNode) => childNode)
            .map((childNode) => (
              <TreeNode
                key={childNode.id}
                node={childNode}
                level={level + 1}
                toggleNode={toggleNode}
                expandedNodes={expandedNodes}
                getChildren={getChildren}
                hasChildren={hasChildren}
                isExpanded={isExpanded}
                parentMethods={parentMethods}
              />
            ))}
        </div>
      )}
    </div>
  );
}

TreeNode.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    extension: PropTypes.string,
    parentId: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.string),
    isProtected: PropTypes.bool,
    tempName: PropTypes.string,
    isEditing: PropTypes.bool,
  }).isRequired,
  level: PropTypes.number.isRequired,
  toggleNode: PropTypes.func.isRequired,
  expandedNodes: PropTypes.object.isRequired,
  getChildren: PropTypes.func.isRequired,
  hasChildren: PropTypes.func.isRequired,
  isExpanded: PropTypes.func.isRequired,
  parentMethods: PropTypes.objectOf(PropTypes.func).isRequired,
};

export default TreeNode;
