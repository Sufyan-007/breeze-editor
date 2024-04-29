import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { Col, Form, Row } from "react-bootstrap";

const SelectFlow = ({ selectedFlow, onSelectFlow, selectedAuthentication }) => {
  return (
    selectedAuthentication === "oauth2" && (
      <Form.Group controlId="formAuthenticationSelect" className="mt-4">
        <Row>
          <Col sm={3}>
            <Form.Label>Select Flows or Grant Types:</Form.Label>
          </Col>
          <Col sm={9}>
            <ButtonGroup className="mx-5">
              <Button
                variant="secondary"
                onClick={() => onSelectFlow("authorizationCode")}
                active={selectedFlow === "authorizationCode"}
              >
                Authorization code
              </Button>
              <Button
                variant="secondary"
                onClick={() => onSelectFlow("implicit")}
                active={selectedFlow === "implicit"}
              >
                Implicit
              </Button>
              <Button
                variant="secondary"
                onClick={() => onSelectFlow("password")}
                active={selectedFlow === "password"}
              >
                Password
              </Button>
              <Button
                variant="secondary"
                onClick={() => onSelectFlow("clientCredentials")}
                active={selectedFlow === "clientCredentials"}
              >
                Client Credentials
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </Form.Group>
    )
  );
};

export default SelectFlow;