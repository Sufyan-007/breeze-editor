import PropTypes from 'prop-types';
import RoutingConfig from '../../routing/pages/RoutingConfig';
import ServiceConfiguration from '../../service-configuration/pages/ServiceConfiguration';
import CustomZipPackagePage from '../../custom_uploads/pages/CustomZipPackage';
import Settings from '../../settings/pages/Settings';
function ConfigDisplay({ configType }) {
  const renderConfigScreen = () => {
    switch (configType) {
      case 'ROUTING':
        return <RoutingConfig />;
      case 'CUSTOM_UPLOAD':
        return <CustomZipPackagePage />;
      case 'SERVICE-CONFIG':
        return <ServiceConfiguration />;
      case 'SETTINGS':
        return <Settings />;
      case 'PACKAGE_CONFIG':
        return <>package.json</>;
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
