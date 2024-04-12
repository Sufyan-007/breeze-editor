import React, { useState, useEffect } from "react";
import { fetchIntermediate } from "../services/IntermediatesService";
import { Table, Pagination } from "react-bootstrap";
import DeleteIcon from "../assets/icons/delete.svg";
import EditIcon from "../assets/icons/edit.svg";
import { current } from "@reduxjs/toolkit";
import Custom from "./ Custom";


export default function ServiceLists() {
  const [fetchedIntermediates, setFetchedIntermediates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const [selectedApi, setSelectedApi] = useState(null);

  useEffect(() => {
    getServices();
  }, []);

  const getServices = async () => {
    try {
      const result = await fetchIntermediate("creator");
      setFetchedIntermediates(result.files_with_apis);
    } catch (error) {
      console.error("Error fetching intermediates:", error);
    }
  };

  // Calculate total count of APIs
  const totalCount = fetchedIntermediates.reduce(
    (total, current) => total + current.apis.length,
    0 // inital value of 0 for total count
  );

  // Logic to get current items based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems =
    fetchedIntermediates &&
    fetchedIntermediates
      .flatMap((service) => service.apis)
      .slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  console.log(fetchedIntermediates, "fetchedIntermediate");

  const handleEditClick = (api) => {
    setSelectedApi(api); //set the selected API in the state
  };

 
  return (
    <div className="m-3">
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>Function Name</th>
            <th>Service Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fetchedIntermediates
            ?.flatMap((service) => service.apis)
            ?.slice(indexOfFirstItem, indexOfLastItem)
            ?.map((api, index) => {
              const service = fetchedIntermediates.find((s) =>
                s.apis.some((a) => a.operation_id === api.operation_id)
              );
              return (
                <tr key={`${api.operation_id}-${index}`}>
                  <td>{api.operation_id}</td>
                  <td>{service?.filename}</td>
                  <td>
                    <img
                      className="m-1"
                      src={EditIcon}
                      alt="Edit"
                      style={{
                        cursor: "pointer",
                        width: "20px",
                        height: "20px",
                      }}
                      onClick={() => handleEditClick(api)}
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
                  </td>
                </tr>
              );
            })}
        </tbody>
        
              <Pagination
                className=""
                style={{
                  // maxWidth: "100%",
                  backgroundColor: "#212529",
                  marginTop: "10px",
                }}
                >
                {Array.from(
                  { length: Math.ceil(totalCount / itemsPerPage) },
                  (_, i) => (
                    <Pagination.Item
                      // style={{ backgroundColor: "#212529", color: "#fff" }}
                      key={i}
                      active={i + 1 === currentPage}
                      onClick={() => paginate(i + 1)}>
                      {i + 1}
                    </Pagination.Item>
                  )
                )}
              </Pagination>
          
      </Table>
      {/* {selectedApi && (
        <Custom dummyData={dummyData} tagsList={["tag1", "tag2"]} />
      )} */}
    </div>
  );
}
