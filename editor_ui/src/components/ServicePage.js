import { useRef, useState , useEffect} from "react";
import CustomPanel from "./CustomPanel";
import ApiList from "./ApiList";
import ServicePageSidebar from "./ServicePageSidebar";

export function ServicePage() {
  const fileInputYAML = useRef(null); // this is created to reference the file input element .
  const fileInputPostman = useRef(null);
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [yamlApis, setYamlApis] = useState([]); // State to store the list of YAML APIs
  const [yamlUploaded, setYamlUploaded] = useState(false);

  const fields = [
      { id: 'operation_id', label: 'Operation ID', type: 'text' },
      { id: 'tags', label: 'Tags', type: 'text' },
      { id: 'summary', label: 'Summary', type: 'text' },
    ];

  useEffect(()=>{
     if (showCustomPanel) {
       setYamlUploaded(false);
     }
  },[showCustomPanel]);

  async function fileUpload(file, fileType) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      let apiUrl = "";
      if (fileType === "yaml") {
        apiUrl =
          "http://127.0.0.1:8000/api-client-generator/convert-starndard-json/openapi";
      } else if (fileType === "postman") {
        apiUrl =
          "http://127.0.0.1:8000/api-client-generator/convert-starndard-json/postman";
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setYamlUploaded(true);
        const responseData = await response.json();
        setYamlApis(responseData);
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (error) {
      alert("Failed to load file, check file syntax");
      console.error(error);
    }
  }

  function openFileInput(fileType) {
    if (fileType === "yaml") {
      fileInputYAML.current.click();
    } else if (fileType === "postman") {
      fileInputPostman.current.click();
    }
  }

  const handleCustomButtonClick = () => {
    setShowCustomPanel(!showCustomPanel);
  };
  // console.log(yamlUploaded, "YAML UPLOADED true or false");
  // console.log(yamlApis, "YAML APIS DATA");

  return (
    // <Loader loader={loader}>
    <>
      <div className="container-fluid d-flex flex-column vh-100 bg-dark ">
        <div className="row flex-grow-1 overflow-hidden  "style={{backgroundColor:"#303033"}}>
          <ServicePageSidebar
            openFileInput={openFileInput}
            fileInputYAML={fileInputYAML}
            fileInputPostman={fileInputPostman}
            fileUpload={fileUpload}
            yamlUploaded={yamlUploaded}
            handleCustomButtonClick={handleCustomButtonClick}
            // yamlApis={yamlApis}
          />

          <div className="col-9 overflow-y-auto h-100 fs-6 text-light">
            {showCustomPanel && (
              <div className="custom-panel-container">
                <CustomPanel 
                  fields={fields}/>
              </div>
        
            )}
            {/* {yamlUploaded && (
              <div>
                <ApiList apis={yamlApis} />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
}
export default ServicePage;
