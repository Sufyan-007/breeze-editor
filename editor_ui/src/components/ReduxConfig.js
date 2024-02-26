import { useCallback, useState } from "react"
import { useParams } from "react-router"
import Loader from "./Loader"
import Reducers from "./Reducers"
import ReduxStore from "./ReduxStore"
import StoreConfig from "./StoreConfig"
import ReducerConfig from "./ReducerConfig"
import arrowReturn from "../assets/icons/arrow-return-left.svg";
import { router } from "../App"

export default function ReduxConfig() {
    const { projectName } = useParams()
    const [reduxStoreConfig, setReduxeduxStoreConfig] = useState(null)
    const [reducerConfig, setReducerConfig] = useState(null)
    const [selected, setSelected] = useState()
    console.log(reduxStoreConfig)
    
    const loadConfig = useCallback(async () => {
        const reduxStore = await (
            await fetch("http://localhost:8000/editor/read-redux-store/" + projectName)
        ).json();
        const reducers = await (
            await fetch("http://localhost:8000/editor/read-reducers/" + projectName)
        ).json();
        setReducerConfig(reducers)
        setReduxeduxStoreConfig(reduxStore)

    }, [projectName]
    )

    function updateStore(storeConfig) {
        console.log("Updating Store")
        setReduxeduxStoreConfig((state) => {
            const config = { ...state, [selected.key]: storeConfig }

            fetch("http://localhost:8000/editor/write-redux-store/" + projectName + "/",
                { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) }
            ).then((response) => response.json()).then((response) => console.log(response))

            return config
        })
    }

    function updateReducer(reducerConfig) {
        console.log("Updating Reducers")
        setReducerConfig((state) => {
            const config = { ...state, [selected.key]: reducerConfig }

            fetch("http://localhost:8000/editor/write-reducers/" + projectName + "/",
                { method: "POST", headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) }
            ).then((response) => response.json()).then((response) => console.log(response))

            return config
        })
    }
    function addReducer(id, reducerConfig) {
        setReducerConfig((state) => {
            return { ...state, [id]: reducerConfig }
        })
        setSelected({ type: "reducer", key: id })
    }

    function addStore(id, storeConfig) {
        setReduxeduxStoreConfig((state) => {
            return { ...state, [id]: storeConfig }
        })
        setSelected({ type: "store", key: id })
    }

    function goHome() {
        router.navigate("/editor/"+projectName)
    }

    return (
        <div className=" container-fluid d-flex flex-column vh-100">
            <Loader loader={loadConfig}>
                <div className="navbar row " style={{ backgroundColor: "#151518" }}>
                    <div className="navbar-brand text-white">
                        Breeze Studio
                    </div>
                </div>
                <div className="row flex-grow-1 overflow-hidden">
                    <div className="col-3   overflow-y-auto h-100 fs-6 text-white" style={{ width: "18rem", backgroundColor: "#303033" }}>
                        <div className="d-flex m-1 fw-bold fs-5">
                            <button className=" d-flex my-2 p-0  btn" onClick={goHome}>
                                <img src={arrowReturn} className="me-2" style={{ height: '1rem' }} alt="" />
                            </button>
                            Redux Configuration
                        </div>
                        <Reducers reducerConfig={reducerConfig} addReducerConfig={addReducer} setSelected={setSelected} selected={selected} className="row my-2  border-top border-bottom border-2  border-black" />
                        <ReduxStore reduxStoreConfig={reduxStoreConfig} addReduxStore={addStore} setSelected={setSelected} selected={selected} className="row my-2  border-bottom border-2 border-black" />
                    </div>
                    <div className="col overflow-y-auto h-100 bg-dark-subtle">
                        {selected?.type === "reducer" ?
                            <ReducerConfig reducerConfig={reducerConfig[selected.key]} update={updateReducer} />
                            :
                            <div></div>
                        }
                        {selected?.type === "store" ?
                            <StoreConfig storeConfig={reduxStoreConfig[selected.key]} update={updateStore} reducers={reducerConfig} />
                            :
                            <div></div>
                        }
                    </div>
                </div>
            </Loader>
        </div>
    )
}