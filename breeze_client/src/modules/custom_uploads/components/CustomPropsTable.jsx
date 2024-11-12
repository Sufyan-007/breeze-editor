import { useState } from 'react';

function CustomPropsTable({ props }) {
  const [selectedProp, setSelectedProp] = useState(null);
  const [editableProps, setEditableProps] = useState(props);

  const getType = (value) => {
    if (value === null) return 'null';
    return typeof value;
  };

  // Function to handle when a value is edited
  const handleValueChange = (key, newValue) => {
    setEditableProps((prevProps) => ({
      ...prevProps,
      [key]: { ...prevProps[key], value: newValue },
    }));
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted with data:', formData);
  };

  return (
    <div className="br-background-primary d-flex">
      <div style={{ width: '100%', marginRight: '50px' }}>
        <h5 className="large-font">Props</h5>
        {Object.keys(props).length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Data Type</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(editableProps).map((key) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{getType(editableProps[key])}</td>
                  <td>
                    <input
                      type="text"
                      value={editableProps[key]?.value || ''}
                      //   onChange={(e) => handleValueChange(key, e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="med-font br-text-primary">No props available</p>
        )}
      </div>
    </div>
  );
}

export default CustomPropsTable;
