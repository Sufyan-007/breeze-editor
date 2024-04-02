import React, { useState , useEffect} from "react";
import {Form} from 'react-bootstrap';

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
    <div
      className="mb-3 text-dark"
      style={{ backgroundColor: "#e0e0e0", padding: "20px" }}
    >
      <Form>
        <Form.Group>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Status
          </Form.Label>
          <Form.Check
            type="radio"
            label="200"
            name="status"
            value="200"
            checked={status === "200"}
            onChange={() => handleStatusChange("200")}
            inline
          />
          <Form.Check
            type="radio"
            label="201"
            name="status"
            value="201"
            checked={status === "201"}
            onChange={() => handleStatusChange("201")}
            inline
          />
          <Form.Check
            type="radio"
            label="403"
            name="status"
            value="403"
            checked={status === "403"}
            onChange={() => handleStatusChange("403")}
            inline
          />
          <Form.Check
            type="radio"
            label="500"
            name="status"
            value="500"
            checked={status === "500"}
            onChange={() => handleStatusChange("500")}
            inline
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Content Type
          </Form.Label>
          <Form.Check
            type="radio"
            label="JSON"
            name="content_type"
            value="application/json"
            checked={contentType === "application/json"}
            onChange={() => handleContentTypeChange("application/json")}
            inline
          />
          <Form.Check
            type="radio"
            label="TEXT"
            name="content_type"
            value="text/plain"
            checked={contentType === "text/plain"}
            onChange={() => handleContentTypeChange("text/plain")}
            inline
          />
          <Form.Check
            type="radio"
            label="HTML"
            name="content_type"
            value="text/html"
            checked={contentType === "text/html"}
            onChange={() => handleContentTypeChange("text/html")}
            inline
          />
          <Form.Check
            type="radio"
            label="XML"
            name="content_type"
            value="application/xml"
            checked={contentType === "application/xml"}
            onChange={() => handleContentTypeChange("application/xml")}
            inline
          />
          <Form.Check
            inline
            type="radio"
            label="Javascript"
            name="content_type"
            value="application/javascript"
            checked={contentType === "application/javascript"}
            onChange={() => handleContentTypeChange("application/javascript")}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Schema Name:
          </Form.Label>
          <Form.Control
            type="text"
            value={responseBody.schema_name}
            onChange={(e) => handleSchemaNameChange(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Raw Content:
          </Form.Label>
          <Form.Control
            type="text"
            value={responseBody.raw_content}
            onChange={(e) => handleRawContentChange(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            File:
          </Form.Label>
          <Form.Control
            type="text"
            value={responseBody.file}
            onChange={(e) => handleFileChange(e.target.value)}
          />
        </Form.Group>
      </Form>
    </div>
  );
}

export default ResponseBody;
