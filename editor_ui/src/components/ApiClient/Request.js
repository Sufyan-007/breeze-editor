import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown, Row, Col } from "react-bootstrap";
import Body from "./Body.js";
import Auth from "./Auth.js";
import Urls from "./Urls.js";
import add from '../../assets/icons/add.svg'
import CustomButtonGroup from "../CustomButtonGroup.js";

let methodType = [
  {
    name: "GET",
    label: "Get",
    variant: "secondary",
    className: "mx-3",
    width: "76%"
  },
  {
    name: "POST",
    label: "Post",
    variant: "secondary",
    className: "mx-3",
    width: "76%"
  },
  {
    name: "PUT",
    label: "Put",
    variant: "secondary",
    className: "mx-3",
    width: "76%"
  },
  {
    name: "DELETE",
    label: "Delete",
    variant: "secondary",
    className: "mx-3",
    width: "76%"
  },
];
function Request({ loginApis, tokenApis, onChange, requestBody }) {
    // console.log(loginApis, tokenApis, "login token");
  const [request, setRequest] = useState(requestBody || {});
  const [hasBody, setHasBody] = useState(request.body?.length > 0);
  const onUrlValueChange = (value) => {
    let r = request;
    r["url"] = value;
    setRequest({
      ...r,
    });
    onChange("request", r);
  };
  const onListValueChange = (prop, index, data) => {
    let r = request;
    r[prop][index] = data;
    setRequest({
      ...r,
    });
    setHasBody(data.length > 0);
    onChange("request", r);
  };

  const onValueChange = (prop, value) => {
    let r = request;
    r[prop] = value;
    setRequest({
      ...r,
    });
    onChange("request", r);
  };
  
  const addBodySection = () => {
    const newBody = {
      id: Date.now(),
      mode: "RAW",
      content_type: "NONE",
      schema_name: '',
      anonymous: false
    };
    setRequest({
      ...request,
      body: request.body ? [...request.body, newBody] : [newBody],
    });
    onChange("request", request)
    setHasBody(true);
  };
  useEffect(() => {
    if (request.body && request.body.length > 0) {
      const updatedBody = request.body.map(body => ({
        ...body,
        id: Date.now() + Math.random(), 
      }));
      setRequest(prevState => ({
        ...prevState,
        body: updatedBody,
      }));
    }
  }, []);
  const removeBodySection = (indexToRemove) => {
    if (request.body && request.body.length > 0) {
      const updatedBody = request.body.filter((_, index) => index !== indexToRemove);
      const updatedRequest = {
        ...request,
        body: updatedBody,
      };
      setRequest(updatedRequest);
      onChange("request", updatedRequest);
      setHasBody(updatedBody.length > 0);
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
            selectedButton={request["method"]}
            onButtonClick={onValueChange}
            formId="method"
            title="Method:" />
        {request["url"] && (
          <Urls urlData={request["url"]} onChange={onUrlValueChange} />
        )}
        <div>
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
                style={{ flexDirection: "row", justifyContent: "normal" }}
              >
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
        </div>
          
            <Row>
              <Col sm={3}>
                <Form.Label className="mt-3 mx-3">Body:</Form.Label>
                <Button variant="secondary" size="sm" onClick={addBodySection}>
                <img width="24" height="24" src="https://img.icons8.com/ios-glyphs/30/FFFFFF/add--v1.png" alt="add--v1"/>            </Button>
              </Col>
              {request["body"] && (
                <Col
                  sm={9}
                  className="d-flex flex-wrap mt-3"
                  style={{ flexDirection: "row", justifyContent: "normal", backgroundColor: "rgba(239, 239, 239, 0.5)", width: "65%" }}>
                  {request["body"].map((body, index) => (
                    <Body
                      key={body.id}
                      index={index}
                      onChange={onListValueChange}
                      bodyData={body}
                      onRemove = {()=>removeBodySection(index)}
                    />
                  ))}
                </Col>
              )}
            </Row>
       
     
      </>
  );
}

export default Request;
