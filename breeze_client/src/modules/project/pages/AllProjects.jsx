import { useState, useEffect, useRef } from 'react';
import '../styles/AllProjects.css';
import Navbar from '../../../common/navbar/Navbar';
import images from '../../../assets/images/index';
import ProjectCard from '../components/ProjectCard';
import { router } from '../../../routes/routing';
import { createProject, deleteProject, getAllProjects } from '../services/projectService';
import CreateProjectForm from '../components/CreateProjectForm';
import { BreezeModal } from '../../../common/display';
import { progressMessages } from '../constants/progressMessages';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Uploading...');
  const [isLoaderModalOpen, setLoaderModalOpen] = useState(false);
  const ws = useRef(null);
  const wsStatus = useRef(null);
  const intervalId = useRef(null);
  const [projectStatuses, setProjectStatuses] = useState({});

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

  const handleSubmit = async (formValues) => {
    setLoading(true);
    setIsCreateProjectModalOpen(false);
    setLoaderModalOpen(true);

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(
        JSON.stringify({
          command: 'start',
          project_id: formValues.name.toLowerCase().replace(/ /g, '_'),
        })
      );
    }

    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    try {
      await createProject(formData);
      fetchProjects();
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      console.log(validationErrors);
    } finally {
      setLoading(false);
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

  const openModal = () => setIsCreateProjectModalOpen(true);

  const handleOpenProject = (projectName) => {
    router.navigate(`/project/${projectName}`);
  };

  const handleDeleteProject = async (projectName) => {
    await deleteProject(projectName);
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();

    ws.current = new WebSocket(`${import.meta.env.VITE_SOCKET_URL}/ws/project-progress/`);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (event) => {
      const messageData = JSON.parse(event.data);
      const progressData = messageData?.progress;

      if (progressData === 20 && intervalId.current === null) {
        incrementProgress();
      } else if (progressData === 50) {
        clearInterval(intervalId.current);
        intervalId.current = null;
        setProgress(progressData);
      } else {
        setProgress(progressData);
      }

      const relatedMessage = progressMessages[progressData];
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
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, []);

  const closeModal = () => {
    setLoaderModalOpen(false);
  };

  useEffect(() => {
    wsStatus.current = new WebSocket(`${import.meta.env.VITE_SOCKET_URL}/ws/app-status/`);

    wsStatus.current.onopen = () => {
      console.log('Connected to the WebSocket of app status');
      if (wsStatus.current && wsStatus.current.readyState === WebSocket.OPEN) {
        sendProjectStatuses(projects);
      }
    };

    wsStatus.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { project_id, status } = message?.status || {};
      if (project_id && status) {
        setProjectStatuses((prevStatuses) => ({
          ...prevStatuses,
          [project_id]: status,
        }));
      }
    };

    wsStatus.current.onclose = () => {
      console.log('Disconnected from the WebSocket');
    };

    return () => {
      if (wsStatus.current) {
        wsStatus.current.close();
        console.log('WebSocket connection closed');
      }
    };
  }, []);

  useEffect(() => {
    if (wsStatus.current && wsStatus.current.readyState === WebSocket.OPEN) {
      sendProjectStatuses(projects);
    }
  }, [projects]);

  const sendProjectStatuses = (projects) => {
    projects.forEach((project) => {
      wsStatus.current.send(
        JSON.stringify({
          command: 'status',
          project_id: project.name,
        })
      );
    });
  };

  return (
    <div className="container-fluid vh-100 p-0 br-background-secondary">
      <Navbar />
      <div className="home-main-content">
        <div className="row m-0 gap-2">
          {projects.map((project) => (
            <ProjectCard
              key={project.name}
              projectName={project.projectName}
              projectImageSrc={images.ABDMLoginPage}
              iconSrc={images.VectorIcon}
              onClick={() => handleOpenProject(project.name)}
              onDelete={() => handleDeleteProject(project.name)}
              projectStatus={projectStatuses[project.name]}
            />
          ))}
          <ProjectCard isCreateNew={true} onClick={openModal} />
        </div>
        <CreateProjectForm
          handleSubmit={handleSubmit}
          isCreateProjectModalOpen={isCreateProjectModalOpen}
          setIsCreateProjectModalOpen={setIsCreateProjectModalOpen}
        />
        {loading && (
          <BreezeModal
            isOpen={isLoaderModalOpen}
            onClose={closeModal}
            header={{ title: 'Creating your project' }}
            size="lg"
          >
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
              <div className="d-flex justify-content-center text-center">
                <div className="loader-wheel" style={{ marginTop: '13px' }}>
                  <i className="bi bi-arrow-clockwise"></i>
                </div>
                <div className="progress-text mt-3" style={{ marginLeft: '10px' }}>
                  {message}
                </div>
              </div>
            </div>
          </BreezeModal>
        )}
      </div>
    </div>
  );
};

export default AllProjects;
