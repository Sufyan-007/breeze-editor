import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { Col, Form, Row } from "react-bootstrap";

const SelectAuthentication = ({
  selectedAuthentication,
  onSelectAuthentication,
}) => {
  return (
    <Form.Group controlId="formAuthenticationSelect" className="mt-4">
      <Row>
        <Col sm={3}>
          <Form.Label>Select Authentication Scheme:</Form.Label>
        </Col>
        <Col sm={9}>
          <ButtonGroup className="mx-5">
            <Button
              variant="secondary"
              onClick={() => onSelectAuthentication("basic")}
              active={selectedAuthentication === "basic"}
            >
              Basic Authentication
            </Button>
            <Button
              variant="secondary"
              onClick={() => onSelectAuthentication("api_keys")}
              active={selectedAuthentication === "api_keys"}
            >
              API Keys
            </Button>
            <Button
              variant="secondary"
              onClick={() => onSelectAuthentication("bearer-auth")}
              active={selectedAuthentication === "bearer-auth"}
            >
              Bearer Authentication
            </Button>
            <Button
              variant="secondary"
              onClick={() => onSelectAuthentication("oauth2")}
              active={selectedAuthentication === "oauth2"}
            >
              OAuth 2.0
            </Button>
            <Button
              variant="secondary"
              onClick={() => onSelectAuthentication("cookie-auth")}
              active={selectedAuthentication === "cookie-auth"}
            >
              Cookie Authentication
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form.Group>
  );
};

export default SelectAuthentication;