import { useState, Fragment } from 'react'
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"


export default function ServicePaths({ paths, tags, selected, setSelected, ...props }) {
    const [showDropdown, setShowDropdown] = useState(false)


    function toggleDropdown() {
        setShowDropdown((state) => !state)
    }

    const highlightStyle = { backgroundColor: "#222" }

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
                        Paths
                    </div>
                </div>
                {showDropdown ?
                    <Fragment>
                        {/* {tags.map((tag) =>
                            <div key={tag.name} className="row  btn rounded-0 d-flex text-white px-3 p-0 my-1 " style={tag.name=== selected?.selected ? highlightStyle : null} onClick={()=>setSelected({type:"tag",selected:tag.name})} >
                                {tag.name}
                            </div>
                        )
                        } */}
                        {Object.entries(paths).map(([k,value]) =>
                            <div key={k} className="row  btn rounded-0 d-flex text-white px-3 p-0 my-1 " style={k=== selected?.selected ? highlightStyle : null} onClick={()=>setSelected({type:"tag",selected:k})} >
                                {k}
                            </div>
                        )
                        }
                        <div className='row'>
                            <div>
                                <button className='btn btn-sm btn-secondary m-1 text-white ' >
                                    Add Paths
                                </button>
                            </div>
                        </div>
                    </Fragment>
                    : null}
            </div>
        </div>

    )
}