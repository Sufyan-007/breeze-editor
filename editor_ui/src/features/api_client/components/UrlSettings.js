import React from 'react';
import { Form } from 'react-bootstrap';
import Delete from '../../../assets/icons/delete-trash.svg';

function UrlSettings({ urlData }) {
  const { baseurl, path, url_env } = urlData;

  return (
    <div className="mt-2 rounded-0 text-white" bg="dark">
      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-between" style={{ width: "90%" }}>
          <Form.Control
            className="text-white mb-2 mx-1"
            size="sm"
            type="text"
            placeholder="Base URL"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={baseurl || ''}
          />
          <Form.Control
            className="text-white mb-2 mx-1"
            size="sm"
            type="text"
            placeholder="Path"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={path ? path.join(',') : ''}
          />
          <Form.Control
            className="text-white mb-2 mx-1"
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
        <div className="d-flex align-items-center">
          <img
            alt="delete"
            className="mb-2 mx-2"
            height={25}
            width={25}
            src={Delete}
          />
        </div>
      </div>
    </div>
  );
}

export default UrlSettings;
