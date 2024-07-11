export default function CustomCode({ value }) {
    return (
      <div className="custom-code border border-light px-2 py-1">
        <div className="d-flex justify-content-between">
          <div>
            <strong>Custom:</strong> {value}
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => {}}>
            <i className="bi bi-pencil-square text-primary"></i>
          </div>
        </div>
      </div>
    );
  }