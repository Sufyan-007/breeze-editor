import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router"
import Loader from "./Loader"
import Reducers from "./Reducers"
import ReduxStore from "./ReduxStore"

export default function ReduxConfig() {
    const { projectName } = useParams()

    const [reduxStoreConfig, setReduxeduxStoreConfig] = useState(null)
    const [reducerConfig, setReducerConfig] = useState(null)


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

    return (
        <div className=" container-fluid d-flex flex-column vh-100">
            <Loader loader={loadConfig}>
                <div className="navbar row " style={{ backgroundColor: "#151518" }}>
                    <div className="navbar-brand text-white">
                        Breeze Studio
                    </div>
                </div>
                <div className="row flex-grow-1 overflow-hidden">
                    <div className="col-3   overflow-y-auto h-100 fs-6 text-white" style={{ width: "18rem" , backgroundColor: "#303033" }}>
                        <Reducers reducerConfig={reducerConfig}  className="row my-2  border-bottom  border-black"/>
                        <ReduxStore reduxStoreConfig={reduxStoreConfig}  className="row my-2  border-bottom  border-black"/>
                    </div>
                    <div className="col">

                    </div>
                </div>
            </Loader>
        </div>
    )
}