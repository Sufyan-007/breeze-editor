import TopBar from './TopBar';
import MonacoEditor from '../../../common/fields/f.monaco-editor';
import { useEffect, useState } from 'react';

function ProjectDisplay() {
  const projectTheme = localStorage.getItem('theme') === 'light' ? 'vs' : 'vs-dark';
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'preview'
  const [codeEditorTheme, setCodeEditorTheme] = useState(projectTheme);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    console.log('projectTheme::>>', projectTheme);
    setCodeEditorTheme(projectTheme);
  }, [projectTheme]);

  return (
    <div className="mb-3">
      <TopBar onTabChange={handleTabChange} activeTab={activeTab} />

      <div className="tab-content" id="pills-tabContent">
        {activeTab === 'code' ? (
          <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
            <div className="editor-container">
              <MonacoEditor
                height="520px"
                language="javascript"
                defaultValue="// Write your code here"
                theme={codeEditorTheme}
              />
            </div>
          </div>
        ) : (
          <div
            className="tab-pane fade show active"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <div className="iframe-container">
              <iframe
                src={`${import.meta.env.VITE_GENERATED_PROJECT_DOMAIN}`}
                title="Preview"
                width="100%"
                height="520px"
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDisplay;
