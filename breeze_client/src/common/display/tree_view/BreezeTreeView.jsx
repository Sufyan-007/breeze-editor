import PropTypes from 'prop-types';
import TreeNode from './TreeNode';
import './BreezeTreeView.css';

function BreezeTreeView({ treeDataObject, expandedNodes, toggleNode, parentStates, parentMethods }) {
  // Helper function to get children nodes
  const getChildren = (nodeId) => {
    return treeDataObject.filter((node) => node.parentId === nodeId);
  };

  // Helper function to check if a node has children
  const hasChildren = (node) => {
    return getChildren(node.id).length > 0;
  };

  // Helper function to check if a node is expanded
  const isExpanded = (nodeId) => {
    return !!expandedNodes[nodeId];
  };

  return (
    <div className="tree-view">
      {treeDataObject
        .filter((node) => node.parentId === null) // Top-level nodes
        .map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            level={0}
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
  );
}

BreezeTreeView.propTypes = {
  treeDataObject: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      extension: PropTypes.string,
      parentId: PropTypes.string,
    })
  ).isRequired,
  expandedNodes: PropTypes.object.isRequired,
  toggleNode: PropTypes.func.isRequired,
  parentStates: PropTypes.object.isRequired,
  parentMethods: PropTypes.object.isRequired,
};

export default BreezeTreeView;
