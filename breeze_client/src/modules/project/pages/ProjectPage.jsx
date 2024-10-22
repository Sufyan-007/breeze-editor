import Layout from '../../../common/layout/Layout';
import ProjectDisplay from '../components/ProjectDisplay';
import ProjectSidebar from '../components/ProjectSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { BreezeLoader } from '../../../common/display';
import { TreeProvider } from '../context/TreeContext';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { resetStore } from '../../../store/actions';
import { TabProvider } from '../context/TabContext';

function ProjectPage() {
  const projectStatus = useSelector((state) => state.project.status);
  const { projectName } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetStore());
    };
  }, [dispatch, projectName]);

  return (
    <div>
      <TreeProvider>
        <Layout
          sidebar={<ProjectSidebar />}
          mainContent={
            <TabProvider>
              <ProjectDisplay />
            </TabProvider>
          }
          currentPage="project"
          projectName={projectName}
        />
      </TreeProvider>
      {projectStatus === 'loading' && <BreezeLoader />}
    </div>
  );
}

export default ProjectPage;
