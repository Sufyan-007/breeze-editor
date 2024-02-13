import { Form } from "react-bootstrap"

export default function ExpressionConfig({ elem, updateElem, ...props }) {
    const exp = elem.children[0]

    function changeVariable(k, v) {
        const e = { ...exp, [k]: v }
        updateElem("children", [e])
    }

    function changeType(type) {
        var e;
        if (type === "map") {
            e = {
                "type": "map", "variable": "[]",  
                "children": [{
                    "type": "Element",
                    "attributes": {
                        "className": { "type": "LITERAL", "value": "" },
                        "id": { "type": "LITERAL", "value": elem.id + "-MP" },
                    },
                    "tagName": "div",
                    "children": [{"type":"text","text":"Hello"}]
                }]
            }
        }
        else if (type === "condition") {
            e = {
                "type": "condition", "variable": "true",
                "trueCase": {
                    "type": "Element",
                    "attributes": {
                        "className": { "type": "LITERAL", "value": "" },
                        "id": { "type": "LITERAL", "value": elem.id + "-TC" },
                    },
                    "tagName": "div",
                    "children": [{"type":"text","text":"True"}]
                },
                "falseCase":
                {
                    "type": "Element",
                    "attributes": {
                        "className": { "type": "LITERAL", "value": "" },
                        "id": { "type": "LITERAL", "value": elem.id + "-FC" },
                    },
                    "tagName": "div",
                    "children": [{"type":"text","text":"False"}]
                }
            }
        }
        else {
            e = { "type": "code", "code": "" }
        }
        updateElem("children", [e])
    }
    return (
        <div {...props}>
            <div className="col">
                <Form>
                    <Form.Group>
                        <Form.Label>
                            Type
                        </Form.Label>
                        <Form.Select value={exp.type} onChange={(event) => changeType(event.target.value)}>
                            <option value="code">Code</option>
                            <option value="map">Map</option>
                            <option value="condition">Condition</option>
                        </Form.Select>
                    </Form.Group>
                    {exp.type === "code" ?
                        <Form.Group>
                            <Form.Label>
                                Code
                            </Form.Label>
                            <Form.Control value={exp.code} onChange={(event) => changeVariable("code", event.target.value)} />
                        </Form.Group>
                        :
                        <Form.Group>
                            <Form.Label>
                                Variable
                            </Form.Label>
                            <Form.Control value={exp.variable} onChange={(event) => changeVariable("variable", event.target.value)} />
                        </Form.Group>
                    }
                </Form>
            </div>
        </div>
    )
}