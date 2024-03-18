import { useRef, useState } from "react";
import CustomPanel from "./CustomPanel";

export function ServicePage() {
  const fileInputYAML = useRef(null); // this is created to reference the file input element .
  const fileInputPostman = useRef(null);
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [showApiClientButtons, setShowApiClientButtons] = useState(false);

  //this function is defined to asynchronously read the content of a file
  const readFile = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsText(file);
    });
  };

  async function fileUpload(file) {
    try {
      console.log("YAML file", file);
      // const loadedFile = await readFile(file);
      // const config = yaml.load(loadedFile);
    } catch (error) {
      alert("Failed to load file, check file syntax:");
    }
  }
  //this func programmatically triggers a click event on the file event , opening the file selection dialog
  function openFileInput() {
    fileInputYAML.current.click();
  }

  function openFileInputPostman() {
    fileInputPostman.current.click();
  }

  async function fileUploadPostman(file) {
    console.log("postman collections file", file);
  }
  const handleCustomButtonClick = () => {
    setShowCustomPanel(!showCustomPanel);
  };

  return (
    // <Loader loader={loader}>
    <>
      <div className="container-fluid d-flex flex-column vh-100 bg-dark">
        <div className="row flex-grow-1 overflow-hidden">
          <div
            className="col-3 overflow-y-auto h-100 fs-6 text-white"
            style={{ width: "18rem", backgroundColor: "#303033" }}
          >
            <div className="d-flex m-1 fw-bold fs-5">Service Configuration</div>
            {showApiClientButtons ? (
              <div className="row p-2">
                <div className="row p-2">
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={openFileInput}
                  >
                    Upload YAML Config
                  </button>
                  <input
                    ref={fileInputYAML}
                    type="file"
                    accept=".yaml, .yml"
                    hidden
                    onChange={(event) => fileUpload(event.target.files[0])}
                  />
                </div>
                <div className="row p-2">
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={openFileInputPostman}
                  >
                    Upload Postman Collections
                  </button>
                  <input
                    ref={fileInputPostman}
                    type="file"
                    accept=".json"
                    hidden
                    onChange={(event) =>
                      fileUploadPostman(event.target.files[0])
                    }
                  />
                </div>
                <div className="row p-2 d-flex justify-content-center">
                  <button
                    className="btn btn-secondary ms-2"
                    onClick={handleCustomButtonClick}
                  >
                    Custom
                  </button>
                </div>
              </div>
            ) : (
              // Render the button to trigger API client generation
              <div className="row p-2">
                <button
                  variant="secondary"
                  className="btn btn-primary"
                  onClick={() => setShowApiClientButtons(true)}
                >
                  Methods for API Client Generation
                </button>
              </div>
            )}
          </div>
          <div className="col-9 overflow-y-auto h-100 fs-6 text-white">
            {showCustomPanel && (
              <div
                className="custom-panel-container"
              >
                <CustomPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
