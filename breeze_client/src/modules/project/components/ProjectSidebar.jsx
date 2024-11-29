import { useEffect, useRef, useState } from 'react';
import { BreezeTreeView } from '../../../common/display';
import '../styles/ProjectSidebar.css';
import logos from '../../../assets/svgs/index';
import { useTreeContext } from '../context/TreeContext';
import CustomContextMenu from '../../../common/display/context-menu/BreezeContextMenu';
import { addFileOptions } from '../constants/contextMenuOptions';
import {
  addNodeAsync,
  fetchFolderConfig,
  moveNodeAsync,
  renameNodeAsync,
} from '../../../redux/directory_management/directory_actions';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  cancelRename,
  updateNodeEditing,
  updateNodeTempName,
  addNode,
  cancelAdd,
  cancelAllEditing,
} from '../../../redux/directory_management/directory_reducers';
import CustomModal from '../../../common/display/modal/BreezeModal';
import { useTabContext } from '../context/TabContext';
import { deleteNodeAsPerCategory } from '../hooks/deleteNodeAsPerCategory';

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
  const { removeTab, addTab, openTabs, selectTab } = useTabContext();
  const toggling = useRef(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const id = 'ROOT';
    dispatch(fetchFolderConfig({ id, projectName })).unwrap();
  }, [dispatch, projectName]);

  const toggleNode = async (nodeId) => {
    if (!toggling.current) {
      toggling.current = true;
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
      toggling.current = false;
    }
  };

  const handleNodeClick = (nodeId) => {
    const selectedNode = directoryConfig[nodeId];
    setSelectedNodeId(nodeId);
    setSelectedNode(selectedNode);
  };

  const handleContextMenuSelection = () => {
    addNodeToTree({ type: 'FILE', parentId: 'ROOT', extension: 'jsx' });
  };

  const addNodeToTree = ({ type, parentId, extension }) => {
    dispatch(addNode({ type, parentId, extension }));
  };

  const handleDragStart = (node) => setDraggedNode(node);

  const handleDrop = async (destinationNode) => {
    if (!draggedNode) return;

    const destinationNodeId =
      destinationNode?.type === 'FILE' ? destinationNode.parentId : destinationNode?.id || 'ROOT';

    if (draggedNode.parentId === destinationNodeId || draggedNode.id === destinationNodeId) return;

    try {
      await dispatch(moveNodeAsync({ projectName, nodeId: draggedNode.id, targetId: destinationNodeId })).unwrap();
    } catch (error) {
      console.error('Failed to move node:', error);
    } finally {
      setDraggedNode(null);
    }
  };

  const handleRename = (nodeId) => {
    dispatch(cancelAllEditing());
    dispatch(updateNodeEditing({ nodeId, isEditing: true, tempName: directoryConfig[nodeId].name }));
  };

  const handleInputChange = (nodeId, newValue) => {
    dispatch(updateNodeTempName({ nodeId, tempName: newValue }));
  };

  const handleInputSubmit = (nodeId) => {
    const node = directoryConfig[nodeId];
    if (!node.isNew) {
      if (node?.tempName.trim()) {
        dispatch(renameNodeAsync({ projectId: projectName, nodeId, newName: node.tempName }))
          .unwrap()
          .then(() => {
            const existingTab = openTabs.find((tab) => tab.id === nodeId);
            if (existingTab) {
              removeTab(nodeId);
            }

            const updatedNode = { ...node, name: node.tempName };
            addTab(updatedNode);

            if (nodeId === existingTab?.id) {
              selectTab(updatedNode);
            }
          })
          .catch((err) => {
            console.error('Error renaming node:', err);
          });
      }
    } else {
      // TODO : add folder api as per condition
      dispatch(addNodeAsync({ projectId: projectName, node })).unwrap();
    }
  };

  const handleInputCancel = (nodeId) => {
    const node = directoryConfig[nodeId];
    if (!node.isNew) {
      dispatch(cancelRename({ nodeId }));
    } else {
      dispatch(cancelAdd({ nodeId }));
    }
  };

  const handleRemoveNode = (nodeId) => {
    setNodeToDelete(nodeId);
    setModalOpen(true);
  };
  const confirmDelete = async () => {
    const node = directoryConfig[nodeToDelete];
    const response = await deleteNodeAsPerCategory(node, dispatch, projectName);
    if (response && response.payload.depth) {
      await dispatch(fetchFolderConfig({ id: 'ROOT', projectName, depth: response.payload.depth })).unwrap();
    }
    removeTab(nodeToDelete);
    setModalOpen(false);
    setNodeToDelete(null);
  };
  const cancelDelete = () => {
    setModalOpen(false);
    setNodeToDelete(null);
  };

  const toggleSidebar = () => setShow((prev) => !prev);

  const handleAddFile = (parentId) => {
    dispatch(cancelAllEditing());
    addNodeToTree({ type: 'FILE', parentId, extension: 'jsx' });
  };

  const handleAddFolder = (parentId) => {
    dispatch(cancelAllEditing());
    addNodeToTree({ type: 'DIRECTORY', parentId, extension: '' });
  };

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
    cancelAllEditing,
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
              // disabled: true,
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
