import Layout from '../../../common/layout/Layout';
import ProjectDisplay from '../components/ProjectDisplay';
import ProjectSidebar from '../components/ProjectSidebar';

function ProjectPage() {
  return (
    <div>
      <Layout sidebar={<ProjectSidebar />} mainContent={<ProjectDisplay />} currentPage="project" />
    </div>
  );
}

export default ProjectPage;
