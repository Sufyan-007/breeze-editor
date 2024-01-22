import { useContext, useState } from "react";
import Html from "./Html";
import { ServiceContext } from "../store/Context";

export default function RootComponent({ name, component, ...props }) {

    const [Component, setComponent] = useState(component)
    const { configService } = useContext(ServiceContext)


    function updateComponent() {
        configService.updateComponent(Component)
    }


    function updateHtml(html) {
        if (html) {
            setComponent((component) => {
                const comp = { ...component, html: html }
                configService.updateComponent(comp)
                return comp
            })
            console.log("updateHtml")
        }
    }


    return (
        <div {...props}>
            <div className="container-fluid border border-dark-subtle border-2">
                <div className=" d-flex justify-content-between mt-3 fw-bold">
                    <div>{name}</div>
                    <button className="btn btn-secondary btn-sm "   onClick={updateComponent}>Update</button>
                </div>
                <div className="row">
                    <div>
                        HTML
                    </div>
                    <div className="col  ">
                        <Html Val={Component.html} className="row me-1 " changeParent={(val) => updateHtml(val)} />
                    </div>
                </div>
            </div>
        </div>
    )
}