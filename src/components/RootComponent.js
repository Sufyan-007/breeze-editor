import { useContext } from "react";
import { ServiceContext } from "../store/Context";

export default function RootComponent({ name, component,selectComponent, ...props }) {
    
    const { configService } = useContext(ServiceContext)
    


    function updateComponent() {
        configService.updateComponent(component)
    }



    


    return (
        <div {...props}>
            <div className="container-fluid border border-dark-subtle border-2">
                <div className=" d-flex justify-content-between my-2 fw-bold">
                    <button className="btn" onClick={()=>selectComponent({elem:component,isComp:true})} >{name}</button>
                    <button className="btn btn-secondary btn-sm " onClick={updateComponent}>Update</button>
                </div>
            </div>
        </div>
    )
}