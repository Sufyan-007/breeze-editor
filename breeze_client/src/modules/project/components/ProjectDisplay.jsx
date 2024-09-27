import TopBar from './TopBar';
import { useEffect, useState } from 'react';
import ConfigDisplay from './ConfigDisplay';
import ConfigurableMonacoEditor from './ConfigurableMonacoEditor';
import PropTypes from 'prop-types';

function ProjectDisplay({ selectedNode }) {
  const [activeTab, setActiveTab] = useState('code'); // 'code' or 'preview' or 'config'

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    console.log(selectedNode);
  }, [selectedNode]);

  return (
    <>
      <div className="mb-3">
        <TopBar onTabChange={handleTabChange} activeTab={activeTab} item={selectedNode} />

        <div className="tab-content" id="pills-tabContent">
          {activeTab === 'code' && (
            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
              <div className="editor-container">
                <ConfigurableMonacoEditor
                  defaultValue="// Monaco editor init"
                  height="calc(100vh - 123px)"
                  language="javascript"
                />
              </div>
            </div>
          )}

          {selectedNode.tag === 'COMPONENT'
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
                    <ConfigDisplay configType={selectedNode?.tag || ''} />
                  </div>
                </div>
              )}
        </div>
      </div>
    </>
  );
}

ProjectDisplay.propTypes = {
  selectedNode: PropTypes.object,
};

export default ProjectDisplay;
