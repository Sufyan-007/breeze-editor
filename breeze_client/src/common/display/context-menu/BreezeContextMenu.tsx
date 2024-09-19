
import React, { ForwardedRef, forwardRef, ReactElement, Ref, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react"

export interface MenuItem<T> {
    label: string,
    value: T,
    hasChildren: boolean,
    children?: Array<MenuItem<T>>,
    getChildren?: (val: T) => Promise<Array<MenuItem<T>>>
}


interface CustomContextMenuProps<T> {
    menuItems: Array<MenuItem<T>>,
    onSelection: (val: MenuItem<T>["value"]) => unknown,
    width?: number,
    elemHeight?: number,
    defaultOrientation?: {
        right: boolean,
        bottom: boolean
    },
    getChildren?: MenuItem<T>["getChildren"]
}


export interface CustomContextMenuRef {
    handleEvent: (e: React.MouseEvent) => void,
    openContextMenu: (position: { x: number, y: number }) => void
}

const CustomContextMenu = forwardRef<CustomContextMenuRef,CustomContextMenuProps<unknown>>(<T,>({ menuItems, onSelection, width = 120, elemHeight = 25, defaultOrientation = { right: true, bottom: true }, getChildren }: CustomContextMenuProps<T>, ref: ForwardedRef<CustomContextMenuRef>) => {
    const [show, setShow] = useState(false)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const selectionAndClose = (val: T) => {
        setShow(false)
        onSelection(val)
    }

    const setMenuPosition = useCallback((x: number, y: number) => {
        const pos = { x: 0, y: 0 }
        if (defaultOrientation.right) {
            if (x + width > document.body.clientWidth) {
                pos.x = x - width
            } else {
                pos.x = x
            }
        }
        else {
            if (x - width < 0) {
                pos.x = x
            } else {
                pos.x = x - width
            }
        }
        if (defaultOrientation.bottom) {
            if (y + (elemHeight * menuItems.length) > document.body.clientHeight) {
                pos.y = y - (elemHeight * menuItems.length)
            } else {
                pos.y = y
            }
        } else {
            if (y - (elemHeight * menuItems.length) < 0) {
                pos.y = y
            } else {

                pos.y = y - (elemHeight * menuItems.length)
                console.log(pos, y, (elemHeight * menuItems.length))
            }
        }
        setPosition(pos)
    }, [defaultOrientation, elemHeight, menuItems.length, width])


    const menuRef = useRef<HTMLUListElement>(null)


    useImperativeHandle(ref, () => {
        return {
            handleEvent: (event) => {
                event.preventDefault()
                event.stopPropagation()
                setMenuPosition(event.clientX, event.clientY)
                setShow(true)

            },
            openContextMenu: ({ x, y }) => {
                setPosition({ x, y })
                setShow(true)
            }
        }
    }, [setMenuPosition])

    useEffect(() => {
        console.log(document.body.clientHeight)
        document.addEventListener("click", (e) => {
            if (!(e.target instanceof Node && menuRef.current?.contains(e.target))) {
                setShow(false)
            }
        })
    }, [])

    return (show &&
        <CustomContextMenuView menuItems={menuItems} onSelection={selectionAndClose} menuRef={menuRef} width={width} elemHeight={elemHeight} position={position} getChildren={getChildren} />
    )
}) as <T,>(props: CustomContextMenuProps<T> & { ref?: Ref<CustomContextMenuRef> })=>ReactElement

export default CustomContextMenu 


interface CustomContextMenuViewProps<T> {
    menuItems: CustomContextMenuProps<T>["menuItems"],
    menuRef?: React.RefObject<HTMLUListElement>,
    onSelection: CustomContextMenuProps<T>["onSelection"],
    width: NonNullable<CustomContextMenuProps<T>["width"]>,
    elemHeight: NonNullable<CustomContextMenuProps<T>["elemHeight"]>,
    position: { x: number, y: number },
    getChildren?: CustomContextMenuProps<T>["getChildren"],
}

const CustomContextMenuView = <T,>({ menuItems, onSelection, menuRef, width, elemHeight, position,getChildren }: CustomContextMenuViewProps<T>) => {
    return (
        <>
            <ul ref={menuRef} className=" bg-dark text-white  ps-1" style={{ position: "absolute", boxSizing: "border-box", width, height: elemHeight * (menuItems.length), left: position.x, top: position.y }}>
                {menuItems.map((menuItem, index) => {
                    return (
                        <CustomContextMenuItem<T> key={index} menuItem={menuItem} onSelection={onSelection} width={width} elemHeight={elemHeight} getChildren={getChildren} />
                    )
                })

                }
            </ul>
        </>
    )
}

interface CustomContextMenuItemProps<T> {
    menuItem: CustomContextMenuProps<T>["menuItems"][0],
    onSelection: CustomContextMenuProps<T>["onSelection"],
    width: NonNullable<CustomContextMenuProps<T>["width"]>,
    elemHeight: NonNullable<CustomContextMenuProps<T>["elemHeight"]>,
    getChildren?: CustomContextMenuProps<T>["getChildren"],
}

const CustomContextMenuItem = <T,>({ menuItem, onSelection, width, elemHeight, getChildren }: CustomContextMenuItemProps<T>) => {

    const [showChildren, setShowChildren] = useState(false)

    const [children, setChildren] = useState(menuItem.children)

    const leaveTimeout = useRef<number | null>()
    
    const menuRef = useRef<HTMLUListElement>(null)

    const itemRef = useRef(null)

    const openChildren = () => {
        if (menuItem.hasChildren) {
            setShowChildren(true)
            if(children === undefined){
                if(menuItem.getChildren){
                    menuItem.getChildren(menuItem.value).then((children)=>{
                        setChildren(children)
                    })
                }else{
                    if(getChildren){
                        getChildren(menuItem.value)
                    }
                }
            }
        }
    };

    const handleMouseEnter= () => {
        if(leaveTimeout.current){
            clearTimeout(leaveTimeout.current);
        }
        openChildren()
    }

    const handleMouseLeave = (e: React.MouseEvent) => {
        if (menuRef.current && menuRef.current.contains(e.relatedTarget as Node)) {
            return
        }
        leaveTimeout.current = setTimeout(()=>{
            setShowChildren(false)
        },100)
    }

    

    return (
        <>
        <li onMouseEnter={handleMouseEnter} ref={itemRef} onClick={()=>onSelection(menuItem.value)} onMouseLeave={handleMouseLeave} style={{ height: elemHeight }}>
            {menuItem.label}
        </li>
        {showChildren && children && 
            <CustomContextMenuView menuItems={children} menuRef={menuRef} onSelection={onSelection} width={width} elemHeight={elemHeight} position={{x:width+10, y:0 }} />
        }
        </>
    );
};
