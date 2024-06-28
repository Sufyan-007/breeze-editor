import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'

function ResponseSettings() {
  return (
    <Row className="mt-2">
    <div
      className="text-white p-1"
      style={{ backgroundColor: "#303033" }}>
      Response Settings
    </div>
    <Row className="mt-2">
      <Col sm={3}>
        <Form.Label className="text-white">Other Name:</Form.Label>
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
  </Row>
  )
}

export default ResponseSettings
