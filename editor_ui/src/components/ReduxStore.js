export default function ReduxStore({ reduxStoreConfig, addReduxStore, setSelected, selected, ...props }) {

    function select(key) {
        setSelected({ type: "store", key })
    }

    function addStore() {
        const length = Object.keys(reduxStoreConfig).length + 1
        const id = "redux_store_uuid" + length
        const store = {
            "name": "Store" + length,
            "containingFile": "store/Store" + length + ".js",
            "reducer": [
            ],
            "imports": {
                "reducer": [],
                "other": [
                    {
                        "TYPE": "THIRD_PARTY",
                        "from": "@reduxjs/toolkit",
                        "import_entity": "{configureStore}",
                        "import_type": "FULL"
                    }
                ]
            }
        }
        addReduxStore(id,store)
    }

    const highlightStyle = { backgroundColor: "#222" }

    return (
        <div {...props}>
            <div className="container-fluid p-0 my-1">
                <div className="row">
                    <div className="d-flex border-bottom border-black px-3 fw-bold fs-5">
                        Redux Stores
                    </div>
                </div>
                {Object.entries(reduxStoreConfig).map(([k, store]) =>
                    <div key={k} className="row  btn rounded-0 d-flex text-white px-3 p-0 my-1 " style={k === selected?.key ? highlightStyle : null} onClick={() => select(k)}>
                        {store.name}
                    </div>
                )
                }
                <div className="row ms-0 my-2">
                    <div className='d-flex '>
                        <button className='btn-sm  btn btn-secondary ' onClick={addStore} >
                            Add Store
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}