import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import CustomButtonGroup from "../CustomButtonGroup";
import remove from "../../assets/icons/remove.svg";
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

const Body = ({ index, onChange, bodyData, onRemove, key }) => {
  const [body, setBody] = useState(bodyData || {});

  const onValueChange = (prop, value) => {
    const updatedBody = { ...body, [prop]: value };
    setBody(updatedBody);
    onChange("body", index, updatedBody);
  };

  const handleRemoveBody = () => {
    console.log(index, "index in body");
    onRemove(index);
  };

  return (
    <Row key={key} className="mx-4 mt-2" style={{ width: "45%" }}>
      <Col sm={1}>
        <img src={remove} height={24} alt="remove" onClick={handleRemoveBody} />
      </Col>
      <Col sm={11}>
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
                title={"Type"}
                selectedButton={body["content_type"]}
                onButtonClick={onValueChange}
                formId={"content_type"}
              />

              <Row>
                <Col sm={3}>
                  <Form.Label className="mb-2 mx-3">Schema:</Form.Label>
                </Col>
                <Col sm={9}>
                  <Form.Control
                    className=""
                    style={{
                      border: "none",
                      backgroundColor: "#6C757D",
                    }}
                    type="text"
                    value={body["schema_name"] || ""}
                    onChange={(e) =>
                      onValueChange("schema_name", e.target.value)
                    }
                  />
                </Col>
              </Row>
            </>
          )}
         
        </Form.Group>
      </Col>
    </Row>
  );
};

export default Body;
