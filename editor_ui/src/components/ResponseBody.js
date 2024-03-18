import React, { useState } from "react";
import {Form} from 'react-bootstrap';

function ResponseBody({onChange}) {
  const [response, setResponse] = useState({
    status: "",
    content_type: "",
    schema_name: "",
    raw_content: "",
    file: "",
  });

  const handleResponseChange=(name, value)=>{
   setResponse({
    ...response,
    [name]:value,
   })
   onChange({ response: { ...response, [name]: value } });
  }

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
            onChange={(e) => handleResponseChange("status", e.target.value)}
            inline
          />
          <Form.Check
            type="radio"
            label="201"
            name="status"
            value="200"
            onChange={(e) => handleResponseChange("status", e.target.value)}
            inline
          />
          <Form.Check
            type="radio"
            label="403"
            name="status"
            value="200"
            onChange={(e) => handleResponseChange("status", e.target.value)}
            inline
          />
          <Form.Check
            type="radio"
            label="403"
            name="status"
            value="200"
            onChange={(e) => handleResponseChange("status", e.target.value)}
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
            checked={response.content_type === "application/json"}
            onChange={(e) =>
              handleResponseChange("content_type", e.target.value)
            }
            inline
          />
          <Form.Check
            type="radio"
            label="TEXT"
            name="content_type"
            value="text/plain"
            checked={response.content_type === "text/plain"}
            onChange={(e) =>
              handleResponseChange("content_type", e.target.value)
            }
            inline
          />
          <Form.Check
            type="radio"
            label="HTML"
            name="content_type"
            value="text/plain"
            checked={response.content_type === "text/plain"}
            onChange={(e) =>
              handleResponseChange("content_type", e.target.value)
            }
            inline
          />
          <Form.Check
            type="radio"
            label="XML"
            name="content_type"
            value="text/plain"
            checked={response.content_type === "text/plain"}
            onChange={(e) =>
              handleResponseChange("content_type", e.target.value)
            }
            inline
          />
          <Form.Check
            inline
            type="radio"
            label="Javascript"
            name="content_type"
            value="text/plain"
            checked={response.content_type === "text/plain"}
            onChange={(e) =>
              handleResponseChange("content_type", e.target.value)
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Schema Name:
          </Form.Label>
          <Form.Control
            type="text"
            value={response.schema_name}
            onChange={(e) =>
              handleResponseChange("schema_name", e.target.value)
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            Raw Content:
          </Form.Label>
          <Form.Control
            type="text"
            value={response.raw_content}
            onChange={(e) =>
              handleResponseChange("raw_content", e.target.value)
            }
          />
        </Form.Group>
        <Form.Group>
          <Form.Label style={{ fontWeight: "bold" }} className="m-3">
            File:
          </Form.Label>
          <Form.Control
            type="text"
            value={response.file}
            onChange={(e) => handleResponseChange("file", e.target.value)}
          />
        </Form.Group>
      </Form>
    </div>
  );
}

export default ResponseBody;
