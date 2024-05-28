import { useState } from "react"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import { Form } from "react-bootstrap"
import { addComponent } from "../services/ComponentConfigService"
import { useParams } from "react-router"
import { router } from "../App"

export default function AddNewComponent() {
    const { projectName } = useParams()
    const [expanded, setExpanded] = useState(false)
    const [newComponent, setNewComponent] = useState({
        name: "",
        type: "CUSTOM",
        route: ""
    })
    const [disableButton, setDisableButton] = useState(false)

    function setComponentName(name) {
        name = (name.charAt(0).toUpperCase() + name.slice(1)).trim()
        setNewComponent(state => {
            return { ...state, name }
        })
    }

    function setComponentType(type) {
        setNewComponent(state => {
            return { ...state, type }
        })
    }

    function setComponentRoute(route) {
        setNewComponent(state => {
            return { ...state, route }
        })
    }

    function addComp(event) {
        event.preventDefault()
        setDisableButton(true)
        addComponent(newComponent.name, newComponent.type, newComponent.route, projectName).then(res => {
            alert("Component added successfully")
            router.navigate("/project/" + projectName + "/component/" + res.comp)
        })
    }

    return (
        <div className={"container rounded-2 " + (expanded ? " bg-dark" : "")} >
            <div className="row px-2 ">
                <div className="d-flex btn text-white mb-3" onClick={() => setExpanded(state => !state)}>
                    <div className=" p-0 m-0 shadow-none" >
                        {expanded ?
                            <img src={downArrow} height={30} alt="" />
                            :
                            <img src={rightArrow} height={30} alt="" />
                        }
                    </div>
                    Add New Component
                </div>
            </div>
            {expanded &&
                <Form className="row my-2">
                    <Form.Group className="m-2">
                        <Form.Label>
                            Name
                        </Form.Label>
                        <Form.Control className=" w-50" value={newComponent.name} onChange={(event) => setComponentName(event.target.value)} />
                    </Form.Group>
                    <Form.Group >
                        <Form.Label className="m-2">
                            Component Type :
                        </Form.Label>
                        <Form.Check type="radio" checked={newComponent.type === "CUSTOM"} label="Custom" name="type" inline onChange={() => setComponentType("CUSTOM")} />
                        <Form.Check type="radio" checked={newComponent.type === "PAGE"} label="Page" name="type" inline onChange={() => setComponentType("PAGE")} />

                    </Form.Group>
                    {newComponent.type === "PAGE" &&
                        <Form.Group className=" m-2">
                            <Form.Label>
                                Route :
                            </Form.Label>
                            <Form.Control value={newComponent.route} onChange={(event) => setComponentRoute(event.target.value)} />
                        </Form.Group>
                    }
                    <div className=" m-2">
                        <button disabled={disableButton} className=" btn btn-primary" onClick={addComp} >ADD COMPONENT </button>
                    </div>
                </Form>
            }
        </div>
    )
}