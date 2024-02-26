import { useEffect, useState } from "react"
import { Form } from "react-bootstrap"

export default function StoreConfig({ storeConfig,update, reducers, ...props }) {

    const [store, setStore] = useState(storeConfig)

    useEffect(() => {
        setStore(storeConfig)
    }, [storeConfig])

    function updateStore(key, value) {
        setStore((store) => {
            return { ...store, [key]: value }
        })
    }

    function updateName(name) {
        name = name.replace(" ", "")
        updateStore("name", name)
        updateStore("containingFile", name[0]??'s'.toUpperCase() + name.slice(1) + ".js")
    }

    function updateReducerName(index,name){
        const red= [...store.reducer]
        const r = {...red[index],name}
        red[index] = r
        updateStore("reducer",red)
    }
    function updateReducerValue(index,value){
        const red= [...store.reducer]
        const r = {...red[index],value}
        red[index] = r

        const importedReducers = [...store.imports.reducer]
        if(!importedReducers.includes(value)){
            importedReducers.push(value)
            updateStore("imports",{...store.imports,reducer:importedReducers})
        }

        updateStore("reducer",red)
    }

    function addReducer(){
        console.log("addReducer")
        const red = [...store.reducer]
        red.push({name:"",value:Object.keys(reducers)[0]})
        updateStore("reducer",red)
    }

    function removeReducer(index){
        const red = [...store.reducer]
        red.splice(index,1)
        updateStore("reducer",red)
    }
    

    return (
        <div className="container h-100 d-flex flex-column">
            <h2 className="my-2 mb-3 row">Store Config</h2>

            <div className="row">
                <h5 className="p-0">Name : </h5>
                <Form.Control value={store.name} onChange={(event) => updateName(event.target.value)} />

            </div>

            <div className="my-3 row flex-grow-1">
                <div className="col ">
                    <h5 className="">Reducers : </h5>
                    {store.reducer.map((reducer,index) =>
                        <div  className="row my-1 border border-dark">
                            <div className="m-2">
                                <label htmlFor="name m-2">Name : </label>
                                <input className="mx-4 border-0 " value={reducer.name} onChange={(event)=>updateReducerName(index,event.target.value)}/>
                            </div>
                            <div className="m-2">
                                <label htmlFor="name m-2">Reducer : </label>
                                <select className="mx-2 border-0 " value={reducer.value} onChange={(event) => updateReducerValue(index,event.target.value)}>
                                    <option hidden  value={reducer.value}>{reducers[reducer.value]?.name ?? reducer.value}</option>
                                    {Object.entries(reducers).map(([key, red]) =>
                                        <option value={key}>{red.name}</option>
                                    )
                                    }
                                </select>
                            </div>
                            <div>
                                <button className="btn btn-danger m-1 btn-sm p-1" onClick={()=>removeReducer(index)}>
                                    remove
                                </button>
                            </div>
                        </div>
                    )
                    }
                    <button className="btn btn-secondary btn-sm m-2" onClick={()=>{addReducer()}}>Add reducer</button>
                </div>
            </div>

            <div className="row ">
                <div className="my-3">
                    <button className="btn btn-primary row" onClick={()=>update(store)}>
                        Update
                    </button>
                </div>
            </div>

        </div>
    )
}