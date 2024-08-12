import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const ReturnValue = ({ config, update }) => {
  const [conf, setConf] = useState({ ...config });

  useEffect(() => {
    setConf({ ...config });
  }, [config]);

  function updateValue(value) {
    setConf((state) => {
      state.value = {
        type: "TOKEN",
        value: value,
      };
      return { ...state };
    });
  }

  return (
    <div className="d-flex h-100 flex-column justify-content-between">
      <div>
        <form className="variable-declaration-form">
          <div className="form-group mb-2">
            <label htmlFor="value">Value</label>
            <input
              type="text"
              id="value"
              name="value"
              placeholder="Return Value"
              value={conf?.value?.value}
              onChange={(event) => updateValue(event.target.value)}
              className="form-control form-control-sm mt-1"
              required
            />
          </div>
        </form>
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
};

export default ReturnValue;
