import { React, useState } from "react";
import {
  Form,
  Button,
  Row,
  Col,
  Dropdown,
  DropdownButton,
  Offcanvas,
} from "react-bootstrap";
import RequestBody from "./RequestBody";
import ResponseBody from "./ResponseBody";
import Customcss from "../css/Custom.css";

function Custom({ dummyData, tagsList = [] }) {
  const [operationId, setOperationId] = useState(dummyData.operation_id || "");
  const [tags, setTags] = useState(dummyData.tags || []);
  const [summary, setSummary] = useState(dummyData.summary || "");
  const [requestBody, setRequestBody] = useState(dummyData.request);
  const [responseBody, setResponseBody] = useState(dummyData.response);
  const [show, setShow] = useState(false);
  const [showRequestBodyForm, setShowRequestBodyForm] = useState(false);
  const [showResponseBodyForm, setShowResponseBodyForm] = useState(false);

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

  const handleTagSelect = (tag) => {
    setTags([tag]);
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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const toggleRequestBodyForm = () => {
    setShowRequestBodyForm(!showRequestBodyForm);
    setShowResponseBodyForm(false);
    if (showRequestBodyForm) {
      setRequestBody(dummyData.request);
    }
  };

  const toggleResponseBodyForm = () => {
    setShowResponseBodyForm(!showResponseBodyForm);
    setShowRequestBodyForm(false);
    if (showResponseBodyForm) {
      setResponseBody(dummyData.response);
    }
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
      modified_api: {
        is_authentication_api: dummyData.is_authentication_api,
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
      <Button variant="primary" onClick={handleShow}>
        Launch
      </Button>

      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className="custom-offcanvas"
      >
        <Offcanvas.Header>
          <Row className="d-flex justify-content-between align-items-center w-100">
            <Col>Edit API</Col>
            <Col md={{ span: 1 }}>
              <Button
                variant="secondary"
                className="m-1"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </Col>
            <Col md={{ span: 1 }}>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Row className="d-flex">
            <Col className="sidebar-offcanvas col-1">
              <Button onClick={toggleRequestBodyForm}>RequestBody</Button>
              <Button onClick={toggleResponseBodyForm}>ResponseBody</Button>
            </Col>
            <Col className="main-content">
              <Form className="mt-5">
                {!showRequestBodyForm && !showResponseBodyForm && (
                  <>
                    <Form.Group
                      className="mt-3 mb-3 custom-form-group"
                      controlId="formOperationId"
                    >
                      <Row>
                        <Col sm={3}>
                          <Form.Label>Function Name</Form.Label>
                        </Col>
                        <Col sm={9}>
                          <Form.Control
                            className="custom-form-control"
                            type="text"
                            value={operationId}
                            onChange={handleOperationIdChange}
                          />
                        </Col>
                      </Row>
                    </Form.Group>

                    <Form.Group
                      className="mt-3 mb-3 custom-form-group"
                      controlId="formTags"
                    >
                      <Row>
                        <Col sm={3}>
                          <Form.Label>Service Name</Form.Label>
                        </Col>
                        <Col sm={9}>
                          <Row>
                            <Col sm="4">
                              <Form.Control
                                className=" custom-form-control"
                                type="text"
                                value={tags.join(", ")}
                                onChange={handleTagsChange}
                              />
                            </Col>
                            <Col sm="3">
                              <DropdownButton
                                id="dropdown-basic-button"
                                title="Select Service "
                                variant="secondary"
                              >
                                {tagsList.map((tag, index) => (
                                  <Dropdown.Item
                                    style={{
                                      textAlign: "center",
                                      width: "100%",
                                    }}
                                    key={index}
                                    onClick={() => handleTagSelect(tag)}
                                  >
                                    {tag}
                                  </Dropdown.Item>
                                ))}
                              </DropdownButton>
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </Form.Group>

                    <Form.Group
                      className="mb-3 mt-3 custom-form-group"
                      controlId="formSummary"
                    >
                      <Row>
                        <Col sm={3}>
                          <Form.Label>Summary</Form.Label>
                        </Col>
                        <Col sm={9}>
                          <Form.Control
                            style={{
                              maxWidth: "50vw",
                              backgroundColor: "#222222",
                            }}
                            className="custom-form-control"
                            as="textarea"
                            rows={3}
                            value={summary}
                            onChange={handleSummaryChange}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </>
                )}

                {showRequestBodyForm && (
                  <Form.Group
                    className="mb-3 custom-form-group"
                    controlId="formRequestBody"
                  >
                    <RequestBody
                      onChange={handleRequestBodyChange}
                      requestBody={requestBody}
                    />
                  </Form.Group>
                )}

                {showResponseBodyForm && (
                  <Form.Group
                    className="mb-3 custom-form-group"
                    controlId="formResponseBody"
                  >
                    <ResponseBody
                      onChange={handleResponseBodyChange}
                      responseBody={responseBody}
                    />
                  </Form.Group>
                )}
              </Form>
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}
export default Custom;
