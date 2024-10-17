import TopBar from './TopBar';
import { useState, useEffect, useCallback } from 'react';
import ConfigDisplay from './ConfigDisplay';
import ConfigurableMonacoEditor from './ConfigurableMonacoEditor';
import { useTreeContext } from '../context/TreeContext';
import { getAvailableTabs, getLanguageFromExtension } from '../constants/TabScreen';
import { useParams } from 'react-router-dom';
import { getFileCode, getProjectPort } from '../services/projectService';

function ProjectDisplay() {
  const { selectedNode } = useTreeContext();
  const { projectName } = useParams();
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'preview' or 'config'
  const [editorCode, setEditorCode] = useState('// Loading..');
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [projectPort, setProjectPort] = useState(3000);

  const availableTabs = getAvailableTabs(selectedNode?.tag);

  const fetchPort = useCallback(async () => {
    const port = await getProjectPort(projectName);
    setProjectPort(port.port);
  }, [projectName]);

  useEffect(() => {
    fetchPort();
  }, [fetchPort]);

  useEffect(() => {
    if (selectedNode?.id && !['DIRECTORY', 'CONFIG'].includes(selectedNode?.type) && projectName) {
      const fetchCode = async () => {
        try {
          const data = await getFileCode(projectName, selectedNode.id);
          if (data.code) {
            setEditorLanguage(getLanguageFromExtension(selectedNode?.extension));
            setEditorCode(data.code);
          } else {
            setEditorCode('// Loading...');
          }
        } catch (error) {
          setEditorCode('// Loading...');
          console.error('Error fetching code:', error);
        }
      };

      fetchCode();
    }
  }, [selectedNode, projectName, activeTab]);

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveTab(availableTabs[0]);
    }
  }, [selectedNode, availableTabs, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="mb-3">
        <TopBar onTabChange={handleTabChange} activeTab={activeTab} availableTabs={availableTabs} />

        <div className="tab-content" id="pills-tabContent">
          {activeTab === 'code' && (
            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
              <div className="editor-container">
                <ConfigurableMonacoEditor
                  defaultValue={editorCode ? editorCode : '// Loading...'}
                  height="calc(100vh - 123px)"
                  language={editorLanguage}
                />
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div
              className="tab-pane fade show active"
              id="pills-preview"
              role="tabpanel"
              aria-labelledby="pills-preview-tab"
            >
              <div className="project-display-container iframe-container">
                <iframe
                  src={`${import.meta.env.VITE_GENERATED_PROJECT_DOMAIN}:${projectPort}`}
                  title="Preview"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                ></iframe>
              </div>
            </div>
          )}

          {activeTab === 'config' && (
            <div
              className="tab-pane fade show active"
              id="pills-config"
              role="tabpanel"
              aria-labelledby="pills-config-tab"
            >
              <div className="project-display-container config-container">
                <ConfigDisplay configType={selectedNode?.tag || ''} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ProjectDisplay;
