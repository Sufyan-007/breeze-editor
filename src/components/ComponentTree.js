import { useSelector } from 'react-redux'
import { useRef, useState, useContext } from 'react'
import { ServiceContext } from "../store/Context";
import { Modal, Button, Form} from 'react-bootstrap'
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import RootComponent from './RootComponent'
import { router } from '../App'

export default function ComponentTree({  ...props }) {
    const config = useSelector((state) => state.config)
    const { configService } = useContext(ServiceContext)
    


    const [showDropdown, setShowDropdown] = useState(false)
    const [ showModal, setShowModal] = useState(false)
    const newCompRef= useRef()



    function toggleDropdown() {
        setShowDropdown((state) => !state)
    }


    function closeModal(added){
        if(added){
            const name=newCompRef.current[0].value
            const route = newCompRef.current[1].value
            if(name){
                configService.addComponent(name,route)
            }
        }
        setShowModal(false)
    }

    

    

    return (
        <div {...props}>
            <Modal show={showModal} onHide={()=>closeModal(false)}>
                <Modal.Header>
                    Add Component
                </Modal.Header>
                <Modal.Body>
                    <Form ref={newCompRef}>
                        <Form.Group>
                            <Form.Label>
                                Component Name
                            </Form.Label>
                            <Form.Control  />
                        </Form.Group>
                        <Form.Group name="route">
                            <Form.Label>
                                Route
                            </Form.Label>
                            <Form.Control name='route' placeholder='(optional)' />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                        <Button variant="secondary" onClick={() => { closeModal(false); }} >
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={() => { closeModal(true); }}>
                            Update
                        </Button>
                    </Modal.Footer>
            </Modal>
            <div className="container-fluid my-1">
                <div className="row">
                    <div className="d-flex  fw-bold fs-5">
                        <button className="btn  p-0 m-0  shadow-none" onClick={toggleDropdown}>
                            {showDropdown ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Components
                    </div>
                </div>
                {showDropdown ?
                    Object.entries(config).map(([k, v]) => <RootComponent key={k} name={k} component={v}  className=" row m-1 " />)

                    : null
                }
                {showDropdown?
                    <div className="row my-2">
                        <div className='d-flex justify-content-around'>
                            <button className='   btn btn-secondary ' onClick={()=>setShowModal(true)}>
                                Add Component
                            </button>
                        </div>
                    </div>
                :null}
            </div>
        </div>
    )

}

