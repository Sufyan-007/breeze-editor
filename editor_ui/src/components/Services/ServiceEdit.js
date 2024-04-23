import { React, useState } from "react";
import closeButton from "../../assets/icons/close-button.svg";
import {
  Form,
  Button,
  Row,
  Col,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import RequestBody from "./RequestBody";
import ResponseBody from "./ResponseBody";
import ServiceEditCss from "../../css/ServiceEdit.css";
import { handleServiceData } from "../../services/CreateEditService.js";

function ServiceEdit({ dummyData, tagsList = [], onClose, editMode }) {
  const [operationId, setOperationId] = useState(dummyData.operation_id || "");
  const [tags, setTags] = useState(dummyData.tags || []);
  const [summary, setSummary] = useState(dummyData.summary || "");
  const [requestBody, setRequestBody] = useState(dummyData.request);
  const [responseBody, setResponseBody] = useState(dummyData.response);
  const [show, setShow] = useState(true);
  const [isAuthApi, setIsAuthApi] = useState(dummyData.is_authentication_api);
  const isEditMode = editMode === "Edit" ? true : false;

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
  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };

  async function handleSubmit(e) {
    const data = {
      filename: dummyData.tags[0] + "Service.json",
      modified_api: {
        id: dummyData.id,
        is_authentication_api: isAuthApi,
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
      const result = await handleServiceData(data);
      console.log(result, "data submitted");
      onClose();
    } catch (error) {
      console.log("Error while submitting the data", error);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "white" }}>{isEditMode ? "" : ""} </h2>
        <Button variant="secondary" className="mx-2" onClick={handleSubmit}>
          Submit
        </Button>
        <Button className="close-button" variant="secondary" onClick={onClose}>
          <img src={closeButton} alt="" height={21} />
        </Button>
      </div>
      <div
        className="main-container"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: "90vh",
          maxWidth: "100%",
        }}
      >
        <Form>
          <Form.Group
            className="mt-3 mb-3 custom-form-group"
            controlId="formOperationId"
          >
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">Function Name</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="mx-5 custom-form-control"
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
                <Form.Label className="m-3">Service Name</Form.Label>
              </Col>
              <Col sm={9}>
                <Row>
                  <Col sm="4">
                    <Form.Control
                      className="mx-5 custom-form-control"
                      type="text"
                      value={tags.join(", ")}
                      onChange={handleTagsChange}
                    />
                  </Col>
                  <Col sm="3">
                    {/* <DropdownButton
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
                    </DropdownButton> */}
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
                <Form.Label className="m-3">Summary</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="mx-5 custom-form-control"
                  as="textarea"
                  rows={3}
                  value={summary}
                  onChange={handleSummaryChange}
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group
            className="mt-3 mb-3 custom-form-group"
            controlId="formAuthenticationApi"
          >
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">IsAuthenticationApi</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Check
                  className="mx-5 mt-3"
                  type="checkbox"
                  label="True"
                  checked={isAuthApi === true}
                  onChange={() => setIsAuthApi(!isAuthApi)}
                />
              </Col>
            </Row>
          </Form.Group>
          <div className="section-div">
            <h7 className="body-sec">Request Body</h7>
          </div>
          <Form.Group
            className="mb-3 custom-form-group"
            controlId="formRequestBody"
          >
            <RequestBody
              onChange={handleRequestBodyChange}
              requestBody={requestBody}
            />
          </Form.Group>

          <div className="section-div">
            <h7 className="body-sec">Response Body</h7>
          </div>
          <Form.Group
            className="mb-3 custom-form-group"
            controlId="formResponseBody"
          >
            <ResponseBody
              onChange={handleResponseBodyChange}
              responseBody={responseBody}
            />
          </Form.Group>
        </Form>
      </div>
    </>
  );
}
export default ServiceEdit;

