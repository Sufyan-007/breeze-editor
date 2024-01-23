import { useState } from 'react'
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { useSelector } from 'react-redux'
import Route from './Route'

export default function RouterConfig({ ...props }) {
    const routerConfig = useSelector(state => state.routerConfig)



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
                        Router
                    </div>
                </div>
                {showDropdown ?
                    Object.entries(routerConfig.routes).map(([index, route]) => <Route className="row"  route={route}/>)
                    : null}
            </div>
        </div>
    )
}