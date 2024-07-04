import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import rightArrow from "../../../../assets/icons/arrow_right_icon.svg";
import downArrow from "../../../../assets/icons/arrow_down_icon.svg";

const dataTypes = [
  "string",
  "number",
  "boolean",
  "callback",
  "array",
  "object",
];

export default function FunctionParams({ param, setParam }) {
  const [showDetails, setShowDetails] = useState(false);

  const updateParam = (key, value) => {
    const updatedParam = { ...param, [key]: value };
    console.log("setParam called");
    setParam(updatedParam);
  };

  return (
    <div className="container">
      <div className="row">
        <div
          className="d-flex"
          onClick={() => setShowDetails((state) => !state)}
        >
          <button type="button" className="btn p-0 m-0 shadow-none">
            {showDetails ? (
              <img src={downArrow} height={20} alt="Collapse" />
            ) : (
              <img src={rightArrow} height={20} alt="Expand" />
            )}
          </button>
          {param.name}
        </div>
      </div>
      {showDetails && (
        <div className="row">
          <Form className="col ms-3 my-1">
            <Row>
              <Col className="px-1 ">
                <Form.Group>
                  <Form.Control
                    placeholder="name"
                    size="sm"
                    value={param.name}
                    onChange={(event) =>
                      updateParam("name", event.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col className="px-1 ">
                <Form.Group className="mb-2" controlId="formDataType">
                  <Form.Control
                    as="select"
                    size="sm"
                    name="datatype"
                    value={param.dataType}
                    onChange={(event) =>
                      updateParam("dataType", event.target.value)
                    }
                  >
                    <option value="">datatype</option>
                    {dataTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="px-1 ">
                <Form.Group>
                  <Form.Control
                    size="sm"
                    placeholder="default value"
                    defaultValue={param.defaultValue}
                    onChange={(event) =>
                      updateParam("defaultValue", event.target.value)
                    }
                  />
                </Form.Group>
              </Col>
              <Col className="px-1 ">
                <Form.Group>
                  <Form.Control
                    size="sm"
                    placeholder="description"
                    value={param.description}
                    onChange={(event) =>
                      updateParam("description", event.target.value)
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </div>
  );
}
