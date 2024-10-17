import { useState } from 'react';
import '../styles/CustomUploadSidebar.css';
import { CustomButtonField } from '../../../common/fields';
export default function CustomUploadSidebar({ components, selectedFilename, handleClick }) {
  const [selectedKey, setSelectedKey] = useState(null);
  const handleButtonClick = (key) => {
    console.log(key);
    setSelectedKey(key);
    handleClick(key, selectedFilename);
  };
  return (
    <div
      className="br-background-primary"
      style={{
        height: '100%',
        overflowY: 'auto',
        left: 0,
        top: 0,
      }}
    >
      <h5 className="large-font">Components</h5>
      {components?.data && !components?.data?.props && (
        <div>
          {Object.keys(components.data).map((key) => (
            <div key={key}>
              <CustomButtonField
                type="button"
                onClick={() => handleButtonClick(key)}
                label={components.data[key]}
                className={`run-btn med-font br-text-primary custom-button ${selectedKey === key ? 'selected' : ''}`}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '5px',
                  border: 'none',
                  cursor: 'pointer',
                }}
              />
            </div>
          ))}
        </div>
      )}

      {!components?.data && <p>No components available</p>}
    </div>
  );
}
