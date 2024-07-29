import React, { useEffect, useState } from "react";
import { Form, Col, Button } from "react-bootstrap";

function DoWhileBlock({ config, update }) {
  const [conf, setConf] = useState({ ...config });

  useEffect(() => {
    setConf({ ...config });
  }, [config]);

  function updateCondition(value) {
    setConf((state) => {
      state.condition.value = value;
      return { ...state };
    });
  }

  return (
    <div className="d-flex h-100 flex-column justify-content-between">
      <div>
        <Form.Label htmlFor="whileCondition">While Condition</Form.Label>
        <Form.Group as={Col} controlId="whileCondition">
          <Form.Control
            className="form-control-sm"
            type="text"
            placeholder="condition"
            value={conf?.condition.value}
            onChange={(event) => updateCondition(event.target.value)}
            required
          />
        </Form.Group>
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

export default DoWhileBlock;
