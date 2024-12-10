import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import PropTypes from 'prop-types';
import { BreezeList } from '../../../common/display';
import ThemeContext from '../../../contexts/ThemeContext';
import { useOffcanvas } from '../../../contexts/OffcanvasContext';
import { configTypeMapping, items } from '../constants/EditorList';
import {
  addAstStatement,
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
    const isSpecificTag = ['COMPONENTS', 'HOOKS', 'CODE_FILE'].includes(node?.tag);
    const editorInstance = monaco.editor.create(editorRef.current, {
      value: value,
      language: language,
      theme: projectTheme,
      readOnly: isSpecificTag ? 'true' : readOnlyMode,
      contextmenu: isSpecificTag ? 'false' : 'true',
    });
    setEditor(editorInstance);

    const handleClick = async (e) => {
      if (e && e.event.buttons !== 1) {
        return;
      }

      const model = editorInstance.getModel();
      const position = editorInstance.getPosition();
      const index = model.getOffsetAt(position);
      // const character = model.getValue()[index];
      const text = model.getValue();
      const count = text.slice(0, index).length;

      const payload = {
        fileId: node.id,
        index: count,
      };
      const result = await getCodeDetails(projectName, payload);
      const configType = result?.related_config?.type;
      setStatementId(result?.related_config?.id || '');
      setFilteredItems(configType ? configTypeMapping[configType] || items : []);
    };

    if (['COMPONENTS', 'HOOKS', 'CODE_FILE'].includes(node?.tag)) {
      editorInstance.onContextMenu(async (e) => {
        e.event.preventDefault();
        e.event.stopPropagation();
        await new Promise((r) => setTimeout(r, 5));
        await handleClick();
        const { clientX, clientY } = e.event.browserEvent;
        setMenuPosition({ x: clientX, y: clientY });
        setShowMenu(true);
      });

      editorInstance.onMouseDown(() => {
        setShowMenu(false);
      });
    }

    if (['COMPONENTS', 'HOOKS', 'CODE_FILE'].includes(node?.tag)) {
      editorInstance.onMouseDown(handleClick);
    }

    return () => {
      editorInstance.dispose();
    };
  }, [language, readOnlyMode, value, projectTheme, node, projectName]);

  const onSubmit = async (value) => {
    const payload = {
      fileId: node.id,
      parentId: statementId,
      config: value,
    };
    await addAstStatement(projectName, payload);
    const data = await getFileCode(projectName, node.id);
    onChange(data.code);
    closeOffcanvas();
  };

  const onUpdate = async (value) => {
    const payload = {
      fileId: node.id,
      statementId: statementId,
      config: value,
    };
    await updateAstStatement(projectName, payload);
    const data = await getFileCode(projectName, node.id);
    onChange(data.code);
    closeOffcanvas();
  };

  const getConfig = useCallback(async () => {
    const payload = {
      fileId: node.id,
      statementId: statementId,
    };
    const config = await getAstStatement(projectName, payload);
    return config;
  }, [projectName, node?.id, statementId]);

  const onCancel = () => {
    closeOffcanvas();
  };

  const { getConfigComponent } = useConfigurableMenuItems(onSubmit, onCancel, onUpdate, getConfig);

  const handleMenuItemClick = (item) => {
    const contentComponent = getConfigComponent(item);
    // console.log('contentComponent', item, contentComponent);
    let width = '40%';
    if (item === 'Html elements') width = '60%';
    showOffcanvas(contentComponent, item || 'Component Configuration', 'end', true, width);
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
