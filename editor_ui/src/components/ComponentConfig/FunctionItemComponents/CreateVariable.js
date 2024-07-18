import React, { useState, useEffect, useMemo } from "react";
import MonacoEditor from "../../common/MonacoEditor";
import { Button, Form } from "react-bootstrap";

function CreateVariable({ config, update }) {
  const [conf, setConf] = useState({ ...config });

  useEffect(() => {
    setConf({ ...config });
  }, [config]);

  const updateConfig = (key, value) => {
    setConf((state) => {
      if (key === "value.value") {
        if (!state.value) {
          state.value = { type: "CUSTOM", value: "" };
        }
        state.value.value = value;
      } else {
        state[key] = value;
      }
      return { ...state };
    });
  };

  const generateUniqueId = useMemo(() => {
    return "id-" + Math.random().toString(36).substr(2, 16);
  }, []);

  return (
    <div className="d-flex flex-column justify-content-between">
      <Form>
        <Form.Group controlId="declarationType">
          <Form.Label>Declaration Type</Form.Label>
          <Form.Control
            as="select"
            className="form-select form-select-sm"
            value={conf.declarationType}
            onChange={(e) => updateConfig("declarationType", e.target.value)}
          >
            <option value="">Select declaration type</option>
            <option value="const">const</option>
            <option value="let">let</option>
            <option value="var">var</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="varName" className="mt-3">
          <Form.Label>Variable Name</Form.Label>
          <Form.Control
            type="text"
            className="form-control-sm"
            value={conf.varName}
            onChange={(e) => updateConfig("varName", e.target.value)}
          />
        </Form.Group>
        <div className="mt-3">
          <Form.Label>Value</Form.Label>
          <MonacoEditor
            defaultValue={conf.value ? conf.value.value : ""}
            onChange={(value) => updateConfig("value.value", value)}
            height="100px"
            width="100%"
            language="json"
            id={generateUniqueId}
          />
        </div>
      </Form>

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

export default CreateVariable;
