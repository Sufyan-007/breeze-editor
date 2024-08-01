import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Delete from "../../../../../assets/icons/delete-trash.svg";

function ParameterSettings({ paramData, onChange }) {
  const [queryParameters, setQueryParameters] = useState([]);
  const [pathParameters, setPathParameters] = useState([]);

  useEffect(() => {
    if (paramData) {
      const pathParamsFiltered = paramData.filter(
        (param) => param.param_in === "PATH"
      );
      // Filter only query parameters
      const queryParamsFiltered = paramData.filter(
        (param) => param.param_in === "QUERY"
      );
      setPathParameters(pathParamsFiltered);
      setQueryParameters(queryParamsFiltered);
    }
  }, [paramData]);

  const handleInputChange = (index, field, value) => {
    const updatedParams = [...queryParameters];
    updatedParams[index] = { ...updatedParams[index], [field]: value };
    const finalParams = [...updatedParams, ...pathParameters]
    setQueryParameters(updatedParams);
    onChange("parameters", finalParams);
  };

  const handleDelete = (index) => {
    const updatedParams = [...queryParameters];
    updatedParams.splice(index, 1);
    const finalParams = [...updatedParams, ...pathParameters]
    setQueryParameters(updatedParams); 
    onChange("parameters", finalParams);
  };

  return (
    <>
      {queryParameters && queryParameters.length > 0 ? (
        queryParameters.map((param, index) => (
          <div
            key={index}
            className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between mb-2 mx-1">
            <div  className="d-flex align-items-center w-100">
              <div className="mx-1" style={{ width: "50%" }}>
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
              <div className="mx-1 mt-1" style={{ width: "50%" }}>
                <Form.Label className="text-white mb-1">Value Type:</Form.Label>
                <Form.Control
                  as="select"
                  className="text-white"
                  size="sm"
                  style={{
                    backgroundColor: "#212529",
                    border: "1px solid rgba(128, 128, 128, 0.5)",
                  }}
                  value={param.param_type}
                  onChange={(e) => {
                    handleInputChange(index, "param_type", e.target.value);
                  }}>
                  <option value="">Select</option>
                  <option value="STATIC">STATIC</option>
                  <option value="USER_INPUT">USER INPUT</option>
                  <option value="LOCAL_STORAGE">LOCAL STORAGE</option>
                  <option value="SESSION_STORAGE">SESSION STORAGE</option>
                </Form.Control>
              </div>
              {param.param_type === "STATIC" ? (
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
                    value={param.value}
                    onChange={(e) => {
                      handleInputChange(index, "value", e.target.value);
                    }}
                  />
                </div>
              ) : param.param_type === "LOCAL_STORAGE" ||
                param.param_type === "SESSION_STORAGE" ? (
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
                      value={param.storage_key}
                      onChange={(e) => {
                        handleInputChange(index, "storage_key", e.target.value);
                      }}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
              <div className="mx-2" style={{ width: "10%" }}>
                <Form.Label className="text-white mb-1">Required:</Form.Label>
                <Form.Check
                  className="text-white"
                  size="sm"
                  type="checkbox"
                  style={{
                    backgroundColor: "#212529",
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
          <span className="text-white mb-1">
            -----No Query Parameters Present-----
          </span>
        </div>
      )}
    </>
  );
}

export default ParameterSettings;
