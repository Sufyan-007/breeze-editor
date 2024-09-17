import '../styles/ProjectDisplay.css';
import PropTypes from 'prop-types';

function TopBar({ onTabChange, activeTab, item }) {
  return (
    <div className="br-background-primary rounded project-top-bar">
      <div className="col-md-4 d-xl-block d-none">
        <div className="blank"></div>
      </div>
      <div className="col-md-4 col-sm-6 d-flex justify-content-xl-center justify-content-start">
        <ul className="nav nav-pills custom-nav rounded br-background-secondary" id="pills-tab" role="tablist">
          <li className="nav-item me-2" role="presentation">
            <button
              className={`nav-link ${activeTab === 'code' ? 'active' : ''}`}
              id="pills-home-tab"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected={activeTab === 'code'}
              onClick={() => onTabChange('code')}
            >
              <i className="bi bi-code-slash me-1"></i>
              Code
            </button>
          </li>
          {item.type === 'component' ? (
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'preview' ? 'active' : ''}`}
                id="pills-profile-tab"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected={activeTab === 'preview'}
                onClick={() => onTabChange('preview')}
              >
                <i className="bi bi-eye me-1"></i>
                Preview
              </button>
            </li>
          ) : (
            <li className="nav-item" role="presentation">
              <button
                className={`nav-link ${activeTab === 'config' ? 'active' : ''}`}
                id="pills-profile-tab"
                type="button"
                role="tab"
                aria-controls="pills-profile"
                aria-selected={activeTab === 'config'}
                onClick={() => onTabChange('config')}
              >
                <i className="bi bi-eye me-1"></i>
                Config
              </button>
            </li>
          )}
        </ul>
      </div>
      <div className="col-md-4 col-sm-6 d-flex justify-content-end">
        <div className="d-flex" role="toolbar" aria-label="Toolbar with button groups">
          <div className="btn-group me-3" role="group" aria-label="First group">
            <button type="button" className="btn selected-tab py-0 px-2">
              <i className="bi bi-display"></i>
            </button>
            <button type="button" className="btn py-0 px-2">
              <i className="bi bi-laptop"></i>
            </button>
            <button type="button" className="btn py-0 px-2">
              <i className="bi bi-tablet"></i>
            </button>
            <button type="button" className="btn py-0 px-2">
              <i className="bi bi-phone"></i>
            </button>
          </div>
          <div className="btn-group second-group me-3" role="group" aria-label="Second group">
            <button type="button" className="btn btn-size color-text p-0 ms-3">
              -
            </button>
            <button type="button" className="btn color-text med-font py-0">
              100%
            </button>
            <button type="button" className="btn btn-size color-text p-0">
              +
            </button>
          </div>
          <div className="btn-group" role="group" aria-label="Third group">
            <button type="button" className="btn color-text py-0">
              <i className="bi bi-arrow-clockwise"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

TopBar.propTypes = {
  onTabChange: PropTypes.func,
  activeTab: PropTypes.string,
  item: PropTypes.object.isRequired,
};

export default TopBar;
