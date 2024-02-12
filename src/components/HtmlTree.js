import { useState, useContext, useRef, useEffect } from "react"
import React from "react"
import { ServiceContext } from "../store/Context";
import { useSelector } from "react-redux"
import Text from "./Text"
import Html from "./Html"
import Expression from "./Expressions";

export default function HtmlTree({ Val, component, changeParent, ...props }) {

    const [value, setValue] = useState(Val)
    const ref = useRef()
    
    const config = useSelector((state) => state.config)
    const { sidebarService } = useContext(ServiceContext)
    const selected = useRef(false);

    useEffect(() => {
        var updateSub;
        const sub = sidebarService.getSelectedElem().subscribe((selectedElem) => {
            if (selectedElem?.elem === value) {
                selected.current = true
                updateSub?.unsubscribe()
                ref.current.classList.add("bg-dark")
                updateSub = selectedElem.updateSub.subscribe((elem) => {
                    setValue(elem)
                    sidebarService.setSelectedElem(elem, component)
                    changeParent(elem)
                })
            } else {
                ref.current?.classList.remove("bg-dark")
            }
        })
        return () => {
            sub.unsubscribe()
            updateSub?.unsubscribe()
        }
    }, [sidebarService, value, ref, changeParent, component])

    function selecteElement() { 
        console.log(value)
        sidebarService.setSelectedElem(value, component)

    }

    const childProps = { value, config, reference: ref, selected, selecteElement, setValue, changeParent, sidebarService, component }


    return (
        <div {...props} >
            
            {value.type === "Element" ?
                <Html  {...childProps} />
                :
                value.type === "Expression" ?
                    <Expression {...childProps} />
                    :
                    <Text value={value} changeParent={changeParent} selecteElement={selecteElement} reference={ref} />
            }
        </div>
    )


}