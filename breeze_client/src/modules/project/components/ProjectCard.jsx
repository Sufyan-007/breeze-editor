import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';

function ProjectCard({
  isCreateNew = false,
  projectName = 'project',
  projectImageSrc = '',
  iconSrc = '',
  onClick = () => {},
  onDelete = () => {},
  projectStatus = 'Fetching..',
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen((prev) => !prev);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
    setMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`col-md-3 m-0 p-0 br-background-primary ${isCreateNew ? 'home-new-card br-background-secondary' : 'home-project-card'}`}
    >
      {isCreateNew ? (
        <div className="h-100 d-flex align-items-center justify-content-center" onClick={onClick}>
          <button type="button" className="btn modal-btn btn-theme color-text">
            <i className="bi bi-plus-circle br-text-primary"></i>
            <span className="ms-1 med-font fw-bold br-text-primary">Create new project</span>
          </button>
        </div>
      ) : (
        <div className="pb-3">
          <div className="d-flex justify-content-between p-3">
            <div className="d-flex justify-content-start">
              <img src={iconSrc} className="mx-2" alt="icon" />
              <span className="med-font text-nowrap ms-2 br-text-primary">{projectName}</span>
            </div>
            <div className="home-action-buttons position-relative" ref={menuRef}>
              <span className="badge breeze-badge">
                <span className="med-font">{projectStatus}</span>
              </span>
              <i
                className="bi bi-three-dots-vertical br-text-primary"
                onClick={toggleMenu}
                style={{ cursor: 'pointer' }}
              ></i>
              {menuOpen && (
                <div
                  className="dropdown-menu show position-absolute px-2 br-background-primary rounded"
                  style={{ top: 30, left: 65, zIndex: 1000, borderRadius: 0 }}
                >
                  <button
                    type="button"
                    className="project-card-dropdown-item dropdown-item p-0 br-text-primary"
                    onClick={handleDelete}
                  >
                    <i className="bi bi-trash-fill text-danger me-1"></i> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="card mx-3" onClick={onClick}>
            <img src={projectImageSrc} alt={`${projectName} image`} />
          </div>
        </div>
      )}
    </div>
  );
}

ProjectCard.propTypes = {
  isCreateNew: PropTypes.bool,
  projectName: PropTypes.string,
  projectImageSrc: PropTypes.string,
  iconSrc: PropTypes.string,
  onClick: PropTypes.func,
  onDelete: PropTypes.func,
  projectStatus: PropTypes.string,
};

export default ProjectCard;
