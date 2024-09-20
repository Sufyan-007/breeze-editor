import { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';
import PropTypes from 'prop-types';

function MonacoEditor({
  defaultValue = '',
  height = '500px',
  width = '100%',
  language = 'javascript',
  theme = 'vs-dark',
  onChange,
  id = 'monaco-editor',
  readOnlyMode = false,
}) {
  const [editor, setEditor] = useState(null);
  const editorRef = useRef();
  const [value] = useState(defaultValue);

  useEffect(() => {
    if (editor && editor.getValue() !== defaultValue) {
      editor.setValue(defaultValue);
    }
  }, [editor, defaultValue]);

  useEffect(() => {
    var addedCallback;
    if (editor && onChange) {
      addedCallback = editor.onDidChangeModelContent(() => {
        onChange(editor.getValue());
      });
    }
    return () => {
      if (addedCallback) {
        addedCallback.dispose();
      }
    };
  }, [editor, onChange]);

  useEffect(() => {
    const editorDiv = document.getElementById(id);
    if (editorDiv) {
      const editor = monaco.editor.create(editorDiv, {
        value: value,
        language,
        theme,
        automaticLayout: true,
        readOnly: readOnlyMode,
      });
      editorRef.current = editor;
      setEditor(editor);
      return () => editor.dispose();
    }
  }, [value, language, theme, id, readOnlyMode]);

  return (
    <div>
      <div id={id} style={{ height, width }}></div>
    </div>
  );
}

MonacoEditor.propTypes = {
  defaultValue: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  language: PropTypes.string,
  theme: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  readOnlyMode: PropTypes.bool,
};

export default MonacoEditor;
