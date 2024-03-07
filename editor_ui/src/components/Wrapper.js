
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { Form } from "react-bootstrap"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
export default function Wrapper({ comp, updateWrapper, ...props }) {
    const [showWrapper, setShowWrapper] = useState(false)
    const [reduxStores,setReduxStores] = useState({})
    const { projectName, } = useParams()
    const [ selectedWrapper, setSelectedWrapper] = useState(comp.wrapper_store??"")
    
    useEffect(()=>{
        setSelectedWrapper(comp.wrapper_store??"")
    },[comp])

    useEffect(()=>{
        const load= async ()=>{
            const reduxStore = await (
                await fetch("http://localhost:8000/editor/read-redux-store/" + projectName)
            ).json();
            setReduxStores(reduxStore)
        }
        load();
    },[projectName])

    function selectWrapper(wrapperId){
        setSelectedWrapper(wrapperId)
    }

    return (
        <div {...props}>
            <div className="d-flex ">
                <button className="btn  p-0 m-0  shadow-none" onClick={() => setShowWrapper((state) => !state)}>
                    {showWrapper ?
                        <img src={downArrow} height={24} alt="" />
                        :
                        <img src={rightArrow} height={24} alt="" />
                    }
                </button>
                Wrapper
            </div>
            {showWrapper ?
                <div className="col">
                    <Form.Select  className="m-1 p-1 w-75" value={selectedWrapper} onChange={(event)=>selectWrapper(event.target.value)}>
                        
                        {Object.entries(reduxStores).map(([key,store])=>
                            <option value={key} >{store.name}</option>
                        )
                        }
                        <option value="">No Wrapper</option>
                    </Form.Select>
                    <button className="btn btn-primary btn-sm m-1" onClick={()=>updateWrapper(selectedWrapper)}>
                        Update
                    </button>
                </div>
                : null
            }
        </div>
    )
}