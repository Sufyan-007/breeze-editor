import React from "react";
import MonacoEditor from "../../common/MonacoEditor";

function CustomCode({ onChange }) {
  const [customCode, setCustomCode] = React.useState("");
  const handleChange = (value) => {
    setCustomCode(value);
    const config = {
      type: "CUSTOM",
      value: customCode,
    };
    onChange(config);
  };

  return (
    <div className="mt-3">
      <MonacoEditor
        defaultValue={""}
        onChange={(value) => {
          handleChange(value);
        }}
        height="200px"
        width="100%"
        language="javascript"
        id="custom-code"
      />
    </div>
  );
}

export default CustomCode;
