import { TreeProvider } from '../context/TreeContext';
import { useParams } from 'react-router-dom';
import { TabProvider } from '../context/TabContext';
import ProjectPage from './ProjectPage';

function ProjectPageWrapper() {
  const { projectName } = useParams();
  return (
    <div>
      <TreeProvider projectName={projectName}>
        <TabProvider projectName={projectName}>
          <ProjectPage />
        </TabProvider>
      </TreeProvider>
    </div>
  );
}

export default ProjectPageWrapper;
