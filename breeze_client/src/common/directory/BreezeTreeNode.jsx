import PropTypes from 'prop-types';

function TreeNode({
  node,
  level,
  getChildren,
  toggleNode,
  hasChildren,
  expandedNodes,
  isExpanded,
  selectedFolderId,
  setSelectedFolderId,
}) {
  const isSelected = selectedFolderId === node.id;
  const childNodes = getChildren(node.id);

  const handleToggle = () => {
    toggleNode(node.id);
  };

  const handleSelect = (node) => {
    if (node.type === 'DIRECTORY') {
      setSelectedFolderId(node.id);
    }
  };

  return (
    <div style={{ marginLeft: `${level * 10}px` }}>
      <div
        className={`tree-node ${isSelected ? 'selected-node' : ''}`}
        style={{ display: 'flex', alignItems: 'center' }}
        onClick={() => {
          handleToggle();
          handleSelect(node);
        }}
      >
        <span className="tree-node-icon">
          <i className={`bi ${isExpanded(node.id) ? 'bi-folder2-open' : 'bi-folder'}`} style={{ color: '#FFC700' }} />
        </span>
        <span className="tree-node-content">{node.name}</span>
      </div>
      {hasChildren(node) && isExpanded(node.id) && (
        <div className="tree-node-children">
          {childNodes
            .filter((childNode) => childNode && childNode.type === 'DIRECTORY')
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
                selectedFolderId={selectedFolderId}
                setSelectedFolderId={setSelectedFolderId}
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
  }).isRequired,
  level: PropTypes.number.isRequired,
  toggleNode: PropTypes.func.isRequired,
  expandedNodes: PropTypes.object.isRequired,
  getChildren: PropTypes.func.isRequired,
  hasChildren: PropTypes.func.isRequired,
  isExpanded: PropTypes.func.isRequired,
  selectedFolderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedFolderId: PropTypes.func.isRequired,
};

export default TreeNode;
