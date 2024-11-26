import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomButtonField } from '../../../common/fields';
import '../styles/CustomUploadSidebar.css';
import { useParams } from 'react-router-dom';
import ExternalCompPropEditForm from './ExternalCompPropEditForm';
import { updatePropConfigAction } from '../redux/customZipActions';

function CustomPropsList({ selectedFile, selectedComponentId, components, props }) {
  const [selectedProp, setSelectedProp] = useState();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentProps, setCurrentProps] = useState(props);
  const { projectName } = useParams();
  const dispatch = useDispatch();

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

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const handleFormSubmit = (formData) => {
    const payload = {
      ...formData,
      id: selectedProp,
      fileName: selectedFile,
      componentId: selectedComponentId,
    };
    if (projectName) {
      dispatch(updatePropConfigAction({ projectName, formData: payload }));
    } else {
      console.error('Project name is undefined!');
    }
  };
  return (
    <div className="br-background-primary d-flex">
      <div style={{ width: '20%', marginRight: '50px' }}>
        <h5 className="large-font">Props</h5>
        {Object.keys(currentProps).length > 0 ? (
          Object.keys(currentProps).map((key) => (
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
          ))
        ) : (
          <p className="med-font br-text-primary">No props available</p>
        )}
      </div>

      <div style={{ width: '70%' }}>
        {isFormVisible && selectedProp && Object.keys(currentProps).length > 0 && (
          <div className="collapsible-form">
            <ExternalCompPropEditForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              initialData={currentProps}
              selectedProp={selectedProp}
            />
          </div>
        )}
      </div>
    </div>
  );
}


export default CustomPropsList;
