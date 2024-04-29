import React, { useState, useEffect } from "react";
import {
  getAuthFileApis
} from "../../services/IntermediatesService";
import { Table } from "react-bootstrap";
import DeleteIcon from "../../assets/icons/delete.svg";
import EditIcon from "../../assets/icons/edit.svg";
import { useParams } from "react-router";

export default function AuthApiList({ onEditAuthService }) {
  const [apiList, setApiList] = useState([]);

  useEffect(() => {
    fetchAuthApiList();
  }, []);
  const appName = useParams();

  const fetchAuthApiList = async () => {
    try {
      const result = await getAuthFileApis(appName.projectName, null);
      setApiList(result["data"]);
    } catch (error) {
      console.error("Error generate react service:", error);
    }
  };
  const handleEditClick = (apiId) => {
    onEditAuthService(apiId);
  };

  return (
    <div className="m-5" style={{ width: "95%" }}>
      {apiList && apiList.length > 0 ? (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th colSpan={9}>Name</th>
              <th colSpan={3}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {apiList.map((api, apiIndex) => (
              <tr key={`${api.id}`}>
                <td colSpan={9}>
                  <div className="name-cell">{api.operation_id}</div>
                </td>
                <td colSpan={3}>
                  <div className="actions-cell">
                    <img
                      className="m-1"
                      src={EditIcon}
                      alt="Edit"
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                      }}
                      onClick={() => handleEditClick(api.id)}
                    />
                    <img
                      src={DeleteIcon}
                      alt="Delete"
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <h5 style={{ color: "white", textAlign: "center" }}>
          No services found
        </h5>
      )}
    </div>
  );
}
