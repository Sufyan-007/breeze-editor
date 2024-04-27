import React, { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import CustomButtonGroup from "../CustomButtonGroup";

const modeOptions = [
  { name: "RAW", label: "Raw", variant: "secondary" },
  { name: "FORMDATA", label: "Formdata", variant: "secondary" },
  { name: "URLENCODED", label: "Urlencoded", variant: "secondary" },
  { name: "FILE", label: "File", variant: "secondary" },
];

const contentTypes = [
  { name: "NONE", label: "None", variant: "secondary" },
  { name: "JSON", label: "Json", variant: "secondary" },
  { name: "TEXT", label: "Text", variant: "secondary" },
  { name: "HTML", label: "Html", variant: "secondary" },
  { name: "XML", label: "Xml", variant: "secondary" },
];

const Body = ({ index, onChange, bodyData, onRemove }) => {
  console.log(bodyData, "bodyData");
  const [body, setBody] = useState(bodyData || {});

  const onValueChange = (prop, value) => {
    console.log(prop, "prop");
    console.log(value, "value");
    const updatedBody = { ...body, [prop]: value };
    setBody(updatedBody);
    onChange("body", index, updatedBody);
  };

  const handleRemoveBody = () => {
    onRemove(index); 
  };


  return (
    <div key={index}>
      <Form.Group controlId={`body-${index}`}>
        <CustomButtonGroup
          options={modeOptions}
          title={"Mode"}
          selectedButton={body["mode"]}
          onButtonClick={onValueChange}
          formId={"mode"}
        />
        {body.mode === "RAW" && (
          <>
            <CustomButtonGroup
              options={contentTypes}
              title={"Content Type"}
              selectedButton={body["content_type"]}
              onButtonClick={onValueChange}
              formId={"content_type"}
            />

            <Row>
              <Col sm={2}>
                <Form.Label className="mb-2">Schema Name:</Form.Label>
              </Col>
              <Col sm={7}>
                <Form.Control
                  className="mx-5 mt-3"
                  style={{
                    maxWidth: "30vw",
                    border: "none",
                    backgroundColor: "#6C757D",
                  }}
                  type="text"
                  value={body["schema_name"] || ""}
                  onChange={(e) => onValueChange("schema_name", e.target.value)}
                />
              </Col>
            </Row>
          </>
        )}
        <div className="d-flex justify-content-center">
        <Button className="mt-3" variant="secondary" size="sm" onClick={handleRemoveBody}>
                  Remove Body
                </Button>
        </div>
      </Form.Group>
    </div>
  );
};

export default Body;
