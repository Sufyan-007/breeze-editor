
export default function Return({ value }) {
    return (
      <div className="return border border-light px-2 py-1">
        <strong>Return:</strong> {value?.value}
      </div>
    );
  }