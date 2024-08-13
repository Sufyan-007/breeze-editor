import React from "react";
import { Form } from "react-bootstrap";
import Delete from "../../../../../assets/icons/delete-trash.svg";
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
  const renderError = (errors) => {
    if (!errors) return null;
    return (
      <div className="text-danger">
        {Object.entries(errors).map(([key, messages]) => (
          <div key={key}>
            {messages.map((message, idx) => (
              <div key={idx}>{key}:{message}</div>
            ))}
          </div>
        ))}
      </div>
    );
  };
  return (
    <>
      {headerData && headerData.length > 0 ? (
        headerData.map((header, index) => (
          <>
          <div
            key={index}
            className=" my-2 rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
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
              <div className="mx-2" style={{ width: "50%" }}>
                <Form.Label className="text-white mb-1">Value Type:</Form.Label>
                <Form.Control
                  as="select"
                  className="text-white"
                  size="sm"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={header.type}
                  onChange={(e) =>
                    handleInputChange(index, "type", e.target.value)
                  }>
                  <option value="">Select</option>
                  <option value="STATIC">STATIC</option>
                  <option value="USER_INPUT">USER INPUT</option>
                  <option value="LOCAL_STORAGE">LOCALSTORAGE</option>
                  <option value="SESSION_STORAGE">SESSION STORAGE</option>
                </Form.Control>
              </div>

              {header.type === "STATIC" ? (
                <div className="mx-2" style={{ width: "50%" }}>
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
              ) : header.type === "LOCAL_STORAGE" ||
                header.type === "SESSION_STORAGE" ? (
                <>
                  <div className="mx-2" style={{ width: "50%" }}>
                    <Form.Label className="text-white mb-1">
                      Storage Key
                    </Form.Label>
                    <Form.Control
                      className="text-white"
                      size="sm"
                      type="text"
                      placeholder="Value"
                      style={{
                        backgroundColor: "#212529",
                        border: "1px solid rgba(128, 128, 128, 0.5)",
                      }}
                      value={header.storage_key}
                      onChange={(e) =>
                        handleInputChange(index, "storage_key", e.target.value)
                      }
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
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
          {renderError(header.errors)}
          </>
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
