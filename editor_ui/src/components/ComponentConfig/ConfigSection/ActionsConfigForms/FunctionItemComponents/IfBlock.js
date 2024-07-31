import React, { useEffect, useState } from "react";
import { Form, Col, Button } from "react-bootstrap";

function IfBlock({ config, update }) {
  const [conf, setConf] = useState({ ...config });

  useEffect(() => {
    setConf({ ...config });
  }, [config]);

  function updateCondition(value) {
    setConf((state) => ({
      ...state,
      condition: {
        ...state.condition,
        value,
      },
    }));
  }

  function updateElseIfCondition(index, value) {
    const updatedElseIfs = conf.elseIf.map((item, idx) =>
      idx === index
        ? { ...item, condition: { ...item.condition, value } }
        : item
    );
    setConf((state) => ({
      ...state,
      elseIf: updatedElseIfs,
    }));
  }

  function addElseIf() {
    setConf((state) => ({
      ...state,
      elseIf: [
        ...state.elseIf,
        {
          condition: { type: "CUSTOM", value: "" },
          bodyConfig: { type: "BLOCK", statements: [] },
        },
      ],
    }));
  }

  function removeElseIf(index) {
    setConf((state) => ({
      ...state,
      elseIf: state.elseIf.filter((_, idx) => idx !== index),
    }));
  }

  function toggleElseBody() {
    setConf((state) => ({
      ...state,
      elseBody: state.elseBody ? null : { type: "BLOCK", statements: [] },
    }));
  }

  return (
    <div className="d-flex h-100 flex-column justify-content-between">
      <div>
        <Form.Label htmlFor="ifCondition">If</Form.Label>
        <Form.Group as={Col} controlId="ifCondition">
          <Form.Control
            className="form-control-sm"
            type="text"
            placeholder="condition"
            value={conf?.condition.value}
            onChange={(event) => updateCondition(event.target.value)}
            required
          />
        </Form.Group>

        <div className="my-2">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Else If Conditions</strong>
            </div>
            <div
              className="mx-1"
              style={{ cursor: "pointer" }}
              onClick={addElseIf}
            >
              <i class="bi bi-plus-circle"></i> Else If
            </div>
          </div>
          {conf.elseIf.length > 0 ? (
            <>
              {" "}
              {conf.elseIf.map((item, index) => (
                <div key={index} className="my-2 px-1">
                  <Form.Label htmlFor={`elseIfCondition-${index}`}>
                    Else If
                  </Form.Label>

                  <div className="d-flex justify-content-between align-items-center">
                    <div className="w-100">
                      <Form.Group
                        as={Col}
                        controlId={`elseIfCondition-${index}`}
                      >
                        <Form.Control
                          className="form-control-sm"
                          type="text"
                          placeholder="condition"
                          value={item.condition.value}
                          onChange={(event) =>
                            updateElseIfCondition(index, event.target.value)
                          }
                          required
                        />
                      </Form.Group>
                    </div>
                    <div
                      className="me-1 ms-2"
                      style={{ color: "red", cursor: "pointer" }}
                      onClick={() => removeElseIf(index)}
                    >
                      <i class="bi bi-trash"></i>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p>No Else if blocks present</p>
          )}
        </div>

        <div className="my-3">
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Include Else Block"
            checked={!!conf.elseBody}
            onChange={toggleElseBody}
          />
        </div>
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

export default IfBlock;
