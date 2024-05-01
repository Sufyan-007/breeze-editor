import { useContext, useEffect, useState } from "react"
import { ComponentContext } from "./ComponentConfigPage"

export default function ElementConfigSidebar({config}){
    const {sidebarService} = useContext(ComponentContext)
    console.log(sidebarService)
    const [selectedElem, setSelectedElement] = useState(null)
    const elem = selectedElem?.elem
    // const update = selectedElem?.updateSub
    // const component = selectedElem?.component


    useEffect(() => {
        sidebarService.getSelectedElem().subscribe((elem) => {
            setSelectedElement(elem)
        })
    }, [sidebarService])

    if (!elem){
        return null
    }
    else{
        return (
            <div className=" col-1" style={{ width: "14rem", backgroundColor: "#303033" }}>
                <div className="row">
                    <button className=" btn-close-white btn-close" onClick={()=>sidebarService.setSelectedElem(null)}>

                    </button>
                </div>
            </div>
        )
    }
}