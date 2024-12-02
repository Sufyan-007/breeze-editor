import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CustomButtonField } from '../../../common/fields';
import '../styles/CustomUploadSidebar.css';
import '../../../../src/App.css';
import { useParams } from 'react-router-dom';
import ExternalCompPropEditForm from './ExternalCompPropEditForm';
import {
  updatePropConfigAction,
  addPropConfigAction,
  deletePropConfigAction,
  fetchZipFileComponentsAction,
} from '../redux/customZipActions';

function CustomPropsList({ selectedFile, selectedComponentId, components, props }) {
  const [selectedProp, setSelectedProp] = useState();
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isAddingNewProp, setIsAddingNewProp] = useState(false);
  const [currentProps, setCurrentProps] = useState(props);
  const { projectName } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (components?.data && Object.keys(components.data).length === 0) {
      setCurrentProps({});
      setSelectedProp(null);
      setIsFormVisible(false);
      setIsAddingNewProp(false);
    } else {
      setCurrentProps(props);
      setSelectedProp(null);
      setIsFormVisible(false);
      setIsAddingNewProp(false);
    }
  }, [components.data, props]);

  const handlePropClick = (key) => {
    if (selectedProp === key && isFormVisible) {
      setIsFormVisible(false);
      setSelectedProp(null);
    } else {
      setSelectedProp(key);
      setIsFormVisible(true);
      setIsAddingNewProp(false);
    }
  };

  const handleAddNewProp = () => {
    setSelectedProp(null);
    setIsAddingNewProp(true);
    setIsFormVisible(true);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setIsAddingNewProp(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      const fetchPayload = {
        resource: selectedComponentId,
        select: ['props'],
      };

      if (isAddingNewProp) {
        const newProp = {
          ...formData,
        };

        const payload = {
          ...newProp,
          fileName: selectedFile,
          componentId: selectedComponentId,
        };

        if (projectName) {
          // Dispatch action to add the new prop
          await dispatch(addPropConfigAction({ projectName, formData: payload })).unwrap();

          // Fetch the updated list of props after successful addition
          await dispatch(
            fetchZipFileComponentsAction({ filename: selectedFile, projectName, payload: fetchPayload })
          ).unwrap();
        } else {
          console.error('Project name is undefined!');
        }
      } else {
        const payload = {
          ...formData,
          id: selectedProp,
          fileName: selectedFile,
          componentId: selectedComponentId,
        };

        if (projectName) {
          // Dispatch action to update the existing prop
          await dispatch(updatePropConfigAction({ projectName, formData: payload })).unwrap();

          // Fetch the updated list of props after successful update
          await dispatch(
            fetchZipFileComponentsAction({ filename: selectedFile, projectName, payload: fetchPayload })
          ).unwrap();
        } else {
          console.error('Project name is undefined!');
        }
      }

      // Reset form visibility and adding state
      setIsFormVisible(false);
      setIsAddingNewProp(false);
    } catch (error) {
      console.error('Error handling form submission:', error);
    }
  };

  const handleDeleteProp = (key) => {
    if (projectName) {
      dispatch(
        deletePropConfigAction({
          projectName,
          propId: key,
          fileName: selectedFile,
          componentId: selectedComponentId,
        })
      );

      setCurrentProps((prevProps) => {
        const updatedProps = { ...prevProps };
        delete updatedProps[key];
        return updatedProps;
      });
    } else {
      console.error('Project name is undefined!');
    }
  };

  return (
    <div className="br-background-primary d-flex">
      <div style={{ width: '20%', marginRight: '50px' }}>
        <div className="row">
          <div className="col-10">
            <h5 className="large-font">Props</h5>
          </div>
          <div className="col-2">
            {components?.data && Object.keys(components.data).length > 0 && (
              <i className="bi bi-plus-square" onClick={handleAddNewProp} style={{ cursor: 'pointer' }}></i>
            )}
          </div>
        </div>
        {Object.keys(currentProps).length > 0 ? (
          Object.keys(currentProps).map((key) => (
            <div className="row" key={key}>
              <div className="col-10">
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
              <div className="col-2 mt-1">
                <i
                  className="bi bi-trash color-red"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDeleteProp(key)}
                ></i>
              </div>
            </div>
          ))
        ) : (
          <p className="med-font br-text-primary">No props available</p>
        )}
      </div>

      <div style={{ width: '70%' }}>
        {isFormVisible && (
          <div className="collapsible-form">
            <ExternalCompPropEditForm
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
              initialData={currentProps}
              selectedProp={selectedProp}
              addNewProp={isAddingNewProp}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// selectedProp && Object.keys(currentProps).length > 0;
export default CustomPropsList;
