import { useContext } from 'react';
import ThemeContext from '../../contexts/ThemeContext';
import PropTypes from 'prop-types';
import BreezeStudio from '../../assets/images/Breeze Studio.png';
import Avatar from '../../assets/images/Ellipse 1.png';
import VectorIcon from '../../assets/images/Vector.png';
import darkLightModeSwitch from '../../assets/svgs/dark-light-mode-switch.svg';
import { Link } from 'react-router-dom';
function Navbar({ currentPage = 'index', projectName = '' }) {
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <nav
      className="navbar navbar-dark br-background-primary"
      aria-label="breadcrumb"
      style={{ '--bs-breadcrumb-divider': "'>'" }}
    >
      <div className="container-fluid">
        <ol className="breadcrumb mb-0" style={{ '--bs-breadcrumb-divider-color': 'var(--color-text)' }}>
          <li className="breadcrumb-item mb-1">
            <Link to={'/'}>
              <img src={BreezeStudio} alt="logo" />
            </Link>
          </li>

          {currentPage === 'project' && (
            <li className="breadcrumb-item active d-flex align-items-center" aria-current="page">
              <img src={VectorIcon} className="mx-2" alt="icon" />
              <span className="med-font fw-semibold br-text-primary">{projectName}</span>
            </li>
          )}
        </ol>

        <div className="d-flex align-items-center">
          <div className="theme-switch">
            <button
              type="button"
              name="dark_light"
              className="btn btn-theme m-0 p-0"
              onClick={toggleTheme}
              title="Toggle dark/light mode"
            >
              <img src={darkLightModeSwitch} alt="Toggle dark/light mode" />
            </button>
          </div>
          <div className="profile d-flex align-items-center ms-3">
            <img className="avatar" src={Avatar} alt="avatar" />
            <span className="ms-1 small-font br-text-primary">John Doe</span>
          </div>
        </div>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  currentPage: PropTypes.string,
  projectName: PropTypes.string,
};

export default Navbar;
