import React, { useState, useEffect } from "react";
import { fetchIntermediate } from "../services/IntermediatesService";
import { Table, Pagination } from "react-bootstrap";
import DeleteIcon from "../assets/icons/deleteicon.svg";
import EditIcon from "../assets/icons/edit.svg";
import { current } from "@reduxjs/toolkit";
import CustomPanel from "./CustomPanel";

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
  const currentItems = fetchedIntermediates && fetchedIntermediates
    .flatMap((service) => service.apis)
    .slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  console.log(fetchedIntermediates,"fetchedIntermediate");

  const handleEditClick = (api) =>{
    setSelectedApi(api); //set the selected API in the state
  }

   const dummyData = {
     operation_id: "get orders",
     tags: [],
     request: {
       method: "get",
       auth: null,
       headers: [
         {
           key: "Authorization",
           value:
             "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA2MTU1MjQ2LCJpYXQiOjE3MDM1NjMyNDYsImp0aSI6IjQ5YTliZWJjNWE0MzRkMjhhNjA5N2U4NDU0MjgzNGM1IiwidXNlcl9pZCI6MX0.Dc8mA704kS_ZgzuPnYmE7w7Kt0GWKR-oVgyOpi2O-2U",
         },
       ],
       parameters: [],
       url: {
         baseurl: "{{url}}/api/orders/7",
         host: ["{{url}}"],
         protocol: "",
         port: 0,
         path: ["api", "orders", "7"],
       },
       body: [],
     },
     response: [],
     summary: "",
   };

  return (
    <div className="m-3">
      <Table striped bordered hover>
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
                      className="m-3"
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
      </Table>
      {selectedApi && <CustomPanel dummyData={dummyData} tagsList={["tag1", "tag2" ]}/>}
      <Pagination>
        {Array.from(
          { length: Math.ceil(totalCount / itemsPerPage) },
          (_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          )
        )}
      </Pagination>
    </div>
  );
}
