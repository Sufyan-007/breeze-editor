import Layout from '../../../common/layout/Layout';
import ProjectSidebar from '../components/ProjectSidebar';

function ProjectPage() {
  return (
    <div>
      <Layout
        sidebar={<ProjectSidebar />}
        mainContent={<div>Main Content for Dashboard Page</div>}
        currentPage="project"
      />
    </div>
  );
}

export default ProjectPage;
