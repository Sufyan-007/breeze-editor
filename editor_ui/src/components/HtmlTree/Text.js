

export default function Text({ value,selectElem,reference  }) {
    return (
        <div  className="p-0 d-flex" ref={reference} onClick={selectElem} >
            <div className=" ms-4" />
            <div className="w-100  d-flex justify-content-between flex-row">
                <div className="w-100 btn d-flex text-white p-0 mx-1  border-0 "
                    
                >
                    Text : {value.text.length > 12 ? value.text.slice(0, 10) + ".." : value.text}
                </div>
                
            </div>
        </div>

    )
}