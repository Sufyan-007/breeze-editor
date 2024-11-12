import TopBar from './TopBar';
import { useState, useEffect, useCallback } from 'react';
import ConfigDisplay from './ConfigDisplay';
import ConfigurableMonacoEditor from './ConfigurableMonacoEditor';
import { useTreeContext } from '../context/TreeContext';
import { getAvailableTabs, getLanguageFromExtension } from '../constants/TabScreen';
import { useParams } from 'react-router-dom';
import { getFileCode, getProjectPort } from '../services/projectService';
import { useTabContext } from '../context/TabContext';
import '../styles/ProjectDisplay.css';

function ProjectDisplay() {
  const { selectedNode } = useTreeContext();
  const { projectName } = useParams();
  const [editorCode, setEditorCode] = useState('// Loading..');
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [projectPort, setProjectPort] = useState(3000);
  const { addTab, openTabs, updateTabContent, selectTab, setActiveConfigTab } = useTabContext();
  const availableTabs = getAvailableTabs(selectedNode?.tag);
  const currentTab = openTabs.find((tab) => tab.id === selectedNode?.id);
  const activeTab = currentTab?.activeTab || 'code'; // 'code' or 'preview' or 'config'

  const fetchPort = useCallback(async () => {
    const port = await getProjectPort(projectName);
    setProjectPort(port.port);
  }, [projectName]);

  useEffect(() => {
    fetchPort();
  }, [fetchPort]);

  useEffect(() => {
    if (selectedNode) {
      const existingTab = openTabs.find((tab) => tab.id === selectedNode.id);
      if (existingTab && existingTab.code) {
        setEditorLanguage(existingTab.language);
        setEditorCode(existingTab.code);
        selectTab(existingTab);
      } else {
        addTab(selectedNode);
      }
    }
  }, [selectedNode, addTab, openTabs, selectTab]);

  useEffect(() => {
    const existingTab = openTabs.find((tab) => tab.id === selectedNode?.id);
    if (
      selectedNode?.id &&
      !['DIRECTORY', 'CONFIG'].includes(selectedNode?.type) &&
      projectName &&
      activeTab === 'code' &&
      existingTab &&
      !existingTab.code
    ) {
      const fetchCode = async () => {
        try {
          const data = await getFileCode(projectName, selectedNode.id);
          if (data.code) {
            const language = getLanguageFromExtension(selectedNode?.extension);
            setEditorLanguage(language);
            setEditorCode(data.code);
            updateTabContent(selectedNode.id, data.code, language);
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
  }, [selectedNode, projectName, activeTab, openTabs, updateTabContent]);

  useEffect(() => {
    if (!availableTabs.includes(activeTab)) {
      setActiveConfigTab(selectedNode.id, availableTabs[0]);
    }
  }, [selectedNode, availableTabs, activeTab, setActiveConfigTab]);

  const handleTabChange = (tab) => {
    setActiveConfigTab(selectedNode.id, tab);
  };

  return (
    <div className="mb-3">
      <TopBar onTabChange={handleTabChange} activeTab={activeTab} availableTabs={availableTabs} />

      <div className="tab-content" id="pills-tabContent">
        {activeTab === 'code' && (
          <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
            <div className="editor-container">
              <ConfigurableMonacoEditor
                defaultValue={editorCode ? editorCode : '// Loading...'}
                height="calc(100vh - 161px)"
                language={editorLanguage}
                node={selectedNode}
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
  );
}

export default ProjectDisplay;
