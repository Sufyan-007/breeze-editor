import React from 'react'

const ElementConfigList = () => {
  return (
    <>
       <div className="text-white col-3 h-100" style={{ width: "18rem", backgroundColor: "#303033" }}>
                <div >
                    <div
                        className="py-2 btn rounded-0 text-white  w-50 "
                        style={selected === 0 ? { backgroundColor: "#303033" } : { backgroundColor: "rgb(33, 37, 41) " }}
                        onClick={() => setSelected(0)}
                    >
                        Html Tree
                    </div>
                    <div
                        className="py-2 btn rounded-0 text-white  w-50 "
                        style={selected === 1 ? { backgroundColor: "#303033" } : { backgroundColor: "rgb(33, 37, 41) " }}
                        onClick={() => setSelected(1)}
                    >
                        Add Element
                    </div>
                </div>
                {selected === 0 ?
                    <HtmlTree htmlId={componentName} config={componentConfig} className="row my-1" />
                    :
                    <div className="row">
                        Add Element
                    </div>
                }
            </div>
    </>
  )
}

export default ElementConfigList
