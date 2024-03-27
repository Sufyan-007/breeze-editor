import { useRef, useState , useEffect} from "react";
import CustomPanel from "./CustomPanel";
import ApiList from "./ApiList";
import ServicePageSidebar from "./ServicePageSidebar";

export function ServicePage() {
  const fileInputYAML = useRef(null); // this is created to reference the file input element .
  const fileInputPostman = useRef(null);
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [yamlApis, setYamlApis] = useState({}); // State to store the list of YAML APIs
  const [yamlUploaded, setYamlUploaded] = useState(false);

 const dummyData = {
        "operation_id": "get orders",
        "tags": [],
        "request": {
            "method": "get",
            "auth": null,
            "headers": [
                {
                    "key": "Authorization",
                    "value": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA2MTU1MjQ2LCJpYXQiOjE3MDM1NjMyNDYsImp0aSI6IjQ5YTliZWJjNWE0MzRkMjhhNjA5N2U4NDU0MjgzNGM1IiwidXNlcl9pZCI6MX0.Dc8mA704kS_ZgzuPnYmE7w7Kt0GWKR-oVgyOpi2O-2U"
                }
            ],
            "parameters": [],
            "url": {
                "baseurl": "{{url}}/api/orders/7",
                "host": [
                    "{{url}}"
                ],
                "protocol": "",
                "port": 0,
                "path": [
                    "api",
                    "orders",
                    "7"
                ]
            },
            "body": []
        },
        "response": [],
        "summary": ""
    
 };

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
        const responseData = await response.json();
        console.log(responseData)
        setYamlApis(responseData);
                setYamlUploaded(true);

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
  console.log(yamlUploaded, "YAML UPLOADED true or false");
  console.log(yamlApis, "YAML APIS DATA IN service page ");

  return (
    // <Loader loader={loader}>
    <>
      <div className="container-fluid d-flex flex-column vh-100 bg-dark ">
        <div
          className="row flex-grow-1 overflow-hidden  "
          style={{ backgroundColor: "#303033" }}
        >
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
                <CustomPanel dummyData={dummyData} />
              </div>
            )}
            {yamlUploaded && (
              <div>
                <ApiList apis={yamlApis} />
              
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default ServicePage;
