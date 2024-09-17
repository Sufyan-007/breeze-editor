import { useState } from 'react';
import { BreezeTreeView } from '../../../common/display';
import SettingsIcon from '../../../assets/svgs/SettingsIcon.svg';
import StackIcon from '../../../assets/svgs/StackIcon.svg';
import RestartClockIcon from '../../../assets/svgs/RestartClockIcon.svg';
import AppsIcon from '../../../assets/svgs/AppsIcon.svg';
import treeData from '../constants/DirectoryStructure';
import '../styles/ProjectSidebar.css';

function ProjectSidebar() {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [state1, setState1] = useState('');
  const [state2, setState2] = useState('');
  const [show, setShow] = useState(true);

  const toggleSidebar = () => {
    setShow(!show);
  };

  const getLogged = (val) => {
    console.log(val);
  };

  const states = { state1, state2 };
  const methods = { setState1, setState2, getLogged };

  const toggleNode = (nodeId) => {
    setExpandedNodes((prevExpandedNodes) => ({
      ...prevExpandedNodes,
      [nodeId]: !prevExpandedNodes[nodeId],
    }));
  };

  //Remaining : dynamic directory management operations and icon mapping as per type.

  if (!show) {
    return (
      <div>
        <div className="collapsed-sidebar-button br-background-primary" onClick={toggleSidebar}>
          <i className="bi bi-box-arrow-in-right br-text-primary"></i>
        </div>
      </div>
    );
  }
  return (
    <aside id="sidebar" className="br-background-primary">
      <div>
        <div className="sidebar-header d-flex justify-content-between align-items-center">
          <h2 className="mb-0 med-font br-text-primary collapsible">PROJECT</h2>
          <div className="sidebar-action-buttons">
            <span className="badge breeze-badge collapsible">
              <i className="small-font bi bi-plus-circle"></i>
              <span className="small-font ms-1">Add</span>
            </span>
            <button
              className="btn toggle-btn btn-theme br-text-primary p-0"
              type="button"
              data-bs-theme="dark"
              onClick={toggleSidebar}
            >
              <i className="large-font bi bi-box-arrow-in-left"></i>
            </button>
          </div>
        </div>
        <form className="sidebar-search">
          <input
            className="form-control br-background-secondary"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
        </form>
        <ul className="sidebar-nav">
          <BreezeTreeView
            treeDataObject={treeData}
            expandedNodes={expandedNodes}
            toggleNode={toggleNode}
            parentStates={states}
            parentMethods={methods}
          />
        </ul>
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
    </aside>
  );
}

export default ProjectSidebar;
