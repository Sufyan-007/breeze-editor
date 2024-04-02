import React, { useState, useEffect } from "react";
import { Accordion,  } from "react-bootstrap";
import CustomPanel from "./CustomPanel";

const ApiList = ({ apis}) => {
  // Extract the array of API objects from the 'data' key
//   const apiData = apis.data || [] ;
//  console.log(apis,"apidata in apilist")
  //state variables to track form values for each Api
  const [formData, setFormData] = useState([]);
  console.log(typeof(apis),"TYPE of Apis")
  useEffect(() => {
    // Initialize formData state when apiData changes
    setFormData(
      apis.data.map((api) => ({
        operationId: api.operation_id,
        tags: api.tags.join(", "),
        requestBody: "",
        responseBody: "",
        summary: api.summary,
      }))
    );
     console.log(apis.data, "apidata in apilist");
  }, [apis]);


  const handleSubmit = (index) => (e) => {
    e.preventDefault();
    // Implement your logic to handle form submission here
    console.log("Form submitted for API at index:", index);
    console.log("Updated data:", formData[index]);
  };

 

  console.log("FORM DATA ", formData)
  return (
    <div className="text-light m-3">
      <h2>List of APIs</h2>
      <Accordion defaultActiveKey="0">
        {formData.length > 0 &&
          apis.data.map((api, index) => (
            <Accordion.Item eventKey={index}>
              <Accordion.Header>{api.operation_id}</Accordion.Header>
              <Accordion.Body>
                <CustomPanel dummyData={api}
                />
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  );
};

export default ApiList;
