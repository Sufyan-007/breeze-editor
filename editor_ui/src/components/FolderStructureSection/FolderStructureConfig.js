import React, { useState, useEffect } from "react";
import { Tree } from "react-arborist";
import {
  fetchFolderConfig,
  onAdd,
  onRenameNode,
  onMoveNode,
  onDeleteNode,
} from "../../services/DirectoryManagementService";
import "../../css/folder.css";
import { useParams } from "react-router-dom";
import Node from "./Node";
import { uploadFile } from "../../services/ResourceUploadService.js";
import ResourcesUploadModal from "../ResourcesConfiguration/ResourcesUploadModal.js";
import DeleteConfirmationModal from "../common/DeleteConfirmationModal.js";
import AddFolderModal from "./AddFolderModal.js";

const FolderStructureConfig = ({ onHide, onSelectPath, resourceUpload }) => {
  const [treeData, setTreeData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selectedPath, setSelectedPath] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFileName, setDeleteFileName] = useState("");
  const [selectedNode, setSelectedNode] = useState(null);
  const { projectName } = useParams();

  useEffect(() => {
    fetchData();
  }, [projectName]);

  useEffect(() => {
    console.log("jkjkhjg");
  }, [selectedNode]);

  const fetchData = async () => {
    try {
      const data = await fetchFolderConfig(projectName);
      const convertedTreeData = transformData(data);
      setTreeData(convertedTreeData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const transformData = (data) => {
    const idMap = {};
    let rootNodes = [];

    Object.values(data).forEach((item) => {
      if (!item.lineage || item.lineage.length === 0) {
        const rootNode = { ...item, children: [] };
        idMap[item.id] = rootNode;
        rootNodes.push(rootNode);
      } else {
        if (!idMap[item.id]) {
          idMap[item.id] = { ...item, children: [] };
        } else {
          idMap[item.id] = {
            ...idMap[item.id],
            ...item,
            children: idMap[item.id].children || [],
          };
        }

        const parentId = item.lineage[item.lineage.length - 1];
        if (!idMap[parentId]) {
          idMap[parentId] = { children: [] };
        }
        idMap[parentId].children.push(idMap[item.id]);
      }
    });

    return rootNodes;
  };

  const onCreate = async (parentId, type, lineage, tag, name) => {
    try {
      console.log("Creating new item with details:", {
        parentId,
        type,
        lineage,
        tag,
        projectName,
      });
      const newItem = await onAdd(
        parentId,
        type,
        lineage,
        tag,
        projectName,
        name
      );
      console.log("New item created:", newItem);
      updateTreeData(parentId, newItem);
    } catch (error) {
      console.log("Failed to add item:", error);
    }
  };

  const updateTreeData = (parentId, newItem) => {
    const addNewNode = (nodes) => {
      return nodes.map((node) => {
        if (node.id === parentId) {
          return {
            ...node,
            children: [...(node.children || []), newItem],
          };
        } else if (node.children) {
          return {
            ...node,
            children: addNewNode(node.children),
          };
        }
        return node;
      });
    };
    setTreeData((prevData) => addNewNode(prevData));
    console.log(treeData, "see the updated node name ");
  };

  const onRename = async (id, name) => {
    try {
      const data = await onRenameNode(id, name, projectName);

      console.log("Rename successful", data);
      if (data.status === "success") {
        fetchData();
      }
    } catch (error) {
      console.log("Failed to rename node:", error);
    }
  };

  const onMove = async ({ dragIds, parentId }) => {
    try {
      const data = await onMoveNode(dragIds, parentId, projectName);
      if (data.status === "success") {
        console.log("move successful");
        updateTreeDataAfterMove(dragIds[0], parentId);
        fetchData();
      } else {
        console.error("Failed to move node:", data.message);
      }
    } catch (error) {
      console.error("Failed to move node:", error);
    }
  };

  const updateTreeDataAfterMove = (dragId, parentId) => {
    const moveNode = (nodes, dragId, parentId) => {
      let draggedNode = null;
      const updatedNodes = nodes.filter((node) => {
        if (node.id === dragId) {
          draggedNode = node;
          return false;
        } else if (node.children) {
          node.children = moveNode(node.children, dragId, parentId);
        }
        return true;
      });

      if (draggedNode && parentId) {
        const parentNode = findNodeById(updatedNodes, parentId);
        if (parentNode) {
          parentNode.children = [...(parentNode.children || []), draggedNode];
        }
      }
      return updatedNodes;
    };

    const findNodeById = (nodes, id) => {
      for (const node of nodes) {
        if (node.id === id) {
          return node;
        } else if (node.children) {
          const foundNode = findNodeById(node.children, id);
          if (foundNode) return foundNode;
        }
      }
      return null;
    };

    setTreeData((prevData) => moveNode(prevData, dragId, parentId));
  };

  const onDelete = async (id) => {
    try {
      const result = await onDeleteNode(id, projectName);
      if (result.status === "success") {
        removeNode(id);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const removeNode = (id) => {
    const deleteNode = (nodes) => {
      return nodes.filter((node) => {
        if (node.id === id) {
          return false;
        } else if (node.children) {
          node.children = deleteNode(node.children);
        }
        return true;
      });
    };

    setTreeData((prevData) => deleteNode(prevData));
  };

  const handleSelectPath = (node) => {
    if (node.data.type === "DIRECTORY") {
      const pathParts = [];
      let currentNode = node;
      while (currentNode) {
        pathParts.unshift(currentNode.data.name);
        currentNode = currentNode.parent;
      }
      const fullPath = pathParts.join("/");
      onSelectPath(fullPath); // Pass selected path to parent component
      setSelectedPath(fullPath);
    }
  };

  const handleUpload = async (formData) => {
    console.log("parent");
    try {
      const result = await uploadFile(formData, projectName);
      console.log(result, "result");
      if (result.message) {
        setToastMessage("File uploaded successfully");
      } else {
        setToastMessage(result.error || "Upload failed.");
      }
      fetchData();
      setShowToast(true);
    } catch (error) {
      setToastMessage("An error occurred while adding the File.");
      setShowToast(true);
    }
  };

  if (!treeData) {
    return <div>Loading...</div>;
  }

  //  const handleConfirmDelete = () => {
  //    onDelete(node.id);
  //    setShowDeleteModal(false);
  //  };

  //  const handleDelete = (fileName) => {
  //    setDeleteFileName(fileName);
  //    setShowDeleteModal(true);
  //  };
  //   const closeModal = () => {
  //     setShowDeleteModal(false);
  //   };

  return (
    <div id="folderStructureConfig">
      <div className="overflow-auto mb-2">
        <Tree
          className="tree-node"
          data={treeData}
          width={600}
          height={resourceUpload ? null : 600}
          indent={20}
          padding={25}
          onCreate={onCreate}
          onRename={onRename}
          onDelete={onDelete}
          onMove={onMove}
        >
          {({ node, style, dragHandle }) => (
            <Node
              node={node}
              style={style}
              dragHandle={dragHandle}
              onCreate={onCreate}
              onRename={onRename}
              onDelete={onDelete}
              onSelectPath={handleSelectPath} // Handle selecting path
              resourceUpload={resourceUpload}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              onUpload={handleUpload}
              // handleDelete={handleDelete}
            />
          )}
        </Tree>
      </div>
      {resourceUpload && (
        <div className="button-container">
          <button
            className="btn btn-secondary"
            onClick={onHide}
            disabled={!selectedNode}
          >
            Select as path
          </button>
        </div>
      )}
      {/* <ResourcesUploadModal
        show={isModalVisible}
        onHide={() => setIsModalVisible(false)}
        onSubmit={handleUpload}
        path={currentFolderPath}
      /> */}
      {/* <DeleteConfirmationModal
        fileName={deleteFileName}
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onDelete={handleConfirmDelete}
      /> */}
      {/* <AddFolderModal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onEnterName={handleEnterName}
      /> */}
    </div>
  );
};

export default FolderStructureConfig;
