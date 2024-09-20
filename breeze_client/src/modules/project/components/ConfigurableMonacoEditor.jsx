import { useContext, useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import PropTypes from 'prop-types';
import { BreezeOffcanvas, BreezeList } from '../../../common/display';
import ThemeContext from '../../../contexts/ThemeContext';
import PropConfigForm from '../../component-configuration/components/config-forms/PropConfigForm';
import VariableConfigForm from '../../component-configuration/components/config-forms/VariableConfigForm';
import ImportConfigForm from '../../component-configuration/components/config-forms/ImportConfigForm';

const items = ['+ Imports', '+ Variable', '+ Props', '+ Function', '+ Lifecycle', '+ Hook', '+ Html elements'];

const ConfigurableMonacoEditor = ({
  defaultValue = '',
  height = '500px',
  width = '100%',
  language = 'javascript',
  onChange,
  readOnlyMode = false,
}) => {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [showOffCanvas, setShowOffCanvas] = useState(false);
  const [offCanvasContent, setOffCanvasContent] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [value] = useState(defaultValue);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';

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
    const editorInstance = monaco.editor.create(editorRef.current, {
      value: value,
      language: language,
      theme: projectTheme,
      readOnly: readOnlyMode,
    });

    setEditor(editorInstance);

    // Show custom menu on alt+enter
    const handleKeyDown = (event) => {
      if (event.altKey && event.key === 'Enter') {
        event.preventDefault();
        setShowMenu(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest('#customMenu')) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      editorInstance.dispose();
    };
  }, [language, readOnlyMode, value, projectTheme]);

  const handleMenuItemClick = (item) => {
    let contentComponent;
    switch (item) {
      case '+ Imports':
        contentComponent = <ImportConfigForm onSubmit={() => {}} />;
        break;
      case '+ Props':
        contentComponent = <PropConfigForm onSubmit={() => {}} />;
        break;
      case '+ Variable':
        contentComponent = <VariableConfigForm onSubmit={() => {}} />;
        break;
      default:
        contentComponent = null;
    }

    setOffCanvasContent(contentComponent);
    setShowOffCanvas(true);
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
            display: 'block',
            position: 'absolute',
            top: '50%',
            right: '40%',
            borderRadius: '5px',
            zIndex: 1000,
          }}
        >
          <BreezeList items={items} onItemClick={handleMenuItemClick} isSearchable={true} />
        </div>
      )}

      {/* Breeze Off-Canvas */}
      <BreezeOffcanvas
        show={showOffCanvas}
        onClose={() => setShowOffCanvas(false)}
        title="Component Configuration"
        placement="end"
      >
        <>{offCanvasContent}</>
      </BreezeOffcanvas>
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
};

export default ConfigurableMonacoEditor;
