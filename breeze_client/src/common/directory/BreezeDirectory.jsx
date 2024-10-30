import PropTypes from 'prop-types';
import BreezeTreeNode from './BreezeTreeNode';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getFolderConfig } from '../../modules/project/services/projectService';

function BreezeDirectory({ setSelectedFolderId, selectedFolderId }) {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [directoryConfig, setDirectoryConfig] = useState({});
  const { projectName } = useParams();
  useEffect(() => {
    const fetchRootFolder = async () => {
      const rootFolderId = 'ROOT';
      try {
        const rootFolderData = await getFolderConfig(rootFolderId, projectName);

        const configs = {};

        for (const child of rootFolderData.children) {
          configs[child.id] = child;
        }

        setDirectoryConfig((prev) => ({
          ...prev,
          ...configs,
        }));
      } catch (error) {
        console.error('Error fetching root folder:', error);
      }
    };

    fetchRootFolder();
  }, [projectName]);

  const getChildren = (nodeId) => {
    const parentNode = directoryConfig[nodeId];
    if (!parentNode || !parentNode.children) return [];
    return parentNode.children.map((childId) => directoryConfig[childId]);
  };

  const hasChildren = (node) => {
    return node.children && node.children.length > 0;
  };

  const toggleNode = async (nodeId) => {
    const isNodeExpanded = expandedNodes[nodeId];
    const node = directoryConfig[nodeId];
    const children = node?.children || [];
    const areAllChildrenLoaded = children.every((childId) => directoryConfig[childId]);
    if (!isNodeExpanded && !areAllChildrenLoaded) {
      try {
        const nodeData = await getFolderConfig(nodeId, projectName);
        const configs = {};
        for (const child of nodeData.children) {
          configs[child.id] = child;
        }

        setDirectoryConfig((prev) => ({
          ...prev,
          ...configs,
        }));
      } catch (error) {
        console.error('Error fetching children for node:', nodeId, error);
      }
    }
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !isNodeExpanded,
    }));
  };

  const isExpanded = (nodeId) => {
    return !!expandedNodes[nodeId];
  };

  return (
    <div>
      {Object.values(directoryConfig)
        .filter((node) => (node.parentId === null || node.parentId === 'ROOT') && node.type === 'DIRECTORY')
        .map((node) => (
          <BreezeTreeNode
            key={node.id}
            node={node}
            level={0}
            toggleNode={toggleNode}
            selectedFolderId={selectedFolderId}
            setSelectedFolderId={setSelectedFolderId}
            expandedNodes={expandedNodes}
            getChildren={getChildren}
            hasChildren={hasChildren}
            isExpanded={isExpanded}
          />
        ))}
    </div>
  );
}

BreezeDirectory.propTypes = {
  setSelectedFolderId: PropTypes.func.isRequired,
  selectedFolderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default BreezeDirectory;
