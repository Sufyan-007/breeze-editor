import { useRef, useState, useEffect } from "react";

import ApiList from "./ApiList";
import ServicePageNavbar from "./ServicePageNavbar";
import Custom from "./Custom";

export function ServicePage() {
  const fileInputYAML = useRef(null); // this is created to reference the file input element .
  const fileInputPostman = useRef(null);
  const [showCustomPanel, setShowCustomPanel] = useState(false);
  const [yamlApis, setYamlApis] = useState({}); // State to store the list of YAML APIs
  const [yamlUploaded, setYamlUploaded] = useState(false);
  const [postmanApis, setPostmanApis] = useState({}); //state to store the list of postman collection APis
  const [postmanUploaded, setPostmanUploaded] = useState(false);
  const [tagsList, setTagsList] = useState([]);

  useEffect(() => {
    if (yamlUploaded && yamlApis) {
      const tags = getAllTagsFromYamlApis(yamlApis);
      setTagsList(tags);
      // console.log(tags, "tags in use effect");
    }
  }, [yamlUploaded, yamlApis]);

  function getAllTagsFromYamlApis(yamlApis) {
    if (yamlApis && yamlApis.data) {
      const data = yamlApis.data;
      const tagsList = [];

      for (const dataArray of data) {
        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const item = dataArray[0];

          if (item.tags && Array.isArray(item.tags) && item.tags.length > 0) {
            for (const tag of item.tags) {
              tagsList.push(tag);
            }
          }
        }
      }
      // console.log(tagsList, "tagsList");
      return tagsList;
    }
  }

  const allTags = getAllTagsFromYamlApis(yamlApis);
  // console.log(allTags, "Tags in yaml ");

  const dummyData = {
    operation_id: "get orders",
    tags: [],
    request: {
      method: "get",
      auth: null,
      headers: [
        {
          key: "Authorization",
          value:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzA2MTU1MjQ2LCJpYXQiOjE3MDM1NjMyNDYsImp0aSI6IjQ5YTliZWJjNWE0MzRkMjhhNjA5N2U4NDU0MjgzNGM1IiwidXNlcl9pZCI6MX0.Dc8mA704kS_ZgzuPnYmE7w7Kt0GWKR-oVgyOpi2O-2U",
        },
      ],
      parameters: [],
      url: {
        baseurl: "{{url}}/api/orders/7",
        host: ["{{url}}"],
        protocol: "",
        port: 0,
        path: ["api", "orders", "7"],
      },
      body: [],
    },
    response: [],
    summary: "",
  };

  async function fileUpload(file, fileType, appName) {
    try {
      const formData = new FormData();
      formData.append("file", file);

      let apiUrl = "";
      if (fileType === "yaml") {
        apiUrl =
          `http://127.0.0.1:8000/api-client-generator/convert-starndard-json/openapi/${appName}`;
      } else if (fileType === "postman") {
        apiUrl =
        `http://127.0.0.1:8000/api-client-generator/convert-starndard-json/postman/${appName}`;
      }

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const responseData = await response.json();

        if (fileType === "yaml") {
          setYamlApis(responseData);
          setYamlUploaded(true);
        } else if (fileType === "postman") {
          setPostmanApis(responseData);
          setPostmanUploaded(true);
        }
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
      setShowCustomPanel(false);
      setPostmanUploaded(false);
    } else if (fileType === "postman") {
      fileInputPostman.current.click();
      setShowCustomPanel(false);
      setYamlUploaded(false);
    }
  }

  const handleCustomButtonClick = () => {
    setShowCustomPanel((prevState) => !prevState);
    setYamlUploaded(false);
    setPostmanUploaded(false);
  };

  // console.log(yamlUploaded, "YAML UPLOADED true or false");
  // console.log(yamlApis, "YAML APIS DATA IN service page ");

  return (
    // <Loader loader={loader}>
    <>
      <div className="container-fluid d-flex flex-column vh-100  " >
        {/* <ServicePageNavbar
          openFileInput={openFileInput}
          fileInputYAML={fileInputYAML}
          fileInputPostman={fileInputPostman}
          fileUpload={fileUpload}
          yamlUploaded={yamlUploaded}
          handleCustomButtonClick={handleCustomButtonClick}
        /> */}
        <div
          className="row flex-grow-1 overflow-hidden  "
          style={{ backgroundColor: "#303033" }}
        >
          {/* <Custom dummyData={dummyData} /> */}
          <div className="col-9 overflow-y-auto h-100 fs-6 text-light">
            {showCustomPanel && (
              <div className="custom-panel-container">
                {/* <CustomPanel dummyData={dummyData} /> */}
              </div>
            )}
            {yamlUploaded && (
              <div>
                <ApiList apis={yamlApis} tagsList={tagsList} />
              </div>
            )}
            {postmanUploaded && (
              <div>
                <ApiList apis={postmanApis} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ServicePage;
