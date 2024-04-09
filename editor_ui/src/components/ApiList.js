import React, { useState, useEffect } from "react";
import { Accordion,  } from "react-bootstrap";
import CustomPanel from "./CustomPanel";

const ApiList = ({ apis , tagsList }) => {
  // Extracting data and filenames from props
  const { data, filename } = apis;
  // console.log(tagsList,"tagslist ");
  // console.log(apis, "apidata in apilist");
  //state variables to track form values for each Api
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    setFormData(
      data.map((apiGroup, index) => ({
        apis: apiGroup,
        filename: filename[index],
      }))
    );

  }, [data, filename]);

  const handleSubmit = (index) => (e) => {
    e.preventDefault();
    // Implement your logic to handle form submission here
    // console.log("Form submitted for API at index:", index);
    // console.log("Updated data:", formData[index]);
  };

  // console.log("FORM DATA ", formData);
  return (
    <div className="text-light m-3">
      {formData.map((apiGroup, index) => (
        <div key={index}>
          <h3 className="m-3">{apiGroup.filename.replace(".json","")}</h3>
          <Accordion defaultActiveKey="0">
            {apiGroup.apis.map((api, apiIndex) => (
              <Accordion.Item key={apiIndex} eventKey={`${index}-${apiIndex}`}>
                <Accordion.Header>{api.operation_id}</Accordion.Header>
                <Accordion.Body>
                  <CustomPanel dummyData={api} tagsList={tagsList}  />
                </Accordion.Body>
              </Accordion.Item>
            ))} 
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default ApiList;
