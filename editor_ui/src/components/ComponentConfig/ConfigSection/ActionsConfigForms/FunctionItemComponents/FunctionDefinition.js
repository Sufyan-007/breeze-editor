import React, { useEffect, useState } from "react";
import { Button, Form, Col, Row } from "react-bootstrap";
import { dataTypes } from "../../../../../constants/datatype";


function FunctionDefinition({ config, update }) {
  const [conf, setConf] = useState({ ...config });
  const [newParam, setNewParam] = useState({ name: "", type: dataTypes[0] });

  useEffect(() => {
    setConf({ ...config });
  }, [config]);

  const handleParamChange = (index, field, value) => {
    const updatedParameters = [...conf.parameters];
    updatedParameters[index][field] = value;
    setConf({ ...conf, parameters: updatedParameters });
  };

  const addParam = () => {
    if (newParam.name && newParam.type) {
      const updatedParameters = [...conf.parameters, { ...newParam }];
      setConf({ ...conf, parameters: updatedParameters });
      setNewParam({ name: "", type: dataTypes[0] });
    }
  };

  const removeParam = (index) => {
    const updatedParameters = conf.parameters.filter((_, i) => i !== index);
    setConf({ ...conf, parameters: updatedParameters });
  };

  return (
    <div className="d-flex h-100 flex-column justify-content-between">
      <div>
        <strong>Edit Params</strong>
        {conf.parameters.map((param, index) => (
          <Row key={index} className="mb-2">
            <Col>
              <Form.Control
                type="text"
                className="form-control-sm"
                value={param.name}
                onChange={(e) =>
                  handleParamChange(index, "name", e.target.value)
                }
                placeholder="Parameter Name"
              />
            </Col>
            <Col>
              <Form.Select
                className="form-select form-select-sm"
                value={param.type}
                onChange={(e) =>
                  handleParamChange(index, "type", e.target.value)
                }
              >
                {dataTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Button
                className="btn btn-sm"
                variant="danger"
                onClick={() => removeParam(index)}
              >
                Remove
              </Button>
            </Col>
          </Row>
        ))}
        <Row className="mt-3">
          <strong>Add more Params</strong>
          <Col>
            <Form.Control
              className="form-control-sm"
              type="text"
              value={newParam.name}
              onChange={(e) =>
                setNewParam({ ...newParam, name: e.target.value })
              }
              placeholder="Name"
            />
          </Col>
          <Col>
            <Form.Select
              className="form-select form-select-sm"
              value={newParam.type}
              onChange={(e) =>
                setNewParam({ ...newParam, type: e.target.value })
              }
            >
              {dataTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col>
            <Button className="btn btn-sm" variant="primary" onClick={addParam}>
              Add
            </Button>
          </Col>
        </Row>
      </div>
      <div className="my-3 d-flex justify-content-between">
        <Button
          variant="success"
          className="btn btn-sm"
          onClick={() => update(conf)}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default FunctionDefinition;
