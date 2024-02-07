import { useContext } from "react";
import { ServiceContext } from "../store/Context";
import { router } from "../App";

export default function RootComponent({ name, component, ...props }) {
    
    const { configService } = useContext(ServiceContext)
    


    function updateComponent() {
        configService.updateComponent(component)
    }

    function openComponent() {
        router.navigate("comp/"+name)
    }

    


    return (
        <div {...props}>
            <div className="container-fluid border border-dark-subtle border-2">
                <div className=" d-flex justify-content-between my-2 fw-bold">
                    <button className="btn text-white" onClick={openComponent} >{name}</button>
                    <button className="btn btn-secondary btn-sm " onClick={updateComponent}>Update</button>
                </div>
            </div>
        </div>
    )
}