import { useState } from "react";
import { useSelector } from "react-redux";
import page_ss from "../assets/icons/page_ss.png";
import custom_ss from "../assets/icons/custom-component.png";
import { router } from "../App";

export default function ProjectComponents(props) {
  const config = useSelector((state) => state.config);
  const [selected, setSelected] = useState(0);

  const handleClick = (key) => {
    const path = `/project/${props.project}/component/${key}`;
    router.navigate(path);
  };

  return (
    <div className="d-flex container-fluid flex-column h-100 text-white">
      <div className="row">
        <div className="col p-0 bg-dark ">
          <div
            className="py-2 btn rounded-0 text-white  w-50 "
            style={selected === 0 ? { backgroundColor: "#303033" } : null}
            onClick={() => setSelected(0)}
          >
            Pages
          </div>
          <div
            className="py-2 btn rounded-0 text-white  w-50 "
            style={selected === 1 ? { backgroundColor: "#303033" } : null}
            onClick={() => setSelected(1)}
          >
            All components
          </div>
        </div>
      </div>
      <div className="row p-2 my-3 flex-grow-1">
        {selected === 0
          ? Object.entries(config.pages).map(([key, value]) => (
              <div className="col-sm-6 col-lg-4 col-xl-3 my-3">
                <div
                  className="card p-0 bg-black text-white position-relative border-0"
                  onClick={() => handleClick(key)}
                >
                  <img
                    src={page_ss}
                    className="card-img border-0"
                    alt="No Screenshot"
                    style={{ minHeight: 100 }}
                  />
                  <div className="card-overlay">{key}</div>
                </div>
              </div>
            ))
          : Object.entries(config.custom_components).map(([key, value]) => (
              <div className="col-sm-6 col-lg-4 col-xl-3 my-3">
                <div
                  className="card p-0 bg-black text-white position-relative border-0"
                  onClick={() => handleClick(key)}
                >
                  <img
                    src={custom_ss}
                    className="card-img border-0"
                    alt="No Screenshot"
                    style={{ minHeight: 100 }}
                  />
                  <div className="card-overlay ">{key}</div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
