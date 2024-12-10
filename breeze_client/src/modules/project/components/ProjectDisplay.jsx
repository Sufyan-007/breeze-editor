import TopBar from './TopBar';
import { useState, useEffect, useCallback } from 'react';
import ConfigDisplay from './ConfigDisplay';
import ConfigurableMonacoEditor from './ConfigurableMonacoEditor';
import { useTreeContext } from '../context/TreeContext';
import { getAvailableTabs, getLanguageFromExtension } from '../constants/TabScreen';
import { useParams } from 'react-router-dom';
import { getFileCode, getProjectPort } from '../services/projectService';
import { useTabContext } from '../context/TabContext';
import { changeConfigAndCodeAsOfVersion } from '../../../services/configs/configService';
import { fetchConfigVersion, updateSelectedNodePayload } from '../../../redux/project/projectActions';
import { configDetailsKeyMapper } from '../constants/configDetailsKeyMapper';
import { useDispatch } from 'react-redux';
import { BreezeToaster } from '../../../common/display';
import '../styles/ProjectDisplay.css';

function ProjectDisplay() {
  const { selectedNode } = useTreeContext();
  const { projectName } = useParams();
  const [editorCode, setEditorCode] = useState('// Loading..');
  const [editorLanguage, setEditorLanguage] = useState('javascript');
  const [projectPort, setProjectPort] = useState(3000);
  const { addTab, openTabs, updateTabContent, selectTab, setActiveConfigTab, selectedTab } = useTabContext();
  const availableTabs = getAvailableTabs(selectedTab?.tag);
  const currentTab = openTabs.find((tab) => tab.id === selectedTab?.id);
  const activeTab = currentTab?.activeTab || 'code'; // 'code' or 'preview' or 'config'
  const [latestConfigVersion, setLatestConfigVersion] = useState(null);
  const [versionError, setVersionError] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState('');
  const [isVersionMismatched, setIsVersionMismatched] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchConfigFileVersions = async () => {
      try {
        const payload = {
          category: configDetailsKeyMapper['category'][selectedNode.tag],
          filename: configDetailsKeyMapper['filename'][selectedNode.id],
        };
        dispatch(fetchConfigVersion({ projectName, payload }))
          .unwrap()
          .then((res) => {
            setLatestConfigVersion(res?.latestConfigVersion);
            setSelectedVersion(res?.currentConfigVersion);
          });
      } catch (err) {
        setVersionError(err.message);
      }
    };

    if (!latestConfigVersion && selectedNode?.id == 'ROUTE_COMPONENT') {
      fetchConfigFileVersions();
    }
    if (selectedNode.activeTab === 'config' && selectedNode?.id == 'ROUTE_COMPONENT') {
      if (selectedVersion != latestConfigVersion) {
        handleVersionSelection('ROLLFORWARD', latestConfigVersion);
      }
    }
  }, [projectName, selectedNode, dispatch]);

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
      !existingTab.code &&
      !selectedNode.isNew
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
      setActiveConfigTab(selectedTab.id, availableTabs[0]);
    }
  }, [selectedTab, availableTabs, activeTab, setActiveConfigTab]);

  const handleTabChange = (tab) => {
    setActiveConfigTab(selectedTab.id, tab);
  };

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

  const handleVersionSelection = async (updateMethod, version = null) => {
    try {
      const payload = {
        updateMethod: updateMethod,
        category: configDetailsKeyMapper['category'][selectedNode.tag],
        filename: configDetailsKeyMapper['filename'][selectedNode.id],
        version: version,
      };
      if (selectedVersion >= latestConfigVersion && updateMethod === 'ROLLFORWARD') {
        setIsVersionMismatched(true);
        setVersionError('currently present on the latest version..');
        setTimeout(() => {
          setIsVersionMismatched(false);
          setVersionError('');
        }, 3000);
        return;
      }
      if (selectedVersion <= 1 && updateMethod === 'ROLLBACK') {
        setIsVersionMismatched(true);
        setVersionError('currently present on the initial version..');
        setTimeout(() => {
          setIsVersionMismatched(false);
          setVersionError('');
        }, 3000);
        return;
      }
      if (updateMethod) {
        const response = await changeConfigAndCodeAsOfVersion(projectName, payload);
        if (response?.currentVersion) {
          setSelectedVersion(response.currentVersion);
          dispatch(
            updateSelectedNodePayload({
              latestConfigVersion: latestConfigVersion,
              currentConfigVersion: response.currentVersion,
            })
          );
        }
        fetchCode();
      }
    } catch (err) {
      setVersionError(err.message);
    }
  };

  return (
    <div className="mb-3">
      <TopBar onTabChange={handleTabChange} activeTab={activeTab} availableTabs={availableTabs} />

      <div className="tab-content" id="pills-tabContent">
        {activeTab === 'code' && (
          <div>
            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
              <div className="editor-container">
                <ConfigurableMonacoEditor
                  defaultValue={editorCode ? editorCode : '// Loading...'}
                  height={selectedNode.id !== 'ROUTE_COMPONENT' ? 'calc(100vh - 161px)' : 'calc(100vh - 230px)'}
                  language={editorLanguage}
                  node={selectedTab}
                  onChange={(val) => {
                    if (selectedTab?.tag !== 'CUSTOM') {
                      setEditorCode(val);
                      updateTabContent(selectedTab.id, val, selectedTab.language);
                    }
                  }}
                />
              </div>
            </div>
            {selectedNode?.id == 'ROUTE_COMPONENT' && (
              <div className="d-flex justify-content-between mt-2">
                <div className="d-flex">
                  <div
                    className="m-2 p-1 bg-primary rounded-pill"
                    role="button"
                    onClick={() => handleVersionSelection('ROLLBACK')}
                  >
                    previous
                  </div>
                  <div
                    className="m-2 p-1 bg-success rounded-pill"
                    role="button"
                    onClick={() => handleVersionSelection('ROLLFORWARD')}
                  >
                    next
                  </div>
                  <div className="m-2 p-1 bg-info rounded" role="button">
                    latest version: {latestConfigVersion || ''}
                  </div>
                </div>
                <div className="m-2">
                  <select
                    name="versionList"
                    id="versionList"
                    className="form-contro border-primary rounded shadow  form-select form-select "
                    onChange={(e) => {
                      const selectedValue = e.target.value;
                      if (selectedValue) {
                        let method = '';
                        if (selectedValue <= selectedVersion) {
                          method = 'ROLLBACK';
                        } else if (selectedValue >= selectedVersion) {
                          method = 'ROLLFORWARD';
                        } else {
                          setIsVersionMismatched(true);
                          setVersionError('currently present on the same version..');
                          setTimeout(() => {
                            setIsVersionMismatched(false);
                            setVersionError('');
                          }, 2000);
                          return;
                        }
                        handleVersionSelection(method, selectedValue); // Call your function with the selected value
                      }
                    }}
                  >
                    {selectedVersion ? (
                      <option value={selectedVersion}>{'selected version: ' + selectedVersion}</option>
                    ) : (
                      <option value="">Select a version</option>
                    )}
                    {Array.from({ length: latestConfigVersion }, (_, index) => index + 1).map(
                      (option) =>
                        option != selectedVersion && (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        )
                    )}
                  </select>
                </div>
              </div>
            )}
            {isVersionMismatched && <BreezeToaster message={versionError} type="info" />}
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
              <ConfigDisplay configType={selectedTab?.tag || ''} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDisplay;
