import { useMemo } from 'react';
import TreeNode from './BreezeTreeNode';
import PropTypes from 'prop-types';

const Tree = ({ data, fetchChildren, handleNodeClick }) => {
  const rootNodes = useMemo(() => Object.values(data).filter((node) => !node.parentId), [data]);

  return (
    <div>
      {rootNodes.map((rootNode) => (
        <TreeNode
          key={rootNode.id}
          node={rootNode}
          fetchChildren={fetchChildren}
          data={data}
          handleNodeClick={handleNodeClick}
        />
      ))}
    </div>
  );
};

Tree.propTypes = {
  data: PropTypes.object,
  fetchChildren: PropTypes.func,
  handleNodeClick: PropTypes.func,
};

export default Tree;
