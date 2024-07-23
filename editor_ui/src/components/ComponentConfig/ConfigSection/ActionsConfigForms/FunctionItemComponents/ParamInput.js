import React from "react";
import { Form } from "react-bootstrap";

const ParamInput = ({ param, value, onChange }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  if (param.type === "STRING") {
    return (
      <Form.Group controlId={param.name}>
        <div className="d-flex mb-1">
          <div
            className="col-3 border border-gray d-flex align-items-center px-2"
            style={{ borderRadius: "5px" }}
          >
            <Form.Label className="mb-0">{param.name}</Form.Label>
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
            <i className="bi bi-arrow-right"></i>
          </div>
          <div className="col-7">
            <Form.Control
              className="form-control-sm"
              type="text"
              value={value || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </Form.Group>
    );
  }

  if (param.type === "NUMERIC") {
    return (
      <Form.Group controlId={param.name}>
        <div className="d-flex mb-1">
          <div
            className="col-3 border border-gray d-flex align-items-center px-2"
            style={{ borderRadius: "5px" }}
          >
            <Form.Label className="mb-0">{param.name}</Form.Label>
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
            <i className="bi bi-arrow-right"></i>
          </div>
          <div className="col-7">
            <Form.Control
              className="form-control-sm"
              type="number"
              value={value || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </Form.Group>
    );
  }

  if (param.type === "OBJECT") {
    return (
      <div>
        <strong className="mb-1">{param.name}</strong>
        {param.properties &&
          param.properties.map((prop, index) => (
            <div className="ps-2" key={index}>
              <ParamInput
                param={prop}
                value={value ? value[prop.name] : ""}
                onChange={(propValue) =>
                  onChange({ ...value, [prop.name]: propValue })
                }
              />
            </div>
          ))}
      </div>
    );
  }

  if (param.type === "ARRAY") {
    return (
      <div>
        <div className="d-flex justify-content-between">
          <strong className="mb-1">{param.name}</strong>
          <div
            className="ms-2"
            onClick={() => onChange([...(value || []), ""])}
          >
            <i className="bi bi-plus-circle"></i>
          </div>
        </div>
        {(value || []).map((val, idx) => (
          <div className="ps-2" key={idx}>
            <ParamInput
              param={{ type: "STRING", name: `${param.name}[${idx}]` }}
              value={val}
              onChange={(newVal) => {
                const newArray = [...value];
                newArray[idx] = newVal;
                onChange(newArray);
              }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (param.type === "ANY") {
    return (
      <Form.Group controlId={param.name}>
        <div className="d-flex mb-1">
          <div
            className="col-3 border border-gray d-flex align-items-center px-2"
            style={{ borderRadius: "5px" }}
          >
            <Form.Label className="mb-0">{param.name}</Form.Label>
          </div>
          <div className="col-2 d-flex justify-content-center align-items-center">
            <i className="bi bi-arrow-right"></i>
          </div>
          <div className="col-7">
            <Form.Control
              className="form-control-sm"
              type="text"
              value={value || ""}
              onChange={handleChange}
            />
          </div>
        </div>
      </Form.Group>
    );
  }

  return null;
};

export default ParamInput;
