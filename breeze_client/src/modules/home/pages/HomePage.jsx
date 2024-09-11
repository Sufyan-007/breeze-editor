import { useState } from 'react';
import '../styles/HomePage.css';
import Navbar from '../../../common/navbar/Navbar';
import VectorIcon from '../../../assets/images/Vector.png';
import ABDMLoginPage from '../../../assets/images/ABDM Login Page 1.png';
import reactLogo from '../../../assets/svgs/react-logo.svg';
import tsLogo from '../../../assets/svgs/typescript-logo.svg';
import vueLogo from '../../../assets/svgs/vue-logo.svg';
import viteLogo from '../../../assets/svgs/vite-logo.svg';
import jsLogo from '../../../assets/svgs/javascript-logo.svg';
import angularLogo from '../../../assets/svgs/angular-logo.svg';
import bootstrapLogo from '../../../assets/svgs/bootstrap-logo.svg';
import chakraUI from '../../../assets/svgs/chakra-ui-logo.svg';
import materialUI from '../../../assets/svgs/material-ui-logo.svg';
import reactBootstrap from '../../../assets/svgs/react-bootstrap-logo.svg';
import CustomModal from '../../../common/modal/Modal';

function HomePage() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const modalHeader = {
    title: 'Create New Project',
    showCloseButton: true,
  };

  const modalFooter = {
    buttons: [
      {
        label: 'Cancel',
        onClick: closeModal,
        className: 'btn br-text-primary med-font',
      },
      {
        label: 'Create',
        onClick: () => console.log('Create clicked'),
        className: 'btn btn-filled med-font',
      },
    ],
  };

  return (
    <div className="container-fluid vh-100 p-0 br-background-secondary">
      <Navbar />
      <div className="home-main-content">
        <div className="home-title">
          <h2 className="xlarge-font br-text-tertiary">Welcome, John</h2>
          <h2 className="mb-3 large-font color-text br-text-primary">Select a Project</h2>
        </div>

        <div className="row m-0 gap-2">
          <div className="col-md-3 m-0 p-0 home-project-card br-background-primary">
            <div className="right-side rounded pb-3">
              <div className="d-flex justify-content-between p-3">
                <div className="d-flex justify-content-start">
                  <img src={VectorIcon} className="mx-2" alt="icon" />
                  <span className="med-font text-nowrap ms-2 br-text-primary">ABDM Connector</span>
                </div>
                <div className="home-action-buttons">
                  <i className="bi bi-caret-right br-text-primary"></i>
                  <i className="bi bi-three-dots-vertical br-text-primary"></i>{' '}
                </div>
              </div>
              <div className="card mx-3">
                <img src={ABDMLoginPage} alt="ABDM Login" />
              </div>
            </div>
          </div>

          <div className="home-new-card col-md-3 m-0 p-0">
            <div
              className="home-modal-box rounded h-100 d-flex align-items-center justify-content-center"
              onClick={openModal}
            >
              <button type="button" className="btn modal-btn btn-theme color-text">
                <i className="bi bi-plus-circle br-text-primary"></i>
                <span className="ms-1 med-font fw-bold br-text-primary">Create new project</span>
              </button>
            </div>
          </div>
        </div>

        {/* custom modal */}
        <CustomModal isOpen={isModalOpen} onClose={closeModal} header={modalHeader} footer={modalFooter}>
          <form className="home-custom-form">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3 home-form-box">
                  <label htmlFor="applicationName" className="med-font color-text mb-1 fw-semibold">
                    Application Name
                  </label>
                  <input type="text" className="form-control" id="applicationName" name="applicationName" required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3 home-form-box">
                  <label htmlFor="author" className="med-font color-text mb-1 fw-semibold">
                    Author
                  </label>
                  <input type="text" className="form-control" id="author" name="author" required />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3 home-form-box">
                  <label htmlFor="projectLogo" className="med-font color-text mb-1 fw-semibold">
                    Upload image for project logo
                  </label>
                  <div className="input-group mb-3">
                    <input type="file" className="form-control" id="projectLogo" />
                  </div>
                  <p className="color-text small-font">Suggested dimensions: 512x512</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3 home-form-box">
                  <label htmlFor="description" className="med-font color-text mb-1 fw-semibold">
                    Description
                  </label>
                  <div className="form-floating">
                    <textarea
                      className="form-control"
                      placeholder="Leave a comment here"
                      id="description"
                      style={{ height: '100px' }}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 home-form-box">
                <label htmlFor="technology" className="med-font color-text mb-1 fw-semibold">
                  Technology
                </label>
                <div className="home-badges-wrapper">
                  <span className="home-badge home-home-theme-badge home-badge-active">
                    <img src={reactLogo} alt="React logo" />
                    <span className="med-font ms-1">React</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={vueLogo} alt="Vue logo" />
                    <span className="med-font ms-1">Vue</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={angularLogo} alt="Angular logo" />
                    <span className="med-font ms-1">Angular</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 home-form-box">
                <label htmlFor="language" className="med-font color-text mb-1 fw-semibold">
                  Language
                </label>
                <div className="home-badges-wrapper">
                  <span className="home-badge home-theme-badge">
                    <img src={jsLogo} alt="JavaScript logo" />
                    <span className="med-font ms-1">JavaScript</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={tsLogo} alt="TypeScript logo" />
                    <span className="med-font ms-1">TypeScript</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 home-form-box">
                <label htmlFor="styling" className="med-font color-text mb-1 fw-semibold">
                  Styling Components
                </label>
                <div className="home-badges-wrapper">
                  <span className="home-badge home-theme-badge">
                    <img src={bootstrapLogo} alt="Bootstrap logo" />
                    <span className="med-font ms-1">Bootstrap</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={reactBootstrap} alt="React Bootstrap logo" />
                    <span className="med-font ms-1">React Bootstrap</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={chakraUI} alt="Chakra UI logo" />
                    <span className="med-font ms-1">Chakra UI</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={materialUI} alt="Material UI logo" />
                    <span className="med-font ms-1">Material UI</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 home-form-box">
                <label htmlFor="buildTool" className="med-font color-text mb-1 fw-semibold">
                  Build Tool
                </label>
                <div className="home-badges-wrapper">
                  <span className="home-badge home-theme-badge">
                    <img src={reactLogo} alt="Create React App logo" />
                    <span className="med-font ms-1">Create React App</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={viteLogo} alt="Vite logo" />
                    <span className="med-font ms-1">Vite</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 home-form-box">
                <label htmlFor="layout" className="med-font color-text mb-1 fw-semibold">
                  Layout
                </label>
                <div className="home-badges-wrapper">
                  <span className="home-badge home-theme-badge">
                    <div className="home-block"></div>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <div className="home-block"></div>
                  </span>
                </div>
              </div>
            </div>
          </form>
          <hr className="m-0" />
        </CustomModal>
      </div>
    </div>
  );
}

export default HomePage;
