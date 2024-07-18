import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";

function UrlSettings({ urlData, onChange, paramData }) {
  const [url, setUrl] = useState(urlData);
  const [pathParams, setPathParams] = useState([]);
  const [queryParams, setQueryParams] = useState([]);

  useEffect(() => {
    setUrl(urlData);
  }, [urlData]);

  useEffect(() => {
    if (paramData) {
      const pathParamsFiltered = paramData.filter(
        (param) => param.param_in === "PATH"
      );
      const queryParamsFiltered = paramData.filter(
        (param) => param.param_in !== "PATH"
      );
      setPathParams(pathParamsFiltered);
      setQueryParams(queryParamsFiltered);
    }
    console.log(paramData, "paramdaata");
  }, [paramData]);

  const { baseurl, path, url_env } = url ? url : {};

  const handleChanges = (prop, value) => {
    const newUrlData = { ...url };
    if (prop === "path") {
      newUrlData[prop] = value.split("/");
    } else {
      newUrlData[prop] = value;
    }
    onChange("url", newUrlData);
  };

  const handlePathParsing = () => {
    if (path && Array.isArray(path)) {
      const updatedParamData = [];

      path.forEach((segment) => {
        if (
          typeof segment === "string" &&
          segment.startsWith("{") &&
          segment.endsWith("}")
        ) {
          const paramName = segment.substring(1, segment.length - 1);
          const existingParamIndex = pathParams.findIndex(
            (para) => para.name === paramName
          );

          if (existingParamIndex !== -1) {
            updatedParamData.push({
              ...pathParams[existingParamIndex],
              description: "", // Update other fields as needed
            });
          } else {
            updatedParamData.push({
              param_in: "PATH",
              name: paramName,
              type: "STRING",
              required: true,
              description: "",
              param_type: "STATIC",
              storage_key: "",
              value: "",
            });
          }
        }
      });

      // Merge with existing query parameters
      const allParams = [...updatedParamData, ...queryParams];

      const remainingParamNames = updatedParamData.map((param) => param.name);
      const deletedParams = pathParams.filter(
        (param) => !remainingParamNames.includes(param.name)
      );

      if (deletedParams.length > 0) {
        console.log(
          "Deleted parameters:",
          deletedParams.map((param) => param.name)
        );
      }

      onChange("parameters", allParams);
      setPathParams(updatedParamData);
      console.log(allParams, "updated parameters");
    }
  };

  const handleInputChange = (index, field, value) => {
    if (index >= 0 && index < pathParams.length) {
      const updatedParams = [...pathParams];
      updatedParams[index] = { ...updatedParams[index], [field]: value };
      setPathParams(updatedParams);
      onChange("parameters", [...updatedParams, ...queryParams]);
    }
  };

  return (
    <>
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
            value={baseurl || ""}
            onChange={(e) => handleChanges("baseurl", e.target.value)}
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
            value={path ? path.join("/") : ""}
            onChange={(e) => handleChanges("path", e.target.value)}
            onBlur={handlePathParsing}
          />
        </div>
        <div className="mx-1" style={{ width: "30%" }}>
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
            value={url_env || ""}
            onChange={(e) => handleChanges("url_env", e.target.value)}
          />
        </div>
      </div>
      <div className="text-white mt-2">
        <span>Parameter Details:</span>
        {pathParams &&
          pathParams.map((para, index) => (
            <div
              key={index}
              className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
              <div
                style={{ width: "90%" }}
                className="d-flex align-items-center">
                <div className="mx-1 mt-1" style={{ width: "30%" }}>
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
                    value={para.name}
                    readOnly
                  />
                </div>
                <div className="mx-1 mt-1" style={{ width: "30%" }}>
                  <Form.Label className="text-white mb-1">
                    Value Type:
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="text-white"
                    size="sm"
                    style={{
                      backgroundColor: "#212529",
                      border: "1px solid rgba(128, 128, 128, 0.5)",
                    }}
                    value={para.param_type}
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

                {para.param_type === "STATIC" ? (
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
                      value={para.value}
                      onChange={(e) => {
                        handleInputChange(index, "value", e.target.value);
                      }}
                    />
                  </div>
                ) : para.param_type === "LOCAL_STORAGE" ||
                  para.param_type === "SESSION_STORAGE" ? (
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
                        value={para.storage_key}
                        onChange={(e) => {
                          handleInputChange(
                            index,
                            "storage_key",
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}

export default UrlSettings;
