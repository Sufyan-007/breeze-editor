import { useEffect, useRef, useState } from 'react';
import { BreezeTreeView } from '../../../common/display';
import '../styles/ProjectSidebar.css';
import logos from '../../../assets/svgs/index';
import { useTreeContext } from '../context/TreeContext';
import CustomContextMenu from '../../../common/display/context-menu/BreezeContextMenu';
import { addFileOptions } from '../constants/contextMenuOptions';
import {
  deleteNodeAsync,
  fetchFolderConfig,
  renameNodeAsync,
} from '../../../redux/directory_management/directory_actions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  cancelRename,
  updateNodeEditing,
  updateNodeTempName,
} from '../../../redux/directory_management/directory_reducers';
import CustomModal from '../../../common/display/modal/BreezeModal';

function ProjectSidebar() {
  const { directoryConfig } = useSelector((state) => state.directory);
  const [draggedNode, setDraggedNode] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [show, setShow] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);

  const contextMenuRef = useRef(null);

  const { selectedNodeId, setSelectedNode, setSelectedNodeId } = useTreeContext();
  const { projectName } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    const id = 'ROOT';
    dispatch(fetchFolderConfig({ id, projectName })).unwrap();
  }, [dispatch]);

  const toggleNode = async (nodeId) => {
    const isNodeExpanded = expandedNodes[nodeId];
    const node = directoryConfig[nodeId];
    const children = node?.children || [];
    const areAllChildrenLoaded = children.every((childId) => directoryConfig[childId]);
    if (!isNodeExpanded && !areAllChildrenLoaded) {
      try {
        await dispatch(fetchFolderConfig({ id: nodeId, projectName })).unwrap();
      } catch (error) {
        console.error('Error fetching children for node:', nodeId, error);
      }
    }
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !isNodeExpanded,
    }));
  };

  const handleNodeClick = (nodeId) => {
    const selectedNode = directoryConfig[nodeId];
    setSelectedNodeId(nodeId);
    setSelectedNode(selectedNode);
  };

  const handleContextMenuSelection = () => {
    addNodeToTree({ type: 'FILE', parentId: selectedNodeId });
  };

  const addNodeToTree = ({ type, parentId }) => {
    // setTreeData((prevTreeData) => [
    //   ...prevTreeData,
    //   {
    //     id: Date.now().toString(),
    //     name: '',
    //     tempName: '',
    //     isEditing: true,
    //     isNew: true,
    //     type,
    //     parentId,
    //     children: [],
    //   },
    // ]);
    // setExpandedNodes((prev) => ({
    //   ...prev,
    //   [parentId]: true,
    // }));
  };

  const handleDragStart = (node) => setDraggedNode(node);

  const handleDrop = (destinationNode) => {
    // if (!draggedNode) return;
    // const newParentId = destinationNode?.type === 'FILE' ? destinationNode.parentId : destinationNode?.id || null;
    // setTreeData((prev) => ({
    //   ...prev,
    //   [draggedNode.id]: {
    //     ...draggedNode,
    //     parentId: newParentId,
    //   },
    // }));
    // setDraggedNode(null);
  };

  const handleRename = (nodeId) => {
    dispatch(updateNodeEditing({ nodeId, isEditing: true, tempName: directoryConfig[nodeId].name }));
  };

  const handleInputChange = (nodeId, newValue) => {
    dispatch(updateNodeTempName({ nodeId, tempName: newValue }));
  };

  const handleInputSubmit = (nodeId) => {
    const node = directoryConfig[nodeId];
    if (node?.tempName.trim()) {
      dispatch(renameNodeAsync({ projectId: projectName, nodeId, newName: node.tempName })).unwrap();
    }
  };

  const handleInputCancel = (nodeId) => {
    dispatch(cancelRename({ nodeId }));
  };

  const handleRemoveNode = (nodeId) => {
    setNodeToDelete(nodeId);
    setModalOpen(true);
  };
  const confirmDelete = () => {
    if (nodeToDelete) {
      dispatch(deleteNodeAsync({ projectId: projectName, nodeId: nodeToDelete }));
    }
    setModalOpen(false);
    setNodeToDelete(null);
  };
  const cancelDelete = () => {
    setModalOpen(false);
    setNodeToDelete(null);
  };

  const toggleSidebar = () => setShow((prev) => !prev);

  const handleAddFile = (parentId) => addNodeToTree({ type: 'FILE', parentId });
  const handleAddFolder = (parentId) => addNodeToTree({ type: 'DIRECTORY', parentId });

  const methods = {
    handleNodeClick,
    handleDragStart,
    handleDrop,
    handleInputChange,
    handleInputSubmit,
    handleInputCancel,
    handleRemoveNode,
    handleRename,
    handleAddFile,
    handleAddFolder,
    addNodeToTree,
  };

  if (!show) {
    return (
      <div>
        <div className="collapsed-sidebar-button br-background-primary" onClick={toggleSidebar}>
          <i className="bi bi-box-arrow-in-right br-text-primary"></i>
        </div>
      </div>
    );
  }
  return (
    <>
      <aside id="sidebar" className="br-background-primary">
        <div
          className="project-sidebar pb-2 h-100"
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => {
            handleDrop(null);
          }}
        >
          <div className="h-100">
            <div className="sidebar-header d-flex justify-content-between align-items-center">
              <h2 className="mb-0 med-font br-text-primary collapsible">PROJECT</h2>
              <div className="sidebar-action-buttons">
                <span
                  className="badge breeze-badge collapsible"
                  onClick={(e) => {
                    contextMenuRef.current?.handleEvent(e);
                  }}
                >
                  <i className="small-font bi bi-plus-circle"></i>
                  <span className="small-font ms-1">Add</span>
                </span>
                <CustomContextMenu
                  ref={contextMenuRef}
                  menuItems={addFileOptions(selectedNodeId, handleContextMenuSelection)}
                  onSelection={handleContextMenuSelection}
                  defaultOrientation={{ right: true, bottom: true }}
                />
                <button
                  className="btn toggle-btn btn-theme br-text-primary p-0"
                  type="button"
                  data-bs-theme="dark"
                  onClick={toggleSidebar}
                >
                  <i className="large-font bi bi-box-arrow-in-left"></i>
                </button>
              </div>
            </div>
            <form className="sidebar-search">
              <input
                className="form-control br-background-secondary"
                type="text"
                placeholder="Search"
                aria-label="Search"
              />
            </form>
            <ul className="sidebar-nav">
              <BreezeTreeView
                treeDataObject={directoryConfig}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                parentMethods={methods}
              />
            </ul>
          </div>
          <div className="bottom-nav py-2">
            <a>
              <img
                src={logos.settingsIcon}
                alt="settings"
                onClick={() =>
                  setSelectedNode({
                    name: 'Settings',
                    tag: 'SETTINGS',
                  })
                }
              />
            </a>
            <a href="#">
              <img src={logos.StackIcon} alt="stack" />
            </a>
            <a href="#">
              <img src={logos.RestartClockIcon} alt="history" />
            </a>
            <a href="#">
              <img src={logos.AppsIcon} alt="components" />
            </a>
            <a href="#" className="run-btn med-font">
              Run
            </a>
          </div>
        </div>
      </aside>
      <CustomModal
        isOpen={isModalOpen}
        onClose={cancelDelete}
        header={{ title: 'Confirm Deletion' }}
        footer={{
          buttons: [
            {
              label: 'Delete',
              onClick: confirmDelete,
              className: 'btn btn-danger',
            },
            {
              label: 'Cancel',
              onClick: cancelDelete,
              className: 'btn btn-secondary',
            },
          ],
        }}
      >
        Are you sure you want to delete this node? This action cannot be undone.
      </CustomModal>
    </>
  );
}

export default ProjectSidebar;
