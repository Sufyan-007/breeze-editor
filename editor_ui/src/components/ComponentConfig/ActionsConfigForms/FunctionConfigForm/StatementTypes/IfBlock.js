import { useState } from "react";
import FunctionConfigStack from "../FunctionConfigStack";

export default function IfBlock({ config, updateParent }) {
  const [blockConfig,setBlockConfig] = useState(config)


  return (
    <div className="if-block border border-light px-2 py-1">
      <strong>If:</strong>{" "}
      {config.condition.value}
      <div className="px-3">
        <FunctionConfigStack config={config.bodyConfig} updateParent={console.log} />
      </div>
      {config.elseBody && (
        <>
          <strong>Else:</strong>
          <div className="px-3">
            <FunctionConfigStack config={config.elseBody} updateParent={console.log} />

          </div>
        </>
      )}
    </div>
  );
}