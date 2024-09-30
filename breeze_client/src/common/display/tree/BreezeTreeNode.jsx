import PropTypes from 'prop-types';
import './BreezeTree.css';

const TreeNode = ({ node, allNodes, renderNode, getChildNodes, onNodeClick, onNodeExpand, expandedNodes }) => {
  const isExpanded = expandedNodes.includes(node.id);
  const children = getChildNodes(node.id, allNodes);

  return (
    <div className="ps-2">
      <div
        style={{
          cursor: 'pointer',
          alignItems: 'center',
        }}
        className="d-flex justify-content-between pe-2 br-tree-node"
        onClick={() => onNodeClick(node)}
      >
        <div>{renderNode(node)}</div>
        <div>
          {children.length > 0 && (
            <span className="br-text-primary" onClick={() => onNodeExpand(node.id)}>
              {isExpanded ? '-' : '+'}
            </span>
          )}
        </div>
      </div>

      {isExpanded && (
        <div>
          {children.map((childNode) => (
            <TreeNode
              key={childNode.id}
              node={childNode}
              allNodes={allNodes}
              renderNode={renderNode}
              getChildNodes={getChildNodes}
              onNodeClick={onNodeClick}
              onNodeExpand={onNodeExpand}
              expandedNodes={expandedNodes}
            />
          ))}
        </div>
      )}
    </div>
  );
};

TreeNode.propTypes = {
  node: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    routePath: PropTypes.string,
    element: PropTypes.string,
    children: PropTypes.array,
  }).isRequired,
  allNodes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      routePath: PropTypes.string,
      element: PropTypes.string,
      children: PropTypes.array,
    })
  ).isRequired,
  renderNode: PropTypes.func.isRequired,
  getChildNodes: PropTypes.func.isRequired,
  onNodeClick: PropTypes.func.isRequired,
  onNodeExpand: PropTypes.func.isRequired,
  expandedNodes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default TreeNode;