import { React, useState } from "react";
import closeButton from "../../assets/icons/close-button.svg";
import {
  Form,
  Button,
  Row,
  Col,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import RequestBody from "./RequestBody";
import ResponseBody from "./ResponseBody";
import ServiceEditCss from "../../css/ServiceEdit.css";
import { handleServiceData } from "../../services/CreateEditService.js";

function ServiceEdit({ dummyData, tagsList = [], onClose, editMode }) {
  const [operationId, setOperationId] = useState(dummyData.operation_id || "");
  const [tags, setTags] = useState(dummyData.tags || "");
  const [summary, setSummary] = useState(dummyData.summary || "");
  const [requestBody, setRequestBody] = useState(dummyData.request);
  const [responseBody, setResponseBody] = useState(dummyData.response);
  const [show, setShow] = useState(true);
  const [isAuthApi, setIsAuthApi] = useState(dummyData.is_authentication_api);
  const isEditMode = editMode === "Edit" ? true : false;

  const handleOperationIdChange = (e) => {
    setOperationId(e.target.value);
  };
  const handleTagsChange = (e) => {
    const newTag = e.target.value.trim();
    setTags(newTag);
  };
  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };
  const handleTagSelect = (tag) => {
    setTags(tag);
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
  const handleClose = () => {
    setShow(false);
    if (onClose) {
      onClose();
    }
  };

  async function handleSubmit(e) {
    const data = {
      filename: dummyData.tags + ".json",
      modified_api: {
        id: dummyData.id,
        is_authentication_api: isAuthApi,
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
      const result = await handleServiceData(data);
      console.log(result, "data submitted");
      onClose();
    } catch (error) {
      console.log("Error while submitting the data", error);
    }
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "white" }}>{isEditMode ? "" : ""} </h2>
        <Button variant="secondary" className="mx-2" onClick={handleSubmit}>
          Submit
        </Button>
        <Button className="close-button" variant="secondary" onClick={onClose}>
          <img src={closeButton} alt="" height={21} />
        </Button>
      </div>
      <div
        className="main-container"
        style={{
          overflowY: "auto",
          overflowX: "hidden",
          maxHeight: "90vh",
          maxWidth: "100%",
        }}
      >
        <Form>
          <Form.Group
            className="mt-3 mb-3 custom-form-group"
            controlId="formOperationId"
          >
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">Function Name</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="mx-5 custom-form-control"
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
                <Form.Label className="m-3">Service Name</Form.Label>
              </Col>
              <Col sm={9}>
                <Row>
                  <Col sm="4">
                    <Form.Control
                      className="mx-5 custom-form-control"
                      type="text"
                      value={tags}
                      onChange={handleTagsChange}
                    />
                  </Col>
                  <Col sm="3">
                    {/* <DropdownButton
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
                    </DropdownButton> */}
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
                <Form.Label className="m-3">Summary</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="mx-5 custom-form-control"
                  as="textarea"
                  rows={3}
                  value={summary}
                  onChange={handleSummaryChange}
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group
            className="mt-3 mb-3 custom-form-group"
            controlId="formAuthenticationApi"
          >
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">IsAuthenticationApi</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Check
                  className="mx-5 mt-3"
                  type="checkbox"
                  label="True"
                  checked={isAuthApi === true}
                  onChange={() => setIsAuthApi(!isAuthApi)}
                />
              </Col>
            </Row>
          </Form.Group>
          <div className="section-div">
            <h7 className="body-sec">Request Body</h7>
          </div>
          <Form.Group
            className="mb-3 custom-form-group"
            controlId="formRequestBody"
          >
            <RequestBody
              onChange={handleRequestBodyChange}
              requestBody={requestBody}
            />
          </Form.Group>

          <div className="section-div">
            <h7 className="body-sec">Response Body</h7>
          </div>
          <Form.Group
            className="mb-3 custom-form-group"
            controlId="formResponseBody"
          >
            <ResponseBody
              onChange={handleResponseBodyChange}
              responseBody={responseBody}
            />
          </Form.Group>
        </Form>
      </div>
    </>
  );
}
export default ServiceEdit;
