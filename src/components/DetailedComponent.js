import Html from "./Html";
import { useContext, useState } from "react";
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"
import { ServiceContext } from "../store/Context";
import Variables from "./Variables";
import Functions from "./Functions";
import arrowReturn from "../assets/icons/arrow-return-left.svg";
import DetailedHtml from "./DetailedHtml";


export default function DetailedComponent({ component, resetSelection, ...props }) {
    const name = component.name


    const [selectionStack, setSelectionStack] = useState([])
    const pushSelection = (elem) => {
        console.log(elem)
        setSelectionStack(prevStack => [...prevStack, elem]);
    }
    const popSelection = () => {
        setSelectionStack(prevStack => {
            const newStack = [...prevStack];
            newStack.pop();
            return newStack;
        });
    }
    const sidebarSelection = selectionStack.length > 0 ? selectionStack[selectionStack.length - 1] : null;


    const [Component, setComponent] = useState(component)
    const [showHtml, setShowHtml] = useState(false)
    const { configService } = useContext(ServiceContext)

    function toggleHtml() {
        setShowHtml((state) => !state)
    }


    function updateHtml(html) {
        if (html) {
            setComponent((component) => {
                const comp = { ...component, html: html }
                configService.updateComponent(comp)
                return comp
            })
            console.log("updateHtml")
        }
    }

    if (sidebarSelection) {
        return (
            <DetailedHtml {...props} elem={sidebarSelection} popSelection={popSelection} pushSelection={pushSelection} />
        )
    }

    return (
        <div {...props}>
            <div className="container-fluid">
                <div className="d-flex m-1 fw-bold fs-4">
                    <button className=" d-flex my-2 p-0  btn" onClick={resetSelection}>
                        <img src={arrowReturn} className="me-2" style={{ height: '1rem' }} alt="" />
                    </button>
                    {name}
                </div>


                <div className="row mt-3 border-top py-2 fs-5 border-black border-bottom">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" >
                            {false ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Imports
                    </div>
                </div>

                <div className="row py-2 fs-5 border-black   border-bottom">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" >
                            {false ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Prop Variables
                    </div>
                </div>
                <div className="row  py-2 fs-5 border-black border-bottom">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" >
                            {false ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        State Variables
                    </div>
                    {false ?
                        <div className="col">
                            {Object.entries(Component.stateVars).map(([index, variable]) => <Variables className="row m-1 " key={variable['$id']} variable={variable} />)}
                            <button className="btn btn-secondary row w-50 btn-sm m-1 ms-4">
                                Add Variables
                            </button>
                        </div>
                        : null}
                </div>


                <div className="row py-2 fs-5 border-black border-bottom">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" >
                            {false ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Functions
                    </div>
                    {false ?
                        <div className="col">
                            {Object.entries(Component.functions).map(([index, func]) => <Functions className="row m-1 " key={func['$id']} func={func} />)}
                            <button className="btn btn-secondary row w-50 btn-sm m-1 ms-4">
                                Add Function
                            </button>
                        </div>
                        : null}
                </div>


                <div className="row py-2 fs-5 border-black border-bottom">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" >
                            {false ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Hooks
                    </div>
                </div>

                <div className="row py-2 fs-5 border-black border-bottom">
                    <div className="d-flex ">
                        <button className="btn  p-0 m-0  shadow-none" >
                            {false ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        Wrapper
                    </div>
                </div>



                <div className="row py-2 border-black border-bottom">
                    <div className="d-flex fs-5  ">
                        <button className="btn  p-0 m-0  shadow-none" onClick={toggleHtml}>
                            {showHtml ?
                                <img src={downArrow} height={24} alt="" />
                                :
                                <img src={rightArrow} height={24} alt="" />
                            }
                        </button>
                        HTML Tree
                    </div>
                    {showHtml ? <div className="col  ">
                        <Html Val={Component.html} className="row mx-1 " pushSelection={pushSelection} changeParent={(val) => updateHtml(val)} />
                    </div> : null}
                </div>
            </div>
        </div>
    )
}