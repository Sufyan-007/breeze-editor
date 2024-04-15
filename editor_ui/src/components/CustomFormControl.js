import React from "react";
import { Form, Col, Row } from "react-bootstrap";
import '../css/AddOrEditAuthConfigStyles.css'
const CustomFormControl = ({
    onChange,
    controlId,
    options,
    flow_type
}) => {
    const filteredOptions = flow_type === "authorization_code" ? options : options.filter(option => option.name !== "flow.authorizationUrl");

    return (
        <Form.Group controlId={controlId} className="mt-4">
          {filteredOptions.map((option) => (
            <Row key={option.name}>
              <Col sm={3}>
                <Form.Label>{option.label}</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control
                  className="formControl mx-5 mb-2"
                  type="text"
                  value={option.value}
                  onChange={(e) => onChange(option.name, e.target.value)}
                />
              </Col>
            </Row>
          ))}
        </Form.Group>
      );
};

export default CustomFormControl;
