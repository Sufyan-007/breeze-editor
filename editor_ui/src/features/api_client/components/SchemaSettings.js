import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import RenderObject from "./RenderObject";

function SchemaSettings({ schemaName, isEditing, schemaData }) {
  const [defaultSchemaObj, setDefaultSchemaObj] = useState(schemaData);

  useEffect(() => {
    setDefaultSchemaObj(schemaData);
  }, [schemaData]);

  const addProperty = () => {
    const newPropertyKey = `property${
      Object.keys(defaultSchemaObj.properties).length + 1
    }`;
    const newProperty = {
      type: "",
      required: false,
      example: "",
      objectType: "",
    };

    setDefaultSchemaObj({
      ...defaultSchemaObj,
      properties: {
        ...defaultSchemaObj.properties,
        [newPropertyKey]: newProperty,
      },
    });
  };

  const editProperty = (key, newValue, newKey) => {
    if (newValue) {
      if (newKey) {
        setDefaultSchemaObj((state) => {
          delete state.properties[key];
          state.properties[newKey] = newValue;
          return { ...state };
        });
      } else {
        setDefaultSchemaObj((state) => {
          state.properties[key] = newValue;
          return { ...state };
        });
      }
    } else {
      setDefaultSchemaObj((prevState) => {
        delete prevState.properties[key];
        return { ...prevState };
      });
    }
  };
  const onSubmit = () => {
    console.log(defaultSchemaObj, "default");
  };
  return (
    defaultSchemaObj && (
      <div id="main">
        <div className="d-flex justify-content-between">
          <h6 className="text-white mt-4">Schema Configuration</h6>
          <div>
            <Button
              variant="secondary"
              className="rounded-0 mt-4"
              onClick={onSubmit}>
              Submit
            </Button>
          </div>
        </div>
        <Row className="mt-4 mb-2">
          <div
            className="text-white p-1"
            style={{ backgroundColor: "#303033" }}>
            <span className="mx-2">General Settings</span>
          </div>
        </Row>
        <Row className="mb-2">
          <Col sm={3} className="text-white">
            Schema Name:
          </Col>
          <Col sm={9}>
            <Form.Control
              className="text-white"
              size="sm"
              type="text"
              placeholder="Value"
              value={schemaName}
              onChange={(e) =>
                setDefaultSchemaObj({
                  ...defaultSchemaObj,
                  type: e.target.value,
                })
              }
              style={{
                backgroundColor: "#212529",
                border: "1px solid rgba(128, 128, 128, 0.5)",
              }}
            />
          </Col>
        </Row>
        <Row className="mb-2">
          <Col sm={3} className="text-white">
            Type:
          </Col>
          <Col sm={9}>
            <Form.Control
              as="select"
              className="text-white"
              size="sm"
              style={{
                backgroundColor: "#212529",
                border: "1px solid rgba(128, 128, 128, 0.5)",
              }}
              value={defaultSchemaObj.type}
              onChange={(e) =>
                setDefaultSchemaObj({
                  ...defaultSchemaObj,
                  type: e.target.value,
                })
              }>
              <option value="">Select</option>
              <option value="object">Object</option>
              <option value="string">String</option>
              <option value="integer">Integer</option>
            </Form.Control>
          </Col>
        </Row>
        <Row className="mb-2 mt-2 d-flex ">
          <div
            className="text-white p-1"
            style={{ backgroundColor: "#303033" }}>
            <span className="mx-2">Properties</span>
            <img
              className="mx-1"
              width="25"
              height="25"
              src="https://img.icons8.com/ios/50/FFFFFF/add--v1.png"
              alt="add--v1"
              onClick={addProperty}
              style={{ cursor: "pointer" }}
            />
          </div>
        </Row>
        {defaultSchemaObj.properties &&
          Object.entries(defaultSchemaObj.properties).map(([key, value]) => (
            <RenderObject
              propertyName={key}
              value={value}
              updateParent={(value, newKey = null) =>
                editProperty(key, value, newKey)
              }
            />
          ))}
      </div>
    )
  );
}

export default SchemaSettings;
