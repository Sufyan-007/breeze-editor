import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import UrlsCss from "../../css/Urls.css";

function Urls({ onChange, urls }) {
  const [url, setUrl] = useState({
    baseurl: urls? urls.baseurl :"",
    host: urls? urls.host : [],
    protocol: urls?urls.protocol : "",
    port: urls? urls.port : "443",
    path: urls? urls.path : [],
  });

  const handleUrlChange = (name, value) => {
    // Update the specified property of the URL in the state
    setUrl({
      ...url,
      [name]: value,
    });
    const updatedUrl = { ...url, [name]: value };
    onChange(updatedUrl); // pass the updated state of the url
  };

  return (
    <div>
      <Form.Group controlId="formUrls" className="mt-3">
        <Row>
          <Col sm={3}>
            <Form.Label className="m-3">URL :</Form.Label>
          </Col>
          <Col sm={9}>
            <Form.Control
              className="mx-5 mb-1"
              type="text"
              placeholder="baseurl"
              value={url.baseurl}
              onChange={(e) => handleUrlChange("baseurl", e.target.value)}
            />
            <Form.Control
              className="mx-5 mb-1"
              type="text"
              placeholder="host"
              value={url.host || [].join(", ")}
              onChange={(e) => handleUrlChange(
                "host",
                e.target.value.split(",").map((p) => p.trim())
              )}
            />
            <Form.Control
              className="mx-5 mb-1"
              type="text"
              placeholder="protocol"
              value={url.protocol}
              onChange={(e) => handleUrlChange("protocol", e.target.value)}
            />
            <Form.Control
              className="mx-5 mb-1"
              type="number"
              placeholder="Port"
              value={url.port}
              onChange={(e) =>
                handleUrlChange("port", e.target.value)
              }
            />
            <Form.Control
              className="mx-5 mb-1"
              type="text"
              placeholder="path params"
              value={url.path || [].join(", ")}
              onChange={(e) =>
                handleUrlChange(
                  "path",
                  e.target.value.split(",").map((p) => p.trim())
                )
              }
            />
          </Col>
        </Row>
      </Form.Group>
    </div>
  );
}

export default Urls;
