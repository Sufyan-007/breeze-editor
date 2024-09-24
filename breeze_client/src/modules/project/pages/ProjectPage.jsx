import Layout from '../../../common/layout/Layout';
import ProjectDisplay from '../components/ProjectDisplay';
import ProjectSidebar from '../components/ProjectSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { BreezeLoader } from '../../../common/display';
import { useEffect, useState } from 'react';
import { fetchProjectConfig } from '../redux/projectActions';

function ProjectPage() {
  const projectStatus = useSelector((state) => state.project.status);
  const projectData = useSelector((state) => state.project.projectConfig);
  const dispatch = useDispatch();
  const [selectedNode, setSelectedNode] = useState({});
  useEffect(() => {
    if (projectStatus === 'ready') {
      dispatch(fetchProjectConfig());
    }
  }, [dispatch, projectStatus]);
  console.log(projectStatus, projectData);

  return (
    <div>
      <Layout
        sidebar={<ProjectSidebar setSelectedNode={setSelectedNode} />}
        mainContent={<ProjectDisplay selectedNode={selectedNode} />}
        currentPage="project"
      />
      {projectStatus === 'loading' && <BreezeLoader />}
    </div>
  );
}

export default ProjectPage;
