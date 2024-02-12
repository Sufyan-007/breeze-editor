import { useRef, useState, useContext} from 'react'
import { ServiceContext } from '../store/Context'
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { useSelector } from 'react-redux'
import Route from './Route'
import { Modal, Button, Form } from 'react-bootstrap'

    export default function RouterConfig({ ...props }) {
        const routerConfig = useSelector(state => state.routerConfig)
    const [showDropdown, setShowDropdown] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const { configService } = useContext(ServiceContext)
    const formRef = useRef();

    function toggleDropdown() {
        setShowDropdown((state) => !state)
    }

    function closeModal(added) {
        if(added){
            const route=formRef.current[0].value
            const component= formRef.current[1].value
            const redirectTo= formRef.current[2].value
            if(route){
                configService.addRoute(route, component, redirectTo)
            }
        }
        setShowModal(false)
    }

    return (
        <div {...props}>
            <Modal show={showModal} onHide={() => closeModal(false)}>
                <Modal.Header>
                    Add Component
                </Modal.Header>
                <Modal.Body>
                    <Form ref={formRef}>
                        <Form.Group name="route">
                            <Form.Label>
                                Route
                            </Form.Label>
                            <Form.Control name='route' placeholder='route' />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Component Name
                            </Form.Label>
                            <Form.Control name="component" placeholder='Component Name' />
                        </Form.Group>

                        <Form.Group name="route">
                            <Form.Label>
                                Redirect To
                            </Form.Label>
                            <Form.Control name='redirect' placeholder='redirect_url' />
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
            <div className="container-fluid">
                <div className="row">
                    <div className="d-flex fw-bold fs-5">
                        <button className="btn  p-0 m-0  shadow-none" onClick={toggleDropdown}>
                            {showDropdown ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Router
                    </div>
                </div>
                {showDropdown ?
                    Object.entries(routerConfig.routes).map(([index, route]) => <Route className="row" route={route} />)
                    : null}

                {showDropdown ? <div className="row">
                    <button className='btn btn-secondary col-3 m-2 p-0' onClick={() => setShowModal(true)}>
                        add route
                    </button>
                </div>
                    : null}
            </div>
        </div>
    )
}