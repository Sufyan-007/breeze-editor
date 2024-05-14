import React, { useState, useEffect } from "react";
import { Form, Button, ButtonGroup, Row, Col } from "react-bootstrap";
import ResponseBodyCss from "../../css/ResponseBody.css";

function ResponseBody({ onChange, responseBody }) {
  const [response, setResponse] = useState([]);

  useEffect(() => {
    const initialResponse =
      responseBody.length > 0
        ? responseBody.map((response) => ({
            status: response.status,
            content_type: response.content_type,
            schema_name: response.schema_name,
            raw_content: response.raw_content,
            file: response.file,
          }))
        : [
            {
              status: "",
              content_type: "",
              schema_name: "",
              raw_content: "",
              file: "",
            },
          ];
    setResponse(initialResponse);
  }, [responseBody]);

  const handleChange = (index, property, value) => {
    const updatedResponseBodies = [...response];
    console.log("updatedResponseBodies before", updatedResponseBodies);

    updatedResponseBodies[index][property] = value;
    console.log("index", index, property, value);
    console.log("updatedResponseBodies", updatedResponseBodies);
    setResponse(updatedResponseBodies);
    onChange(updatedResponseBodies);
  };

  // console.log(responseBody,"response body ");
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
                    onClick={() => handleChange(index, "status", "S_200")}
                    active={response.status === "S_200"}
                  >
                    200
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleChange(index, "status", "S_201")}
                    active={response.status === "S_201"}
                  >
                    201
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleChange(index, "status", "S_403")}
                    active={response.status === "S_403"}
                  >
                    403
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleChange(index, "status", "S_500")}
                    active={response.status === "S_500"}
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
                    onClick={() => handleChange(index, "content_type", "JSON")}
                    active={response.content_type === "JSON"}
                  >
                    JSON
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleChange(index, "content_type", "TEXT")}
                    active={response.content_type === "TEXT"}
                  >
                    TEXT
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleChange(index, "content_type", "HTML")}
                    active={response.content_type === "HTML"}
                  >
                    HTML
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleChange(index, "content_type", "XML")}
                    active={response.content_type === "XML"}
                  >
                    XML
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      handleChange(index, "content_type", "Javascript")
                    }
                    active={response.content_type === "Javascript"}
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
                  value={response.schema_name}
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
                  value={response.raw_content}
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
                  value={response.file}
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
