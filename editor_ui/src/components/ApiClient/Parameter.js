import React, { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import CustomButtonGroup from "../CustomButtonGroup";
import remove from "../../assets/icons/remove.svg";
let paramInTypes = [
  {
    name: "PATH",
    label: "PATH",
    variant: "secondary",
  },
  {
    name: "QUERY",
    label: "QUERY",
    variant: "secondary",
  },
];
let parameterTypes = [
  {
    name: "STRING",
    label: "STRING",
    variant: "secondary",
  },
  {
    name: "INTEGER",
    label: "INTEGER",
    variant: "secondary",
  },
];
function Parameter({ index, onChange, parameterData, key, onRemove }) {
  console.log(parameterData, "data");
  const [parameter, setParameter] = useState(parameterData || {});
  const onValueChange = (prop, value) => {
    let p = parameter;
    p[prop] = value;
    onChange("parameters", index, p);
  };
  useEffect(() => {
    setParameter(parameterData);
  }, [parameterData]);

  return (
    <Row
      className="mb-3 text-dark p-2"
      style={{ width: "45%", marginLeft: "25px" }}
      key={key}>
      <Col sm={1}>
        <img
          src={remove}
          height={24}
          alt="remove"
          onClick={() => onRemove(index)}
        />
      </Col>
      <Col sm={11}>
        <Form.Group>
          <CustomButtonGroup
            options={paramInTypes}
            selectedButton={parameter["param_in"]}
            onButtonClick={onValueChange}
            formId="param_in"
            title="Param_In:"></CustomButtonGroup>
        </Form.Group>

        <Form.Group>
          <CustomButtonGroup
            options={parameterTypes}
            selectedButton={parameter["type"]}
            onButtonClick={onValueChange}
            formId="type"
            title="Type:"></CustomButtonGroup>
        </Form.Group>

        <Form.Group>
          <Row>
            <Col sm={3}>
              <Form.Label className="mx-3">Name :</Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Control
                className="mb-2"
                type="text"
                value={parameter["name"]}
                onChange={(e) => onValueChange("name", e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Row>
            <Col sm={3}>
              <Form.Label className="mx-3">Description:</Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Control
                className="mb-2"
                type="text"
                value={parameter["description"]}
                onChange={(e) => onValueChange("description", e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>

        <Form.Group>
          <Row>
            <Col sm={3}>
              <Form.Label className="mx-3">Required:</Form.Label>
            </Col>
            <Col sm={9}>
              <Form.Check
                className="mb-2"
                checked={parameter["required"]}
                onChange={(e) => onValueChange("required", e.target.checked)}
              />
            </Col>
          </Row>
        </Form.Group>
      </Col>
    </Row>
  );
}

export default Parameter;
