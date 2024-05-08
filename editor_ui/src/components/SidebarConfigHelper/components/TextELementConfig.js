import React from 'react'
import { Form } from 'react-bootstrap'
import { useRef, useEffect } from'react'

const TextELement = ({textValue,handleTextChange}) => {
  const textareaRef = useRef(null);

  useEffect(() => {
      if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      }
  }, [textValue]);
  return (
      
                <>
                <Form.Control 
                    as="textarea" 
                    placeholder=""  
                    className="m-auto mt-4 mb-3 ps-3 pe-4 pt-3 pb-3" 
                    value={textValue} 
                    onChange={handleTextChange} 
                    style={{ minHeight: '150px' , width:'95%' , resize: 'none' ,overflowY: 'hidden' }}
                    ref={textareaRef}

                     />
                      </>

            
  )
}

export default TextELement
