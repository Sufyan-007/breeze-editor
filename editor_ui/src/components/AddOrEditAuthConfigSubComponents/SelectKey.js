import React from "react";
import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const SelectKey = ({ selectedAccessKey, onSetAccessKey,selectedRefreshKey,onSetRefreshKey, tokenStorageMethod }) => {
  return (
    tokenStorageMethod === "localStorage" ||
    tokenStorageMethod === "sessionStorage"|| "cookie" ? (
      <Form.Group controlId="formTokenKey" className="mt-4">
        <Row>
          <Col sm={3}>
            <Form.Label>Select Access Token Key:</Form.Label>
          </Col>
          <Col sm={9}>
            <Form.Control
              type="text"
              placeholder="Access Key Name"
              value={selectedAccessKey}
              onChange={(e) => onSetAccessKey(e.target.value)}
              className="mx-5 mb-2 formControl"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <Form.Label>Select Refresh Token Key(Optional):</Form.Label>
          </Col>
          <Col sm={9}>
            <Form.Control
              type="text"
              placeholder="Refresh Key Name"
              value={selectedRefreshKey}
              onChange={(e) => onSetRefreshKey(e.target.value)}
              className="mx-5 mb-2 formControl"
            />
          </Col>
        </Row>
      </Form.Group>
    ) :null
  );
};

export default SelectKey;