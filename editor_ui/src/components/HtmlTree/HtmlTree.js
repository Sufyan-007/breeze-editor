import { useContext, useEffect, useRef } from "react"
import Html from "./Html"
import Text from "./Text"
import { ComponentContext } from "../ComponentConfig/ComponentConfigPage"
import Conditional from "./Conditional"
import Map from "./Map"


export default function HtmlTree({ htmlId, className }) {
    const { componentConfig, sidebarService } = useContext(ComponentContext)
    const value = componentConfig.html_elements[htmlId]
    const ref = useRef()

    useEffect(() => {
        var updateSub;
        const sub = sidebarService.getSelectedElem().subscribe((elem)=>{
            if(elem?.elem ===htmlId){
                console.log(elem)
                ref.current?.classList.add("bg-dark")
                console.log(ref.current?.classList)
            }else{
                ref.current?.classList.remove("bg-dark")
            }
        })
        return () => {
            sub.unsubscribe()
            updateSub?.unsubscribe()
        }
    }, [sidebarService,htmlId])

    function selectElem(){
        sidebarService.setSelectedElem(htmlId)
    }

    return (
        <div className={className}>
            {value.type === "Element" ?
                <Html value={value} htmlId={htmlId} selectElem={selectElem} reference={ref} />
                :
                value.type === "condition"?
                    <Conditional value={value} htmlId={htmlId} selectElem={selectElem} reference={ref} />
                :
                value.type === "map" ?
                    <Map  value={value} htmlId={htmlId} selectElem={selectElem} reference={ref} />
                    :
                    <Text selectElem={selectElem} htmlId={htmlId} reference={ref} value={value} />
            }
        </div>
    )
}