import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';

function MonacoEditor({ defaultValue = "", height = "500px", width = "100%", language = "javascript", theme = "vs-dark", onChange, id = "monaco-editor", readOnlyMode = false }) {
  const [editor, setEditor] = useState(null)
  const editorRef = useRef()
  const [value] = useState(defaultValue)
  // const [editorDiv,setEditorDiv] = useState(document.getElementById(id));
  
  // useEffect(()=>{
  //   setEditorDiv(document.getElementById(id))
  // })

  useEffect(() => {
    // editor.setValue("Changed value")
    if (editor && editor.getValue() !== defaultValue) {
      editor.setValue(defaultValue)
    }
  }, [editor, defaultValue]);

  useEffect(() => {
    // console.log("setChange")
    if (editor && onChange) {
      editor.onDidChangeModelContent(() => {
        if (`onChange`) {
          onChange(editor.getValue());
        }
      });
    }
  }, [editor, onChange])


  useEffect(() => {
    const editorDiv = document.getElementById(id);
    if (editorDiv) {

      const editor = monaco.editor.create(editorDiv, {
        value: value,
        language,
        theme,
        automaticLayout: true,
        readOnly: readOnlyMode
      });
      editorRef.current = editor;
      setEditor(editor);
      return () => editor.dispose();
    }
  }, [value,  language, theme, id, readOnlyMode]);

  return (
    <div>
      <div id={id} style={{ height, width }}></div>
    </div>
  );
}

export default MonacoEditor;
