import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

function TryCatch({ config, update }) {
  const [conf, setConf] = useState({ ...config });

  useEffect(() => {
    setConf({ ...config });
  }, [config]);

  return (
    <div className="d-flex h-100 flex-column justify-content-between">
      <div></div>
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

export default TryCatch;
