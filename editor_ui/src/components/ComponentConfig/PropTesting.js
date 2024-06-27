import { useState } from "react"
import Offcanvas from "../common/Offcanvas"

export default function PropTesting() {
    const [canvasOpen, setCanvasOpen] = useState(false)
    return (
        <>
            <button className=" btn-sm btn btn-secondary" onClick={()=>setCanvasOpen(true)}>
                Open Prop Configuration
            </button>
            <Offcanvas isOpen={canvasOpen} onClose={() => setCanvasOpen(false)} title="Prop configuration">
                Props
            </Offcanvas>
        </>
    )
}