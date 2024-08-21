import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import dataTypes from "../../../../../constants/datatype";

export default function FunctionParams({ param, setParam }) {
  const updateParam = (key, value) => {
    const updatedParam = { ...param, [key]: value };
    setParam(updatedParam);
  };

  return (
    <div className="container px-1">
      <Form className="col ms-2">
        <Row className="align-items-center">
          <Col className="px-1 ">
            <Form.Group>
              <Form.Control
                placeholder="name"
                size="sm"
                value={param.name}
                onChange={(event) => updateParam("name", event.target.value)}
              />
            </Form.Group>
          </Col>
          <Col className="px-1 ">
            <Form.Group controlId="formDataType">
              <Form.Control
                as="select"
                size="sm"
                name="datatype"
                value={param.type}
                onChange={(event) => updateParam("type", event.target.value)}
              >
                <option value="">datatype</option>
                {dataTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col className="px-1 ">
            <Form.Group>
              <Form.Control
                size="sm"
                placeholder="default value"
                value={param.value}
                onChange={(event) =>
                  updateParam("value", event.target.value)
                }
              />
            </Form.Group>
          </Col>
          <Col className="px-1 ">
            <Form.Group>
              <Form.Control
                size="sm"
                placeholder="description"
                value={param.description}
                onChange={(event) =>
                  updateParam("description", event.target.value)
                }
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
