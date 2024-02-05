import { useState, useContext, useRef, useEffect } from "react"
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import threeDots from "../assets/icons/three_dots_icon.svg"
import React from "react"
import { ServiceContext } from "../store/Context";

export default function Html({ Val, component, changeParent, ...props }) {

    const [value, setValue] = useState(Val)
    const [showChild, setShowChild] = useState(false)
    const hasChildren = value.children?.length > 0
    const ref= useRef()
    const { sidebarService } = useContext(ServiceContext)
    const selected=useRef(false);

    useEffect(()=>{
        var updateSub;
        const sub= sidebarService.getSelectedElem().subscribe((selectedElem)=>{
            if(selectedElem?.elem===value){
                selected.current=true
                updateSub?.unsubscribe()
                ref.current.classList.add("bg-dark")
                updateSub=selectedElem.updateSub.subscribe((elem)=>{
                    setValue(elem)
                    sidebarService.setSelectedElem(elem,component)
                    changeParent(elem)
                })
            }else{
                ref.current?.classList.remove("bg-dark")
            }
        })
        return ()=>{
            sub.unsubscribe()
            updateSub?.unsubscribe()
        }
    },[sidebarService,value,ref,changeParent,component])


    function toggleShowChild() {
        setShowChild((showChild) => !showChild)
    }

    function updateChild(key, child, offset = 0) {
        
        const index = key > 0 ? key + offset : 0
        const children = [...value.children]
        children.splice(key, 1)

        if (child) {
            children.splice(index, 0, child)
        }

        setValue(value => {
            const newVal = { ...value, children }
            changeParent(newVal)
            return newVal
        })
        if (!child || offset !== 0) {
            setShowChild(false)
        }

    }

    function addText() {
        const text = { "type": "text", "text": "Hello world" }
        const children = [...value.children, text]
        setValue(value => {
            return { ...value, children }
        })
        setShowChild(true)
    }

    function addChild() {
        const id = value.attributes.id.value + "-" + value.children.length
        var tagName = "div";
        if (value.tagName === "Container" || value.tagName === "Col") {
            tagName = "Row"
        }
        if (value.tagName === "Row") {
            tagName = "Col"
        }

        const newDiv = {
            "type": "Element",
            "attributes": {
                "className": { "type": "LITERAL", "value": "" },
                "id": { "type": "LITERAL", "value": id },
            },
            "tagName": tagName,
            "children": []
        }
        const children = [...value.children, newDiv]
        setValue(value => {
            const newVal = { ...value, children }
            changeParent(newVal)
            return newVal
        })
        sidebarService.setSelectedElem(newDiv)
        setShowChild(true)
    }

    function handleHover(highlight) {
        // Cors issue here with iFrame

        const iFrame = document.getElementById("iFrame")
        const id = value.attributes.id?.value

        if (iFrame && id) {
            iFrame.contentWindow.postMessage({ id, highlight }, '*')
        }
    }

    function selecteElement() {
        sidebarService.setSelectedElem(value,component)
        
    }

    if (value.type === 'Element') {
        return (
            <div {...props} >
                <div ref={ref} className=" p-0 d-flex justify-content-between "  >
                    <div className="d-flex w-100 ">
                        {hasChildren ?
                            <button className="btn p-0 m-0 shadow-none" onClick={toggleShowChild} >
                                {showChild ?
                                    <img src={downArrow} height={20} alt="" />
                                    :
                                    <img src={rightArrow} height={20} alt="" />
                                }
                            </button>
                            : <div className="" style={{ marginLeft: "21px" }} />
                        }
                        <div className="w-100 btn d-flex text-white p-0 mx-1  border-0 "
                            onClick={selecteElement}
                            onMouseEnter={()=>handleHover(true)}
                            onMouseLeave={()=>handleHover(false)}
                        >
                            {value.tagName}
                        </div>
                    </div>
                    <div className=" dropdown ">
                        <button className="btn p-0 mx-1"

                            data-toggle="dropdown"
                        >
                            <img className=" h-75 " src={threeDots} alt="" />
                        </button>
                        <div className="dropdown-menu p-0 my-1 " aria-labelledby="dropdownMenuButton">
                            
                            <div className="dropdown-item my-1  " onClick={addChild} >
                                Add Child
                            </div>
                            <div className="dropdown-item my-1  " onClick={addText} >
                                Add Text
                            </div>
                            <div className="dropdown-item my-1  " onClick={() => { changeParent(value, -1) }} >
                                Move Up
                            </div>
                            <div className="dropdown-item my-1  " onClick={() => { changeParent(value, 1) }}>
                                Move Down
                            </div>

                            <div className="dropdown-item my-1 bg-danger " onClick={() => { if(selected.current){sidebarService.setSelectedElem(null)} ;changeParent(null) }} >
                                Remove
                            </div>

                        </div>
                    </div>
                </div>
                {
                    hasChildren && showChild ?
                        <div className="col ms-2 m-0  border-start border-1 border-black ">
                            {value.children.map((child, index) =>
                             <Html component={component} key={index} Val={child} className="row" changeParent={(Val, offest = 0) => updateChild(index, Val, offest)} />)
                            }
                        </div> :
                        null
                }
            </div >
        )
    }
    else {
        return (
            <div {...props}>
                
                <div ref={ref} className="p-0 d-flex" >
                    <div className=" ms-4" />
                    <div className="w-100  d-flex justify-content-between flex-row">
                        <div className="w-100 btn d-flex text-white p-0 mx-1  border-0 "
                            onClick={selecteElement}
                        >
                            Text : {value.text.length>12?value.text.slice(0,10)+"..":value.text}
                        </div>
                        <div className=" dropdown ">
                            <button className="btn p-0 mx-1"

                                data-toggle="dropdown"
                            >
                                <img className=" h-75 " src={threeDots} alt="" />
                            </button>
                            <div className="dropdown-menu p-0 my-1 " aria-labelledby="dropdownMenuButton">
                                
                                <div className="dropdown-item my-1  " onClick={() => { changeParent(value, -1) }}>
                                    Move Up
                                </div>
                                <div className="dropdown-item my-1  " onClick={() => { changeParent(value, 1) }} >
                                    Move Down
                                </div>
                                <div className="dropdown-item my-1 bg-danger " onClick={() => { changeParent(null) }} >
                                    Remove
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}