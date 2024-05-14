import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';

function MonacoEditor({ defaultValue = "", height = "500px", width = "100%", language = "javascript", theme = "vs-dark", onChange, id = "monaco-editor" }) {
  const [editor, setEditor] = useState(null)
  const editorRef = useRef()
  // const [editorDiv,setEditorDiv] = useState(document.getElementById(id));
  
  // useEffect(()=>{
  //   setEditorDiv(document.getElementById(id))
  // })

  useEffect(() => {
    console.log("setChange")
    if (editor) {
      editor.onDidChangeModelContent(() => {
        if (`onChange`) {
          onChange(editor.getValue());
        }
      });
    }
  }, [editor, onChange])


  useEffect(() => {
    console.log("INit editor")
    const editorDiv = document.getElementById(id);
    if (editorDiv) {

      console.log("Actual init")
      const editor = monaco.editor.create(editorDiv, {
        value: defaultValue,
        language,
        theme,
      });
      editorRef.current = editor;
      setEditor(editor);
      return () => editor.dispose();
    }
  }, [defaultValue,  language, theme, id]);

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
