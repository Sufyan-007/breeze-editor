import { useEffect, useRef, useState } from "react"
import { Offcanvas } from "react-bootstrap"

export default function CommonConfigSidebar({ title = "Title", children, onClose }) {
    console.log(children)
    return (
        <>
            <Offcanvas  backdropClassName="" show={children}  placement="end"   onHide={onClose}>
                <Offcanvas.Header className="bg-dark text-white"  closeButton>
                    <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body  className="bg-dark text-white">
                    {children}
                </Offcanvas.Body>
            </Offcanvas>
            
        </>
    )
}