import { useState, useEffect } from 'react';
import RoutingConfigForm from '../components/RoutingConfigForm';
import '../styles/styles.css';
import { initialRoutingConfig, routerProviderData } from '../constants/RoutingConstants';
import { BreezeTree } from '../../../common/display';
import { CustomTextInput } from '../../../common/fields';
import RouterProviderForm from '../components/RouterProviderForm';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchComponents } from '../../../redux/components/componentActions';
import {
  fetchRoutingConfig,
  addRouteConfig,
  updateRouteConfig,
  deleteRouteConfig,
} from '../../../redux/routing/routingActions';
import { getRouteDetails } from '../../../services/routing/routingService';

function RoutingConfig() {
  const dispatch = useDispatch();
  const { projectName } = useParams();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRoute, setIsNewRoute] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRouterProviderForm, setShowRouterProviderForm] = useState(false);
  const { components } = useSelector((state) => state.component);
  const { routingConfig, status } = useSelector((state) => state.routing);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    if (Object.keys(routingConfig).length === 0) {
      dispatch(fetchRoutingConfig({ projectName }));
    }
  }, [dispatch, projectName, routingConfig]);

  useEffect(() => {
    if (Object.keys(components).length === 0) {
      dispatch(fetchComponents({ projectName }));
    }
  }, [dispatch, projectName, components]);

  useEffect(() => {
    if (status === 'succeeded') {
      setFlag(true);
    }
  }, [status]);

  const transformedComponents = components?.data
    ? [
        { label: 'Select component', value: '' },
        ...Object.entries(components.data).map(([key, value]) => ({
          label: value,
          value: key,
        })),
      ]
    : [{ label: 'Select component', value: '' }];

  const handleNodeClick = async (route) => {
    setShowRouterProviderForm(false);
    const res = await getRouteDetails(projectName, route.id);
    setSelectedRoute(res.data);
    setIsEditing(true);
  };

  const handleAddRoute = () => {
    setShowRouterProviderForm(false);
    setIsEditing(false);
    setIsNewRoute(true);
    setSelectedRoute(initialRoutingConfig);
  };

  const handleFormSubmit = async (routeData) => {
    try {
      if (isNewRoute) {
        await dispatch(addRouteConfig({ projectName, payload: routeData })).unwrap();
      } else if (isEditing) {
        await dispatch(updateRouteConfig({ projectName, payload: routeData })).unwrap();
      }
    } catch (error) {
      console.error('Error submitting route data:', error);
    } finally {
      setIsEditing(false);
      setIsNewRoute(false);
      dispatch(fetchRoutingConfig({ projectName }));
    }
  };

  const handleDeleteRoute = async () => {
    if (selectedRoute) {
      const id = selectedRoute.id;
      await dispatch(deleteRouteConfig({ projectName, payload: { id } })).unwrap();
      setSelectedRoute(initialRoutingConfig);
      setIsEditing(false);
      dispatch(fetchRoutingConfig({ projectName }));
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
  };

  const handleRouterProviderClick = () => {
    setIsEditing(false);
    setIsNewRoute(false);
    setShowRouterProviderForm(true);
  };

  const handleRouterProviderSubmit = (data) => {
    console.log('Router provider data:', data);
    setShowRouterProviderForm(false);
  };

  return (
    <div className="h-100">
      <div className="row mx-0 h-100">
        <div className="col-4 p-2 br-routing-config-display border-end border-secondary">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="br-text-primary fw-bold">Route Configuration</h6>
            </div>
            <div className="mb-2">
              <span className="badge breeze-badge collapsible" onClick={handleAddRoute}>
                <i className="small-font bi bi-plus-circle"></i>
                <span className="small-font ms-1">Add</span>
              </span>
            </div>
          </div>
          <div className="px-2 py-1">
            <CustomTextInput
              name="searchRoute"
              value={searchQuery}
              onChange={handleSearch}
              config={{ label: '', groupClass: 'form-group mb-2' }}
              placeholder={'Search..'}
            />
          </div>
          <div className="routing-tree">
            {flag && <BreezeTree data={routingConfig} fetchChildren={() => {}} handleNodeClick={handleNodeClick} />}
          </div>
        </div>

        <div className="col-8 p-2 br-routing-config-display">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="badge breeze-badge" onClick={handleRouterProviderClick}>
                <span className="med-font">
                  <i className="bi bi-gear me-1"></i>Router Provider
                </span>
              </span>
            </div>
            <div>
              {isEditing && (
                <i className="bi bi-trash3-fill btn btn-sm btn-outline-danger" onClick={handleDeleteRoute}></i>
              )}
            </div>
          </div>

          {isEditing || isNewRoute ? (
            <div className="">
              <RoutingConfigForm
                onSubmit={handleFormSubmit}
                initialData={selectedRoute}
                availableComponents={transformedComponents}
              />
            </div>
          ) : (
            <p className="br-text-primary">Select a route from the tree or click Add Route to create a new route.</p>
          )}

          {showRouterProviderForm && (
            <div className="mb-4">
              <RouterProviderForm
                initialData={routerProviderData}
                availableComponents={transformedComponents}
                onSubmit={handleRouterProviderSubmit}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoutingConfig;
