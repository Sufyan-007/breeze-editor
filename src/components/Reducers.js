export default function Reducers({ reducerConfig, addReducerConfig, setSelected, selected, ...props }) {

    function select(key) {
        setSelected({ type: "reducer", key })
    }

    function addReducer() {
        const length = Object.keys(reducerConfig).length + 1
        const id = "reducer_uuid" + length
        const reducer = {
            "name": "reducerSlice",
            "containingFile": "reducer/ReducerSlice.js",
            "stateVarName": "value",
            "initialState": "{}",
            "reducers": [
            ],
            "imports": {
                "other": [
                    {
                        "TYPE": "THIRD_PARTY",
                        "from": "@reduxjs/toolkit",
                        "import_entity": "createSlice",
                        "import_type": "FULL"
                    }
                ]
            }
        }
        addReducerConfig(id,reducer)
    }

    const highlightStyle = { backgroundColor: "#222" }

    return (
        <div {...props}>
            <div className="container-fluid p-0 my-1">
                <div className="row">
                    <div className="d-flex border-bottom border-black px-3 fw-bold fs-5">
                        Reducers
                    </div>
                </div>
                {Object.entries(reducerConfig).map(([k, reducer]) =>
                    <div key={k} className="row  btn rounded-0 d-flex text-white px-3 p-0 my-1 " style={k === selected?.key ? highlightStyle : null} onClick={() => select(k)}>
                        {reducer.name}
                    </div>
                )
                }
                <div className="row ms-0 my-2">
                    <div className='d-flex '>
                        <button className='btn-sm  btn btn-secondary ' onClick={addReducer} >
                            Add Reducer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}