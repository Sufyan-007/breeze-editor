import { useState, useEffect } from "react"
import { Form } from "react-bootstrap"
export default function ReducerConfig({ reducerConfig, update, ...props }) {

    const [reducer, setReducer] = useState(reducerConfig)


    useEffect(() => {
        setReducer(reducerConfig)
    }, [reducerConfig])

    function updateReducer(key, value) {
        setReducer((reducer) => {
            return { ...reducer, [key]: value }
        })
    }

    function updateName(name) {
        name = name.replace(" ", "")
        updateReducer("name", name)
        updateReducer("containingFile", "reducer/" + (name[0]??'r').toUpperCase() + name.slice(1) + ".js")
    }

    function updateReducerName(index,name){
        const reducers= [...reducer.reducers]
        const r = {...reducers[index],name}
        reducers[index] = r
        updateReducer("reducers",reducers)
    }
    function updateReducerLogic(index,logic){
        const reducers= [...reducer.reducers]
        const r = {...reducers[index],logic}
        reducers[index] = r
        updateReducer("reducers",reducers)
    }

    function addReducer(){
        const reducers = [...reducer.reducers]
        const newReducer ={
            "name": "setState",
            "$id": "REDUCER/UUID"+(reducers.length+1),
            "parameters": [{ "name": "action" }],
            "isAsync": false,
            "logic": "state.value = action.payload;"
        }
        reducers.push(newReducer)
        updateReducer("reducers",reducers)
    }

    return (
        <div className="container h-100 d-flex flex-column">
            <h2 className="my-2 mb-3 row">Reducer Config</h2>

            <div className="row">
                <h5 className="p-0 ms-2">Name : </h5>
                <Form.Control value={reducer.name} onChange={(event) => updateName(event.target.value)} />

            </div>

            <div className="row">
                <h5 className="p-0 ms-2">Initial State : </h5>
                <Form.Control value={reducer.initialState} onChange={(event) => updateReducer("initialState", event.target.value)} />
            </div>

            <div className="my-3 row flex-grow-1">
                <div className="col ">
                    <h5 className="">Reducers : </h5>
                    {
                        reducer.reducers.map((reducer, index) =>
                            <div className="row my-1 border border-dark">
                                <div className="m-2">
                                    <label htmlFor="name m-2">Name : </label>
                                    <input className="mx-4 border-0 " value={reducer.name} onChange={(event) => updateReducerName(index,event.target.value)} />
                                    <div className="my-2">
                                        Logic :
                                    </div>
                                    <textarea className="w-50" value={reducer.logic} onChange={(event) => updateReducerLogic(index,event.target.value)}/>
                                </div>

                            </div>
                        )
                    }
                    <button className="btn btn-secondary btn-sm m-2" onClick={()=>{addReducer()}}>Add reducer</button>
                </div>
            </div>

            <div className="row ">
                <div className="my-3">
                    <button className="btn btn-primary row" onClick={() => update(reducer)}>
                        Update
                    </button>
                </div>
            </div>
        </div>
    )
}