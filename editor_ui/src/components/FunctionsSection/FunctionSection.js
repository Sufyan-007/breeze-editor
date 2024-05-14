import { useContext } from "react"
import { ComponentContext } from "../ComponentConfig/ComponentConfigPage"
import Function from "./Function"

export default function FunctionSection() {

    const {  componentConfig } = useContext(ComponentContext)
    const functions = componentConfig.functions


    return (
        <div className="row flex-grow-1 text-white" style={{backgroundColor:'rgb(48, 48, 51)'}}>
            <div className="col ">
                <h3 className=" row m-3">
                    Functions
                </h3>
                {functions?.length > 0 ?
                    functions.map(func =>
                        < div className="row mx-2 my-3">
                            <Function func={func} />
                        </div>
                    )

                    :
                    <div className="row m-3">
                        No Functions
                    </div>
                }
            </div>
        </div >
    )
}