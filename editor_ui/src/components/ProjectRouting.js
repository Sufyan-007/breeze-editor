import { useState, useEffect } from "react";
import { ButtonGroup, Button, InputGroup, Dropdown, DropdownButton } from "react-bootstrap";
import DeleteIcon from "../assets/icons/delete-trash.svg";
import EditIcon from "../assets/icons/edit-icon.svg";
import ViewIcon from "../assets/icons/view-eye.svg";
import ChildRoute from "../assets/icons/child-route-96.png"
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FloatingLabel, Form } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { addRoute, saveAllRoutes} from "../services/ComponentConfigService"
import { setRouterConfig } from '../reducers/RouterConfigReducer';
import "../CSS/ProjectRouteDetails.css";

export default function ProjectRouting() {
  
  // check placing multiple routes in the table and their scrolling 
  // add toggler to see all route including child routes
  // add the hydrate and error element in the backend
  // apply search functionality, try to do it from backend
  // update the addRoute and addChildRoute API such that it only changes the affected route
  // give unique id to each and route object and create updateRoute API

  const [currentOffCanvasRoute, setCurrentOffCanvasRoute] = useState(''); 
  const [displayRoute, setDisplayRoute] = useState(''); 
  const [selectedChildRoute, setSelectedChildRoute] = useState(''); 
  const [childRouteOptions, setChildRouteOptions] = useState('');
  const [parentPath, setParentPath] = useState('parent path');
  const [isRouteWithAComponent, setIsRouteWithAComponent] = useState(true);
  const [routeMode, setRouteMode] = useState('');
  const [searchedRoute, setSearchedRoute] = useState("");
  const [showAllRouteObj, setShowAllRouteObj] = useState(false);
  const [showSelectedRouteObj, setShowSelectedRouteObj] = useState({});
  const { projectName } = useParams();
  const dispatch = useDispatch();
  
  const [selectedProps, setSelectedProps] = useState('');
  const optionalRouteProps = [
    {name: 'Action'},
    {name: 'Loader'},
    {name: 'Lazy'},
    {name: 'ShouldRevalidate'},
    {name: 'ErrorElement'},
    {name: 'HydrateElement'},
  ]

  const onSelect = (selectedList, selectedItem) => {
    console.log(selectedList);
    console.log(selectedItem);
    setShowSelectedRouteObj({...showSelectedRouteObj, [selectedItem['name']] : true});
    setSelectedProps(selectedList);
  }

  const onRemove = (selectedList, selectedItem) => {
    console.log(selectedList);
    setShowSelectedRouteObj({...showSelectedRouteObj, [selectedItem['name']] : false});
    setSelectedProps(selectedList);
  }

  const getFunctionFromConfig = (allRoutes) => {
    return allRoutes.map((route) => {
      let routeObjImplementationProp = {};
      Object.entries(route).forEach((prop) => {
        // prop[0] is key like --> action, loader, lazy, ...
        // prop[1] is its value i.e. the implementation object
        if (prop[1]?.implementation !== undefined && prop[1]?.implementation !== null) {
          let parameters = "";
          let params = prop[1].implementation.parameters.list.map((param) => param["name"]);
          if (prop[1].implementation.parameters.destructured) {
            parameters = `{${params.join()}}`;
          } else {
            parameters = `${params.join()}`;
          }
          routeObjImplementationProp[prop[0]] = `${
            prop[1].implementation.isAsync ? "async " : ""
          }(${parameters}) => { ${prop[1].implementation.body.trim()} }`;
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
  const [allFirstLayerPaths, setAllFirstLayerPaths] = useState([]);

  const displaySerchedRoute = (value) => {
    console.log(searchedRoute);
    console.log(value);
    setSearchedRoute(value);
    console.log(searchedRoute);
  };

  const handleRouteOffCanvas = (route, mode) => {
    setDisplayRoute('');
    setSelectedChildRoute('');
    setIsRouteWithAComponent(true);
    setShowAllRouteObj(false);
    setCurrentOffCanvasRoute(route);
    setDisplayRoute(route)
    setRouteMode(mode);
    if (mode === 'childView') {
      console.log(route.childRoutes);
      setChildRouteOptions(route?.childRoutes ? route.childRoutes : '');
      setDisplayRoute('')
      setSelectedChildRoute('');
    }
  }

  const addNewRoute = () => {
    setCurrentOffCanvasRoute('');
    setDisplayRoute('');
    setIsRouteWithAComponent(true);
    setShowAllRouteObj(false);
    setRouteMode('Add');
    setSelectedChildRoute('');
    setParentPath('parent path')
    setAllFirstLayerPaths(['none', ...routes.map(route =>  route.path)]);
  }

  const handleRouteObjectChange = (route, prop, event) => {
    if (routeMode !== 'View') {
      (setDisplayRoute({...route, [prop] : event.target.value}))
    }
  }

  const addChildroute = () => {
    setSelectedChildRoute(''); 
    setDisplayRoute('');
  }

  const saveRoute = async () => {

    if (displayRoute?.path) {
      if (displayRoute.path[0] !== '/') {
        displayRoute.path = '/' + displayRoute.path;
      }
    }

    if (!displayRoute.path || !(displayRoute.component || displayRoute.redirectTo) ) {
      // add a toaster
      console.log('Incomplete Route Details');
      return;
    }

    if (routeMode === 'Edit' || routeMode === 'Add') {
      if (routeMode === 'Add') {
        let res = await addRoute(displayRoute, projectName);
        if (res.status === 200) {
          dispatch(setRouterConfig(res.body));
          let updatedRoutes = getFunctionFromConfig(res.body.routes);
          setRoutes(updatedRoutes);
          setDisplayRoute('');
        } else {
          // add toaster
          console.log(res.body.error);
        }

      } else if (routeMode === 'Edit') {
        // using the saveAllRoutes API until the updateRoute API is made
        let updatedRoutes = routes.map((route) => {
          if (route.path === currentOffCanvasRoute.path ) {
            route = displayRoute;
          }
          return route;
        });
        let res = await saveAllRoutes(updatedRoutes, projectName);
        if (res.status === 200) {
          dispatch(setRouterConfig(res.body));
          let updatedRoutes = getFunctionFromConfig(res.body.routes);
          setRoutes(updatedRoutes);
          setDisplayRoute('');
        } else {
          // add toaster
          console.log(res.body.error);
        }
      }

    } else if (routeMode === 'childView') {
      // if selectedChildRoute is present and childView mode then save 
      // 1. the edited displayRoute by replacing it with the selectedChildRoute 
      // present in currentOffcanvas route's childRoutes array and then add the currentOffcanvas route 
      // with the add API
      // 2. add the new child route by saving the displayRoute object with addroute API
      // by appending displayRoute Object to the currentOffcanvasRoute object's childRoutes array



      console.log(displayRoute);
      console.log(selectedChildRoute);
      console.log(currentOffCanvasRoute);
    }

    // use setRoutes when get the successful API response to update the routes in the table
    // and then clear the offcanvas form and emit the toaster
  }

  useEffect(() => {
    // routes.map((route) => {

    // });
  }, []);

  return (
    <div className="container-fluid text-white hide-scrollbar">
      <div className="mt-3 mb-1 mx-4">
        <h3 className="ms-2">Project Routes:</h3>
      </div>
      <div className="d-flex justify-content-end mt-1 mb-3 mx-4">
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
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasRight"
          aria-controls="offcanvasRight"
          onClick={() => addNewRoute()}
        >
          Add Route
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
        <div className="offcanvas-header mx-1">
          <h5 id="offcanvasRightLabel">
            {currentOffCanvasRoute
              ? routeMode === "childView"
                ? "Child Routes"
                : `${routeMode} Route`
              : "Add Route or Child Route"}
          </h5>
          <button
            type="button"
            className="btn-close text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body pdt">
          {routeMode === "childView" && (
            <div className="">
              <div className="mb-3 mx-1">
                {childRouteOptions && (
                  <div className="d-flex ">
                    <div className="flex-grow-1">
                      <Form.Label className="ms-1" style={{color: "#ae9959"}}>
                        Select To View/Edit Child Route
                      </Form.Label>
                      <Form.Select
                        aria-label="Default select example"
                        className={`${routeMode === "childView" ? "" : "mb-3"} `}
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            let macthedRoute = childRouteOptions.find(
                              (route) => route.path === e.target.value
                            );
                            setSelectedChildRoute(macthedRoute);
                            setDisplayRoute(macthedRoute);
                          } else {
                            setSelectedChildRoute("");
                            setDisplayRoute("");
                          }
                        }}
                        value={selectedChildRoute?.path || ""}
                      >
                        (<option value="">None</option>)
                        {[
                          ...new Set(childRouteOptions?.map((route) => route)),
                        ].map(
                          (route, index) =>
                            route.path && (
                              <option key={index} value={route.path}>
                                {route.path +
                                  " - " +
                                  (route.component || route.redirectTo)}
                              </option>
                            )
                        )}
                      </Form.Select>
                    </div>
                    <div className={`${selectedChildRoute ? "" : "disableRouteButton"} btn btn-primary ms-3 newChildRouteButton`}>
                      <div className="" onClick={() => addChildroute()}>Add New Route</div>
                    </div>
                  </div>
                )}
                {childRouteOptions === '' && (
                  <input
                    className="form-control"
                    value="No child route present, add one!"
                    disabled
                  />
                )}
              </div>
            </div>
          )}
          <div className="mx-1 form-floating" aria-label="path-input">
            <InputGroup className="">
              {routeMode === "childView" && (
                <InputGroup.Text className="mt-3 pb-3 pt-3" id="basic-addon1" title="parent path" role="button">
                  {currentOffCanvasRoute.path}
                </InputGroup.Text>
              )}
              {routeMode === "Add" && (
                <DropdownButton
                // variant="outline-secondary"
                title={parentPath}
                id="newRouteDropdown"
                size="4"
                className="mt-3 pb-3 pt-3 btn-secondary custom-parent-path-scroll"
              >
                <div className="custom-parent-path-scroll">
                  {allFirstLayerPaths?.map(path => (
                  <Dropdown.Item className="px-3" size="5" id="newRouteDropdownOptions" onClick={() => setParentPath(path)}>{path}</Dropdown.Item>
                  ))}
                </div>
              </DropdownButton>
              )}

              <FloatingLabel
                controlId="floatingInputGrid-path"
                label="route path"
              >
                <Form.Control
                  type="text"
                  contentEditable={true}
                  className={`${routeMode === "Add" ? 'mb-3' : 'mb-1'} py-1`}
                  style={{
                    position: "relative",
                    top: (routeMode === "childView" || routeMode === "Add") ? "16px" : "18px",
                    paddingBottom: "25px",
                  }}
                  value={displayRoute ? displayRoute.path : ""}
                  onChange={(e) =>
                    handleRouteObjectChange(displayRoute, "path", e)
                  }
                />
              </FloatingLabel>
            </InputGroup>
          </div>
          <div
            className="mb-3 mt-1"
            aria-label="component-redirectTo radio-buttons"
          >
            <div className={`d-flex ${routeMode === "Add" ? 'mt-1' : 'mt-4'} pt-3`} aria-label="toggler">
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
                  value={displayRoute.component || ""}
                  onChange={(e) =>
                    handleRouteObjectChange(displayRoute, "component", e)
                  }
                  disabled={routeMode === "View"}
                >
                  (<option value="">None</option>)
                  {[...new Set(routes.map((route) => route.component))].map(
                    (component, index) =>
                      component && (
                        <option key={index} value={component}>
                          {component}
                        </option>
                      )
                  )}
                </select>
              )}
              {!isRouteWithAComponent && (
                <input
                  className="form-control"
                  placeholder="redirectTo"
                  value={displayRoute.redirectTo || ""}
                  onChange={(e) =>
                    handleRouteObjectChange(displayRoute, "redirectTo", e)
                  }
                  disabled={routeMode === "View"}
                />
              )}
            </div>
          </div>
          <div className=" mx-1 my-2">
            
            <Multiselect
              className="form-control p-0 text-white"
              options={optionalRouteProps}
              selectedValues={selectedProps}
              onSelect={onSelect}
              onRemove={onRemove}
              displayValue="name"
              showCheckbox={true}
              placeholder="Other Route Objects"
              style={{
                option: {
                  backgroundColor: "#212529",
                  padding: ".5rem 3rem .5rem .5rem",
                  cursor: "pointer",
                }, 
                searchBox: { border: "none", "border-bottom": "1px solid blue", "border-radius": "0px" }  
              }}
            />
          </div>
          {!showAllRouteObj && (
            <div>
              {/* {isRouteWithAComponent && ( */}
              {true && (
                <div className="d-flex">
                  { showSelectedRouteObj.HydrateElement && (<div className="mx-1">
                    <label className="ms-2">Hydrate Element</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={displayRoute.hydrateComponent || ""}
                      onChange={(e) =>
                        handleRouteObjectChange(
                          displayRoute,
                          "hydrateComponent",
                          e
                        )
                      }
                      disabled={routeMode === "View"}
                    >
                      (<option value="">None</option>)
                      {[...new Set(routes.map((route) => route.component))].map(
                        (component, index) =>
                          component && (
                            <option key={index} value={component}>
                              {component}
                            </option>
                          )
                      )}
                    </select>
                  </div>)}
                  { showSelectedRouteObj.ErrorElement && (<div className="mx-1">
                    <label className="ms-2">Error Element</label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      value={displayRoute.errorElement || ""}
                      onChange={(e) =>
                        handleRouteObjectChange(displayRoute, "errorElement", e)
                      }
                      disabled={routeMode === "View"}
                    >
                      (<option value="">None</option>)
                      {[...new Set(routes.map((route) => route.component))].map(
                        (component, index) =>
                          component && (
                            <option key={index} value={component}>
                              {component}
                            </option>
                          )
                      )}
                    </select>
                  </div>)}
                </div>
              )}

              {showSelectedRouteObj.Action && (<div className="my-3">
                <div>
                  <label className="ms-2">Action</label>
                </div>
                <textarea
                  className="form-control mx-1 mb-1"
                  placeholder="add action callback"
                  value={displayRoute.action || ""}
                  onChange={(e) =>
                    handleRouteObjectChange(displayRoute, "action", e)
                  }
                  rows={3}
                />
              </div>)}
              {showSelectedRouteObj.Loader && (<div className="my-3">
                <div>
                  <label className="ms-2">Loader</label>
                </div>
              <textarea
                className="form-control mx-1 mt-1 mb-3"
                placeholder="add loader callback"
                value={displayRoute.loader || ""}
                onChange={(e) =>
                  handleRouteObjectChange(displayRoute, "loader", e)
                }
                rows={3}
              />
              </div>)}
              {showSelectedRouteObj.Lazy && (<div className="my-3">
                <div>
                  <label className="ms-2">Lazy</label>
                </div>
              <textarea
                className="form-control mx-1 mt-1 mb-3"
                placeholder="add lazy callback"
                value={displayRoute.lazy || ""}
                onChange={(e) =>
                  handleRouteObjectChange(displayRoute, "lazy", e)
                }
                rows={3}
              />
              </div>)}
              {showSelectedRouteObj.ShouldRevalidate && (<div className="my-3">
                <div>
                  <label className="ms-2">ShouldRevalidate</label>
                </div>
              <textarea
                className="form-control mx-1 mt-1 mb-3"
                placeholder="add shouldRevalidate callback"
                value={displayRoute.shouldRevalidate || ""}
                onChange={(e) =>
                  handleRouteObjectChange(displayRoute, "shouldRevalidate", e)
                }
                rows={3}
              />
              </div>)}

            </div>
          )}
          {routeMode !== "View" && (
            <div className="my-4">
              <div className={`${displayRoute ? '' : 'disableRouteButton'} btn btn-success mx-1`} onClick={() => saveRoute()}>Save Changes</div>
              { selectedChildRoute && (<div className={`${displayRoute ? '' : 'disableRouteButton'} btn btn-danger mx-1`}>Delete Route</div>)}
            </div>
          )}
        </div>
      </div>

      <div className="mx-3 p-3">
        <table className="table table-bordered table-dark">
          <thead>
            <tr className="text-center">
              <th>Path</th>
              <th>Component</th>
              <th>Child Routes</th>
              <th colSpan={3}>Actions</th>
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
                    data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasRight"
                    onClick={() => handleRouteOffCanvas(route, "childView")}
                    title="View"
                  >
                    <img src={ChildRoute} alt="" height={24} className="" />
                  </Button>
                </td>
                <td>
                  <ButtonGroup className="d-flex justify-content-center">
                    <Button
                      variant="dark"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      onClick={() => handleRouteOffCanvas(route, "Edit")}
                      title="Edit"
                    >
                      <img src={EditIcon} alt="" height={24} className="" />
                    </Button>
                    <Button
                      variant="dark"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      onClick={() => handleRouteOffCanvas(route, "View")}
                      title="View"
                    >
                      <img src={ViewIcon} alt="" height={24} className="" />
                    </Button>
                    <Button variant="dark" title="Delete">
                      <img src={DeleteIcon} alt="" height={24} className="" />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
