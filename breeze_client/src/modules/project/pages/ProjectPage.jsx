import Layout from '../../../common/layout/Layout';
import ProjectDisplay from '../components/ProjectDisplay';
import ProjectSidebar from '../components/ProjectSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { BreezeLoader } from '../../../common/display';
import { TreeProvider } from '../context/TreeContext';

function ProjectPage() {
  const projectStatus = useSelector((state) => state.project.status);

  return (
    <div>
      <TreeProvider>
        <Layout sidebar={<ProjectSidebar />} mainContent={<ProjectDisplay />} currentPage="project" />
      </TreeProvider>
      {projectStatus === 'loading' && <BreezeLoader />}
    </div>
  );
}

export default ProjectPage;
