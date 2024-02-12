
import threeDots from "../assets/icons/three_dots_icon.svg"
export default function Text({ changeParent, value, reference, selecteElement }) {
    return (
        <div ref={reference} className="p-0 d-flex" >
            <div className=" ms-4" />
            <div className="w-100  d-flex justify-content-between flex-row">
                <div className="w-100 btn d-flex text-white p-0 mx-1  border-0 "
                    onClick={selecteElement}
                >
                    Text : {value.text.length > 12 ? value.text.slice(0, 10) + ".." : value.text}
                </div>
                <div className=" dropdown ">
                    <button className="btn p-0 mx-1"

                        data-toggle="dropdown"
                    >
                        <img className=" h-75 " src={threeDots} alt="" />
                    </button>
                    <div className="dropdown-menu p-0 my-1 " aria-labelledby="dropdownMenuButton">

                        <div className="dropdown-item my-1  " onClick={() => { changeParent(value, -1) }}>
                            Move Up
                        </div>
                        <div className="dropdown-item my-1  " onClick={() => { changeParent(value, 1) }} >
                            Move Down
                        </div>
                        <div className="dropdown-item my-1 bg-danger " onClick={() => { changeParent(null) }} >
                            Remove
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}