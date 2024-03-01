import { useCallback, useRef, useState } from "react"
import { useParams } from "react-router"
import Loader from "./Loader"
import { getServiceConfig, updateServiceConfig } from "../services/ServiceConfigService"
import yaml from "js-yaml"
import ServicePaths from "./ServicePaths"
import SchemaConfig from "./SchemaConfig"
import EntityConfig from "./EntityConfig"
import { Form, Modal } from "react-bootstrap"
import PathConfig from "./PathConfig"


export function ServicePage() {
    const { projectName } = useParams()
    const [serviceConfig, setServiceConfig] = useState()
    const fileInput = useRef()
    const [showModelModal, setShowModelModal] = useState(false)
    const [newModelName, setNewModelName] = useState("")
    const [selected, setSelected] = useState({ type: "", selected: "" })
    

    const loader = useCallback(async () => {
        const services = await getServiceConfig(projectName)
        setServiceConfig(services)
    }, [projectName])

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
            const loadedFile = await readFile(file)
            const config = yaml.load(loadedFile);
            const resp = window.confirm("Update Services? This will overwrite existing config!")
            if (resp) {
                updateService(config)
            }
        } catch (error) {
            alert("Failed to load file, check file syntax: ")
        }
    }

    async function updateService(config) {
        const response = await updateServiceConfig(projectName, config)
        setServiceConfig(response)
    }

    function openFileInput() {
        fileInput.current.click()
    }

    function updateServiceConf(key, value) {
        setServiceConfig((state) => {
            updateService({ ...state, [key]: value })
            return { ...state, [key]: value }
        })
    }

    function updateComponents(key, value) {
        const components = { ...serviceConfig.components, [key]: value }
        updateServiceConf("components", components)
    }

    function closeModal(added) {
        if (added) {
            const newModel = {
                type: "object",
                properties: {},
                required: []
            }
            const name = newModelName.replace(" ", "")
            const schemas = { ...serviceConfig.components.schemas }
            if (name !== "") {
                if (schemas[name]) {
                    alert("Model already exists")
                } else {
                    schemas[name] = newModel
                    updateComponents("schemas", schemas)
                    setNewModelName("")
                    setShowModelModal(false)
                }
            } else {
                alert("Enter a name")
            }


        } else {
            setShowModelModal(false)
        }
    }

    function updateSchema(entityName, newEntity) {
        const schemas = serviceConfig.components.schemas
        schemas[entityName] = newEntity
        updateComponents("schemas", schemas)


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
            <div className="container-fluid d-flex flex-column vh-100">
                <div className="navbar row " style={{ backgroundColor: "#151518" }}>
                    <div className="navbar-brand text-white">
                        Breeze Studio
                    </div>
                </div>

                <div className="row flex-grow-1 overflow-hidden">
                    <div className="col-3   overflow-y-auto h-100 fs-6 text-white" style={{ width: "18rem", backgroundColor: "#303033" }}>
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