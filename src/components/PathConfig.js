import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"

export default function PathConfig({ paths, tags, selectedPath, ...props }) {
    const [path, setPath] = useState(paths[selectedPath])

    console.log(tags)

    useEffect(() => {
        setPath(paths[selectedPath])
    }, [selectedPath, paths])

    return (
        <div className=" container-fluid h-100">
            <div className="row">
                <h4>
                    {selectedPath}
                </h4>
            </div>
            <div className="row my-2">
                <h5>Request Options</h5>
                <Form className="mx-4">
                    <Form.Check checked={path.get ? true : false} label="get" />
                    <Form.Check checked={path.post ? true : false} label="post" />
                    <Form.Check checked={path.put ? true : false} label="put" />
                    <Form.Check checked={path.patch ? true : false} label="patch" />
                    <Form.Check checked={path.delete ? true : false} label="delete" />
                </Form>
            </div>
            {Object.entries(path).map(([key, value]) =>
                <div className="row border m-2 border-dark">
                    <div className="col">
                        <h6 className="row p-2">
                            {key} Mapping
                        </h6>
                        <div className="row my-1">
                            <div>
                                <label >
                                    Summary :
                                </label>
                                <input className=" w-75 m-1 " value={value.summary} />

                            </div>
                        </div>

                        <div className="row my-1">
                                <label  className=" col-2">
                                    Function Name :
                                </label>
                                <input className=" col m-1 " value={value.operationId} />

                        </div>
                        <div className="row">
                            <label className=" col-1 px-2">
                                Tags:
                            </label>
                            <div className="col">
                                {tags.map((tag) =>
                                    <Form.Check checked={value.tags.includes(tag.name) ? true : false} label={tag.name} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    )
}