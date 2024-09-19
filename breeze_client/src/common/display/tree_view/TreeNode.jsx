import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './BreezeTreeView.css';

function TreeNode({
  node,
  level,
  toggleNode,
  expandedNodes,
  getChildren,
  hasChildren,
  isExpanded,
  parentStates,
  parentMethods,
}) {
  const isSelected = parentStates.selectedNodeId === node.id;
  const isEditing = node.isEditing;
  const childNodes = getChildren(node.id);

  // Ref to focus the input when it is shown
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus(); // Focus the input when it becomes visible
    }
  }, [isEditing]);

  const handleToggle = (e) => {
    e.stopPropagation(); // Prevents node selection when clicking the toggle
    toggleNode(node.id); // Toggle the node open/close
  };

  const handleInputChange = (e) => {
    parentMethods.handleInputChange(node.id, e.target.value);
  };

  const handleInputSubmit = () => {
    if (node.tempName.trim()) {
      parentMethods.handleInputSubmit(node.id);
      parentMethods.setSelectedNodeId(null); // Deselect the node after submitting
    }
  };

  const handleInputCancel = () => {
    parentMethods.handleInputCancel(node.id); // Remove the node directly
    console.log(isSelected);
  };

  const nodeIsSelected = (e) => {
    e.stopPropagation();
    parentMethods.setSelectedNodeId(isSelected ? null : node.id);
  };

  const handleDragStart = (e) => {
    e.stopPropagation();
    parentMethods.handleDragStart(node);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (e) => {
    e.stopPropagation();
    parentMethods.handleDrop(node);
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
        className={`tree-node ${parentStates.selectedNodeId === node.id ? 'selected-node' : ''}`}
        onClick={nodeIsSelected}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        <span className="tree-node-icon">
          {node.type === 'DIRECTORY' ? (
            <i className={`bi ${isExpanded(node.id) ? 'bi-folder2-open' : 'bi-folder'} br-text-primary`} />
          ) : (
            <i className={`bi bi-filetype-${node.extension || 'jsx'} br-text-primary`} />
          )}
        </span>
        <span className="tree-node-content" onDoubleClick={(e) => e.stopPropagation()}>
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
              <button onClick={handleInputSubmit} className="node-input br-text-primary">
                <i className="bi bi-check" />
              </button>
              <button onClick={handleInputCancel} className="node-input br-text-primary">
                <i className="bi bi-x" />
              </button>
            </div>
          ) : (
            <>
              {node.name}
              {node.extension && <span>.{node.extension}</span>}
            </>
          )}
        </span>
        <span className="tree-node-state" onClick={handleToggle}>
          {!isEditing && node.type === 'DIRECTORY' && (
            <>
              <i
                className="bi bi-file-earmark-plus node-icon"
                title="Add File"
                onClick={(e) => {
                  e.stopPropagation();
                  parentMethods.handleAddFile(node.id);
                }}
              />
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
          {!isEditing && (
            <>
              <i
                className="bi bi-pencil node-icon"
                title="Rename"
                onClick={(e) => {
                  e.stopPropagation();
                  parentMethods.handleRename(node.id);
                }}
              />
              <i
                className={`bi ${hasChildren(node) ? 'bi-folder-x' : 'bi-trash'} node-icon`}
                title={hasChildren(node) ? 'Delete Folder' : 'Delete'}
                onClick={(e) => {
                  e.stopPropagation();
                  parentMethods.handleRemoveNode(node.id);
                }}
              />
            </>
          )}

          <span className="tree-node-state">
            {node.type === 'DIRECTORY' && !isEditing && (isExpanded(node.id) ? '   -   ' : '   +   ')}
          </span>
        </span>
      </div>
      {hasChildren(node) && isExpanded(node.id) && (
        <div className="tree-node-data">
          {childNodes.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              toggleNode={toggleNode}
              expandedNodes={expandedNodes}
              getChildren={getChildren}
              hasChildren={hasChildren}
              isExpanded={isExpanded}
              parentStates={parentStates}
              parentMethods={parentMethods}
            />
          ))}
        </div>
      )}
    </div>
  );
}

TreeNode.propTypes = {
  node: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  toggleNode: PropTypes.func.isRequired,
  expandedNodes: PropTypes.object.isRequired,
  getChildren: PropTypes.func.isRequired,
  hasChildren: PropTypes.func.isRequired,
  isExpanded: PropTypes.func.isRequired,
  parentStates: PropTypes.objectOf(PropTypes.any).isRequired,
  parentMethods: PropTypes.objectOf(PropTypes.func).isRequired,
};

export default TreeNode;
