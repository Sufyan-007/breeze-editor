import PropTypes from 'prop-types';

function ProjectCard({
  isCreateNew = false,
  projectName = 'project',
  projectImageSrc = '',
  iconSrc = '',
  onClick = () => {},
}) {
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
        <div className="pb-3" onClick={onClick}>
          <div className="d-flex justify-content-between p-3">
            <div className="d-flex justify-content-start">
              <img src={iconSrc} className="mx-2" alt="icon" />
              <span className="med-font text-nowrap ms-2 br-text-primary">{projectName}</span>
            </div>
            <div className="home-action-buttons">
              <i className="bi bi-caret-right br-text-primary"></i>
              <i className="bi bi-three-dots-vertical br-text-primary"></i>{' '}
            </div>
          </div>
          <div className="card mx-3">
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
};

export default ProjectCard;
