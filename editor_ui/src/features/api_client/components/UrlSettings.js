import React from 'react';
import { Form } from 'react-bootstrap';
function UrlSettings({ urlData, onChange }) {
  const { baseurl, path, url_env } = urlData ? urlData : {};

  return (
    <div className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
        <div className="mx-1" style={{ width: "30%" }}>
          <Form.Label className="text-white mb-1">Base URL:</Form.Label>
          <Form.Control
            className="text-white"
            size="sm"
            type="text"
            placeholder="Base URL"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={baseurl || ''}
          />
        </div>
        <div className="mx-1" style={{ width: "30%" }}>
          <Form.Label className="text-white mb-1">Path:</Form.Label>
          <Form.Control
            className="text-white"
            size="sm"
            type="text"
            placeholder="Path"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={path ? path.join('/') : ''}
          />
        </div>
        <div className='mx-1' style={{ width: "30%" }} >
          <Form.Label className="text-white mb-1">URL Environment:</Form.Label>
          <Form.Control
            className="text-white"
            size="sm"
            type="text"
            placeholder="URL Environment"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={url_env}
          />
        </div>
    </div>
  );
}

export default UrlSettings;
