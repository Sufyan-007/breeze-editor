import Layout from '../../../common/layout/Layout';
import ProjectDisplay from '../components/ProjectDisplay';
import ProjectSidebar from '../components/ProjectSidebar';
import { useSelector } from 'react-redux';
import { BreezeLoader } from '../../../common/display';
import { useState } from 'react';

function ProjectPage() {
  const projectStatus = useSelector((state) => state.project.status);
  const [selectedNode, setSelectedNode] = useState({});

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
