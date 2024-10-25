import PropTypes from 'prop-types';
import RoutingConfig from '../../routing/pages/RoutingConfig';
import ServiceConfiguration from '../../service-configuration/pages/ServiceConfiguration';
import CustomZipPackagePage from '../../custom_uploads/pages/CustomZipPackage';
import Settings from '../../settings/pages/Settings';
import ThirdPartyDependencyConfig from '../../third-party-dependencies/pages/ThirdPartyDependencyConfig';
import SchemaSettings from '../../schema-configuration/pages/SchemaSettings';
function ConfigDisplay({ configType }) {
  const renderConfigScreen = () => {
    switch (configType) {
      case 'ROUTING':
        return <RoutingConfig />;
      case 'EXTERNAL_COMP':
        return <CustomZipPackagePage />;
      case 'SERVICE-CONFIG':
        return <ServiceConfiguration />;
      case 'SETTINGS':
        return <Settings />;
      case 'PACKAGE_CONFIG':
        return <ThirdPartyDependencyConfig />;
      case 'SCHEMAS':
        return <SchemaSettings />;
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
