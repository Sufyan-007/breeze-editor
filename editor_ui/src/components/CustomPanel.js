import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import RequestBody from "./RequestBody";
import ResponseBody from "./ResponseBody";

function CustomPanel() {
  const [operationId, setOperationId] = useState("");
  const [tags, setTags] = useState([]);
  const [requestBody, setRequestBody] = useState({});
  const [responseBody, setResponseBody] = useState({});
  const [summary, setSummary] = useState("");
  const [showRequestBodyForm, setShowRequestBodyForm] = useState(false);
  const [showResponseBodyForm, setShowResponseBodyForm] = useState(false);

  const handleTagsChange = (e) => {
    const { value } = e.target;
    const tagsArray = value.split(",").map((tag) => tag.trim());
    setTags(tagsArray);
  };

  const handleAddRequestBody = () => {
    setShowRequestBodyForm(!showRequestBodyForm);
  };

  const handleAddResponseBody = () => {
    setShowResponseBodyForm(!showResponseBodyForm);
  };

  const handleRequestBodyChange = (newData) => {
    setRequestBody({ ...requestBody, ...newData });
    console.log(newData, "newwwww data in custom panel");
  };

  const handleResponseBodyChange = (newData) => {
    setResponseBody({ ...responseBody, ...newData });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      operation_id: operationId,
      tags: tags,
      request_body: requestBody,
      response_body: responseBody,
      summary: summary,
    };
    console.log("Form Data:", formData);
    // Add your logic for handling form data here
  };

  // Log the state of requestBody whenever it changes
  console.log("Request Body State:", requestBody);
  console.log("Response Body State:", responseBody);

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formOperationId">
          <Form.Label>Operation ID:</Form.Label>
          <Form.Control
            type="text"
            value={operationId}
            onChange={(e) => setOperationId(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formTags">
          <Form.Label>Tags (comma-separated):</Form.Label>
          <Form.Control
            type="text"
            value={tags.join(", ")}
            onChange={handleTagsChange}
          />
        </Form.Group>

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
          <RequestBody onChange={handleRequestBodyChange} />
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
          <ResponseBody onChange={handleResponseBodyChange} />
        )}

        <Form.Group className="mb-3" controlId="formSummary">
          <Form.Label>Summary:</Form.Label>
          <Form.Control
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </Form.Group>

        <Button variant="secondary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default CustomPanel;
