import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

function MonacoEditor({ defaultValue = "", height = "500px", width = "100%", language = "javascript", theme = "vs-dark", onChange, id="monaco-editor" }) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editorDiv = document.getElementById(id);
    if (editorDiv) {
      const editor = monaco.editor.create(editorDiv, {
        value: defaultValue,
        language,
        theme,
      });
      editorRef.current = editor;

      editor.onDidChangeModelContent(() => {
        if (onChange) {
          onChange(editor.getValue());
        }
      });

      return () => editor.dispose();
    }
  }, [defaultValue, language, theme, id, onChange]);

  // const getValue = useCallback(() => {
  //   return editorRef.current ? editorRef.current.getValue() : "";
  // }, []);

  return (
    <div>
      <div id={id} style={{ height, width }}></div>
    </div>
  );
}

export default MonacoEditor;
