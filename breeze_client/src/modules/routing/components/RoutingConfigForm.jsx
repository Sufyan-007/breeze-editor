import { useState, useEffect } from 'react';
import {
  CustomSelectField,
  CustomTextInput,
  CustomTextArea,
  CustomSwitchField,
  CustomButtonField,
} from '../../../common/fields';
import PropTypes from 'prop-types';
import { initialRoutingConfig } from '../constants/RoutingConstants';
import { getAllRoutesFullPath } from '../../../services/routing/routingService';
import { useParams } from 'react-router-dom';

function RoutingConfigForm({ onSubmit, initialData, availableComponents }) {
  const [formData, setFormData] = useState(initialData);
  const [basicDetailsOpen, setBasicDetailsOpen] = useState(true);
  const [advancedDetailsOpen, setAdvancedDetailsOpen] = useState(false);
  const [availableRoutes, setAvailableRoutes] = useState([{ label: 'Select Route', value: '' }]);
  const { projectName } = useParams();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    const fetchRoutes = async () => {
      const res = await getAllRoutesFullPath(projectName);
      const formattedRoutes = res?.nodes
        .map((node) => ({
          label: node.path,
          value: node.id,
        }))
        .filter((route) => route.label !== '/');
      setAvailableRoutes([{ label: 'Select Route', value: '' }, ...formattedRoutes]);
    };
    fetchRoutes();
  }, [projectName]);

  const handlePropChange = (index, prop, value) => {
    setFormData((prevData) => {
      const updatedProps = [...prevData.props];
      updatedProps[index] = { ...updatedProps[index], [prop]: value };
      return { ...prevData, props: updatedProps };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialRoutingConfig);
  };

  return (
    <form className="route-form">
      {/* Basic Route Details Section */}
      <div className="basic-route-details mb-3">
        <div className="br-background-secondary px-2 py-1 d-flex align-items-center justify-content-between">
          <h5
            className="br-text-primary med-font fw-semibold mb-0"
            onClick={() => setBasicDetailsOpen(!basicDetailsOpen)}
            style={{ cursor: 'pointer' }}
          >
            Basic Route Details
          </h5>
          <span> {basicDetailsOpen ? '-' : '+'}</span>
        </div>

        {basicDetailsOpen && (
          <div className="m-1">
            <CustomSelectField
              name="parentId"
              value={formData.parentId || ''}
              onChange={(value) => handleChange('parentId', value)}
              options={availableRoutes}
              config={{ label: 'Parent Path', groupClass: 'form-group mb-2' }}
            />

            <CustomTextInput
              name="path"
              value={formData.path || ''}
              onChange={(value) => handleChange('path', value)}
              config={{ label: 'Route Path', groupClass: 'form-group mb-2' }}
            />

            <CustomSelectField
              name="componentId"
              value={formData.componentId || ''}
              onChange={(value) => handleChange('componentId', value)}
              options={availableComponents}
              config={{ label: 'Element', groupClass: 'form-group mb-2' }}
            />

            <label className="form-label br-text-primary med-font fw-semibold">Props</label>
            {formData.props && formData.props.length > 0 ? (
              formData.props.map((prop, index) => (
                <div key={index} className="">
                  <CustomTextInput
                    name={prop.propName}
                    value={prop.propValue}
                    onChange={(value) => handlePropChange(index, 'propValue', value)}
                    config={{ label: prop.propName, groupClass: 'form-group mb-2' }}
                  />
                </div>
              ))
            ) : (
              <div className="form-label br-text-primary med-font">No props found</div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Routing Details Section */}
      <div className="advanced-route-details mb-3">
        <div className="br-background-secondary px-2 py-1 d-flex align-items-center justify-content-between">
          <h5
            className="br-text-primary med-font fw-semibold mb-0"
            onClick={() => setAdvancedDetailsOpen(!advancedDetailsOpen)}
            style={{ cursor: 'pointer' }}
          >
            Advanced Routing Details
          </h5>
          <span>{advancedDetailsOpen ? '-' : '+'}</span>
        </div>

        {advancedDetailsOpen && (
          <div className="my-2 mx-1">
            <div className="d-flex">
              <CustomSwitchField
                name="index"
                checked={formData.index || false}
                onChange={(value) => handleChange('index', value)}
                config={{
                  label: 'Index',
                  groupClass: 'form-group form-switch me-3',
                  className: 'form-check-input br-form-switch-input me-2',
                }}
              />

              <CustomSwitchField
                name="caseSensitive"
                checked={formData.caseSensitive || false}
                onChange={(value) => handleChange('caseSensitive', value)}
                config={{
                  label: 'Case Sensitive',
                  groupClass: 'form-group form-switch',
                  className: 'form-check-input br-form-switch-input me-2',
                }}
              />
            </div>

            <CustomSelectField
              name="errorElementId"
              value={formData.errorElementId || ''}
              onChange={(value) => handleChange('errorElementId', value)}
              options={availableComponents}
              config={{
                label: 'Error Element',
                groupClass: 'form-group mb-2',
              }}
            />

            <CustomTextArea
              name="loader"
              value={formData.loader || ''}
              onChange={(value) => handleChange('loader', value)}
              config={{ label: 'Loader', groupClass: 'form-group mb-2' }}
            />

            <CustomTextArea
              name="action"
              value={formData.action || ''}
              onChange={(value) => handleChange('action', value)}
              config={{ label: 'Action', groupClass: 'form-group mb-2' }}
            />

            <CustomTextArea
              name="lazy"
              value={formData.lazy || ''}
              onChange={(value) => handleChange('lazy', value)}
              config={{ label: 'Lazy', groupClass: 'form-group mb-2' }}
            />
          </div>
        )}
      </div>

      <div className="d-flex justify-content-end">
        <CustomButtonField type="button" label="Submit" className="btn btn-filled" onClick={handleSubmit} />
      </div>
    </form>
  );
}

RoutingConfigForm.propTypes = {
  onSubmit: PropTypes.func,
  initialData: PropTypes.object,
  availableComponents: PropTypes.array,
};

export default RoutingConfigForm;
