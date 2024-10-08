import TopBar from './TopBar';
import { useState, useEffect } from 'react';
import ConfigDisplay from './ConfigDisplay';
import ConfigurableMonacoEditor from './ConfigurableMonacoEditor';
import { useTreeContext } from '../context/TreeContext';
import { getAvailableTabs, initCode } from '../constants/TabScreen';
import { useParams } from 'react-router-dom';

function ProjectDisplay() {
  const { selectedNode } = useTreeContext();
  const { projectName } = useParams();
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'preview' or 'config'
  const [editorCode, setEditorCode] = useState('');

  const availableTabs = getAvailableTabs(selectedNode?.tag);
  console.log('selectedNode::>>', selectedNode);
  //to do : add in services.
  useEffect(() => {
    if (selectedNode && projectName) {
      const fetchCode = async () => {
        try {
          const response = await fetch(
            `http://localhost:8000/api/directory/${projectName}/get-code/${selectedNode.id}`
          );
          if (response.ok) {
            const data = await response.json();
            setEditorCode(data.code);
          } else {
            console.error('Failed to fetch code:', response.statusText);
          }
        } catch (error) {
          console.error('Error fetching code:', error);
        }
      };

      fetchCode();
    }
  }, [selectedNode, projectName]);

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
                  defaultValue={editorCode ? editorCode : '//Fetching Code'}
                  height="calc(100vh - 123px)"
                  language="javascript"
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
                  src={`${import.meta.env.VITE_GENERATED_PROJECT_DOMAIN}`}
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
