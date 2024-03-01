import { useEffect, useState } from "react"
export default function EntityConfig({ schema, selectedEntity,updateSchema, ...props }) {
    const [entityName, setEntityName] = useState(selectedEntity)
    const [entity, setEntity] = useState(schema[selectedEntity])
    const [properties, setProperties] = useState([])
    const [duplicateNames, setDuplicateNames] = useState(false)


    useEffect(()=>{
        setProperties(Object.entries(entity.properties).map(([key, value]) => {
            return { ...value, name: key }
        }))
    },[entity])
    
    useEffect(() => {
        const abort = { aborted: false }; // Initialize the abort object

        const checkDuplicate = async (abort) => {
            const nameSet = new Set();
            for (let obj of properties) {
                if (abort.aborted) {
                    return false;
                }
                if (nameSet.has(obj.name)) {
                    return true;
                } else {
                    nameSet.add(obj.name);
                }
            }
            return false;
        }

        checkDuplicate(abort)
            .then((hasDuplicate) => {
                if(duplicateNames!==hasDuplicate){
                    setDuplicateNames(hasDuplicate)
                }
                
            });

        return () => {
            abort.aborted = true;
        };
    }, [properties,duplicateNames]);

    useEffect(() => {
        setEntityName(selectedEntity)
        setEntity(schema[selectedEntity])
    }, [selectedEntity, schema])

    function updateProperties(index, value) {

        const newProperties = [...properties]
        newProperties[index] = value
        setProperties(newProperties)

    }

    function updatePropertyName(index, name) {
        const property = { ...properties[index], name }
        updateProperties(index, property)
    }

    function updatePropertyType(index, type) {
        const property = { ...properties[index], type }
        updateProperties(index, property)
    }

    function updateDescription(index, description) {
        const property = { ...properties[index], description}
        updateProperties(index,property)
    }

    function addProperty(){
        const property = {
            type:"string",
            name:"newProperty",
            description:"new property"
        }
        setProperties((properties)=>{
            properties.push(property)
            return [...properties]
        })
    }

    function updateEntityDescription(description){
        setEntity(state=>{
            return {...state, description}
        })
    }


    function updateEntity(){
        const propertyObject={}
        properties.forEach((property)=>{
            propertyObject[property.name]={type:property.type,description:property.description,$ref:property["$ref"]}
        })
        const newEntity = {...entity, properties:propertyObject}
        updateSchema(selectedEntity, newEntity)
    }

    return (
        <div className="container-fluid h-100 d-flex flex-column">

            <div className="row">
                <div className="col">
                    <h4 className="">{entityName} Model</h4>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <h5>
                        Description :
                    </h5>
                    <textarea value={entity.description??""} onChange={(event)=>updateEntityDescription(event.target.value)} className=" w-100"></textarea>
                </div>
            </div>

            <div className="my-3 row flex-grow-1">
                <div className="col ">
                    <h5 className="">Properties : </h5>
                    {
                        properties.map((property, index) =>
                            <div className="row my-1 border border-dark">
                                <div className="m-1">
                                    <label className=" ">Name : </label>
                                    <input className="mx-4 border-0 " value={property.name} onChange={(event) => updatePropertyName(index, event.target.value)} />

                                </div>
                                <div className="m-1">
                                    <label>Type : </label>
                                    <select className=" w-25 m-2" value={property.type} onChange={(event) => updatePropertyType(index, event.target.value)}>
                                        <option value="string">String</option>
                                        <option value="number">Number</option>
                                        <option value="array">Array</option>
                                        {Object.keys(schema).map((key) =>
                                            <option value={key}>{key}</option>
                                        )

                                        }
                                    </select>
                                </div>

                                {property.type === "array" ?

                                    <div className="m-1">
                                        <label>Ref : </label>
                                        <select className=" w-25 m-2" value={property.items["$ref"].split('/').slice(-1)[0]} >
                                            <option value="string">String</option>
                                            <option value="number">Number</option>
                                            {Object.keys(schema).map((key) =>
                                                <option value={key}>{key}</option>
                                            )

                                            }
                                        </select>
                                    </div>

                                    : null}

                                <div className="d-flex m-1 ">
                                    <div className="">
                                        Description :
                                    </div>
                                    <textarea value={property.description??""} rows={1} placeholder="(optional)" onChange={(event)=>updateDescription(index,event.target.value)} className=" w-50 mx-2 m-1" />
                                </div>

                            </div>
                        )
                    }
                    {duplicateNames ?
                        <div className=" text-danger">
                            Properties cannot have duplicate names and will be overwritten
                        </div>
                        : null}

                    <button className="btn btn-secondary btn-sm m-2" onClick={addProperty}>Add property</button>
                </div>
            </div>


            <div className="row ">
                <div className="my-3">
                    <button className="btn btn-primary row" onClick={updateEntity}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
}