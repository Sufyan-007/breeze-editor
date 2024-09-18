import TopBar from './TopBar';
import { useEffect, useState } from 'react';
import ConfigDisplay from './ConfigDisplay';
import ConfigurableMonacoEditor from '../../../common/fields/f.configurable-monaco-editor';

function ProjectDisplay() {
  const projectTheme = localStorage.getItem('theme') === 'light' ? 'vs' : 'vs-dark';
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'preview' or 'config'
  const [codeEditorTheme, setCodeEditorTheme] = useState(projectTheme);
  const item = { type: 'third-party' }; // TO DO : Dynamic after api integration

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    setCodeEditorTheme(projectTheme);
  }, [projectTheme]);

  return (
    <>
      <div className="mb-3">
        <TopBar onTabChange={handleTabChange} activeTab={activeTab} item={item} />

        <div className="tab-content" id="pills-tabContent">
          {activeTab === 'code' && (
            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
              <div className="editor-container">
                <ConfigurableMonacoEditor
                  defaultValue="// Monaco editor init"
                  height="calc(100vh - 123px)"
                  language="javascript"
                  theme={codeEditorTheme}
                />
              </div>
            </div>
          )}

          {item.type === 'component'
            ? activeTab === 'preview' && (
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
              )
            : activeTab === 'config' && (
                <div
                  className="tab-pane fade show active"
                  id="pills-config"
                  role="tabpanel"
                  aria-labelledby="pills-config-tab"
                >
                  <div className="project-display-container config-container">
                    <ConfigDisplay configType={item.type} />
                  </div>
                </div>
              )}
        </div>
      </div>
    </>
  );
}

export default ProjectDisplay;
