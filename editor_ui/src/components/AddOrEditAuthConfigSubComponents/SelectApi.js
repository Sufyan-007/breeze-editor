import React from "react";
import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const SelectApi = ({ availableApis, selectedApi, onSelectApi }) => {
  return (
    <Form.Group controlId="formApiSelect" className="mt-5">
      <Row>
        <Col sm={3}>
          <Form.Label>Select an API:</Form.Label>
        </Col>
        <Col sm={9}>
          <Form.Control
            className="mx-5 formControl"
            as="select"
            value={selectedApi}
            onChange={(e) => onSelectApi(e.target.value)}
          >
            <option value="">-- Select an API --</option>
            {Object.values(availableApis).map((api) => (
              <option key={api.operation_id} value={api.operation_id}>
                {api.operation_id}
              </option>
            ))}
          </Form.Control>
        </Col>
      </Row>
    </Form.Group>
  );
};

export default SelectApi;