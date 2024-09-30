import { useEffect, useState } from 'react';
import '../styles/AllProjects.css';
import Navbar from '../../../common/navbar/Navbar';
import images from '../../../assets/images/index';
import { BreezeModal } from '../../../common/display';
import ProjectCard from '../components/ProjectCard';
import { router } from '../../../routes/routing';
import { createProject, getAllProjects } from '../services/projectService';
import { CustomTextInput } from '../../../common/fields';

import {
  buildToolOptions,
  initialNewProjectFormConfig,
  languageOptions,
  stylingOptions,
  technologyOptions,
} from '../constants/CreateNewProjectFormConstants';

function AllProjects() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  // const [error, setError] = useState(null);

  const [formValues, setFormValues] = useState(initialNewProjectFormConfig);
  const [nameError, setNameError] = useState('');
  const [authorError, setAuthorError] = useState('');

  const handleInputChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });

    if (name === 'name') setNameError('');
    if (name === 'author') setAuthorError('');
  };

  const handleBadgeSelection = (name, selectedValue) => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: prevFormValues[name] === selectedValue ? '' : selectedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasError = false;
    if (!formValues.name) {
      setNameError('Application name is required.');
      hasError = true;
    }
    if (!formValues.author) {
      setAuthorError('Author name is required.');
      hasError = true;
    }
    if (hasError) return;
    console.log(formValues);
    try {
      const createdProject = await createProject(formValues);
      setProjects((prevProjects) => [...prevProjects, createdProject]);
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setFormValues(initialNewProjectFormConfig);
      fetchProjects();
    }
  };
  const fetchProjects = async () => {
    try {
      const projectsData = await getAllProjects();
      setProjects(Object.values(projectsData));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setFormValues(initialNewProjectFormConfig);
  };

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
        onClick: handleSubmit,
        className: 'btn btn-filled med-font',
      },
    ],
  };

  const handleOpenProject = (projectName) => {
    setModalOpen(true);
    router.navigate(`/project/${projectName}`);
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
          {projects.map((project) => (
            <ProjectCard
              key={project.project_name}
              projectName={project.project_name}
              projectImageSrc={images.ABDMLoginPage}
              iconSrc={images.VectorIcon}
              onClick={() => handleOpenProject(project.project_name)}
            />
          ))}
          <ProjectCard isCreateNew={true} onClick={openModal} />
        </div>
        <BreezeModal isOpen={isModalOpen} onClose={closeModal} header={modalHeader} footer={modalFooter}>
          <form className="home-custom-form" onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3 home-form-box">
                  <CustomTextInput
                    name="name"
                    value={formValues.name}
                    onChange={(value) => handleInputChange('name', value)}
                    config={{ label: 'Application Name' }}
                    required
                  />
                  {nameError && <p className="small-font text-danger">{nameError}</p>}
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3 home-form-box">
                  <CustomTextInput
                    name="author"
                    value={formValues.author}
                    onChange={(value) => handleInputChange('author', value)}
                    config={{ label: 'Author' }}
                    required
                  />
                  {authorError && <p className="small-font text-danger">{authorError}</p>}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3 home-form-box">
                  <label htmlFor="projectLogo" className="med-font color-text mb-1 fw-semibold">
                    Upload image for project logo
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="projectLogo"
                    onChange={(e) => handleInputChange('projectLogo', e.target.files[0])}
                  />
                  <p className="color-text small-font">Suggested dimensions: 512x512</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3 home-form-box">
                  <label htmlFor="description" className="med-font color-text mb-1 fw-semibold">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    style={{ height: '100px' }}
                    value={formValues.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 home-form-box">
                <label className="med-font color-text mb-1 fw-semibold">Technology</label>
                <div className="home-badges-wrapper">
                  {technologyOptions.map((option) => (
                    <span
                      className={`home-badge home-theme-badge ${formValues.technology === option.label ? 'breeze-badge-active' : ''}`}
                      key={option.label}
                      onClick={() => handleBadgeSelection('technology', option.label)}
                    >
                      <img src={option.logo} alt={`${option.label} logo`} />
                      <span className="med-font ms-1">{option.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 home-form-box">
                <label className="med-font color-text mb-1 fw-semibold">Language</label>
                <div className="home-badges-wrapper">
                  {languageOptions.map((option) => (
                    <span
                      className={`home-badge home-theme-badge ${formValues.language === option.label ? 'breeze-badge-active' : ''}`}
                      key={option.label}
                      onClick={() => handleBadgeSelection('language', option.label)}
                    >
                      <img src={option.logo} alt={`${option.label} logo`} />
                      <span className="med-font ms-1">{option.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 home-form-box">
                <label className="med-font color-text mb-1 fw-semibold">Styling Components</label>
                <div className="home-badges-wrapper">
                  {stylingOptions.map((option) => (
                    <span
                      className={`home-badge home-theme-badge ${formValues.styling === option.label ? 'breeze-badge-active' : ''}`}
                      key={option.label}
                      onClick={() => handleBadgeSelection('styling', option.label)}
                    >
                      <img src={option.logo} alt={`${option.label} logo`} />
                      <span className="med-font ms-1">{option.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="mb-3 home-form-box">
                <label className="med-font color-text mb-1 fw-semibold">Build Tool</label>
                <div className="home-badges-wrapper">
                  {buildToolOptions.map((option) => (
                    <span
                      className={`home-badge home-theme-badge ${formValues.buildTool === option.label ? 'breeze-badge-active' : ''}`}
                      key={option.label}
                      onClick={() => handleBadgeSelection('buildTool', option.label)}
                    >
                      <img src={option.logo} alt={`${option.label} logo`} />
                      <span className="med-font ms-1">{option.label}</span>
                    </span>
                  ))}
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

export default AllProjects;
