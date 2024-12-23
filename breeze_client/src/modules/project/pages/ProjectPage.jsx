import { useState, useEffect, useCallback, useRef } from 'react';
import Layout from '../../../common/layout/Layout';
import ProjectDisplay from '../components/ProjectDisplay';
import ProjectSidebar from '../components/ProjectSidebar';
import TabBar from '../components/TabBar';
import { useDispatch } from 'react-redux';
import { BreezeLoader } from '../../../common/display';
import { useParams } from 'react-router-dom';
import { resetStore } from '../../../store/actions';
import SearchInput from '../components/SearchInput';

function ProjectPage() {
  const { projectName } = useParams();
  const dispatch = useDispatch();

  const [showSearch, setShowSearch] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    return () => {
      dispatch(resetStore());
    };
  }, [dispatch, projectName]);

  const handleKeyDown = useCallback((e) => {
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      setShowSearch(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleClickOutside = useCallback((e) => {
    if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
      setShowSearch(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleKeyDown, handleClickOutside]);

  return (
    <div>
      <Layout
        sidebar={<ProjectSidebar />}
        mainContent={
          <>
            {showSearch && (
              <div ref={searchBoxRef}>
                <SearchInput
                  projectName={projectName}
                  setShowSearch={setShowSearch}
                  setFileList={setFileList}
                  setLoading={setLoading}
                />
              </div>
            )}
            <TabBar />
            <ProjectDisplay fileList={fileList} />
          </>
        }
        currentPage="project"
        projectName={projectName}
      />
      {loading && <BreezeLoader />}
    </div>
  );
}

export default ProjectPage;
