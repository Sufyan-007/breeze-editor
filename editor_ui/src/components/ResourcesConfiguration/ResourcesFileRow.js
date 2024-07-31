import React from "react";
import DeleteIcon from "../../assets/icons/delete-trash.svg";

const ResourcesFileRow = ({ file, onDelete, onDownload }) => {
  return (
    <tr>
      <td className="text-white">{file.name}</td>
      <td className="dark">{file.path}</td>
      <td className="action-cell">
        <div
          title="Delete"
          style={{ cursor: "pointer", display: "flex", justifyContent: "space-around" }}
        >
          <i onClick={onDownload} class="bi bi-download blue" style={{ color: 'blue', fontSize:"18px" }}></i>
          <img onClick={onDelete} src={DeleteIcon} alt="Delete" height={24} />
        </div>
      </td>
    </tr>
  );
};

export default ResourcesFileRow;
