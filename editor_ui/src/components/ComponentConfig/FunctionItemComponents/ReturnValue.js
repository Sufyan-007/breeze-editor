import React, { useState, useEffect } from "react";

const ReturnValue = ({ onChange }) => {
  const [returnValue, setReturnValue] = useState("");

  const handleChange = (e) => {
    setReturnValue(e.target.value);
  };

  useEffect(() => {
    const valueObject = {
      type: "TOKEN",
      value: returnValue,
    };
    const declaration = {
      type: "RETURN",
      value: valueObject,
    };

    onChange(declaration);
  }, [returnValue, onChange]);

  return (
    <div className="px-1 py-2">
      <form className="variable-declaration-form">
        <div className="form-group mb-2">
          <label htmlFor="value">Value</label>
          <input
            type="text"
            id="value"
            name="value"
            placeholder="Return Value"
            value={returnValue}
            onChange={handleChange}
            className="form-control form-control-sm mt-1"
            required
          />
        </div>
      </form>
    </div>
  );
};

export default ReturnValue;
