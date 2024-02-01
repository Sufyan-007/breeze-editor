import { useState } from "react";
import ComponentTree from "./ComponentTree";
import RouterConfig from "./RouterConfig";
import ContextConfig from "./ContextConfig";
import DetailedComponent from "./DetailedComponent";

export default function Sidebar({ ...props }) {

    const [sidebarSelection, setSidebarSelection] = useState(null)

    const selectComponent = (elem) => {
        setSidebarSelection(elem);
    }

    const resetSelection = () => {
        setSidebarSelection(null);
    }



    if (sidebarSelection) {
        return (
            <div {...props}>
                
                <DetailedComponent className="row" component={sidebarSelection.elem} resetSelection={resetSelection} />
            </div>
        )
    } else {
        return (

            <div {...props}>
                <ComponentTree selectComponent={selectComponent} className="row my-2  border-bottom  border-black" />
                <RouterConfig className="row my-2 border-bottom border-black" />
                <ContextConfig className="row my-2 border-bottom border-black" />

            </div>
        )
    }


}