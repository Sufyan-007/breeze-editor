import React, { useState } from "react";
import { Form, Col } from "react-bootstrap";

function IfBlock({ onChange }) {
  const [condition, setCondition] = useState("");

  const handleConditionChange = (e) => {
    const newCondition = e.target.value;
    setCondition(newCondition);
    const config = {
      type: "IF_BLOCK",
      condition: {
        type: "CUSTOM",
        value: newCondition,
      },
      bodyConfig: {
        type: "BLOCK",
        statements: [],
      },
      elseBody: {
        type: "BLOCK",
        statements: [],
      },
    };
    onChange(config);
  };

  return (
    <div className="mt-3">
      <Form.Label htmlFor="ifCondition">If Condition</Form.Label>
      <Form.Group as={Col} controlId="ifCondition">
        <Form.Control
          className="form-control-sm"
          type="text"
          placeholder="condition"
          value={condition}
          onChange={handleConditionChange}
          required
        />
      </Form.Group>
    </div>
  );
}

export default IfBlock;
