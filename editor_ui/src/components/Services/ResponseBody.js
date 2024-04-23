import React, { useState , useEffect} from "react";
import {Form, Button, ButtonGroup, Row , Col} from 'react-bootstrap';
import ResponseBodyCss from "../../css/ResponseBody.css";

function ResponseBody({onChange, responseBody}) {
   const [status, setStatus] = useState(responseBody.status || "");
   const [contentType, setContentType] = useState(
     responseBody.content_type || ""
   );
   const [schemaName, setSchemaName] = useState(responseBody.schema_name || "");
   const [rawContent, setRawContent] = useState(responseBody.raw_content || "");
   const [file, setFile] = useState(responseBody.file || "");

 const handleStatusChange = (value) => {
   setStatus(value);
   onChange({ ...responseBody, status: value });
 };

 const handleContentTypeChange = (value) => {
   setContentType(value);
   onChange({ ...responseBody, content_type: value });
 };

 const handleSchemaNameChange = (value) => {
   setSchemaName(value);
   onChange({ ...responseBody, schema_name: value });
 };

 const handleRawContentChange = (value) => {
   setRawContent(value);
   onChange({ ...responseBody, raw_content: value });
 };

 const handleFileChange = (value) => {
   setFile(value);
   onChange({ ...responseBody, file: value });
 };

  return (
    <div className="mb-3 text-dark">
      <Form>
        <Form.Group>
          <Row>
            <Col sm={3}>
              <Form.Label className="m-3">
                Status
              </Form.Label>
            </Col>
            <Col sm={9}>
              <ButtonGroup className="mx-5">
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange("200")}
                  active={status === "200"}
                >
                  200
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange("201")}
                  active={status === "201"}
                >
                  201
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange("403")}
                  active={status === "403"}
                >
                  403
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleStatusChange("500")}
                  active={status === "500"}
                >
                  500
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Row>
            <Col sm={3}>
              <Form.Label className="m-3">
                Content Type
              </Form.Label>
            </Col>
            <Col sm={9}>
              <ButtonGroup className="mx-5">
                <Button
                  variant="secondary"
                  onClick={() => handleContentTypeChange("application/json")}
                  active={contentType === "application/json"}
                >
                  JSON
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleContentTypeChange("text/plain")}
                  active={contentType === "text/plain"}
                >
                  TEXT
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleContentTypeChange("text/html")}
                  active={contentType === "text/html"}
                >
                  HTML
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleContentTypeChange("application/xml")}
                  active={contentType === "application/xml"}
                >
                  XML
                </Button>
                <Button
                  variant="secondary"
                  onClick={() =>
                    handleContentTypeChange("application/javascript")
                  }
                  active={contentType === "application/javascript"}
                >
                  Javascript
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Row>
            <Col sm={3}>
              <Form.Label className="m-3">
                Schema Name:
              </Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Control
              className="mx-5"
                type="text"
                value={responseBody.schema_name}
                onChange={(e) => handleSchemaNameChange(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Row>
            <Col sm={3}>
              <Form.Label className="m-3">
                Raw Content:
              </Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Control
                className="mx-5"
                type="text"
                value={responseBody.raw_content}
                onChange={(e) => handleRawContentChange(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Row>
            <Col sm={3}>
              <Form.Label className="m-3">
                File:
              </Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Control
                className="mx-5"
                type="text"
                value={responseBody.file}
                onChange={(e) => handleFileChange(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>
      </Form>
    </div>
  );
}

export default ResponseBody;