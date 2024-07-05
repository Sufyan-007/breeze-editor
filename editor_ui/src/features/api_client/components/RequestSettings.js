import React, { useEffect, useState } from "react";
import { Card, Row } from "react-bootstrap";
import edit from "../../../assets/icons/edit-icon.svg";
import ParameterSettings from "./ParameterSettings";
import HeadersSetting from "./HeadersSetting";
import AuthSettings from "./AuthSettings";
import UrlSettings from "./UrlSettings";
import BodySettings from "./BodySettings";

function RequestSettings({ requestData, onChange }) {
  const [request, setRequest] = useState(requestData);
  const [expandedProperty, setExpandedProperty] = useState(null);
  const requestProperties = ["URL", "BODY", "Parameters", "Headers", "Auth"];

  const addProperty = (prop) => {
    let newData = null;
    if (prop === "parameters") {
      const newParam = {
        name: "",
        param_in: "",
        type: "",
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
    console.log(index, "index");
    if (expandedProperty === index) {
      setExpandedProperty(null);
    } else {
      setExpandedProperty(index);
    }
  };

  return (
    <Row className="mt-2">
      <div className="text-white p-1" style={{ backgroundColor: "#303033" }}>
        Request Settings
      </div>
      {requestProperties &&
        requestProperties.map((req, index) => (
          <Card key={index} className="mt-1 rounded-0 text-white" bg="dark">
            <Card.Body className="d-flex justify-content-between">
              {req}
              <div>
                {req !== "URL" && req!== "BODY" &&  (
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
              (req.toLowerCase() === "parameters" ? (
                <Card.Body className="text-white">
                  <ParameterSettings
                    paramData={request.parameters ? request.parameters : []}
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
                  <UrlSettings urlData={request.url} onChange={onReqChange} />
                </Card.Body>
              ) : req.toLowerCase() === "auth" ? (
                <AuthSettings authData={request.auth} onChange={onReqChange} />
              ) : req.toLowerCase() === "body" ? (
                <BodySettings bodyData={request.body ? request.body : {}} />
              ) : (
                <></>
              ))}
          </Card>
        ))}
    </Row>
  );
}

export default RequestSettings;
