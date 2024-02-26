import { ServiceContext } from "../store/Context"
import { useContext, useEffect, useState } from "react"
import { Form } from "react-bootstrap"
import ExpressionConfig from "./ExpressionConfig"
export default function ElementConfig({ ...props }) {

    const { sidebarService } = useContext(ServiceContext)
    const [selectedElem, setSelectedElement] = useState(null)
    const elem = selectedElem?.elem
    const update = selectedElem?.updateSub
    const component = selectedElem?.component


    useEffect(() => {
        sidebarService.getSelectedElem().subscribe((elem) => {
            setSelectedElement(elem)
        })
    }, [sidebarService, setSelectedElement])


    function updateElem(key, value) {
        
        setSelectedElement((selectedElem) => {
            // console.log({ ...selectedElem, elem: { ...elem, [key]: value } })
            return { ...selectedElem, elem: { ...elem, [key]: value } }
        })
    }

    function updateAttribute(key, value) {
        const attributes = { ...elem.attributes, [key]: value }
        updateElem("attributes", attributes)
    }

    function updateLiteralAtrribute(key, value) {
        const val = { type: "LITERAL", value }
        updateAttribute(key, val)
    }

    function updateVariableAttribute(key, value) {
        const val = { type: "VARIABLE", value }
        updateAttribute(key, val)
    }

    function updateFunctionAttribute(key, $ref) {
        var val
        if ($ref) {
            val = { type: "FUNCTION", $ref }
        }
        else{
            val = { type: "FUNCTION", value:{
                
                "parameters": { "list": ["event"] },
                "isAnonymous": true,
                "isAsync": false,
                "body": "console.log(event)"
              }}
        }
        updateAttribute(key, val)
    }

    function addAttribute(attr) {
        if (!elem.attributes[attr]) {
            updateLiteralAtrribute(attr, "")
        }
    }
    function addVariableAttribute(attr, val = "") {
        if (!elem.attributes[attr]) {
            updateVariableAttribute(attr, val)
        }
    }

    function removeAttribute(key) {
        const attributes = { ...elem.attributes }
        delete attributes[key]
        updateElem("attributes", attributes)
    }

    function changeAttributeType(key, variable) {
        const type = variable ? "VARIABLE" : "LITERAL"
        const val = { ...elem.attributes[key], type }
        updateAttribute(key, val)
    }

    if (!elem) {
        return null
    }
    if (elem.type === "text") {
        return (
            <div {...props}>
                <div className="container-fluid text-white h-100 p-0 d-flex flex-column">
                    <div className="row  p-1 border-bottom border-white">
                        <button className=" btn-close btn-close-white" onClick={() => sidebarService.setSelectedElem(null)}>
                        </button>
                        Text
                    </div>
                    <div className="row my-2 px-1">
                        <textarea value={elem.text} onChange={(event) => { updateElem("text", event.target.value) }} >
                        </textarea>
                    </div>

                    <div className="row  py-2">
                        <div className="d-flex justify-content-around">
                            <button className=" btn btn-sm btn-secondary" onClick={() => sidebarService.setSelectedElem(null)}>
                                Cancel
                            </button>
                            <button className=" btn btn-sm btn-primary" onClick={() => update.next(elem)}>
                                Update
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
    if (elem.type === "Expression") {

        return (
            <div {...props}>
                <div className="container-fluid text-white h-100 p-0 d-flex flex-column">
                    <div className="row  p-1 border-bottom border-white">
                        <button className=" btn-close btn-close-white" onClick={() => sidebarService.setSelectedElem(null)}>
                        </button>
                        Text
                    </div>
                    <ExpressionConfig elem={elem} updateElem={updateElem} className="row flex-grow-1 my-1" />

                    <div className="row  py-2">
                        <div className="d-flex justify-content-around">
                            <button className=" btn btn-sm btn-secondary" onClick={() => sidebarService.setSelectedElem(null)}>
                                Cancel
                            </button>
                            <button className=" btn btn-sm btn-primary" onClick={() => update.next(elem)}>
                                Update
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
    return (
        <div {...props}>
            <div className="container-fluid text-white h-100 p-0 d-flex flex-column">
                <div className="row  p-1 border-bottom border-white">
                    <button className=" btn-close btn-close-white" onClick={() => sidebarService.setSelectedElem(null)}>
                    </button>
                    {elem.attributes?.id?.value}
                </div>
                <div className="row flex-grow-1">
                    <div className="col">
                        <Form className="text-white">
                            <Form.Group className="my-2 ">
                                <Form.Label className="my-0 " style={{ fontSize: "14px" }}>
                                    Tag Name
                                </Form.Label>
                                <Form.Control size="sm" value={elem.tagName} onChange={(event) => updateElem("tagName", event.target.value)} placeholder="tagname" />
                            </Form.Group>
                            <Form.Group className="my-2">
                                <Form.Label className="my-0 " style={{ fontSize: "14px" }}>
                                    Id
                                </Form.Label>
                                <Form.Control size="sm" value={elem.attributes?.id?.value} placeholder="Id (mandatory)" />
                            </Form.Group>
                        </Form>
                        <div className="row border-1 my-2 border-top border-bottom border-white">
                            <div className="col">Attributes</div>
                        </div>
                        <Form>
                            {Object.entries(elem.attributes).map(([k, v]) => {
                                if (k !== "id" && k.slice(0, 2) !== "on") {
                                    return (
                                        <Form.Group className="my-2">
                                            <Form.Label className="my-0 d-flex " style={{ fontSize: "14px" }}>
                                                {k}
                                                <Form.Check className="mx-2 " label="expression" checked={v.type === "VARIABLE"} onChange={(event) => changeAttributeType(k, event.target.checked)} />
                                            </Form.Label>
                                            <Form.Control size="sm" value={v.value} onChange={(event) => updateLiteralAtrribute(k, event.target.value)} />
                                        </Form.Group>
                                    )
                                } else return null
                            })
                            }
                        </Form>
                        <div className="row my-3">
                            <div className="px-3">
                                <Form.Select className="bg-dark-subtle  " size="sm" onChange={(event) => { addAttribute(event.target.value); event.target.selectedIndex = 0; }}>
                                    <option selected disabled hidden>Add Attributes</option>
                                    <option value="className">ClassName</option>
                                    <option value="src">src</option>
                                    <option value="value">value</option>
                                    <option value="config">config</option>
                                    <option value="height">height</option>
                                    <option value="component">component</option>
                                    <option value="Val">Val</option>
                                    <option value="project">project</option>
                                </Form.Select>
                            </div>

                        </div>
                        <div className="row border-1 my-3 border-top border-bottom border-white">
                            <div className="col">Styles</div>
                        </div>
                        <div className="row">
                            <div>
                                <button className="btn btn-secondary btn-sm">
                                    Add Style
                                </button>
                            </div>
                        </div>
                        <div className="row border-1 my-3 border-top border-bottom border-white">
                            <div className="col">Event Listeners</div>
                        </div>
                        <div className="row my-1">
                            {Object.entries(elem.attributes).map(([k, v]) => {
                                if (k.slice(0, 2) === "on") {
                                    return (
                                        <div key={k} className="my-1 px-0 d-flex">
                                            <button className="btn mx-1 btn-close-white btn-close" onClick={() => removeAttribute(k)}></button>
                                            <div style={{ fontSize: "15px" }}>{k}:</div>
                                            <Form.Select className="mx-2 bg-dark-subtle" size="sm" value={v.$ref} onChange={(event) => { updateFunctionAttribute(k, event.target.value) }}>
                                                <option value="" >console.log</option>
                                                {
                                                    component.functions.map((func) =>
                                                        <option key={func.name} value={func.$id}>{func.name}</option>
                                                    )
                                                }
                                            </Form.Select>
                                        </div>
                                    )
                                } else return null
                            })}
                        </div>
                        <div className="row">
                            <div className="px-3">
                                <Form.Select className=" bg-dark-subtle" size="sm" onChange={(event) => { addVariableAttribute(event.target.value, "console.log"); event.target.selectedIndex = 0; }}>
                                    <option selected disabled hidden>Add Listener</option>
                                    <option value="onClick">onClick</option>
                                    <option value="onChange">onChange</option>
                                    <option value="onFocus">onFocus</option>
                                </Form.Select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row  py-2 border-top border-black">
                    <div className="d-flex justify-content-around">
                        <button className=" btn btn-sm btn-secondary" onClick={() => sidebarService.setSelectedElem(null)}>
                            Cancel
                        </button>
                        <button className=" btn btn-sm btn-primary" onClick={() => update.next(elem)}>
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}