import PropTypes from 'prop-types';
import TreeNode from './TreeNode';
import '../../styles/BreezeTreeView.css';

function BreezeTreeView({ treeDataObject, expandedNodes, toggleNode, parentMethods }) {
  const getChildren = (nodeId) => {
    const parentNode = treeDataObject[nodeId];
    if (!parentNode || !parentNode.children) return [];

    const children = parentNode.children.map((childId) => treeDataObject[childId]);

    return children.sort((a, b) => {
      if (a.type === 'DIRECTORY' && b.type !== 'DIRECTORY') return -1;
      if (a.type !== 'DIRECTORY' && b.type === 'DIRECTORY') return 1;
      if (a.type === 'CONFIG' && b.type !== 'CONFIG') return 1;
      if (a.type !== 'CONFIG' && b.type === 'CONFIG') return -1;
      return a.name.localeCompare(b.name);
    });
  };

  const hasChildren = (node) => node.children && node.children.length > 0;

  const isExpanded = (nodeId) => !!expandedNodes[nodeId];

  return (
    <div className="tree-view">
      {Object.values(treeDataObject)
        .filter((node) => node.parentId === null || node.parentId === 'ROOT')
        .sort((a, b) => {
          if (a.type === 'DIRECTORY' && b.type !== 'DIRECTORY') return -1;
          if (a.type !== 'DIRECTORY' && b.type === 'DIRECTORY') return 1;
          if (a.type === 'CONFIG' && b.type !== 'CONFIG') return 1;
          if (a.type !== 'CONFIG' && b.type === 'CONFIG') return -1;
          return a.name.localeCompare(b.name);
        })
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
            parentMethods={parentMethods}
          />
        ))}
    </div>
  );
}

BreezeTreeView.propTypes = {
  treeDataObject: PropTypes.objectOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string,
      extension: PropTypes.string,
      parentId: PropTypes.string,
      children: PropTypes.arrayOf(PropTypes.string),
      isProtected: PropTypes.bool,
      tempName: PropTypes.string,
      isEditing: PropTypes.bool,
    })
  ).isRequired,
  expandedNodes: PropTypes.object.isRequired,
  toggleNode: PropTypes.func.isRequired,
  parentMethods: PropTypes.object.isRequired,
};

export default BreezeTreeView;
