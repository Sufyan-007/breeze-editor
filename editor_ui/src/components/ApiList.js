import React, { useState, useEffect } from "react";
import { Accordion, Form , Button } from "react-bootstrap";

const ApiList = ({ apis }) => {
  // Extract the array of API objects from the 'data' key
  const apiData = apis.data || [];

  //state variables to track form values for each Api
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    // Initialize formData state when apiData changes
    setFormData(
      apiData.map((api) => ({
        operationId: api.operation_id,
        tags: api.tags.join(", "),
        requestBody: "",
        responseBody: "",
        summary: api.summary,
      }))
    );
    
  }, [apiData]);


  const handleSubmit = (index) => (e) => {
    e.preventDefault();
    // Implement your logic to handle form submission here
    console.log("Form submitted for API at index:", index);
    console.log("Updated data:", formData[index]);
  };

  // Function to handle form input changes
  const handleInputChange = (index, field) => (e) => {
    const newFormData = [...formData];
    newFormData[index][field] = e.target.value;
    setFormData(newFormData);
  };

  console.log("FORM DATA ", formData)
  return (
    <div className="text-light m-3">
      <h2>List of APIs</h2>
      <Accordion defaultActiveKey="0">
        {formData.length > 0 &&
          apiData.map((api, index) => (
            <Accordion.Item eventKey={index}>
              <Accordion.Header>{api.operation_id}</Accordion.Header>
              <Accordion.Body>
                {/* {formData[index].operationId} */}
                <Form onSubmit={handleSubmit(index)}>
                  <Form.Group
                    className="mb-3"
                    controlId={`formOperationId_${index}`}
                  >
                    <Form.Label>Operation ID:</Form.Label>

                    <Form.Control
                      type="text"
                      value={formData[index]["operationId"]}
                      onChange={handleInputChange(index, "operationId")}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId={`formTags_${index}`}>
                    <Form.Label>Tags (comma-separated):</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData[index]["tags"]}
                      onChange={handleInputChange(index, "tags")}
                    />
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId={`formRequestBody_${index}`}
                  >
                    <Form.Label>Request Body:</Form.Label>
                    <Button>
                        Add Request Body
                    </Button>
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId={`formResponseBody_${index}`}
                  >
                    <Form.Label>Response Body:</Form.Label>
                    <Button>
                        Add Response Body 
                    </Button>
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId={`formSummary_${index}`}
                  >
                    <Form.Label>Summary:</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData[index].summary}
                      onChange={handleInputChange(index, "summary")}
                    />
                  </Form.Group>

                  <Button variant="secondary" type="submit">
                    Update
                  </Button>
                </Form>
              </Accordion.Body>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  );
};

export default ApiList;
