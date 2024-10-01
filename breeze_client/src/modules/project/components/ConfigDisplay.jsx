import PropTypes from 'prop-types';
import RoutingConfig from '../../routing/pages/RoutingConfig';
import CustomZipPackage from '../../custom_uploads/pages/CustomZipPackage'

function ConfigDisplay({ configType }) {
  const renderConfigScreen = () => {
    switch (configType) {
      case 'ROUTING':
        return <RoutingConfig />;
      case 'CUSTOMUPLOAD':
        return <CustomZipPackage/>;
    
      case 'services':
        return <>Services Config Screen</>;
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
