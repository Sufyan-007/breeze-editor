import React from "react";
import { Form } from "react-bootstrap";
import Delete from "../../../assets/icons/delete-trash.svg";

function ParameterSettings({ paramData, onChange }) {
  const handleInputChange = (index, field, value) => {
    const updatedParams = [...paramData];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    onChange("parameters", updatedParams);
  };

  const handleDelete = (index) => {
    const updatedParams = [...paramData];
    updatedParams.splice(index, 1);
    onChange("parameters", updatedParams);
  };

  return (
    <>
      {paramData.length > 0 ? (
        paramData.map((param, index) => (
          <div
            key={index}
            className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
            <div style={{ width: "90%" }} className="d-flex align-items-center">
              <div className="mx-1" style={{ width: "30%" }}>
                <Form.Label className="text-white mb-1">Name:</Form.Label>
                <Form.Control
                  className="text-white"
                  size="sm"
                  type="text"
                  placeholder="Parameter Name"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={param.name}
                  onChange={(e) =>
                    handleInputChange(index, "name", e.target.value)
                  }
                />
              </div>
              <div className="mx-1" style={{ width: "30%" }}>
                <Form.Label className="text-white mb-1">
                  Parameter In:
                </Form.Label>
                <Form.Control
                  as="select"
                  className="text-white"
                  size="sm"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={param.param_in}
                  onChange={(e) =>
                    handleInputChange(index, "param_in", e.target.value)
                  }>
                  <option value="query">Query</option>
                  <option value="path">Path</option>
                  <option value="headers">Headers</option>
                </Form.Control>
              </div>

              <div className="mx-1" style={{ width: "30%" }}>
                <Form.Label className="text-white mb-1">Type:</Form.Label>
                <Form.Control
                  as="select"
                  className="text-white"
                  size="sm"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={param.type}
                  onChange={(e) =>
                    handleInputChange(index, "type", e.target.value)
                  }>
                  <option value="string">String</option>
                  <option value="integer">Integer</option>
                  <option value="array">Array</option>
                </Form.Control>
              </div>
              <div className="mx-2" style={{ width: "10%" }}>
                <Form.Label className="text-white mb-1">Required:</Form.Label>
                <Form.Check
                  className="text-white"
                  size="sm"
                  type="checkbox"
                  style={{
                    backgroundColor: "#212529"
                  }}
                  checked={param.required}
                  onChange={(e) =>
                    handleInputChange(index, "required", e.target.checked)
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
          <span className="text-white">-----No Parameters Present-----</span>
        </div>
      )}
    </>
  );
}

export default ParameterSettings;
