import { useState } from 'react'
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { router } from '../App'

export default function ServiceConfig({ ...props }) {


    const [showDropdown, setShowDropdown] = useState(false)

    function toggleDropdown() {
        setShowDropdown((state) => !state)
    }

    return (
        <div {...props}>
            <div className="container-fluid ">
                <div className="row">
                    <div className="d-flex fw-bold fs-5">
                        <button className="btn  p-0 m-0  shadow-none" onClick={toggleDropdown}>
                            {showDropdown ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Services
                    </div>
                </div>
                {showDropdown ?
                    <div className='row'>
                        <div>
                            <button className='btn btn-sm btn-secondary m-1 text-white ' onClick={() => router.navigate('service')}>
                                Open Service Configuration
                            </button>
                        </div>
                    </div>
                    : null}
            </div>
        </div>
    )
}