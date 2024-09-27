import { useState } from 'react';
import PropTypes from 'prop-types';
import TreeNode from './BreezeTreeNode';

const Tree = ({ data, renderNode, handleNodeClick }) => {
  const [expandedNodes, setExpandedNodes] = useState([]);

  const getChildNodes = (parentId, allNodes) => {
    return allNodes.filter((node) => node.parentPath === parentId);
  };

  const handleNodeExpand = (nodeId) => {
    if (expandedNodes.includes(nodeId)) {
      setExpandedNodes(expandedNodes.filter((id) => id !== nodeId));
    } else {
      setExpandedNodes([...expandedNodes, nodeId]);
    }
  };

  const rootNodes = data.filter((node) => node.parentPath === '');

  return (
    <div className="br-tree-view">
      {rootNodes.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          allNodes={data}
          renderNode={renderNode}
          getChildNodes={getChildNodes}
          onNodeClick={handleNodeClick}
          onNodeExpand={handleNodeExpand}
          expandedNodes={expandedNodes}
        />
      ))}
    </div>
  );
};

Tree.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string,
      routePath: PropTypes.string,
      element: PropTypes.string,
      children: PropTypes.array,
    })
  ).isRequired,
  renderNode: PropTypes.func.isRequired,
  handleNodeClick: PropTypes.func.isRequired,
};

export default Tree;
