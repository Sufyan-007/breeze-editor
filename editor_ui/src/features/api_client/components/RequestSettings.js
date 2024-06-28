import React, { useState } from "react";
import { Card, Row } from "react-bootstrap";
import edit from "../../../assets/icons/edit-icon.svg";
// import add from "../../../assets/icons/add.svg";
import ParameterSettings from "./ParameterSettings";
import HeadersSetting from "./HeadersSetting";
import AuthSettings from "./AuthSettings";
import UrlSettings from "./UrlSettings";

function RequestSettings({ request, onChange }) {
  console.log(request, "request");
  const [expandedProperty, setExpandedProperty] = useState(null);
  const requestProperties = ["Parameters", "Body", "Headers", "Auth", "URL"];

  const handleAdd = (prop) => {
    console.log(prop, "prop");
  };
//   const onValueChange = (prop, value) => {
//     let r = request;
//     r[prop] = value;
//     setRequest({
//       ...r,
//     });
//     onApiModelChange("request", r);
//   };
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
                <img
                  alt="edit"
                  className="mx-1"
                  height={25}
                  width={25}
                  src={edit}
                  onClick={() => toggleProperty(index)}
                />
                <img
                  className="mx-1"
                  width="25"
                  height="25"
                  src="https://img.icons8.com/ios/50/FFFFFF/add--v1.png"
                  alt="add--v1"
                  onClick={() => handleAdd(req.toLowerCase())}
                />
              </div>
            </Card.Body>
            {expandedProperty === index &&
              (req.toLowerCase() === "parameters" ? (
                <Card.Body className="text-white">
                  <ParameterSettings paramData={request.parameters} />
                </Card.Body>
              ) : req.toLowerCase() === "headers" ? (
                <Card.Body className="text-white">
                  <HeadersSetting headerData={request.headers} />
                </Card.Body>
              ) : req.toLowerCase() === "url" ? (
                <Card.Body className="text-white">
                  <UrlSettings urlData={request.url} />
                </Card.Body>
              ) : req.toLowerCase() === "auth" ? (
                <AuthSettings authData={request.auth} />
              ) : (
                <></>
              ))}
          </Card>
        ))}
    </Row>
  );
}

export default RequestSettings;
