import { ServiceContext } from "../store/Context"
import { useContext, useEffect, useState } from "react"
import { Form } from "react-bootstrap"
export default function ElementConfig({ ...props }) {

    const { sidebarService } = useContext(ServiceContext)
    const [selectedElem, setSelectedElement] = useState(null)
    const elem = selectedElem?.elem
    const update = selectedElem?.updateSub

    useEffect(() => {
        console.log("Use Effect")
        sidebarService.getSelectedElem().subscribe((elem) => {
            setSelectedElement(elem)
        })
    }, [sidebarService, setSelectedElement])


    function updateElem(key, value) {
        setSelectedElement((selectedElem) => {
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



    if (!elem) {
        return null
    }
    if (elem.type !== "Element") {

        return null
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
                                <Form.Control disabled size="sm" value={elem.attributes?.id?.value} placeholder="Id (mandatory)" />
                            </Form.Group>
                        </Form>
                        <div className="row border-1 my-2 border-top border-bottom border-white">
                            <div className="col">Attributes</div>
                        </div>
                        <Form>
                            {Object.entries(elem.attributes).map(([k, v]) => {
                                if (k !== "id") {
                                    return (
                                        <Form.Group className="my-2">
                                            <Form.Label className="my-0 " style={{ fontSize: "14px" }}>
                                                {k}
                                            </Form.Label>
                                            <Form.Control size="sm" value={v.value} onChange={(event) => updateLiteralAtrribute(k, event.target.value)} />
                                        </Form.Group>
                                    )
                                }else return null
                            })

                            }
                        </Form>
                        <div className="row my-3">
                            <div>
                                <button className="btn btn-secondary btn-sm">
                                    Add Attribute
                                </button>
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
                        <div className="row">
                            <div>
                                <button className="btn btn-secondary btn-sm">
                                    Event Listener
                                </button>
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