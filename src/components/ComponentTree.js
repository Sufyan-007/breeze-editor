import { useSelector } from 'react-redux'
import { useState } from 'react'
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import RootComponent from './RootComponent'
export default function ComponentTree({ ...props }) {
    const config = useSelector((state) => state.config)

    const [showDropdown, setShowDropdown] = useState(false)

    function toggleDropdown() {
        setShowDropdown((state) => !state)
    }

    return (
        <div {...props}>
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
                        Components
                    </div>
                </div>
                {showDropdown ?
                    Object.entries(config).map(([k, v]) => <RootComponent key={k} name={k} component={v} className=" row m-1 " />)
                    : null
                }
            </div>
        </div>
    )

}

