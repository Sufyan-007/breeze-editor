export default function FunctionCall({ functionName, parameters }) {
    return (
      <div className="function-call border border-light px-2 py-1">
        <strong>Function Call:</strong> {functionName}(
        {parameters.map((param, index) => param.value).join(", ")})
      </div>
    );
  }