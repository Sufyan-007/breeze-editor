import React, { useState, useEffect } from "react";
import FolderTree from "react-folder-tree";
import "react-folder-tree/dist/style.css";
import { fetchFolderConfig } from "../../services/DirectoryManagementService";
const FolderTreeView = () => {
  const [treeData, setTreeData] = useState({});
  console.log(treeData)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchFolderConfig();
        const convertedTreeData = convertDataToTree(data); 
        setTreeData(convertedTreeData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = async (parentId, type, lineage, tag) => {
    console.log(
      parentId,
      "parent id",
      type,
      "type",
      "lineage",
      lineage,

      "inside handleAdditem"
    );
    // Make an API call to add the new folder/file
    const response = await fetch(
      "http://127.0.0.1:8000/directory-management/add-node",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ parentId, type, lineage, tag }),
      }
    );
    const newItem = await response.json();
  };
  
  const handleDeleteItem = async(nodeId , path ) => {
      console.log(nodeId, "node id to delete", path, "path");

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/directory-management/delete-node/${nodeId}`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete item: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error deleting item:", error); // Log the error
  }
  }
   //event trigger
  const onTreeStateChange = (state, event) => {
    console.log("state", state, "event", event);

    if (event.type === "addNode" && event.path) {
      // console.log('on tree state change', treeData[0]);
      const parentNode = getNodeByPath(treeData[0], event.path);
      console.log(parentNode, "parent node");
      if (parentNode) {
        const parentId = parentNode.id;
        const tag = parentNode.name;
        const lineage = parentNode.lineage
          ? [...parentNode.lineage, parentId]
          : [parentId];
        const type = event.params[0] ? "DIRECTORY" : "FILE";
        handleAddItem(parentId, type, lineage, tag);
      }
    }
    else if(event.type === "deleteNode" && event.path){
      const nodeToDelete = getNodeByPath(treeData[0],event.path)
       console.log(nodeToDelete, "node to delete");
       if (nodeToDelete) {
         handleDeleteItem(nodeToDelete.id, event.path);
       }
    }
  };

  const getNodeById = (tree, id) => {
    for (const node of Object.values(tree)) {
      if (node.id === id) return node;
      if (node.children) {
        const childNode = getNodeById(node.children, id);
        if (childNode) return childNode;
      }
    }
    return null;
  };
  const getNodeByPath = (root, path) => {
    console.log("inside node by path");
    let node = root;
    for (let index of path) {
      if (!node || !node.children || !node.children[index]) {
        return null;
      }
      node = node.children[index];
    }
    return node;
  };

 return (
   <div style={{ padding: "10px", color: "white" }}>
     {treeData && treeData[0] ? (
       <FolderTree data={treeData[0]} onChange={onTreeStateChange} />
     ) : (
       <div>Loading...</div>
     )}
   </div>
 );

};

const convertDataToTree = (data) => {
  const tree = {};
  const rootIds = [];

  Object.values(data).forEach((item) => {
    item.children = [];
    item.name = item.name;
    item.checked = 0;
    item.isOpen = true;

    //check if the item is a root node
    if (item.lineage.length === 0) {
      tree[item.id] = item;
      rootIds.push(item.id);
    } else {
      const parentId = item.lineage[item.lineage.length - 1];
      if (!data[parentId].children) {
        data[parentId].children = [];
      }
      data[parentId].children.push(item);
    }
  });


  return rootIds.map((rootId) => tree[rootId]);
};

export default FolderTreeView;
