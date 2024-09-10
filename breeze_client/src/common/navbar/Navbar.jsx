import { useContext } from 'react';
import ThemeContext from '../../contexts/ThemeContext';
import PropTypes from 'prop-types';
import BreezeStudio from '../../assets/images/Breeze Studio.png';
import Avatar from '../../assets/images/Ellipse 1.png';
import VectorIcon from '../../assets/images/Vector.png';

function Navbar({ currentPage = 'index' }) {
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
            <a href="/">
              <img src={BreezeStudio} alt="logo" />
            </a>
          </li>

          {currentPage === 'project' && (
            <li className="breadcrumb-item active d-flex align-items-center" aria-current="page">
              <img src={VectorIcon} className="mx-2" alt="icon" />
              <span className="med-font fw-semibold br-text-primary">ABDM Connector</span>
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="#A5A5A4">
                <path fill="none" d="M0 0h24v24H0z"></path>
                <path d="M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z"></path>
              </svg>
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
};

export default Navbar;
