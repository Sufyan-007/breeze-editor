import PropTypes from 'prop-types';
import TreeNode from './TreeNode';
import './BreezeTreeView.css';

function BreezeTreeView({ treeDataObject, expandedNodes, toggleNode, parentStates, parentMethods }) {
  return (
    <div className="tree-view">
      {treeDataObject.map((node) => (
        <TreeNode
          key={node.id}
          node={node}
          level={0}
          toggleNode={toggleNode}
          expandedNodes={expandedNodes}
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
      id: PropTypes.number.isRequired,
      type: PropTypes.string,
      name: PropTypes.string.isRequired,
      children: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
  expandedNodes: PropTypes.object,
  toggleNode: PropTypes.func,
  parentStates: PropTypes.objectOf(PropTypes.any),
  parentMethods: PropTypes.objectOf(PropTypes.func),
};
export default BreezeTreeView;
