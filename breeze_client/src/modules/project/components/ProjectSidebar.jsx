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
          {/* <h2 className="mb-0 med-font color-text collapsible">PROJECT</h2>
          <div className="action-buttons">
            <badge className="badge light-badge collapsible">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                fill="currentColor"
                className="bi bi-plus-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
              </svg>
              <span className="small-font ms-1">Add</span>
            </badge>
            <button className="btn toggle-btn btn-theme color-text p-0 mb-1" type="button" data-bs-theme="dark">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-box-arrow-in-left"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 3.5a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-2a.5.5 0 0 1 1 0v2A1.5 1.5 0 0 1 9.5 14h-8A1.5 1.5 0 0 1 0 12.5v-9A1.5 1.5 0 0 1 1.5 2h8A1.5 1.5 0 0 1 11 3.5v2a.5.5 0 0 1-1 0z"
                />
                <path
                  fill-rule="evenodd"
                  d="M4.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H14.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                />
              </svg>
            </button>
          </div> */}
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
