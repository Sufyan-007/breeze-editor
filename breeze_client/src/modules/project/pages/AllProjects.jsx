import { useEffect, useRef, useState } from 'react';
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
import CustomModal from '../../../common/display/modal/BreezeModal';

function AllProjects() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  // const [error, setError] = useState(null);

  const [formValues, setFormValues] = useState(initialNewProjectFormConfig);
  const [nameError, setNameError] = useState('');
  const [authorError, setAuthorError] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Uploading...');
  const [showModal, setModalShow] = useState(false);
  const ws = useRef(null);
  const intervalId = useRef(null);

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

    setLoading(true);
    setModalShow(true);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          command: 'start',
          project_id: formValues.name.toLowerCase().replace(/ /g, '_'),
        })
      );
    }

    try {
      const createdProject = await createProject(formValues);
      setProjects((prevProjects) => [...prevProjects, createdProject]);
      setModalOpen(false);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
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

  const incrementProgress = () => {
    intervalId.current = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 45) {
          clearInterval(intervalId.current);
          intervalId.current = null;
          return prevProgress;
        }
        return prevProgress + 1;
      });
    }, 1000);
  };

  useEffect(() => {
    fetchProjects();
    ws.current = new WebSocket(`${import.meta.env.VITE_BREEZE_BACKEND_HOST}/ws/project-progress/`);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const progress = message?.progress;

      if (progress === 20 && intervalId.current === null) {
        incrementProgress();
      } else if (progress === 50) {
        clearInterval(intervalId.current);
        intervalId.current = null;
        setProgress(progress);
      } else {
        setProgress(progress);
      }

      const progressMessages = {
        5: 'Initializing your project',
        20: 'Installing Packages',
        50: 'Configuring Services',
        60: 'Setting up your project',
        80: 'This might take a while',
        90: 'Almost there...',
      };

      const relatedMessage = progressMessages[progress];
      if (relatedMessage) {
        setMessage(relatedMessage);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
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
          {loading && (
            <CustomModal isOpen={showModal} onClose={closeModal} header={{ title: 'Creating your project' }} size="lg">
              <div className="text-center mt-3">
                <div className="progress">
                  <div
                    className="progress-bar"
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{ width: `${progress}%` }}
                    aria-label="project completion bar"
                  >
                    {progress}%
                  </div>
                </div>
                <div className="d-flex justify-content-center text center">
                  <div className="loader-wheel" style={{ marginTop: '13px' }}>
                    <i className="bi bi-arrow-clockwise"></i>
                  </div>
                  <div className="progress-text mt-3" style={{ marginLeft: '10px' }}>
                    {message}
                  </div>
                </div>
              </div>
            </CustomModal>
          )}
          <hr className="m-0" />
        </BreezeModal>
      </div>
    </div>
  );
}

export default AllProjects;
