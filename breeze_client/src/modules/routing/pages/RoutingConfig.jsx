import { useState, useEffect } from 'react';
import RoutingConfigForm from '../components/RoutingConfigForm';
import '../styles/styles.css';
import { initialRoutingConfig, routerProviderData, routingTreeData } from '../constants/RoutingConstants';
import { BreezeTree } from '../../../common/display';
import { CustomButtonField, CustomTextInput } from '../../../common/fields';
import RouterProviderForm from '../components/RouterProviderForm';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchComponents } from '../../../redux/components/componentActions';

function RoutingConfig() {
  const dispatch = useDispatch();
  const { projectName } = useParams();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewRoute, setIsNewRoute] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRouterProviderForm, setShowRouterProviderForm] = useState(false);
  const { components } = useSelector((state) => state.component);

  useEffect(() => {
    dispatch(fetchComponents({ projectName }));
  }, [dispatch, projectName]);

  const transformedComponents = components?.data
    ? Object.entries(components.data).map(([key, value]) => ({
        label: value,
        value: key,
      }))
    : [];

  const handleNodeClick = (route) => {
    setShowRouterProviderForm(false);
    setSelectedRoute(route);
    setIsEditing(true);
  };

  const handleAddRoute = () => {
    setShowRouterProviderForm(false);
    setIsEditing(false);
    setIsNewRoute(true);
    setSelectedRoute(initialRoutingConfig);
  };

  const handleFormSubmit = (routeData) => {
    console.log('Route data submitted:', routeData);
    setIsEditing(false);
    setIsNewRoute(false);
  };

  const handleDeleteRoute = () => {
    if (selectedRoute) {
      console.log(`Deleted route: ${selectedRoute.routePath}`);
      setSelectedRoute(initialRoutingConfig);
      setIsEditing(false);
    }
  };

  const renderTreeNode = (node) => {
    return (
      <div className="med-font">
        <i className="bi bi-diagram-2"></i> <span className="fw-bold">{node.routePath}</span> - {node.element}
      </div>
    );
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
          <h6 className="br-text-primary fw-bold">Route Configuration</h6>
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
            <BreezeTree data={routingTreeData} renderNode={renderTreeNode} handleNodeClick={handleNodeClick} />
          </div>
        </div>

        <div className="col-8 p-2 br-routing-config-display">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <span className="badge breeze-badge p-2" onClick={handleRouterProviderClick}>
                <span className="med-font">
                  <i className="bi bi-gear me-1"></i>Router Provider
                </span>
              </span>
            </div>
            <div>
              <CustomButtonField
                type="button"
                label="New Route"
                className="btn btn-filled me-2"
                onClick={handleAddRoute}
              />
              {isEditing && <i className="bi bi-trash3-fill btn btn-outline-danger" onClick={handleDeleteRoute}></i>}
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
