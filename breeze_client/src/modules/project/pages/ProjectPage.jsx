import Layout from '../../../common/layout/Layout';
import ProjectDisplay from '../components/ProjectDisplay';
import ProjectSidebar from '../components/ProjectSidebar';
import { useSelector } from 'react-redux';
import { BreezeLoader } from '../../../common/display';
import { TreeProvider } from '../context/TreeContext';
import { useParams } from 'react-router-dom';

function ProjectPage() {
  const projectStatus = useSelector((state) => state.project.status);
  const { projectName } = useParams();

  return (
    <div>
      <TreeProvider>
        <Layout
          sidebar={<ProjectSidebar />}
          mainContent={<ProjectDisplay />}
          currentPage="project"
          projectName={projectName}
        />
      </TreeProvider>
      {projectStatus === 'loading' && <BreezeLoader />}
    </div>
  );
}

export default ProjectPage;
