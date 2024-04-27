import React, { useState, useEffect } from "react";
import { Form, Button, Dropdown, Row, Col } from "react-bootstrap";
import Body from "./Body.js";
import Auth from "./Auth.js";
import Urls from "./Urls.js";
import CustomButtonGroup from "../CustomButtonGroup.js";

let methodType = [
  {
    name: "GET",
    label: "Get",
    variant: "secondary",
  },
  {
    name: "POST",
    label: "Post",
    variant: "secondary",
  },
  {
    name: "PUT",
    label: "Put",
    variant: "secondary",
  },
  {
    name: "DELETE",
    label: "Delete",
    variant: "secondary",
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
    setRequest({
      ...request,
      body: request.body ? request.body.concat({}) : [{}],
    });
    setHasBody(true);
  };

  const removeBodySection = (index) => {
    if (request.body && request.body.length > 0) {
      const updatedBody = request.body.filter((_, i) => i !== index);
      setRequest({
        ...request,
        body: updatedBody,
      });
      setHasBody(updatedBody.length > 0);
    }
  };
  
  return (
    <div className="mb-3 text-dark requestbody">
      <Form>
        <Form.Group controlId="method" className="mx-3">
          <CustomButtonGroup
            options={methodType}
            selectedButton={request["method"]}
            onButtonClick={onValueChange}
            formId="method"
            title="Method:"></CustomButtonGroup>
        </Form.Group>
        {request["url"] && (
          <Urls urlData={request["url"]} onChange={onUrlValueChange} />
        )}
        {/* {request["auth"] &&
          request["auth"].map((auth, index) => {
            return (
              <Auth
                index={index}
                onChange={onListValueChange}
                auth={auth}
                tokenApis={tokenApis}
                loginApis={loginApis}
              />
            );
          })} */}

          <div>
            <Row>
              <Col sm={3}>
                <Form.Label className="mt-3 mx-3">Body:</Form.Label>
                <Button variant="secondary" size="sm" onClick={addBodySection}>
              Add Body
            </Button>
              </Col>
              {request["body"] && (
                <Col
                  sm={9}
                  className="d-flex flex-wrap mt-3"
                  style={{ flexDirection: "row", justifyContent: "normal" }}>
                  {request["body"].map((body, index) => (
                    <Body
                      index={index}
                      onChange={onListValueChange}
                      bodyData={body}
                      onRemove = {removeBodySection}
                    />
                  ))}
                </Col>
              )}
            </Row>
          </div>
      </Form>
    </div>
  );
}

export default Request;
