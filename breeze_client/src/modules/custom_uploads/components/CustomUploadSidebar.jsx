import { useState } from 'react';
import '../styles/CustomUploadSidebar.css';
import PropTypes from 'prop-types';
import { CustomButtonField } from '../../../common/fields';
export default function CustomUploadSidebar({ components, selectedFilename, handleClick }) {
  const [selectedKey, setSelectedKey] = useState(null);
  const handleButtonClick = (key) => {
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
      {components?.data && Object.keys(components.data).length > 0 && !components?.data?.props ? (
        <div>
          <h5 className="large-font">Components</h5>
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
      ) : (
        <p>No components found</p>
      )}
    </div>
  );
}

// Prop type validations
CustomUploadSidebar.propTypes = {
  components: PropTypes.shape({
    data: PropTypes.objectOf(PropTypes.string),
  }),
  selectedFilename: PropTypes.string,
  handleClick: PropTypes.func,
};
