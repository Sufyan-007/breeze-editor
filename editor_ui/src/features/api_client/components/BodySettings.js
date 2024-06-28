import React from "react";
import { Col, Form, Row } from "react-bootstrap";

function BodySettings({ bodyData }) {
  console.log(bodyData, "bodydata");
  return (
    <>
    <div
      className="text-white p-1 mt-1"
      style={{ backgroundColor: "#303033" }}>
      Body Settings
    </div>
      {bodyData.length > 0 ? (
        bodyData.map((body, index) => (
          <Row key={index} className="mt-2">
            <Col sm={3}>
              <Form.Label className="text-white">body prop</Form.Label>
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
              />
            </Col>
          </Row>
        ))
      ) : (
        <>
        </>
      )}
    </>
  );
}

export default BodySettings;
