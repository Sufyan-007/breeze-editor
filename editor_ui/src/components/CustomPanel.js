import { React, useState } from "react";
import { Form, Button } from "react-bootstrap";
import RequestBody from "./RequestBody";
import ResponseBody from "./ResponseBody";
import CustomPanelCss from "../css/CustomPanel.css";

function CustomPanel({ dummyData }) {
  console.log(dummyData);
  const [operationId, setOperationId] = useState(dummyData.operation_id || "");
  const [tags, setTags] = useState(dummyData.tags || []);
  const [summary, setSummary] = useState(dummyData.summary || "");
  const [showRequestBodyForm, setShowRequestBodyForm] = useState(false);
  const [showResponseBodyForm, setShowResponseBodyForm] = useState(false);
  const [requestBody, setRequestBody] = useState(dummyData.request);
  const [responseBody, setResponseBody] = useState(dummyData.response);

  const handleOperationIdChange = (e) => {
    setOperationId(e.target.value);
  };

  const handleTagsChange = (e) => {
    const newTags = e.target.value.split(",").map((tag) => tag.trim());
    setTags(newTags);
  };

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const handleAddRequestBody = () => {
    setShowRequestBodyForm(!showRequestBodyForm);
  };

  const handleAddResponseBody = () => {
    setShowResponseBodyForm(!showResponseBodyForm);
  };

  const handleRequestBodyChange = (newData) => {
    setRequestBody((prevState) => {
      console.log(prevState, "previous state");
      return {
        ...prevState,
        ...newData,
      };
    });
  };
  console.log(requestBody, "request body in custom panel");

  const handleResponseBodyChange = (newData) => {
    setResponseBody((prevState) => ({
      ...prevState,
      ...newData,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", {
      operationId,
      tags,
      summary,
      requestBody,
      responseBody,
    });
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group
          className="mb-3 custom-form-group"
          controlId="formOperationId"
        >
          <Form.Label>Operation ID:</Form.Label>
          <Form.Control
            className="custom-form-control"
            type="text"
            value={operationId}
            onChange={handleOperationIdChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 custom-form-group" controlId="formTags">
          <Form.Label>Tags:</Form.Label>
          <Form.Control
            type="text"
            value={tags.join(", ")}
            onChange={handleTagsChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 custom-form-group" controlId="formSummary">
          <Form.Label>Summary:</Form.Label>
          <Form.Control
            className="custom-form-control"
            as="textarea"
            rows={3}
            value={summary}
            onChange={handleSummaryChange}
          />
        </Form.Group>

        <Form.Group
          className="mb-3 custom-form-group"
          controlId="formRequestBody"
        >
          <Form.Label>Request Body:</Form.Label>
          <Button
            variant="secondary"
            className="ms-2 custom-btn"
            onClick={handleAddRequestBody}
          >
            Add Request Body
          </Button>
        </Form.Group>

        {showRequestBodyForm && (
          <RequestBody
            onChange={handleRequestBodyChange}
            requestBody={requestBody}
          />
        )}

        <Form.Group
          className="mb-3 custom-form-group"
          controlId="formResponseBody"
        >
          <Form.Label>Response Body:</Form.Label>
          <Button
            variant="secondary"
            className="ms-2 custom-btn"
            onClick={handleAddResponseBody}
          >
            Add Response Body
          </Button>
        </Form.Group>
        {showResponseBodyForm && (
          <ResponseBody
            onChange={handleResponseBodyChange}
            responseBody={responseBody}
          />
        )}

        <Button className="custom-btn m-3" variant="secondary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default CustomPanel;
