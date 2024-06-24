import React, { useState, useEffect } from "react";
import { Tree } from "react-arborist";
import { fetchFolderConfig } from "../../services/DirectoryManagementService";
import "../../css/folder.css";
import Node from "../FolderStructure/Node";

const FolderStruArborist = () => {
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

    const fetchData = async () => {
      try {
        const data = await fetchFolderConfig();
        console.log("Fetched data:", data);
        const convertedTreeData = transformData(data);
        console.log("Converted tree data:", convertedTreeData);
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

  const onCreate = async (parentId, type, lineage, tag) => {
    console.log(
      parentId,
      type,
      lineage,
      tag
    );
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/directory-management/add-node",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ parentId, type, lineage, tag }),
        }
      );
      const newItem = await response.json();
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
    console.log(id , name , "id and name");
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/directory-management/rename-node/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(name),
        }
      );

      const data = await response.json();
  
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
      const response = await fetch(
        "http://127.0.0.1:8000/directory-management/move-node",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dragId: dragIds[0], destinationId: parentId, }),
        }
      );

      const data = await response.json();
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
      const response = await fetch(
        `http://127.0.0.1:8000/directory-management/delete-node/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        removeNode(id);
      } else {
        throw new Error(`Failed to delete item: ${response.statusText}`);
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

  if (!treeData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Tree
        className="tree-node"
        data={treeData}
        openByDefault={true}
        width={600}
        height={1000}
        indent={20}
        padding={25}
        onCreate={onCreate}
        onRename={onRename}
        onMove={onMove}
        onDelete={onDelete}
      >
        {({ node, style, dragHandle }) => (
          <Node
            node={node}
            style={style}
            dragHandle={dragHandle}
            onCreate={onCreate}
            onRename={onRename}
            onDelete={onDelete}
          />
        )}
      </Tree>
    </div>
  );
};

export default FolderStruArborist;
