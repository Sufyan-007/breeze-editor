import React, { useRef, useEffect, useState } from 'react';
import * as monaco from 'monaco-editor';

function MonacoEditor({ defaultValue = "", height = "500px", width = "100%", language = "javascript", theme = "vs-dark", onChange, id = "monaco-editor", readOnlyMode = false  ,placeholderText=""}) {
  const [editor, setEditor] = useState(null)
  const editorRef = useRef()
  const [value] = useState(defaultValue)

  // const [editorDiv,setEditorDiv] = useState(document.getElementById(id));
  
  // useEffect(()=>{
  //   setEditorDiv(document.getElementById(id))
  // })
// useEffect(()=>{
//   const placeholder = document.querySelector(`[data-editor-id="${id}"]`);
//   if (placeholder) {
//     placeholder.style.display = defaultValue ? 'none' : 'block';
//   }
// },[defaultValue])
  useEffect(() => {
    // editor.setValue("Changed value")
    if (editor && editor.getValue() !== defaultValue) {
      editor.setValue(defaultValue)
    }
    const placeholder = document.querySelector(`[data-editor-id="${id}"]`);
  if (placeholder) {
    placeholder.style.display = defaultValue ? 'none' : 'block';
  }
  }, [editor, defaultValue]);

  useEffect(() => {
    // console.log("setChange")
    if (editor && onChange) {
      editor.onDidChangeModelContent(() => {
        const currentValue = editor.getValue();

        if (`onChange`) {
          onChange(editor.getValue());
        }
        const placeholder = document.querySelector(`[data-editor-id="${id}"]`);
        if (!currentValue) {
          placeholder.style.display = 'block';
        } else {
          placeholder.style.display = 'none';
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
        readOnly: readOnlyMode,
        automaticLayout: true
      });
      editorRef.current = editor;
      setEditor(editor);
      const placeholder = document.querySelector(`[data-editor-id="${id}"]`);
      if (placeholder) {
        placeholder.style.display = defaultValue ? 'none' : 'block';
      }
      return () => editor.dispose();
    }
  }, [value,  language, theme, id, readOnlyMode]);

  return (
    <div style={{ position: 'relative' }}>
      <div id={id} style={{ height, width }}></div>
      <div className="monaco-placeholder" data-editor-id={id} style={placeholderStyle}>
        {placeholderText}
      </div>
    </div>
  );
}

const placeholderStyle = {
  position: 'absolute',
  top: '0px',
  left: '70px',
  color: 'gray',
  fontSize:'15px',
  pointerEvents: 'none',
  userSelect: 'none',
  zIndex: 1,
};
export default MonacoEditor;
