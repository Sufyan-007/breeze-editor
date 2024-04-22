import { useContext, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { ServiceContext } from "../../store/Context";

export default function HtmlTree({ Val, component, changeParent, className}){
    const [value, setValue] = useState(Val)
    const ref = useRef()
    
    const config = useSelector((state) => state.config)
    const { sidebarService } = useContext(ServiceContext)
    const selected = useRef(false);

    return (
        <div className={className}>
            Html Tree
        </div>
    )
}