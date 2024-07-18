import React from "react";
import { Col, Form, Row } from "react-bootstrap";

function GeneralSettingsCard({ settings, onChange }) {
  const handleInputChange = (prop, value) => {
    onChange(prop, value);
  };
  const handleMethodChange = (value)=>{
    const newRequest = {...settings.request}
    newRequest.method = value;
    onChange("request", newRequest);
  }
  return (
    <Row className="mt-3">
      <div className="text-white p-1" style={{ backgroundColor: "#303033" }}>
        General Settings
      </div>
      <Row className="mt-2">
        <Col sm={6}>
          <Row>
            <Col sm={3}>
              <Form.Label className="text-white mx-3"> Name:</Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Control
                className="text-white"
                size="sm"
                type="text"
                placeholder="var"
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                }}
                value={settings.operation_id ? settings.operation_id : ""}
                onChange={(e) =>
                  handleInputChange("operation_id", e.target.value)
                }
              />
            </Col>
          </Row>
        </Col>
        <Col sm={6}>
          <Row>
            <Col sm={3}>
              <Form.Label className="text-white mx-3">Service File:</Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Control
                className="text-white"
                size="sm"
                type="text"
                placeholder="var"
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                }}
                value={settings.tags ? settings.tags : ""}
                onChange={(e) => handleInputChange("tags", e.target.value)}
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col sm={6}>
          <Row>
            <Col sm={3}>
              <Form.Label className="text-white mx-3"> Summary:</Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Control
                className="text-white"
                size="sm"
                type="text"
                placeholder="var"
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                }}
                value={settings.summary ? settings.summary : ""}
                onChange={(e) => handleInputChange("summary", e.target.value)}
              />
            </Col>
          </Row>
        </Col>
        <Col sm={6}>
          <Row>
            <Col sm={3}>
              <Form.Label className="text-white mx-3"> Method:</Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Control
                as="select"
                className="text-white"
                size="sm"
                style={{
                  backgroundColor: "#212529",
                  border: "1px solid rgba(128, 128, 128, 0.5)",
                }}
                value={settings.request && settings.request.method}
                onChange={(e) => handleMethodChange( e.target.value)}
              >
                <option value="">Select</option>
                <option value="GET">Get</option>
                <option value="PUT">Put</option>
                <option value="POST">Post</option>
                <option value="DELETE">Delete</option>
              </Form.Control>
            </Col>
          </Row>
        </Col>
      </Row>
    </Row>
  );
}

export default GeneralSettingsCard;
