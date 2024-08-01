import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import ParameterSettings from "./ParameterSettings";

function UrlSettings({ urlData, onChange, paramData, onAdd, method }) {
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
    // console.log(paramData, "paramdaata");
  }, [paramData]);

  const { baseurl, path, url_env, servers } = url ? url : {};

  const handleChanges = (prop, value) => {
    const newUrlData = { ...url };
    if (prop === "path") {
      newUrlData[prop] = value.split("/");
    } else {
      newUrlData[prop] = value;
    }
    onChange("url", newUrlData);
  };

  const handleMethodChange = (value)=>{
      onChange("method", value)
  }

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
      // console.log(allParams, "updated parameters");
    }
  };

  const handleInputChange = (param_type, index, field, value) => {
    if (param_type === "path") {
      if (index >= 0 && index < pathParams.length) {
        const updatedParams = [...pathParams];
        updatedParams[index] = { ...updatedParams[index], [field]: value };
        setPathParams(updatedParams);
        onChange("parameters", [...updatedParams, ...queryParams]);
      }
    } else {
      if (index >= 0 && index < queryParams.length) {
        const updatedParams = [...queryParams];
        updatedParams[index] = { ...updatedParams[index], [field]: value };
        setQueryParams(updatedParams);
        onChange("parameters", [...updatedParams, ...pathParams]);
      }
    }
  };

  return (
    <>
      <div className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between">
        <div className="mx-1" style={{ width: "50%" }}>
          <Form.Label className="text-white mb-1">Method:</Form.Label>
          <Form.Control
            as="select"
            className="text-white"
            size="sm"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={method}
          onChange={(e) => handleMethodChange(e.target.value)}
          >
            <option value="">Select</option>
            <option value="GET">Get</option>
            <option value="PUT">Put</option>
            <option value="POST">Post</option>
            <option value="DELETE">Delete</option>
          </Form.Control>
        </div>
        <div className="mx-2" style={{ width: "50%" }}>
          <Form.Label className="text-white mb-1">Base URL:</Form.Label>
          {/* <Form.Control
            className="text-white "
            size="sm"
            type="text"
            placeholder="Enter Base URL"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={baseurl || ""}
            onChange={(e) => handleChanges("baseurl", e.target.value)}
          /> */}
          <Form.Control
            as="select"
            className="text-white"
            size="sm"
            style={{
              backgroundColor: "#212529",
              border: "1px solid rgba(128, 128, 128, 0.5)",
            }}
            value={servers ? servers[0].url : ""}
          onChange={(e) => handleChanges("baseurl",e.target.value)}
          >
            <option value="">Select</option>
            {servers &&
              servers.map((server, index) => (
                <option key={index} value={server.url}>
                  {server.url}
                </option>
              ))}
          </Form.Control>
        </div>


        <div className="mx-2" style={{ width: "50%" }}>
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
      </div>
      <div
        className="text-white mt-3"
        style={{ border: "1px solid rgba(128, 128, 128, 0.5)" }}>
        <div className="m-2">Path Parameter Details:</div>
        {pathParams && pathParams.length > 0 ? (
          pathParams.map((para, index) => (
            <div
              key={index}
              className=" rounded-0 text-white bg-dark  d-flex align-items-center justify-content-between mb-2 mx-1">
              <div className="d-flex align-items-center w-100">
                <div className="mx-1 mt-1" style={{ width: "50%" }}>
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
                <div className="mx-1 mt-1" style={{ width: "50%" }}>
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
                      handleInputChange(
                        "path",
                        index,
                        "param_type",
                        e.target.value
                      );
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
                        handleInputChange(
                          "path",
                          index,
                          "value",
                          e.target.value
                        );
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
                            "path",
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
          ))
        ) : (
          <div className="d-flex justify-content-center mb-1">
            -----Add {"{Path}"} Parameters in the Path-----
          </div>
        )}
      </div>

      <div
        className="text-white mt-3"
        style={{ border: "1px solid rgba(128, 128, 128, 0.5)" }}>
        <div className="m-2">
          Query Parameter Details:
          <img
            className="mx-3 mb-1"
            width="25"
            height="25"
            src="https://img.icons8.com/ios/50/FFFFFF/add--v1.png"
            alt="add--v1"
            onClick={() => onAdd("query parameters")}
            style={{ cursor: "pointer" }}
          />
        </div>

        <ParameterSettings paramData={paramData} onChange={onChange} />
      </div>
    </>
  );
}

export default UrlSettings;
