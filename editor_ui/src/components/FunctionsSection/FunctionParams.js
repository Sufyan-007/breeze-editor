import { useState } from "react"
import rightArrow from "../../assets/icons/arrow_right_icon.svg"
import downArrow from "../../assets/icons/arrow_down_icon.svg"
import { Form } from "react-bootstrap"

const dataTypes = ["string", "number", "boolean","callback", "array", "object"];

export default function FunctionParams({ param, setParam }) {
    const [showDetails, setShowDetails] = useState(false)

    function updateParam(key, value) {
        param = { ...param, [key]: value }

        setParam(param)
    }

    return (
        <div className=" container ms-2">
            <div className="row">
                <div className="d-flex fs-5" onClick={() => setShowDetails(state => !state)}>
                    <button className=" btn p-0 m-0 shadow-none">
                        {showDetails ?
                            <img src={downArrow} height={20} alt="" />
                            :
                            <img src={rightArrow} height={20} alt="" />
                        }
                    </button>
                    {param.name}
                </div>
            </div>
            {showDetails &&
                <div className="row" >
                    <Form className="col mx-4" >
                        <Form.Group>
                            <Form.Label>
                                Name
                            </Form.Label>
                            <Form.Control size="sm" value={param.name} onChange={(event) => updateParam("name", event.target.value)} />

                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formDataType">
                            <Form.Label>Data Type</Form.Label>
                            <Form.Control
                                as="select"
                                name="datatype"
                                value={param.dataType}
                                onChange={(event)=> updateParam("dataType", event.target.value)}
                            >
                                <option value="">Select a data type</option>
                                {dataTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Description
                            </Form.Label>
                            <Form.Control size="sm" value={param.description} onChange={(event) => updateParam("description", event.target.value)} />

                        </Form.Group>
                    </Form>
                </div>

            }
        </div>
    )
}