import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import UrlsCss from "../../css/Urls.css";

function Urls({ onChange, urls }) {
  const [url, setUrl] = useState({
    baseurl: urls.url?.baseurl || "",
    host: urls.url?.host || "",
    protocol: urls.url?.protocol || "",
    port: urls.url?.port || 443,
    path: urls.url?.path || [],
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
              placeholder="www.example.com"
              value={url.baseurl}
              onChange={(e) => handleUrlChange("baseurl", e.target.value)}
            />
            <Form.Control
              className="mx-5 mb-1"
              type="text"
              placeholder="example.com"
              value={url.host}
              onChange={(e) => handleUrlChange("host", e.target.value)}
            />
            <Form.Control
              className="mx-5 mb-1"
              type="text"
              placeholder="https"
              value={url.protocol}
              onChange={(e) => handleUrlChange("protocol", e.target.value)}
            />
            <Form.Control
              className="mx-5 mb-1"
              type="number"
              placeholder="Port"
              value={url.port}
              onChange={(e) =>
                handleUrlChange("port", parseInt(e.target.value, 10))
              }
            />
            <Form.Control
              className="mx-5 mb-1"
              type="text"
              placeholder="path1 , path2 "
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
