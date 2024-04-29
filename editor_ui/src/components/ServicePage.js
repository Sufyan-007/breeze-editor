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

    return (
        <Loader loader={loader}>
            <Modal show={showModelModal} onHide={() => closeModal(false)}>
                <Modal.Header>
                    <h4 className="m-0">Add Model</h4>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Label>
                            Name
                        </Form.Label>
                        <Form.Control value={newModelName} onChange={(event) => setNewModelName(event.target.value)} />
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => closeModal(false)}>
                        Close
                    </button>

                    <button className="btn btn-primary" onClick={() => closeModal(true)}>
                        Add
                    </button>
                </Modal.Footer>
            </Modal>
            <div className="container-fluid d-flex flex-column h-100">


                <div className="row flex-grow-1 overflow-hidden">
                    <div className="col-3   overflow-y-auto h-100 fs-6 text-white" style={{ width: "18rem", backgroundColor: "#303033" }}>
                        <div className="d-flex m-1 fw-bold fs-5">
                            Service Configuration
                        </div>
                        <ServicePaths setSelected={setSelected} selected={selected} tags={serviceConfig?.tags} paths={serviceConfig?.paths} className="row my-2 border-bottom border-black" />
                        <SchemaConfig setSelected={setSelected} selected={selected} addModel={() => { setShowModelModal(true) }} schemas={serviceConfig?.components?.schemas} className="row my-2 border-bottom border-black" />

                        <div className="row p-2">
                            <button className="btn btn-secondary" onClick={openFileInput}>
                                Upload YAML Config
                            </button>
                            <input ref={fileInput} type="file" accept=".yaml, .yml , .json" hidden onChange={(event) => fileUpload(event.target.files[0])} />
                        </div>
                    </div>
                    <div className="col  overflow-y-auto h-100 bg-dark-subtle">
                        {selected.type === "tag" ?
                            <PathConfig paths={serviceConfig.paths} tags={serviceConfig.tags} selectedPath={selected.selected} />
                            : null}
                        {selected.type === "schema" ?
                            <EntityConfig schema={serviceConfig.components?.schemas} selectedEntity={selected.selected} updateSchema={updateSchema} />
                            : null}
                    </div>
                </div>
            </div>
        </Loader>
    )
}
