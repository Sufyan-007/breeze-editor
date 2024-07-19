export default function WhileBlock({ condition, bodyConfig }) {
    return (
      <div className="while-block border border-light px-2 py-1">
        <strong>While:</strong>{" "}
        {condition.operand1.value +
          " " +
          condition.operation +
          " " +
          condition.operand2.value}
        <div className="px-3">
        </div>
      </div>
    );
  }