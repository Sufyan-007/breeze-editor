import { useContext, useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import PropTypes from 'prop-types';
import { BreezeList } from '../../../common/display';
import ThemeContext from '../../../contexts/ThemeContext';
import PropConfigForm from '../../component-configuration/components/config-forms/PropConfigForm';
import VariableConfigForm from '../../component-configuration/components/config-forms/VariableConfigForm';
import AddELement from '../../component-configuration/components/config-forms/AddELement';
import ImportConfigForm from '../../component-configuration/components/config-forms/ImportConfigForm';
import FunctionConfigForm from '../../component-configuration/components/config-forms/FunctionConfigForm';
import LifecycleConfigForm from '../../component-configuration/components/config-forms/LifecycleConfigForm';
import HookConfigForm from '../../component-configuration/components/config-forms/HookConfigForm';
import { useOffcanvas } from '../../../contexts/OffcanvasContext';

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
  const [showMenu, setShowMenu] = useState(false);
  const [value] = useState(defaultValue);
  const { theme } = useContext(ThemeContext);
  const projectTheme = theme === 'dark' ? 'vs-dark' : 'vs';
  const { showOffcanvas } = useOffcanvas();

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
      setShowMenu((state) => {
        if (state && !event.target.closest('#customMenu')) {
          return false;
        }
        return state;
      });
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
      case '+ Html elements':
        contentComponent = <AddELement />;
        break;
      case '+ Function':
        contentComponent = <FunctionConfigForm onSubmit={() => {}} />;
        break;
      case '+ Lifecycle':
        contentComponent = <LifecycleConfigForm onSubmit={() => {}} />;
        break;
      case '+ Hook':
        contentComponent = <HookConfigForm onSubmit={() => {}} />;
        break;
      default:
        contentComponent = null;
    }

    showOffcanvas(
      contentComponent,
      'Component Configuration',
      'end', // Optional placement
      true, // Optional backdrop
      '40%' // Optional size
    );

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
      {/* <BreezeOffcanvas
        show={showOffCanvas}
        onClose={() => setShowOffCanvas(false)}
        title="Component Configuration"
        placement="end"
        size="40%"
      >
        <>{OffCanvasContent}</>
      </BreezeOffcanvas> */}
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
