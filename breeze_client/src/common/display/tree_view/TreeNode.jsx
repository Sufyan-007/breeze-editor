import PropTypes from 'prop-types';
import './BreezeTreeView.css';

const TreeNode = ({ node, level, toggleNode, expandedNodes, parentStates, parentMethods }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes[node.id];

  const handleToggle = () => {
    toggleNode(node.id);
    parentMethods.getLogged(node.id);
  };

  return (
    <div style={{ marginLeft: `${level * 10}px` }}>
      <div className="tree-node" onClick={() => handleToggle()} style={{ display: 'flex', alignItems: 'center' }}>
        <span className="tree-node-icon">
          {hasChildren && isExpanded ? (
            <i className="bi bi-folder2-open br-text-primary"></i>
          ) : hasChildren && !isExpanded ? (
            <i className="bi bi-folder br-text-primary"></i>
          ) : (
            <i className="bi bi-filetype-jsx br-text-primary"></i>
          )}
        </span>
        <span className="tree-node-content">{node.name}</span>
        <span className="tree-node-state">{hasChildren && (isExpanded ? '   -   ' : '   +   ')}</span>
      </div>
      {hasChildren && isExpanded && (
        <div className="tree-node-data">
          {node.children.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              level={level + 1}
              toggleNode={toggleNode}
              expandedNodes={expandedNodes}
              parentStates={parentStates}
              parentMethods={parentMethods}
            />
          ))}
        </div>
      )}
    </div>
  );
};

TreeNode.propTypes = {
  node: PropTypes.object,
  level: PropTypes.number,
  toggleNode: PropTypes.func,
  expandedNodes: PropTypes.object,
  parentStates: PropTypes.objectOf(PropTypes.any),
  parentMethods: PropTypes.objectOf(PropTypes.func),
};

export default TreeNode;
