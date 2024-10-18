import { useState } from 'react';
import PropTypes from 'prop-types';

const TreeNode = ({ node, fetchChildren, data, handleNodeClick }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleExpand = async () => {
    if (!isExpanded && node.children && node.children.length > 0) {
      setIsLoading(true);
      await fetchChildren(node.id);
      setIsLoading(false);
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div style={{ marginLeft: '10px' }}>
      <div className="d-flex justify-content-between">
        <div>
          <span onClick={() => handleNodeClick(node)} style={{ cursor: 'pointer' }}>
            <i className="bi bi-diagram-2 med-font me-1"></i>
            {node.path} - {node.componentName}
          </span>
        </div>
        <div>
          {node.children && node.children.length > 0 && (
            <>
              <span className="mx-3" onClick={handleExpand} style={{ cursor: 'pointer' }}>
                {isExpanded ? '-' : '+'}
              </span>
              {isLoading && <span>Loading...</span>}
            </>
          )}
        </div>
      </div>

      {isExpanded && node.children && (
        <div>
          {node.children.map(
            (childId) =>
              data[childId] && (
                <TreeNode
                  key={childId}
                  node={data[childId]}
                  fetchChildren={fetchChildren}
                  data={data}
                  handleNodeClick={handleNodeClick}
                />
              )
          )}
        </div>
      )}
    </div>
  );
};

TreeNode.propTypes = {
  node: PropTypes.object,
  fetchChildren: PropTypes.func,
  data: PropTypes.object,
  handleNodeClick: PropTypes.func,
};
export default TreeNode;
