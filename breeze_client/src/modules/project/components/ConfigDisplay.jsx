import PropTypes from 'prop-types';
import CustomZipPackage from '../../third_party/pages/CustomZipPackage'

function ConfigDisplay({ configType }) {
  const renderConfigScreen = () => {
    switch (configType) {
      case 'routing':
        return <>Routing Config Screen</>;
      case 'third-party':
        return <CustomZipPackage/>;
        // return <>Third party config</>;
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
