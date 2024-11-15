import { useState, useEffect } from 'react';
import PropConfigForm from '../../component-configuration/components/config-forms/PropConfigForm'; // Adjust the import path if needed
import { CustomButtonField } from '../../../common/fields';
import '../styles/CustomUploadSidebar.css';

function CustomPropsList({ components, props }) {
  const [selectedProp, setSelectedProp] = useState();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentProps, setCurrentProps] = useState(props);
  useEffect(() => {
    if (components?.data && Object.keys(components.data).length === 0) {
      setCurrentProps({});
      setSelectedProp(null);
      setIsFormVisible(false);
    } else {
      setCurrentProps(props);
      setSelectedProp(null);
      setIsFormVisible(false);
    }
  }, [components.data, props]);

  const handlePropClick = (key) => {
    if (selectedProp === key && isFormVisible) {
      setIsFormVisible(false);
      setSelectedProp(null);
    } else {
      setSelectedProp(key);
      setIsFormVisible(true);
    }
  };

  const handleFormSubmit = (formData) => {
    console.log('Form submitted with data:', formData);
  };
  console.log(currentProps, 'current props', selectedProp, 'selected props');
  return (
    <div className="br-background-primary d-flex">
      <div style={{ width: '20%', marginRight: '50px' }}>
        <h5 className="large-font">Props</h5>
        {Object.keys(currentProps).length > 0 ? (
          Object.keys(currentProps).map((key) =>
              <div key={key}>
                <CustomButtonField
                  type="button"
                  label={currentProps[key].prop_name}
                  onClick={() => handlePropClick(key)}
                  className={`run-btn med-font br-text-primary custom-button ${selectedProp === key ? 'selected' : ''}`}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '5px',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                />
              </div>
            
          )
        ) : (
          <p className="med-font br-text-primary">No props available</p>
        )}
      </div>

      <div style={{ width: '70%' }}>
        {isFormVisible && selectedProp && Object.keys(currentProps).length > 0 && (
          <div className="collapsible-form">
            <PropConfigForm onSubmit={handleFormSubmit} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomPropsList;
