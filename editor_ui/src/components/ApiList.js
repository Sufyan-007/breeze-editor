import React, { useState, useEffect } from "react";
import { Accordion,Table  } from "react-bootstrap";

import DeleteIcon from '../assets/icons/delete.svg';
import EditIcon from '../assets/icons/edit.svg'
import Custom from "./Custom";

const ApiList = ({ apis , tagsList, onClose}) => {
  // Extracting data and filenames from props
  const { data, filename } = apis;
  // console.log(tagsList,"tagslist ");
  // console.log(apis, "apidata in apilist");
  //state variables to track form values for each Api
  const [formData, setFormData] = useState([]);
  const [selectedApi, setSelectedApi] = useState("");
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    setFormData(
      Object.entries(data).map(([key, value]) => ({
        apis: value,
        filename: `${value.tags[0]}Service`,
      }))
    );
    console.log(formData, "formdata");

  }, [data, filename]);

  const handleSubmit = (index) => (e) => {
    e.preventDefault();
    // Implement your logic to handle form submission here
    // console.log("Form submitted for API at index:", index);
    // console.log("Updated data:", formData[index]);
  };

  const handleClose = () => {
    setSelectedApi(""); 
    if (onClose) {
      onClose();
    }
  };

  const handleEditClick = (api) =>{
         setSelectedApi(api)
  }

  console.log("FORM DATA ", formData);
  return (
    <div>
    {/* <h2 className="mt-5" style={{color: "white"}}>Form Data Table</h2>
    {showTable && <Table striped bordered hover variant="dark" className="mt-3">
      <thead>
        <tr>
          <th>Function Name</th>
          <th>File Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {formData.map((item, index) => (
          <tr key={index}>
            <td>{item.apis.operation_id}</td>
            <td>{item.filename}</td>
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
                      onClick={() => handleEditClick(item.apis)}
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
        ))}
      </tbody>
    </Table>}

    {selectedApi && <Custom
            dummyData={selectedApi}
            tagsList={["tag1", "tag2", "tag3"]}
            onClose={handleClose}
            
          />} */}
    
  </div>
  );
};

export default ApiList;
