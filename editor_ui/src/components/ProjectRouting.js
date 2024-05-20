import { useEffect, useRef, useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import DeleteIcon from "../assets/icons/delete-trash.svg";
import EditIcon from "../assets/icons/edit-icon.svg";
import ViewIcon from "../assets/icons/view-eye.svg";
import { Link } from "react-router-dom";
import ProjectRouteModal from "./ProjectRouteModal";
import { useSelector } from "react-redux";
import ProjectRouteDetails from "./ProjectRouteDetails";
import { FloatingLabel, Form } from "react-bootstrap";
import "../CSS/ProjectRouteDetails.css";

export default function ProjectRouting() {
  // const [routes, setRoutes] = useState([
  //   { path: "/", component: "Main" },
  //   { path: "/r1", component: "GeneralSettings" ,
  //     childRoutes: [{ path: "/r3", component: "newSettings" }]
  //   },
  //   { path: "/r2", redirectTo: "https://reactrouter.com/en/main/route/route" }
  // ]);


  // for off-canvas
  const [isRouteWithAComponent, setIsRouteWithAComponent] = useState(true);
  const [show, setShow] = useState(false);
  const [addRouteModalShow, setAddRouteModalShow] = useState(false);
  const [routeObj, setRouteObj] = useState();
  const [routeMode, setRouteMode] = useState();
  const [searchedRoute, setSearchedRoute] = useState("");
  const [showAllRouteObj, setShowAllRouteObj] = useState(false);
  const saveRouteRefs = useRef({});
  const setSaveRouteRef = (name, refs) => {
    saveRouteRefs.current[name] = refs;
  };
  const callChildFunc = (compName, funcName) => {
    if (
      saveRouteRefs.current[compName] &&
      saveRouteRefs.current[compName][funcName]
    ) {
      saveRouteRefs.current[compName][funcName]();
    }
  };
  // const saveAllRouteChanges = () => {

  // };
  const handleShow = () => setShow(true);
  const handleClose = () => {
    setRouteMode("");
    setShow(false);
  };
  const onSubmit = (data) => {
    console.log(data);
  };

  
  const getFunctionFromConfig = (allRoutes) => {
    return allRoutes.map((route) => {
      let routeObjImplementationProp = {};
      Object.entries(route).forEach((prop) => {
        // prop[0] is key like --> action, loader, lazy, ...
        // prop[1] is its value i.e. the implementation object
        if (prop[1]?.implementation !== undefined && prop[1]?.implementation !== null) {
          let parameters = "";
          let params = prop[1].implementation.parameters.list.map(
            (param) => param["name"]
          );
          if (prop[1].implementation.parameters.destructured) {
            parameters = `{${params.join()}}`;
          } else {
            parameters = `${params.join()}`;
          }
          routeObjImplementationProp[prop[0]] = `${
            prop[1].implementation.isAsync ? "async" : " "
          }  (${parameters}) => { ${prop[1].implementation.body} }`;
        }

        if (prop[0] === 'childRoutes') {
          let newChildRoutes = getFunctionFromConfig(prop[1]);
          routeObjImplementationProp[prop[0]] = newChildRoutes;
        }

      });
      return { ...route, ...routeObjImplementationProp };
    });
  };


  const routerConfig = useSelector((state) => state.routerConfig);
  const [routes, setRoutes] = useState(getFunctionFromConfig(routerConfig.routes));

  function handleAllRoutePropsModal(routeObj, routeMode) {
    setAddRouteModalShow(true)
    setRouteObj(routeObj);
    setRouteMode(routeMode);
  }

  const displaySerchedRoute = (value) => {
    console.log(searchedRoute);
    console.log(value);
    setSearchedRoute(value);
    console.log(searchedRoute);
  };

  function clearSearchValue() {
    setSearchedRoute("");
  } 

  // const handleEdit = async (css_name) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8000/editor/get-css-file/${css_name}/`
  //     );
  //     const data = await response.json();
  //     setModalMode("edit");
  //     setInitialData(data);
  //     setShowModal(true);
  //   } catch (error) {
  //     setToastMessage("An error occurred while trying to edit the file.");
  //     setShowToast(true);
  //   }
  // };

  return (
    <div className="container-fluid text-white hide-scrollbar">
      <div className="mt-3 mb-1 mx-4">
        <h3 className="ms-2">Project Routes:</h3>
      </div>
      <div className="d-flex justify-content-end mt-1 mb-3 mx-4">
        <div
          className="btn btn-info me-2"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
          onClick={() => displaySerchedRoute('')}
        >
          Add Route offcanvas
        </div>
        <div
          data-bs-theme="dark"
          className="me-2"
          type="button"
          onChange={(e) => displaySerchedRoute(e.target.value)}
        >
          <input
            className="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
            value={searchedRoute}
          />
        </div>
        <button
          className="btn btn-primary me-2"
          onClick={() => handleAllRoutePropsModal({}, "Add")}
        >
          Add Route
        </button>
        <button
          className="btn btn-success me-2"
          onClick={() => {
            callChildFunc("ProjectRouteDetails", "saveEditedRoutes");
          }}
        >
          Save All Changes
        </button>
      </div>

      {/* offcanvas add route obj */}
      <div
        className="offcanvas offcanvas-end offcanvas-size-xl"
        data-bs-theme="dark"
        tabindex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 id="offcanvasRightLabel">Add Route</h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body pdt">
          <div className="mx-1 form-floating" aria-label="path-input">
            {/* <input
              className="form-control"
              id="floatingInputPath"
              placeholder="route path"
            /> */}
            <FloatingLabel controlId="floatingInputGrid-path" label="route path">
              <Form.Control
                type="text"
                contentEditable={true}
                className="mb-1"
                style={{
                  position: "relative",
                  top: "18px",
                  paddingBottom: "22px",
                }}
              />
            </FloatingLabel>
          </div>
          <div className="mb-3 mt-4" aria-label="component-redirectTo radio-buttons">
            <div className="d-flex mt-4 pt-3" aria-label="toggler">
              <div className="form-check mx-1">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault1"
                  checked={isRouteWithAComponent}
                  onClick={() => setIsRouteWithAComponent(true)}
                />
                <label className="form-check-label" for="flexRadioDefault1">
                  component
                </label>
              </div>
              <div className="form-check mx-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="flexRadioDefault"
                  id="flexRadioDefault2"
                  checked={!isRouteWithAComponent}
                  onClick={() => setIsRouteWithAComponent(false)}
                />
                <label className="form-check-label" for="flexRadioDefault2">
                  redirectTo
                </label>
              </div>
            </div>
            <div className="mx-1 my-2" aria-label="dropdown-textinput">
              {isRouteWithAComponent && (
                <select
                  className="form-select"
                  aria-label="Default select example"
                >
                  <option selected>Select A Component</option>
                  <option value="0">None</option>
                  <option value="1">Main</option>
                  <option value="2">General</option>
                </select>
              )}
              {!isRouteWithAComponent && (
                <input className="form-control" placeholder="redirectTo" />
              )}
            </div>
          </div>
          <div className="form-check mx-1 my-4">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDisabled"
              checked={showAllRouteObj}
              onChange={() => setShowAllRouteObj(!showAllRouteObj)}
            />
            <label class="form-check-label" for="flexCheckDisabled">
              See All Route Props
            </label>
          </div>
          {showAllRouteObj && (
            <div>
              {isRouteWithAComponent && (
                <div className="d-flex">
                  <div className="mx-1">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                    >
                      <option selected>Select Hydrate Element</option>
                      <option value="0">None</option>
                      <option value="1">Main</option>
                      <option value="2">General</option>
                    </select>
                  </div>
                  <div className="mx-1">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                    >
                      <option selected>Select Error Element</option>
                      <option value="0">None</option>
                      <option value="1">Main</option>
                      <option value="2">General</option>
                    </select>
                  </div>
                </div>
              )}

              <textarea
                className="form-control mx-1 my-3"
                placeholder="add loader callback"
              />
              <textarea
                className="form-control mx-1 my-3"
                placeholder="add lazy callback"
              />
              <textarea
                className="form-control mx-1 my-3"
                placeholder="add shouldRevalidate callback"
              />
              <textarea
                className="form-control mx-1 my-3"
                placeholder="add action callback"
              />
            </div>
          )}
          <div className="btn btn-success mt-3 mx-1">Save Route</div>
        </div>
      </div>

      <div className="mx-3 p-3">
        <table className="table table-bordered table-dark">
          <thead>
            <tr className="text-center">
              <th>Path</th>
              <th>Component</th>
              <th>All Route Props</th>
              <th
                style={{ color: "transparent", userSelect: "none" }}
                colSpan={3}
              >
                options
              </th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr className="text-center" key={route.path}>
                <td>{route.path}</td>
                <td>
                  {route.component ? (
                    route.component
                  ) : (
                    <Link
                      to={route.redirectTo}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {route?.redirectTo?.length > 15
                        ? route.redirectTo.slice(0, 15) + "..."
                        : route?.redirectTo}
                    </Link>
                  )}
                </td>
                <td>
                  <Button
                    variant="dark"
                    onClick={() => handleAllRoutePropsModal(route, "View")}
                    title="View"
                  >
                    <img src={ViewIcon} alt="" height={24} className="mx-2" />
                  </Button>
                </td>
                <td>
                  <ButtonGroup className="d-flex justify-content-center">
                    <Button
                      variant="dark"
                      onClick={() => handleAllRoutePropsModal(route, "Edit")}
                      title="Edit"
                    >
                      <img src={EditIcon} alt="" height={24} className="mx-2" />
                    </Button>
                    <Button variant="dark" title="Delete">
                      <img
                        src={DeleteIcon}
                        alt=""
                        height={24}
                        className="mx-2"
                      />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <ProjectRouteDetails
          routeMode={routeMode}
          routeData={routeObj}
          show={show}
          onHide={handleClose}
          onSubmit={onSubmit}
          routes={routes}
          setProjectRoutes={setRoutes}
          compName="ProjectRouteDetails"
          setSaveRouteRef={setSaveRouteRef}
          searchedRoute={searchedRoute}
          setSearchedRoute={setSearchedRoute}
          clearSearchValue={clearSearchValue}
          addRouteModalShow={addRouteModalShow}
          setAddRouteModalShow={setAddRouteModalShow}
          getFunctionFromConfig={getFunctionFromConfig}
        />
      </div>
      {/* <div>
        <ProjectRouteModal
          routeMode={routeMode}
          routeData={routeObj}
          show={show}
          onHide={handleClose}
          onSubmit={onSubmit}
          routes={routes}
        />
      </div> */}
    </div>
  );
}
