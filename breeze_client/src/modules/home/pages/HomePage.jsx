import { useState } from 'react';
import '../styles/HomePage.css';
import Navbar from '../../../common/navbar/Navbar';
import logos from '../../../assets/svgs/index';
import images from '../../../assets/images/index';
import { BreezeModal } from '../../../common/display';
import ProjectCard from '../components/ProjectCard';
import { router } from '../../../routes/routing';

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

  const handleOpenProject = () => {
    setModalOpen(true);
    router.navigate('/project');
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
          {/* Regular Project Card */}
          <ProjectCard
            projectName="ABDM Connector"
            projectImageSrc={images.ABDMLoginPage}
            iconSrc={images.VectorIcon}
            onClick={handleOpenProject}
          />

          {/* Create New Project Card */}
          <ProjectCard isCreateNew={true} onClick={openModal} />
        </div>

        {/* custom modal */}
        <BreezeModal isOpen={isModalOpen} onClose={closeModal} header={modalHeader} footer={modalFooter}>
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
                    <textarea className="form-control" id="description" style={{ height: '100px' }}></textarea>
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
                    <img src={logos.reactLogo} alt="React logo" />
                    <span className="med-font ms-1">React</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={logos.vueLogo} alt="Vue logo" />
                    <span className="med-font ms-1">Vue</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={logos.angularLogo} alt="Angular logo" />
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
                    <img src={logos.jsLogo} alt="JavaScript logo" />
                    <span className="med-font ms-1">JavaScript</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={logos.tsLogo} alt="TypeScript logo" />
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
                    <img src={logos.bootstrapLogo} alt="Bootstrap logo" />
                    <span className="med-font ms-1">Bootstrap</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={logos.reactBootstrap} alt="React Bootstrap logo" />
                    <span className="med-font ms-1">React Bootstrap</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={logos.chakraUI} alt="Chakra UI logo" />
                    <span className="med-font ms-1">Chakra UI</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={logos.materialUI} alt="Material UI logo" />
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
                    <img src={logos.reactLogo} alt="Create React App logo" />
                    <span className="med-font ms-1">Create React App</span>
                  </span>
                  <span className="home-badge home-theme-badge">
                    <img src={logos.viteLogo} alt="Vite logo" />
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
        </BreezeModal>
      </div>
    </div>
  );
}

export default HomePage;
