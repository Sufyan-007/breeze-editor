import React from "react";
import { Form } from "react-bootstrap";
import Delete from "../../../assets/icons/delete-trash.svg";
function HeadersSetting({ headerData, onChange }) {
  const handleInputChange = (index, field, value) => {
    const updatedHeaders = [...headerData];
    updatedHeaders[index] = { ...updatedHeaders[index], [field]: value };
    onChange("headers", updatedHeaders);
  };

  const handleDelete = (index) => {
    const updatedHeaders = [...headerData];
    updatedHeaders.splice(index, 1);
    onChange("headers", updatedHeaders);
  };
  return (
    <>
      {headerData && headerData.length > 0 ? (
        headerData.map((header, index) => (
          <div
            key={index}
            className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
            <div style={{ width: "90%" }} className="d-flex align-items-center">
              <div className="mx-1" style={{ width: "50%" }}>
                <Form.Label className="text-white mb-1">Key:</Form.Label>
                <Form.Control
                  className="text-white"
                  size="sm"
                  type="text"
                  placeholder="Key"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={header.key}
                  onChange={(e) =>
                    handleInputChange(index, "key", e.target.value)
                  }
                />
              </div>
              <div className="mx-1" style={{ width: "50%" }}>
                <Form.Label className="text-white mb-1">Value</Form.Label>
                <Form.Control
                  className="text-white"
                  size="sm"
                  type="text"
                  placeholder="Value"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={header.value}
                  onChange={(e) =>
                    handleInputChange(index, "value", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="d-flex align-items-center">
              <img
                alt="delete"
                className="mt-4"
                height={25}
                width={25}
                src={Delete}
                onClick={() => handleDelete(index)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="d-flex justify-content-center">
          <span className="text-white">-----No Headers Present-----</span>
        </div>
      )}
    </>
  );
}

export default HeadersSetting;
