import React from "react";
import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const AuthorizationUrls = ({
  authorizationUrl,
  tokenUrl,
  refreshUrl,
  onSetAuthorizationUrl,
  onSetTokenUrl,
  onSetRefreshTokenUrl,
  selectedFlow,
  selectedAuthentication,
}) => {
  return (
    selectedFlow &&
    selectedAuthentication === "oauth2" && (
      <Form.Group controlId="authorizationUrls" className="mt-4">
        <Row>
          <Col sm={3}>
            <Form.Label>Authorization URLs:</Form.Label>
          </Col>
          <Col sm={9}>
            <Form.Control
              type="text"
              placeholder="Authorization URL"
              value={authorizationUrl}
              onChange={(e) => onSetAuthorizationUrl(e.target.value)}
              className={`mx-5 mb-2 formControl ${
                authorizationUrl.trim() === "" ? "border border-danger border-2 border-solid" : ""
              }`}
            />
            {selectedFlow === "authorizationCode" && (
              <Form.Control
                type="text"
                placeholder="Token URL"
                value={tokenUrl}
                onChange={(e) => onSetTokenUrl(e.target.value)}
                className={`mx-5 mb-2 formControl ${
                  tokenUrl.trim() === "" ? "border border-danger border-2 border-solid" : ""
                }`}
              />
            )}
            <Form.Control
              type="text"
              placeholder="Refresh URL (Optional)"
              value={refreshUrl}
              onChange={(e) => onSetRefreshTokenUrl(e.target.value)}
              className="mx-5 mb-2 formControl"
            />
          </Col>
        </Row>
      </Form.Group>
    )
  );
};

export default AuthorizationUrls;