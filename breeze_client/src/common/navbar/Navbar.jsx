import { useContext, useEffect, useRef, useState } from 'react';
import ThemeContext from '../../contexts/ThemeContext';
import PropTypes from 'prop-types';
import BreezeStudio from '../../assets/images/Breeze Studio.png';
import Avatar from '../../assets/images/Ellipse 1.png';
import VectorIcon from '../../assets/images/Vector.png';
import darkLightModeSwitch from '../../assets/svgs/dark-light-mode-switch.svg';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ currentPage = 'index', projectName = '' }) {
  const { toggleTheme } = useContext(ThemeContext);
  const menuRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

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
          {/* Grid menu button  */}
          <div className="menu-button ms-2 position-relative" ref={menuRef}>
            <button
              type="button"
              className="btn br-text-primary m-0 p-0"
              onClick={handleMenuToggle}
              title="Open app menu"
            >
              <i className="bi bi-menu-button"></i>
            </button>
            {isMenuOpen && (
              <div className="menu-dropdown position-absolute br-background-secondary shadow p-3 rounded ">
                <Link to="/user-management" className="d-block mb-2 br-text-tertiary" onClick={handleLinkClick}>
                  User Management
                </Link>
                <Link to="/role-management" className="d-block mb-2 br-text-tertiary" onClick={handleLinkClick}>
                  Role Management
                </Link>
                <Link to="/all-projects" className="d-block br-text-tertiary" onClick={handleLinkClick}>
                  All Projects
                </Link>
              </div>
            )}
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
