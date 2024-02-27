import { useState, Fragment } from 'react'
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"


export default function ServicePaths({ paths, tags, setSelected, ...props }) {
    const [showDropdown, setShowDropdown] = useState(false)


    console.log(tags)

    console.log(paths)

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
                    <Fragment>
                        {tags.map(tag =>
                            <div key={tag.name} className="row  btn rounded-0 d-flex text-white px-3 p-0 my-1 " onClick={()=>setSelected({type:"tag",selected:tag.name})} >
                                {tag.name}
                            </div>
                        )

                        }
                        <div className='row'>
                            <div>
                                <button className='btn btn-sm btn-secondary m-1 text-white ' >
                                    Add Service
                                </button>
                            </div>
                        </div>
                    </Fragment>
                    : null}
            </div>
        </div>

    )
}