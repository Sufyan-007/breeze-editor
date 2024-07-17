import React, { useState, useEffect, useMemo } from "react";
import MonacoEditor from "../../common/MonacoEditor";
import { Button } from "react-bootstrap";

function CustomCode({ config, update }) {
  const [conf, setConf] = useState({ ...config });

  useEffect(() => {
    setConf({ ...config });
  }, [config]);

  function updateCode(value) {
    setConf((state) => {
      state.body = value;
      return { ...state };
    });
  }

  const generateUniqueId = useMemo(() => {
    return "id-" + Math.random().toString(36).substr(2, 16);
  }, []);

  return (
    <div className="mt-3 d-flex flex-column justify-content-between">
      <div>
        <MonacoEditor
          defaultValue={config.body}
          onChange={(value) => {
            updateCode(value);
          }}
          height="200px"
          width="100%"
          language="javascript"
          id={generateUniqueId}
        />
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

export default CustomCode;
