import Layout from '../../../common/layout/Layout';
import ProjectDisplay from '../components/ProjectDisplay';
import ProjectSidebar from '../components/ProjectSidebar';
import { useSelector } from 'react-redux';
import { BreezeLoader } from '../../../common/display';

function ProjectPage() {
  const projectStatus = useSelector((state) => state.project.status);

  return (
    <div>
      <Layout sidebar={<ProjectSidebar />} mainContent={<ProjectDisplay />} currentPage="project" />
      {projectStatus === 'loading' && <BreezeLoader />}
    </div>
  );
}

export default ProjectPage;
