import React, { useState, useEffect } from "react";
import { Form, Button, ButtonGroup, Row, Col } from "react-bootstrap";
import ResponseBodyCss from "../../css/ResponseBody.css";

function ResponseBody({ onChange, responseBody }) {
  const [response, setResponse] = useState([]);

  useEffect(() => {
    // Initialize response array with default values
    // console.log("responseBody", responseBody);

    const initialResponse = responseBody.map((response) => ({
      status: response.status || "",
      content_type: response.content_type || "",
      schema_name: response.schema_name || "",
      raw_content: response.raw_content || "",
      file: response.file || "",
    }));
    setResponse(initialResponse);
  }, [responseBody]);

  const handleChange = (index, property, value) => {
    const updatedResponseBodies = [...response];
    // console.log("updatedResponseBodies before", updatedResponseBodies);

    updatedResponseBodies[index][property] = value;
    // console.log("index", index, property, value);
    // console.log("updatedResponseBodies", updatedResponseBodies);
    setResponse(updatedResponseBodies);
    onChange(updatedResponseBodies);
  };

  return (
    <div className="mb-3 text-dark">
      {response.map((response, index) => (
        <Form key={index}>
          <Form.Group>
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">Status</Form.Label>
              </Col>
              <Col sm={9}>
                <ButtonGroup className="mx-5">
                  <Button
                    variant="secondary"
                    onClick={() => handleChange(index, "status", "200")}
                    active={response.status === "200"}
                  >
                    200
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleChange(index, "status", "201")}
                    active={response.status === "201"}
                  >
                    201
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleChange(index, "status", "403")}
                    active={response.status === "403"}
                  >
                    403
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleChange(index, "status", "500")}
                    active={response.status === "500"}
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
                <Form.Label className="m-3">Content Type</Form.Label>
              </Col>
              <Col sm={9}>
                <ButtonGroup className="mx-5">
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleChange(index, "content_type", "application/json")
                    }
                    active={response.content_type === "application/json"}
                  >
                    JSON
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleChange(index, "content_type", "text/plain")
                    }
                    active={response.content_type === "text/plain"}
                  >
                    TEXT
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleChange(index, "content_type", "text/html")
                    }
                    active={response.content_type === "text/html"}
                  >
                    HTML
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleChange(index, "content_type", "application/xml")
                    }
                    active={response.content_type === "application/xml"}
                  >
                    XML
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleChange(
                        index,
                        "content_type",
                        "application/javascript"
                      )
                    }
                    active={response.content_type === "application/javascript"}
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
                <Form.Label className="m-3">Schema Name:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="mx-5"
                  type="text"
                  value={responseBody.schema_name}
                  onChange={(e) =>
                    handleChange(index, "schema_name", e.target.value)
                  }
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">Raw Content:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="mx-5"
                  type="text"
                  value={responseBody.raw_content}
                  onChange={(e) =>
                    handleChange(index, "raw_content", e.target.value)
                  }
                />
              </Col>
            </Row>
          </Form.Group>
          <Form.Group>
            <Row>
              <Col sm={3}>
                <Form.Label className="m-3">File:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="mx-5"
                  type="text"
                  value={responseBody.file}
                  onChange={(e) => handleChange(index, "file", e.target.value)}
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
      ))}
    </div>
  );
}

export default ResponseBody;
