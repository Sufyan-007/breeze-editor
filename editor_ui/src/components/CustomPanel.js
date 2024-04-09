import { React, useState } from "react";
import { Form, Button, Row , Col, Dropdown, DropdownButton } from "react-bootstrap";
import RequestBody from "./RequestBody";
import ResponseBody from "./ResponseBody";
import CustomPanelCss from "../css/CustomPanel.css";

function CustomPanel({ dummyData , tagsList }) {
  // console.log(dummyData,"dummy data ");
  // console.log(tagsList,"tagsLIst in custom Panel");
  const [operationId, setOperationId] = useState(dummyData.operation_id || "");
  const [tags, setTags] = useState(dummyData.tags || []);
  const [summary, setSummary] = useState(dummyData.summary || "");
  // const [showRequestBodyForm, setShowRequestBodyForm] = useState(false);
  // const [showResponseBodyForm, setShowResponseBodyForm] = useState(false);
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

  const handleRequestBodyChange = (newData) => {
    setRequestBody((prevState) => {
      return {
        ...prevState,
        ...newData,
      };
    });
  };

  const handleResponseBodyChange = (newData) => {
    setResponseBody((prevState) => ({
      ...prevState,
      ...newData,
    }));
  };

  const handleTagSelect = (tag) => {
    setTags([tag]);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("Form submitted with data:", {
      operationId,
      tags,
      summary,
      requestBody,
      responseBody,
    });

    const data = {
      filename: dummyData.tags[0] + "Service.json",
      modified_api: 
        {
          isAuthenticationApi: dummyData.isAuthenticationApi,
          isLogin: dummyData.isLogin,
          isToken: dummyData.isToken,
          operation_id: operationId,
          tags: tags,
          summary: summary,
          request: requestBody,
          response: responseBody,
        },
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api-client-generator/modified-intermediate-json/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json(); // Await the response data
      console.log(responseData);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group
          className="mb-3 custom-form-group"
          controlId="formOperationId"
        >
          <Form.Label>Function Name</Form.Label>
          <Form.Control
            className="custom-form-control"
            type="text"
            value={operationId}
            onChange={handleOperationIdChange}
          />
        </Form.Group>

        <Form.Group className="mb-3 custom-form-group" controlId="formTags">
          <Form.Label>Service Name</Form.Label>
          <Row>
            <Col sm="4">
              <Form.Control
                type="text"
                value={tags.join(", ")}
                onChange={handleTagsChange}
              />
            </Col>
            <Col sm="3">
              <DropdownButton
                id="dropdown-basic-button"
                title="Select Service "
              >
                {tagsList.map((tag, index) => (
                  <Dropdown.Item
                    style={{ textAlign: "center", width: "100%" }}
                    key={index}
                    onClick={() => handleTagSelect(tag)}
                  >
                    {tag}
                  </Dropdown.Item>
                ))}
              </DropdownButton>
            </Col>
          </Row>
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
        </Form.Group>

        <RequestBody
          onChange={handleRequestBodyChange}
          requestBody={requestBody}
        />

        <Form.Group
          className="mb-3 custom-form-group"
          controlId="formResponseBody"
        >
          <Form.Label>Response Body:</Form.Label>
        </Form.Group>

        <ResponseBody
          onChange={handleResponseBodyChange}
          responseBody={responseBody}
        />

        <Button className="custom-btn m-3" variant="secondary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default CustomPanel;
