export default function Assignment({ varName, value }) {
    return (
      <div className="assignment border border-light px-2 py-1">
        <strong>Assignment:</strong> {varName} ={" "}
        {value && value.type === "STRING" ? value.value : JSON.stringify(value)}
      </div>
    );
  }