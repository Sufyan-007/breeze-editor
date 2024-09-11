import SettingsIcon from '../../../assets/svgs/SettingsIcon.svg';
import StackIcon from '../../../assets/svgs/StackIcon.svg';
import RestartClockIcon from '../../../assets/svgs/RestartClockIcon.svg';
import AppsIcon from '../../../assets/svgs/AppsIcon.svg';
import '../styles/ProjectSidebar.css';

function ProjectSidebar() {
  return (
    <>
      <div>
        <div className="sidebar-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0 med-font br-text-primary collapsible">PROJECT</h2>
          <div className="sidebar-action-buttons">
            <span className="badge breeze-badge collapsible">
              <i className="small-font bi bi-plus-circle"></i>
              <span className="small-font ms-1">Add</span>
            </span>
            <button className="btn toggle-btn btn-theme br-text-primary p-0" type="button" data-bs-theme="dark">
              <i className="large-font bi bi-box-arrow-in-left"></i>
            </button>
          </div>
        </div>
        <form className="sidebar-search"></form>
        <ul className="sidebar-nav"></ul>
      </div>
      <div className="bottom-nav py-2">
        <a href="#">
          <img src={SettingsIcon} alt="settings" />
        </a>
        <a href="#">
          <img src={StackIcon} alt="stack" />
        </a>
        <a href="#">
          <img src={RestartClockIcon} alt="history" />
        </a>
        <a href="#">
          <img src={AppsIcon} alt="components" />
        </a>
        <a href="#" className="run-btn med-font">
          Run
        </a>
      </div>
    </>
  );
}

export default ProjectSidebar;
