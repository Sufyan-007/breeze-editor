export default function Declaration({ declarationType, varName, value }) {
    return (
      <div className="declaration border border-light px-2 py-1">
        <strong>{declarationType}:</strong> {varName} ={" "}
        {value && value.type === "STRING" ? value.value : JSON.stringify(value)}
      </div>
    );
}