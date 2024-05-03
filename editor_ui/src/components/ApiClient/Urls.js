import React, { useEffect } from "react";
import CustomFormControl from "../CustomFormControl";
import { Col, Form, Row } from "react-bootstrap";

function Urls({ urlData, onChange }) {
  const onValueChange = (field, fieldValue) => {
    const updatedUrlData = {
        ...urlData,
        [field]: Array.isArray(fieldValue) ? [...fieldValue] : fieldValue,
    };
    onChange("url",updatedUrlData);
};
useEffect(()=>{},[urlData])
  const urlFields = [
    {
      name: "host",
      label: "Host",
      value: urlData && urlData.host ? urlData.host : [],
      width: "30%",
    },
    {
      name: "protocol",
      label: "Protocol",
      value: urlData && urlData.protocol ? urlData.protocol : "",
      width: "30%",
    },
    {
      name: "port",
      label: "Port",
      value: urlData && urlData.port ? urlData.port : "",
      width: "30%",
    },
    {
      name: "path",
      label: "Path",
      value: urlData && urlData.path ? urlData.path : [],
      width: "30%",
    },
    {
      name: "baseurl",
      label: "Base URL",
      value: urlData && urlData.baseurl ? urlData.baseurl : "",
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
            flow_type=""
            onChange={(name, value) => onValueChange(name, value)}
          />
        </Col>
      </Row>
    </Form.Group>
  );
}

export default Urls;
