import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Body from "./Body.js";
import Auth from "./Auth.js";
import Urls from "./Urls.js";
import CustomButtonGroup from "../CustomButtonGroup.js";
import Parameter from "./Parameter.js";

let methodType = [
  {
    name: "GET",
    label: "Get",
    variant: "secondary",
    className: "mx-3",
    width: "100%",
  },
  {
    name: "POST",
    label: "Post",
    variant: "secondary",
    className: "mx-3",
    width: "100%",
  },
  {
    name: "PUT",
    label: "Put",
    variant: "secondary",
    className: "mx-3",
    width: "100%",
  },
  {
    name: "DELETE",
    label: "Delete",
    variant: "secondary",
    className: "mx-3",
    width: "100%",
  },
];
function Request({ loginApis, tokenApis, onChange, requestBody }) {
  const [request, setRequest] = useState(requestBody);
  const onListValueChange = (prop, index, data) => {
    console.log(request, "request");
    let r = { ...request };
    r[prop][index] = data;
    setRequest({
      ...r,
    });
    onChange("request", r);
  };

  useEffect(() => {
    setRequest(requestBody);
  }, [requestBody]);

  const onValueChange = (prop, value) => {
    let r = request;
    r[prop] = value;
    setRequest({
      ...r,
    });
    onChange("request", r);
  };

  const addProperty = (name, initial_values) => {
     const newProperty = {
      ...initial_values,
      id: Date.now()
     }
     console.log(newProperty, "newprop");
    setRequest({
      ...request,
      [name]: request[name]
        ? [...request[name], newProperty]
        : [newProperty],
    });
    onChange("request", request);
  };

  useEffect(() => {
    if (request.body && request.body.length > 0) {
      const updatedBody = request.body.map((body) => ({
        ...body,
        id: Date.now() + Math.random(),
      }));
      setRequest((prevState) => ({
        ...prevState,
        body: updatedBody,
      }));
    }
  }, []);

  const removeProperty = (name, indexToRemove) => {
    if (request[name] && request[name].length > 0) {
      const updatedProperty = request[name].filter(
        (_, index) => index !== indexToRemove
      );
      const updatedRequest = {
        ...request,
        [name]: updatedProperty,
      };
      setRequest(updatedRequest);
      onChange("request", updatedRequest);
    }
  };
  const addAuthSection = () => {
    const newAuth = {};
    if (!request["auth"] || request["auth"].length === 0) {
      onListValueChange("auth", 0, newAuth);
    } else {
      onListValueChange("auth", request["auth"].length, newAuth);
    }
  };

  return (
    <>
      <CustomButtonGroup
        options={methodType}
        selectedButton={request.method}
        onButtonClick={onValueChange}
        formId="method"
        title="Method:"
      />
      <Urls urlData={request["url"]} onChange={onValueChange} />

      {loginApis && tokenApis && (
        <Row>
          <Col sm={3}>
            <Form.Label className="mt-3 mx-3">Auth:</Form.Label>
            <Button variant="secondary" size="sm" onClick={addAuthSection}>
              Add Auth
            </Button>
          </Col>
          {request["auth"] && (
            <Col
              sm={9}
              className="d-flex flex-wrap mt-3"
              style={{ flexDirection: "row", justifyContent: "normal" }}>
              {request["auth"].map((auth, index) => (
                <Auth
                  key={index}
                  index={index}
                  onChange={onListValueChange}
                  auth={auth}
                  tokenApis={tokenApis}
                  loginApis={loginApis}
                />
              ))}
            </Col>
          )}
        </Row>
      )}

      <Row>
        <Col sm={3}>
          <Form.Label className="mt-3 mx-3">Parameter:</Form.Label>
          <Button variant="secondary" size="sm" onClick={()=> addProperty("parameters", {"param_in":'',
        "type":'', "required": false, "description":'', "name":''})}>
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
              alt="add--v1"
            />{" "}
          </Button>
        </Col>
        {request["parameters"] && (
          <Col
            sm={9}
            className="d-flex flex-wrap mt-3"
            style={{
              flexDirection: "row",
              justifyContent: "normal",
              backgroundColor: "rgba(239, 239, 239, 0.5)",
            }}>
            {request["parameters"].map((parameter, index) => (
              <Parameter
                key={parameter.id}
                index={index}
                onChange={onListValueChange}
                parameterData={parameter}
                onRemove={() => removeProperty("parameters",index)}
              />
            ))}
          </Col>
        )}
      </Row>

      <Row>
        <Col sm={3}>
          <Form.Label className="mt-3 mx-3">Body:</Form.Label>
          <Button variant="secondary" size="sm" onClick={()=> addProperty("body", {mode: "RAW",
      content_type: "NONE",
      schema_name: "",
      anonymous: false,})}>
            <img
              width="24"
              height="24"
              src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png"
              alt="add--v1"
            />{" "}
          </Button>
        </Col>
        {request["body"] && (
          <Col
            sm={9}
            className="d-flex flex-wrap mt-3"
            style={{
              flexDirection: "row",
              justifyContent: "normal",
              backgroundColor: "rgba(239, 239, 239, 0.5)",
            }}>
            {request["body"].map((body, index) => (
              <Body
                key={body.id}
                index={index}
                onChange={onListValueChange}
                bodyData={body}
                onRemove={() => removeProperty("body", index)}
              />
            ))}
          </Col>
        )}
      </Row>
    </>
  );
}

export default Request;
