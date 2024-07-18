import React, { useEffect, useState } from "react";
import { Card, Row } from "react-bootstrap";
import edit from "../../../../../assets/icons/edit-icon.svg";
import ParameterSettings from "./ParameterSettings";
import HeadersSetting from "./HeadersSetting";
import AuthSettings from "./AuthSettings";
import UrlSettings from "./UrlSettings";
import BodySettings from "./BodySettings";

function RequestSettings({ requestData, onChange }) {
  const [request, setRequest] = useState(requestData);
  const [expandedProperty, setExpandedProperty] = useState(null);
  const requestProperties = ["Url", "Body", "Query Parameters", "Headers", "Auth"];

  const addProperty = (prop) => {
    console.log(prop, "prop");
    let newData = null;
    if (prop === "query parameters") {
      prop = "parameters";
      const newParam = {
        name: "",
        param_in: "QUERY",
        type: "STRING",
        required: false,
        description: "",
      };
      if (!requestData.parameters) {
        requestData.parameters = [];
      }
      newData = [...requestData.parameters, newParam];
    } else if (prop === "headers") {
      const newHeader = { key: "", value: "" };
      if (!requestData.headers) {
        requestData.headers = [];
      }
      newData = [...requestData.headers, newHeader];
    } else if (prop === "auth") {
      const newAuth = {
        type: "",
        contents: [],
        login_api: "",
        token_api: null,
        errors: null,
      };
      if (!requestData.auth) {
        requestData.auth = [];
      }
      newData = [...requestData.auth, newAuth];
    }
    onReqChange(prop, newData);
  };

  useEffect(() => {
    setRequest(requestData);
  }, [requestData]);

  const onReqChange = (prop, value) => {
    let r = request;
    r[prop] = value;
    setRequest({
      ...r,
    });
    onChange("request", r);
  };
  const toggleProperty = (index) => {
    // console.log(index, "index");
    if (expandedProperty === index) {
      setExpandedProperty(null);
    } else {
      setExpandedProperty(index);
    }
  };
  return (
    <Row className="mt-3">
      <div className="text-white p-1" style={{ backgroundColor: "#303033" }}>
        Request Settings
      </div>
      <div className="p-1">
        {requestProperties &&
          requestProperties.map((req, index) => (
            <Card
              key={index}
              className="mt-1  rounded-0 text-white"
              bg="dark"
              style={{ border: "1px solid rgba(128, 128, 128, 0.5)" }}>
              <Card.Body className="d-flex justify-content-between">
                {req}
                <div>
                  {req !== "Url" && req !== "Body" && (
                    <img
                      className="mx-1"
                      width="25"
                      height="25"
                      src="https://img.icons8.com/ios/50/FFFFFF/add--v1.png"
                      alt="add--v1"
                      onClick={() => addProperty(req.toLowerCase())}
                      style={{ cursor: "pointer" }}
                    />
                  )}
                  <img
                    alt="edit"
                    className="mx-1"
                    height={25}
                    width={25}
                    src={edit}
                    onClick={() => toggleProperty(index)}
                    style={{ cursor: "pointer" }}
                  />
                </div>
              </Card.Body>
              {expandedProperty === index &&
                (req.toLowerCase() === "query parameters" ? (
                  <Card.Body className="text-white">
                    <ParameterSettings
                      paramData={request.parameters || []
                      //   .filter(
                      //   (param) => param.param_in === "QUERY"
                      // )
                    }
                      onChange={onReqChange}
                    />
                  </Card.Body>
                ) : req.toLowerCase() === "headers" ? (
                  <Card.Body className="text-white">
                    <HeadersSetting
                      headerData={request.headers}
                      onChange={onReqChange}
                    />
                  </Card.Body>
                ) : req.toLowerCase() === "url" ? (
                  <Card.Body className="text-white">
                    <UrlSettings
                      urlData={request.url}
                      onChange={onReqChange}
                      paramData={request.parameters || []
                      //   .filter(
                      //   (param) => param.param_in === "PATH"
                      // )
                    }
                    />
                  </Card.Body>
                ) : req.toLowerCase() === "auth" ? (
                  <AuthSettings
                    authData={request.auth}
                    onChange={onReqChange}
                  />
                ) : req.toLowerCase() === "body" ? (
                  <BodySettings
                    bodyData={
                      request.body && request.body.length > 0
                        ? request.body[0]
                        : {
                            content_type: "",
                            mode: "",
                            required: false,
                            schema_name: "",
                            schema: {
                              type: "object",
                              properties: {},
                              required: [],
                            },
                          }
                    }
                    onChange={onReqChange}
                  />
                ) : (
                  <></>
                ))}
            </Card>
          ))}
      </div>
    </Row>
  );
}

export default RequestSettings;
