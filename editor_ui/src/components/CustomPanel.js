import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import RequestBody from "./RequestBody";
import ResponseBody from "./ResponseBody";

function CustomPanel({
  fields,
  onSubmit,
  requestBodyComponent,
  responseBodyComponentm
}) {
  const [showRequestBodyForm, setShowRequestBodyForm] = useState(false);
  const [showResponseBodyForm, setShowResponseBodyForm] = useState(false);
  const [formData, setFormData] = useState({});

  const handleFieldChange = (e, fieldName) =>{
    const {value} = e.target;
    setFormData((prevData) => ({ ...prevData, [fieldName]: value }));
  }
  const handleAddRequestBody = () => {
    setShowRequestBodyForm(!showRequestBodyForm);
  };

  const handleAddResponseBody = () => {
    setShowResponseBodyForm(!showResponseBodyForm);
  };

  // const handleRequestBodyChange = (newData) => {
  //   setRequestBody({ ...requestBody, ...newData });
  //   console.log(newData, "newwwww data in custom panel");
  // };

  // const handleResponseBodyChange = (newData) => {
  //   setResponseBody({ ...responseBody, ...newData });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        {fields.map((field) => (
          <Form.Group
            key={field.id}
            className="mb-3"
            controlId={`form${field.id}`}
          >
            <Form.Label>{field.label}</Form.Label>
            <Form.Control
              type={field.type}
              value={formData[field.id] || ""}
              onChange={(e) => handleFieldChange(e, field.id)}
            />
          </Form.Group>
        ))}

        <Form.Group className="mb-3" controlId="formRequestBody">
          <Form.Label>Request Body:</Form.Label>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={handleAddRequestBody}
          >
            Add Request Body
          </Button>
        </Form.Group>

        {showRequestBodyForm && (
          // <RequestBody onChange={handleRequestBodyChange} />
          <RequestBody/>
        )}

        <Form.Group className="mb-3" controlId="formResponseBody">
          <Form.Label>Response Body:</Form.Label>
          <Button
            variant="secondary"
            className="ms-2"
            onClick={handleAddResponseBody}
          >
            Add Response Body
          </Button>
        </Form.Group>
        {showResponseBodyForm && (
          // <ResponseBody onChange={handleResponseBodyChange} />
          <ResponseBody />
        )}


        <Button variant="secondary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default CustomPanel;
