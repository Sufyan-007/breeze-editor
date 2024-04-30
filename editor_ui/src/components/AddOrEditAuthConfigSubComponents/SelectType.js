import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { Col, Form, Row } from "react-bootstrap";

const SelectType = ({ selectedType, onSelectType }) => {
  return (
    <Form.Group controlId="formTypeSelect" className="mt-4">
      <Row>
        <Col sm={3}>
          <Form.Label>Select Type:</Form.Label>
        </Col>
        <Col sm={9}>
          <ButtonGroup className="mx-5">
            <Button
              variant="secondary"
              onClick={() => onSelectType("LOGIN")}
              active={selectedType === "LOGIN"}
            >
              Access Token API
            </Button>
            <Button
              variant="secondary"
              onClick={() => onSelectType("REFRESH")}
              active={selectedType === "REFRESH"}
            >
              Refresh Token API
            </Button>
            <Button
              variant="secondary"
              onClick={() => onSelectType("LOGOUT")}
              active={selectedType === "LOGOUT"}
            >
              Logout API
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form.Group>
  );
};

export default SelectType;