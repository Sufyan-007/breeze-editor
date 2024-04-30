import React from "react";
import CustomFormControl from "../CustomFormControl";
import { Col, Form, FormGroup, Row } from "react-bootstrap";

function Urls({ urlData, onChange }) {
  // console.log(urlData, "urldata");
  const onValueChange = (field, fieldValue) => {
    const updatedUrlData = {
      ...urlData,
      [field]: fieldValue,
    };
    onChange(updatedUrlData);
  };

  const urlFields = [
    {
      name: "host",
      label: "Host",
      value: urlData ? urlData.host : [],
      width: "30%",
    },
    {
      name: "protocol",
      label: "Protocol",
      value: urlData ? urlData.protocol : "",
      width: "30%",
    },
    {
      name: "port",
      label: "Port",
      value: urlData ? urlData.port : "",
      width: "30%",
    },
    {
      name: "path",
      label: "Path",
      value: urlData ? urlData.path : [],
      width: "30%",
    },
    {
      name: "baseurl",
      label: "Base URL",
      value: urlData ? urlData.baseurl : "",
      width: "80%",
    },
  ];

  return (
    <Form.Group>
      <Row>
        <Col sm={3}>
          <Form.Label className="mx-3 mt-5">URL:</Form.Label>
        </Col>
        <Col sm={9} >
          <CustomFormControl
            controlId="url"
            options={urlFields}
            flow_type="authorization_code"
            onChange={(name, value) => onValueChange(name, value)}
          />
        </Col>
      </Row>
    </Form.Group>
  );
}

export default Urls;
