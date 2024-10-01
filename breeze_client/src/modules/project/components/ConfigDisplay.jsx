import PropTypes from 'prop-types';
import RoutingConfig from '../../routing/pages/RoutingConfig';
import ServiceConfiguration from '../../service-configuration/pages/ServiceConfiguration';
function ConfigDisplay({ configType }) {
  const renderConfigScreen = () => {
    switch (configType) {
      case 'ROUTING':
        return <RoutingConfig />;
      case 'CUSTOM_UPLOAD':
        return <>Third party Config Screen</>;
      case 'SERVICE-CONFIG':
        return <ServiceConfiguration />;
      default:
        return <div>Select a configuration type</div>;
    }
  };
  return <div className="br-background-primary br-text-primary h-100">{renderConfigScreen()}</div>;
}

ConfigDisplay.propTypes = {
  configType: PropTypes.string,
};

export default ConfigDisplay;
