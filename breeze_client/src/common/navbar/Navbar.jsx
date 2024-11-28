import { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ThemeContext from '../../contexts/ThemeContext';
import BreezeStudio from '../../assets/images/Breeze Studio.png';
import Avatar from '../../assets/images/Ellipse 1.png';
import darkLightModeSwitch from '../../assets/svgs/dark-light-mode-switch.svg';
import './Navbar.css';
import { router } from '../../routes/routing';
import ProfileOffCanvas from './ProfileOffCanvas';

function Navbar({ currentPage = 'index', projectName = '' }) {
  const { toggleTheme } = useContext(ThemeContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOffCanvas, setShowOffCanvas] = useState(false);

  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);

  const username = localStorage.getItem('username') || 'John Doe';
  const userRole = localStorage.getItem('userRole') || 'User';

  const toggleOffCanvas = () => setShowOffCanvas(!showOffCanvas);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleAppMenu = () => setIsMenuOpen((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
    router.navigate('/login');
  };

  const handleLinkClick = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSaveProfile = (updatedData) => {
    console.log('Updated Profile Data:', updatedData);
    setShowOffCanvas(false);
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
            <Link to="/all-projects">
              <img src={BreezeStudio} alt="logo" />
            </Link>
          </li>

          {currentPage === 'project' && (
            <li className="breadcrumb-item active d-flex align-items-center" aria-current="page">
              <span className="med-font fw-semibold br-text-primary">{projectName}</span>
            </li>
          )}
        </ol>

        <div className="d-flex align-items-center">
          <div className="theme-switch">
            <button
              type="button"
              name="dark_light"
              className="btn btn-theme m-0 p-0 me-3"
              onClick={toggleTheme}
              title="Toggle dark/light mode"
            >
              <img src={darkLightModeSwitch} alt="Toggle dark/light mode" />
            </button>
          </div>

          <div className="menu-button position-relative" ref={menuRef}>
            <button type="button" className="btn br-text-primary m-0 p-0" onClick={toggleAppMenu} title="Open app menu">
              <i className="bi bi-menu-button"></i>
            </button>
            {isMenuOpen && (
              <div className="menu-dropdown position-absolute br-background-primary shadow p-2 rounded">
                <Link to="/user-management" className="d-block br-text-primary" onClick={handleLinkClick}>
                  <i className="bi bi-people me-2"></i>User Management
                </Link>
                <Link to="/role-management" className="d-block br-text-primary" onClick={handleLinkClick}>
                  <i className="bi bi-person-fill-gear me-2"></i> Role Management
                </Link>
                <Link to="/all-projects" className="d-block br-text-primary" onClick={handleLinkClick}>
                  <i className="bi bi-cast me-2"></i>All Projects
                </Link>
              </div>
            )}
          </div>

          <div className="profile d-flex align-items-center ms-3 br-cursor-pointer" ref={profileMenuRef}>
            <div className="d-flex align-items-center" onClick={toggleMenu}>
              <img className="avatar" src={Avatar} alt="Profile Avatar" />
              <span className="ms-2 small-font br-text-primary">{username}</span>
            </div>

            {menuOpen && (
              <div
                className="dropdown-menu show position-absolute px-1 br-background-primary rounded"
                style={{ top: 45, right: 10, zIndex: 100, borderRadius: 0 }}
              >
                <button
                  type="button"
                  className="profile-menu-dropdown-item dropdown-item br-text-primary"
                  onClick={toggleOffCanvas}
                >
                  <i className="bi bi-person me-2"></i> Profile Settings
                </button>
                <button
                  type="button"
                  className="profile-menu-dropdown-item dropdown-item br-text-primary"
                  onClick={handleLogout}
                >
                  <i className="bi bi-box-arrow-right me-2"></i> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProfileOffCanvas
        show={showOffCanvas}
        onClose={toggleOffCanvas}
        username={username}
        userRole={userRole}
        onSave={handleSaveProfile}
      />
    </nav>
  );
}

Navbar.propTypes = {
  currentPage: PropTypes.string,
  projectName: PropTypes.string,
};

export default Navbar;
