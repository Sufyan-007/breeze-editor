
import arrowReturn from "../assets/icons/arrow-return-left.svg";
import rightArrow from "../assets/icons/arrow_right_icon.svg"
import downArrow from "../assets/icons/arrow_down_icon.svg"

import threeDots from "../assets/icons/three_dots_icon.svg"
import { Form } from "react-bootstrap"

export default function Main() {
    console.log("Hello world!");
    return (
        <div className="container-fluid vh-100 d-flex flex-column ">
            <div className=" navbar  row" style={{ backgroundColor: "#111111" }}>
                <div className="container-fluid">
                    <div className=" navbar-brand text-white">
                        Breeze Studio
                    </div>
                    <div>
                        <input type="text" className="p-1 m-1 " placeholder='Port Number' />
                        <input type="text" className="p-1" placeholder='Route' />
                        <button className=" btn btn-primary m-1"> Go</button>
                    </div>
                </div>
            </div>
            <div className="row flex-grow-1 overflow-hidden">
                <div className="col-2 overflow-y-auto h-100 fs-6 text-white" style={{ width: "16rem", backgroundColor: "#333333" }}>
                    <div className="d-flex m-1 fw-bold fs-5">
                        <button className=" d-flex my-2 p-0 btn " >
                            <img src={arrowReturn} className="me-2 " style={{ color: "#eeeeee", height: '1.25rem' }} alt="" />
                        </button>
                        ComponentName
                    </div>
                    <div className="row mt-3 border-top py-2 border-black border-bottom">
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
                    <div className="row mt-1 py-2  border-black border-bottom">
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
                    <div className="row mt-1 py-2  border-black border-bottom">
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

                    <div className="row mt-1 py-2  border-black border-bottom">
                        <div className="d-flex ">
                            <button className="btn  p-0 m-0  shadow-none" >
                                {false ?
                                    <img src={downArrow} height={24} alt="" />
                                    :
                                    <img src={rightArrow} height={24} alt="" />
                                }
                            </button>
                            State Variabls
                        </div>
                    </div>

                    <div className="row mt-1 py-2  border-black border-bottom">
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
                    </div>

                    <div className="row mt-1 py-2  border-black border-bottom">
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

                    <div className="row mt-1 py-2  border-black border-bottom">
                        <div className="d-flex ">
                            <button className="btn  p-0 m-0  shadow-none" >
                                {true ?
                                    <img src={downArrow} height={24} alt="" />
                                    :
                                    <img src={rightArrow} height={24} alt="" />
                                }
                            </button>
                            Html Tree
                        </div>
                        <div className="col ">
                            <div className="row mx-2">
                                <div className="p-0 d-flex justify-content-between">
                                    <div>
                                        <button className="btn p-0 m-0  shadow-none"  >
                                            <img src={downArrow} height={20} alt="" />
                                        </button>
                                        div
                                    </div>
                                    <div className=" dropdown ">
                                        <button className="btn p-0 mx-1"

                                            data-toggle="dropdown"
                                        >
                                            <img className=" h-75 " src={threeDots} alt="" />
                                        </button>
                                        <div className="dropdown-menu bg-dark  p-0 my-1 " aria-labelledby="dropdownMenuButton">
                                            <div className="dropdown-item my-1 text-white  "  >
                                                Edit
                                            </div>
                                            <div className="dropdown-item my-1  text-white"  >
                                                Add Child
                                            </div>
                                            <div className="dropdown-item my-1 text-white "  >
                                                Add Text
                                            </div>
                                            <div className="dropdown-item my-1 text-white "  >
                                                Move Up
                                            </div>
                                            <div className="dropdown-item my-1  text-white" >
                                                Move Down
                                            </div>

                                            <div className="dropdown-item my-1 bg-danger text-white" >
                                                Remove
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col ms-2 m-0  border-start border-1 border-black">
                                    <div className="row ">
                                        <div className="p-0 d-flex">
                                            <button className="btn p-0 m-0  shadow-none"  >
                                                <img src={downArrow} height={20} alt="" />
                                            </button>
                                            Container
                                        </div>
                                        <div className="col ms-2 m-0  border-start border-1 border-black">

                                            <div className="row ">
                                                <div className="p-0 d-flex">
                                                    <button className="btn p-0 m-0  shadow-none"  >
                                                        <img src={downArrow} height={20} alt="" />
                                                    </button>
                                                    Row
                                                </div>
                                                <div className="col ms-2 m-0  border-start border-1 border-black">
                                                    <div className="row ">
                                                        <div className="p-0 d-flex bg-dark">
                                                            <div className="ms-3" />
                                                            Img
                                                        </div>
                                                        <div className="col ms-2 m-0  border-start border-1 border-black">

                                                        </div>
                                                    </div>
                                                    <div className="row ">
                                                        <div className="p-0 d-flex ">
                                                            <div className="ms-3" />
                                                            div
                                                        </div>
                                                        <div className="col ms-2 m-0  border-start border-1 border-black">

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row ">
                                                <div className="p-0 d-flex">
                                                    <button className="btn p-0 m-0  shadow-none"  >
                                                        <img src={rightArrow} height={20} alt="" />
                                                    </button>
                                                    Row
                                                </div>
                                                <div className="col ms-2 m-0  border-start border-1 border-black">

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col">
                    Iframe
                </div>
                <div className="col-2 text-white" style={{ width: "15rem", backgroundColor: "#333333" }}>
                    <div className="row p-1">
                        <button className=" btn-close btn-close-white">
                        </button>
                        DIV_ID
                    </div>
                    <Form >
                        <Form.Group className="my-3">
                            <Form.Label className="my-0 fs-6">
                                Tag Name
                            </Form.Label>
                            <Form.Control value="img" placeholder="tagname" />
                        </Form.Group>
                        <Form.Group className="my-3">
                            <Form.Label className="my-0 ">
                                Id
                            </Form.Label>
                            <Form.Control />
                        </Form.Group>
                        <Form.Group className="my-3">
                            <Form.Label className="my-0 ">
                                ClassName
                            </Form.Label>
                            <Form.Control />
                        </Form.Group>
                    </Form>
                    <div className="row ">
                        <div className="d-flex justify-content-around">
                            <button className="btn btn-secondary btn-sm">
                                Cancel
                            </button>
                            <button className="btn btn-primary btn-sm">
                                Update
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}