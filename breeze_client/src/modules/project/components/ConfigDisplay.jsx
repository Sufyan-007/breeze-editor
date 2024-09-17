import PropTypes from 'prop-types';

function ConfigDisplay({ configType }) {
  const renderConfigScreen = () => {
    switch (configType) {
      case 'routing':
        return <>Routing Config Screen</>;
      case 'third-party':
        return <>Third party Config Screen</>;
      case 'services':
        return <>Services Config Screen</>;
      default:
        return <div>Select a configuration type</div>;
    }
  };
  return <div className="vh-100 br-background-primary br-text-primary">{renderConfigScreen()}</div>;
}

ConfigDisplay.propTypes = {
  configType: PropTypes.string,
};

export default ConfigDisplay;
