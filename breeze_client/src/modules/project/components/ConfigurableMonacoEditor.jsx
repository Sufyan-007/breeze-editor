import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import PropTypes from 'prop-types';
import { BreezeList } from '../../../common/display';
import ThemeContext from '../../../contexts/ThemeContext';
import { useOffcanvas } from '../../../contexts/OffcanvasContext';
import { configTypeMapping, items, outerBlockItems } from '../constants/EditorList';
import {
  addAstStatement,
  deleteAstStatement,
  getAstStatement,
  getCodeDetails,
  updateAstStatement,
} from '../../../services/components/componentService';
import { useParams } from 'react-router-dom';
import useConfigurableMenuItems from '../hooks/useConfigurableMenuItems';
import { getFileCode } from '../services/projectService';

const ConfigurableMonacoEditor = ({
  defaultValue = '',
  height = '500px',
  width = '100%',
  language = 'javascript',
  onChange,
  readOnlyMode = false,
  node = {},
}) => {
  const editorRef = useRef(null);
  const countRef = useRef(0);
  const [editor, setEditor] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [filteredItems, setFilteredItems] = useState(items);
  const [value] = useState(defaultValue);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const { showOffcanvas, closeOffcanvas } = useOffcanvas();
  const { projectName } = useParams();
  const [statementId, setStatementId] = useState('');

  useEffect(() => {
    if (editor && editor.getValue() !== defaultValue) {
      editor.setValue(defaultValue);
    }
  }, [editor, defaultValue]);

  useEffect(() => {
    if (editor && onChange) {
      editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });
    }
  }, [editor, onChange]);

  useEffect(() => {
    const isSpecificTag = ['COMPONENTS', 'HOOKS', 'CODE_FILE', 'SERVICES'].includes(node?.tag);
    const editorInstance = monaco.editor.create(editorRef.current, {
      value: value,
      language: language,
      theme: projectTheme,
      readOnly: isSpecificTag ? 'true' : readOnlyMode,
    });
    setEditor(editorInstance);

    let breezeConfigAction;
    if (['COMPONENTS', 'HOOKS', 'CODE_FILE'].includes(node?.tag)) {
      const calculateMenuPosition = (domPosition) => {
        const editorContainer = editorRef.current.getBoundingClientRect();
        const editorScrollTop = editorRef.current.scrollTop || 0;

        return {
          x: editorContainer.left + domPosition.left,
          y: editorContainer.top + domPosition.top - editorScrollTop + domPosition.height,
        };
      };

      const menuConfig = async (editorInstance) => {
        const position = editorInstance.getPosition();
        const domPosition = editorInstance.getScrolledVisiblePosition(position);
        if (domPosition) {
          const menuPosition = calculateMenuPosition(domPosition);
          setMenuPosition(menuPosition);

          const model = editorInstance.getModel();
          const index = model.getOffsetAt(position);
          countRef.current = index;

          const payload = {
            fileId: node.id,
            index,
          };
          const result = await getCodeDetails(projectName, payload);
          const configType = result?.related_config?.type;

          setStatementId(result?.related_config?.id || node?.id);
          setFilteredItems(configType ? configTypeMapping[configType] || items : outerBlockItems);

          setShowMenu(true);
        }
      };

      const handleAltEnter = async (e) => {
        if (e.keyCode === monaco.KeyCode.Enter && e.altKey) {
          e.preventDefault();
          await menuConfig(editorInstance);
        }
      };

      breezeConfigAction = editorInstance.addAction({
        id: 'breeze-config',
        label: 'Breeze Config',
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 0,
        run: async (editor) => {
          await menuConfig(editor);
        },
      });

      editorInstance.onKeyDown(handleAltEnter);

      editorInstance.onMouseDown(() => {
        setShowMenu(false);
      });
    }

    return () => {
      editorInstance.dispose();
      if (breezeConfigAction) breezeConfigAction.dispose();
    };
  }, [language, readOnlyMode, value, projectTheme, node, projectName]);

  const updateFileCode = async () => {
    const data = await getFileCode(projectName, node?.id);
    onChange(data.code);
  };

  const onSubmit = async (value) => {
    const payload = {
      fileId: node.id,
      parentId: statementId,
      config: value,
      index: countRef.current,
    };
    await addAstStatement(projectName, payload);
    await updateFileCode();
    closeOffcanvas();
  };

  const onUpdate = async (value) => {
    const payload = {
      fileId: node.id,
      statementId: statementId,
      config: value,
    };
    await updateAstStatement(projectName, payload);
    await updateFileCode();
    closeOffcanvas();
  };

  const deleteStatement = async () => {
    const payload = {
      fileId: node.id,
      statementId: statementId,
    };
    await deleteAstStatement(projectName, payload);
    await updateFileCode();
  };

  const getConfig = useCallback(async () => {
    const payload = {
      fileId: node.id,
      statementId: statementId,
    };
    const config = await getAstStatement(projectName, payload);
    return config;
  }, [projectName, node?.id, statementId]);

  const getScope = useCallback(
    async (parentId) => {
      const payload = {
        fileId: node.id,
        statementId: parentId,
      };
      const config = await getAstStatement(projectName, payload);
      return config;
    },
    [projectName, node?.id]
  );

  const onCancel = () => {
    closeOffcanvas();
  };

  const { getConfigComponent } = useConfigurableMenuItems(
    onSubmit,
    onCancel,
    onUpdate,
    getConfig,
    getScope,
    node?.id,
    updateFileCode
  );

  const handleMenuItemClick = (item) => {
    if (item === 'Delete') {
      deleteStatement();
    } else {
      const contentComponent = getConfigComponent(item);
      let width = '40%';
      if (item === 'Add elements' || item === 'Edit elements' || item === 'Configure Imports') width = '60%';
      showOffcanvas(contentComponent, item || 'Component Configuration', 'end', true, width);
    }
    setShowMenu(false);
  };

  return (
    <div>
      <div ref={editorRef} style={{ height, width }}></div>

      {/* Custom Menu */}
      {showMenu && (
        <div
          id="customMenu"
          style={{
            position: 'absolute',
            top: menuPosition.y,
            left: menuPosition.x,
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          <BreezeList items={filteredItems} onItemClick={handleMenuItemClick} isSearchable={true} />
        </div>
      )}
    </div>
  );
};

ConfigurableMonacoEditor.propTypes = {
  defaultValue: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  language: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  readOnlyMode: PropTypes.bool,
  node: PropTypes.object,
};

export default ConfigurableMonacoEditor;
