import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { funcConfigTemplates } from '../../constants/functionConfigTemplates';
import { CustomButtonField, CustomSelectField, CustomTextInput } from '../../../../common/fields';
import { getAllRoutesFullPath, getRouteDetails } from '../../../../services/routing/routingService';
import { useParams } from 'react-router-dom';

function RouterNavigateConfigForm({ onSubmit, onCancel, editMode }) {
  const initialRoutingNavigateConfig = JSON.parse(JSON.stringify(funcConfigTemplates['addNavigation']));
  const [formData, setFormData] = useState({ ...initialRoutingNavigateConfig });
  const [availableRoutes, setAvailableRoutes] = useState([{ label: 'Select Route', value: '' }]);
  const [routeParams, setRouteParams] = useState([]);
  const [paramValues, setParamValues] = useState({});
  const { projectName } = useParams();

  useEffect(() => {
    const fetchRoutes = async () => {
      const res = await getAllRoutesFullPath(projectName);
      const formattedRoutes = res?.nodes.map((node) => ({
        label: node.path,
        value: node.id,
      }));
      setAvailableRoutes([{ label: 'Select Route', value: '' }, ...formattedRoutes]);
    };
    fetchRoutes();
  }, [projectName]);

  const handleRouteSelect = async (routeId) => {
    try {
      const response = await getRouteDetails(projectName, routeId);
      const routeDetails = response.data;
      setFormData((prev) => ({ ...prev, selectedRoute: routeId }));
      if (routeDetails.params?.length > 0) {
        const paramsObj = routeDetails.params.reduce((acc, param) => {
          acc[param] = '';
          return acc;
        }, {});
        setRouteParams(routeDetails.params);
        setParamValues(paramsObj);
      } else {
        setRouteParams([]);
        setParamValues({});
        setFormData((prev) => ({
          ...prev,
          parameters: [{ ...prev.parameters[0], value: routeDetails.path }],
        }));
      }
    } catch (error) {
      console.error('Failed to fetch route details:', error);
    }
  };

  const handleParamChange = (param, value) => {
    const updatedParamValues = { ...paramValues, [param]: value };
    setParamValues(updatedParamValues);

    const constructedPath = routeParams.reduce(
      (path, param) => path.replace(`:${param}`, updatedParamValues[param] || `:${param}`),
      availableRoutes.find((route) => route.value === formData.selectedRoute)?.label || ''
    );

    setFormData((prev) => ({
      ...prev,
      parameters: [{ ...prev.parameters[0], value: constructedPath }],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <div className="service-call-config-form h-100">
      <div className="d-flex flex-column justify-content-between h-100">
        <div>
          <CustomSelectField
            name="path"
            value={formData.selectedRoute}
            onChange={(value) => handleRouteSelect(value)}
            options={availableRoutes}
            config={{ label: 'Select Path', groupClass: 'form-group mb-2' }}
          />

          {routeParams.map((param) => (
            <CustomTextInput
              key={param}
              name={param}
              value={paramValues[param]}
              onChange={(val) => handleParamChange(param, val)}
              config={{ label: `Enter value for ${param}`, groupClass: 'form-group mb-2' }}
            />
          ))}
        </div>
        <div className="d-flex justify-content-end">
          <CustomButtonField
            type="button"
            label={'Cancel'}
            className="btn br-secondary-button med-font mx-2"
            onClick={handleCancel}
          />
          <CustomButtonField
            type="button"
            label={editMode ? 'Update' : 'Submit'}
            className="btn btn-filled med-font"
            onClick={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}

RouterNavigateConfigForm.propTypes = {
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  editMode: PropTypes.bool,
};

export default RouterNavigateConfigForm;
