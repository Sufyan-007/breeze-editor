import React from 'react';
import "../../css/FolderTemplate.css";

function FolderTemplate() {
  return (
    <>
      <div className="container">
        <h3 className="heading">Select a Project Folder Structure Template</h3>
        <div className="card-grid">
          <div className="card">
            <h2>Template 1</h2>
            <div className="template-description">
              <div className="level-1">Src</div>
              <div className="level-2">components</div>
              <div className="level-3">com1.js</div>
              <div className="level-3">com2.js</div>
              <div className="level-2">services</div>
              <div className="level-3">ser1.js</div>
              <div className="level-3">ser2.js</div>
              <div className="level-2">index.js</div>
              <div className="level-2">App.js</div>
              <div className="level-2">App.css</div>
            </div>
            <button onClick={() => selectTemplate("temp1")}>Select</button>
          </div>
          <div className="card">
            <h2>Template 2</h2>
            <div className="template-description">
              <div className="level-1">Src</div>
              <div className="level-2">components</div>
              <div className="level-3">com1.js</div>
              <div className="level-3">com2.js</div>
              <div className="level-2">pages</div>
              <div className="level-3">type1</div>
              <div className="level-4">page1.js</div>
              <div className="level-4">page2.js</div>
              <div className="level-3">type2</div>
              <div className="level-4">page1.js</div>
              <div className="level-4">page2.js</div>
              <div className="level-2">hooks</div>
              <div className="level-3">hk1.js</div>
              <div className="level-3">hk2.js</div>
              <div className="level-2">index.js</div>
              <div className="level-2">App.js</div>
              <div className="level-2">App.css</div>
            </div>
            <button onClick={() => selectTemplate("temp2")}>Select</button>
          </div>
          <div className="card">
            <h2>Template 3</h2>
            <div className="template-description">
              <div className="level-1">Src</div>
              <div className="level-2">features</div>
              <div className="level-3">module1</div>
              <div className="level-4">components</div>
              <div className="level-5">com1.js</div>
              <div className="level-5">com2.js</div>
              <div className="level-4">services</div>
              <div className="level-5">ser1.js</div>
              <div className="level-5">ser2.js</div>
              <div className="level-3">module2</div>
              <div className="level-4">components</div>
              <div className="level-5">com1.js</div>
              <div className="level-5">com2.js</div>
              <div className="level-4">services</div>
              <div className="level-5">ser1.js</div>
              <div className="level-5">ser2.js</div>
              <div className="level-2">index.js</div>
              <div className="level-2">App.js</div>
              <div className="level-2">App.css</div>
            </div>
            <button onClick={() => selectTemplate("temp3")}>Select</button>
          </div>
        </div>
      </div>
    </>
  );

  function selectTemplate(template) {
    alert(`Selected template: ${template}`);
    // Implement the logic to handle the template selection
    // For example, you can navigate to a different page or send a request to the backend
  }
}

export default FolderTemplate;
