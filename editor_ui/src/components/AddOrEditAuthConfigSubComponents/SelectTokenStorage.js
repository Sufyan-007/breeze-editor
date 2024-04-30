import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "react-bootstrap/Button";
import { Col, Form, Row } from "react-bootstrap";

const SelectTokenStorage = ({
  selectedTokenStorageMethod,
  onSelectTokenStorage,
}) => {
  return (
    <Form.Group controlId="tokenStoreSelect" className="mt-4">
      <Row>
        <Col sm={3}>
          <Form.Label>Select Token Storage Scheme:</Form.Label>
        </Col>
        <Col sm={9}>
          <ButtonGroup className="mx-5">
            <Button
              variant="secondary"
              onClick={() => onSelectTokenStorage("LOCAL_STORAGE")}
              active={selectedTokenStorageMethod === "LOCAL_STORAGE"}
            >
              Local Storage
            </Button>
            <Button
              variant="secondary"
              onClick={() => onSelectTokenStorage("SESSION")}
              active={selectedTokenStorageMethod === "SESSION"}
            >
              Session Storage
            </Button>
            <Button
              variant="secondary"
              onClick={() => onSelectTokenStorage("COOKIE")}
              active={selectedTokenStorageMethod === "COOKIE"}
            >
              Cookie
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form.Group>
  );
};

export default SelectTokenStorage;