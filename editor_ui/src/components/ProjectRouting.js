import { useState, useEffect, useRef, useMemo } from "react";
import { ButtonGroup, Button, InputGroup } from "react-bootstrap";
import DeleteIcon from "../assets/icons/delete-trash.svg";
import EditIcon from "../assets/icons/edit-icon.svg";
import ViewIcon from "../assets/icons/view-eye.svg";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoaderData } from "react-router";
import { FloatingLabel, Form } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import { saveRoute, addChildRoute, editChildRoute, deleteChildRoute, deleteBaseRoute} from "../services/ComponentConfigService"
import { setRouterConfig } from '../reducers/RouterConfigReducer';
import { getRouterConfig } from '../services/ConfigService';
import Select from 'react-select';
import ToasterComponent from "../common/display/d.toast"
import ModalComponent from "../common/display/d.modal"
import MonacoEditor from "./common/MonacoEditor";
import "../css/ProjectRouting.css";

export default function ProjectRouting() {

  const [currentOffCanvasRoute, setCurrentOffCanvasRoute] = useState(''); 
  const [displayRoute, setDisplayRoute] = useState(''); 
  const [selectedParentPathRoute, setSelectedParentPathRoute] = useState('');
  const [isRouteWithAComponent, setIsRouteWithAComponent] = useState(true);
  const [routeMode, setRouteMode] = useState('');
  const [searchedRoute, setSearchedRoute] = useState("");
  const [showAllRouteObj, setShowAllRouteObj] = useState(false);
  const [showSelectedRouteObj, setShowSelectedRouteObj] = useState({});
  const { projectName } = useParams();
  const dispatch = useDispatch();
  const initialRouterConfig = useLoaderData();
  const routerConfig = useSelector(state => state.routerConfig);
  const [selectedProps, setSelectedProps] = useState('');
  const selectRef = useRef(null);
  const optionalRouteProps = [
    {name: 'All'},
    {name: 'Action'},
    {name: 'Loader'},
    {name: 'Lazy'},
    {name: 'ShouldRevalidate'},
    {name: 'ErrorElement'},
    {name: 'HydrateElement'},
  ]
  
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('test');
  const [modalBody, setModalBody] = useState('testBody');
  const [modalSubmitHandler, setModalSubmitHandler] = useState(null);
  const [isSubmitButtonPresent, setIsSubmitButtonPresent] = useState(false);
  
  const loadDeleteRouteModal = (submitHandler) => {
    setModalTitle('Delete Route');
    setModalBody('All the related routes will be affected, are you sure you want to delete it?');
    setIsSubmitButtonPresent(true);
    setModalSubmitHandler(() => () => {
      submitHandler();
      setIsModalVisible(false);
    });
    setIsModalVisible(true);
  }

  const [toasterObject, setToasterObject] = useState({});
  const [showToaster, setShowToaster] = useState(false);

  const closeToaster = () => {
    setShowToaster(false);
    setToasterObject({})
  }

  const onSelect = (selectedList, selectedItem) => {
    if (selectedItem['name'] === 'All') {
      let newList = {}
      optionalRouteProps.forEach(element => {
        newList[element['name']] = true
      });
      setShowSelectedRouteObj(newList);
      setSelectedProps(optionalRouteProps);
    } else {
      setShowSelectedRouteObj({...showSelectedRouteObj, [selectedItem['name']] : true});
      setSelectedProps(selectedList);
    }
  }

  const onRemove = (selectedList, selectedItem) => {
    if (selectedItem['name'] === 'All') {
      let newList = {}
      optionalRouteProps.forEach(element => {
        newList[element['name']] = false
      });
      setShowSelectedRouteObj(newList);
      setSelectedProps([]);
    } else {
      setShowSelectedRouteObj({...showSelectedRouteObj, [selectedItem['name']] : false});
      setSelectedProps(selectedList);
    }
  }

  const getFunctionFromConfig = (allRoutes) => {
    let entries = Object.entries(allRoutes)
    entries = entries.map(obj => {
      let route_obj = JSON.parse(JSON.stringify(obj))
      route_obj[1]['fullPath'] = route_obj[0]
      return route_obj[1];
    })
    // sort by fullPath
    entries.sort((a, b) => {
      const nameA = a.fullPath.toUpperCase(); 
      const nameB = b.fullPath.toUpperCase(); 
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return entries?.map((route) => {
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
      });
      return { ...route, ...routeObjImplementationProp };
    });
  };

  const allRoutes = useMemo(
    () => getFunctionFromConfig(routerConfig?.routes || initialRouterConfig?.routes),
    [routerConfig?.routes, initialRouterConfig?.routes]
  );

  const [routes, setRoutes] = useState([...allRoutes]);
  const [parentRouteOptions, setParentRouteOptions] = useState(
    [{value: 'none', label: 'None'}, ...allRoutes.map(route => ({value: route, label: route.fullPath}))]
  );

  const displaySearchedRoute = (value) => {
    setSearchedRoute(value);
    let filteredDisplayRoutes = allRoutes.filter(
      (route) =>
        value === "" ||
        route.path?.includes(value) ||
        route.component?.toLowerCase()?.includes(value.toLowerCase()) ||
        route.redirectTo?.toLowerCase()?.includes(value.toLowerCase())
    );
    setRoutes(filteredDisplayRoutes);
  };

  const handleRouteOffCanvas = (route, mode) => {
    setShowAllRouteObj(false);
    setCurrentOffCanvasRoute({...route});
    setDisplayRoute(route)
    setRouteMode(mode);
    setSelectedProps('');
    setShowSelectedRouteObj('');
    route.component ? setIsRouteWithAComponent(true) : setIsRouteWithAComponent(false);
  }

  const addNewRoute = () => {
    setCurrentOffCanvasRoute('');
    setDisplayRoute('');
    setIsRouteWithAComponent(true);
    setShowAllRouteObj(false);
    setRouteMode('Add');
    if (selectRef.current)
      selectRef.current.clearValue();
    setSelectedParentPathRoute('')
    setSelectedProps('');
    setShowSelectedRouteObj('');
    setParentRouteOptions(
      [
        {value: 'none', label: 'None'}, 
        ...allRoutes.map(route => ({value: route, label: route.fullPath}))
      ]
    );
  }

  const handleRouteObjectChange = (route, prop, event) => {
    let callBackFunction = '';
    if (routeMode !== 'View') {
      if (typeof(event) === "string") {
        callBackFunction = event.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g,'');
      } else {
        callBackFunction = event.target.value;
      }
      (setDisplayRoute({...route, [prop] : callBackFunction}))
    }
  }

  const setTheRouteResponse = (res) => {
    if (res.status === 200) {
      dispatch(setRouterConfig(res.body));
      let updatedRoutes = getFunctionFromConfig(res.body.routes);
      setRoutes(updatedRoutes);
      setParentRouteOptions([{value: 'none', label: 'None'}, ...allRoutes.map(route => ({value: route, label: route.fullPath}))])
      setDisplayRoute('');
      setSearchedRoute('');
    } else {
        console.log(res.body);
        setShowToaster(true);
        setToasterObject({
          'toastTitle': 'Oops found an error!',
          'toastBody': `${res.body}`,
          'variant': 'warning',
          'closeButton': false
        });
      }
  }

  const saveTheRoute = async () => {

    if (displayRoute?.path) {
      if (displayRoute.path[0] !== '/') {
        displayRoute.path = '/' + displayRoute.path;
      }
    }

    if (!displayRoute.path || !(displayRoute.component || displayRoute.redirectTo) ) {
      console.log('Incomplete Route Details');
      setShowToaster(true);
      setToasterObject({
        'toastTitle': 'Oops found an error!',
        'toastBody': 'Incomplete Route Details',
        'closeButton': false
      });
      return;
    }

    if (routeMode === 'Edit' || routeMode === 'Add') {
      if (routeMode === 'Add') {
        if (!selectRef.current.getValue()[0] || selectRef.current.getValue()[0].value === 'none') {
          let res = await saveRoute(displayRoute, projectName);
          setTheRouteResponse(res);
        } else {
          // add child route to the selected parent route
          let childObj = {
            fullParentPath: selectedParentPathRoute.fullPath,
            ...displayRoute
          }
          let res = await addChildRoute(childObj, projectName);
          setTheRouteResponse(res);
        }

      } else if (routeMode === 'Edit' && currentOffCanvasRoute.initialParentPath) {
          let selectedParentValue = selectRef.current.getValue()[0]
          if (selectedParentValue) {
            displayRoute.newFullParentPath = selectedParentValue.value.fullPath || 'none';
          } 
          let childObj = {
            fullParentPath: currentOffCanvasRoute.fullPath.substring(0, currentOffCanvasRoute.fullPath.length - currentOffCanvasRoute.path.length),
            prevPath: currentOffCanvasRoute.path,
            ...displayRoute
          }
          let res = await editChildRoute(childObj, projectName);
          setTheRouteResponse(res);
      } else if (routeMode === 'Edit') {
          displayRoute.prevPath = currentOffCanvasRoute.path;
          let selectedParentValue = selectRef.current.getValue()[0]
          if (selectedParentValue) {
            displayRoute.newFullParentPath = selectedParentValue.value.fullPath || 'none';
          } 
          let res = await saveRoute(displayRoute, projectName);
          setTheRouteResponse(res);
      }

    }
  }

  const deleteTheRoute = async (route) => {
    // TODO: add a popup here, and on confirmation delete the route
    if (route.initialParentPath) {
      let res = await deleteChildRoute(route, projectName);
      setTheRouteResponse(res);
    } else {
      let res = await deleteBaseRoute(route, projectName);
      setTheRouteResponse(res);
    }
  }

  useEffect(() => {
    if (routeMode === 'Edit') {
      if (currentOffCanvasRoute.initialParentPath) {
        let requiredParent = routes.find(eachRoute => 
          eachRoute.fullPath === currentOffCanvasRoute.fullPath.substring(
            0, currentOffCanvasRoute.fullPath.length - currentOffCanvasRoute.path.length
          )
        );
        if (selectRef.current) {
          setSelectedParentPathRoute(requiredParent);
          selectRef.current.setValue({value: requiredParent, label: requiredParent.fullPath});
          setParentRouteOptions(
            [
              {value: 'none', label: 'None'},
              ...allRoutes.filter(route => route.fullPath !== currentOffCanvasRoute.fullPath).map(
                route => ({value: route, label: route.fullPath})
              )                  
            ]
          );
        }
      } else {
        setSelectedParentPathRoute('');
        if (selectRef.current) {
          selectRef.current.clearValue();
          setParentRouteOptions(
            [
              {value: 'none', label: 'None'},
              ...allRoutes.filter(route => route.fullPath !== currentOffCanvasRoute.fullPath).map(
                route => ({value: route, label: route.fullPath})
              )                  
            ]
          );
        }
      }
    }
  }, [routeMode, currentOffCanvasRoute, routes, allRoutes]);

  return (
    <div className="container-fluid text-white">
      <div className="mt-3 mb-1 mx-4">
        <h3 className="ms-2">Project Routes:</h3>
      </div>
      <div className="d-flex justify-content-end mt-1 mb-2 mx-4">
        <div className="d-flex">
          <div
            data-bs-theme="dark"
            className="me-2"
            type="button"
            onChange={(e) => displaySearchedRoute(e.target.value)}
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
            data-bs-target="#projectRoutingOffcanvasRight"
            aria-controls="projectRoutingOffcanvasRight"
            onClick={() => addNewRoute()}
          >
            Add Route
          </button>
        </div>
      </div>

      {/* offcanvas starts */}
      <div
        className={`offcanvas offcanvas-end ${routeMode === 'Add' ? 'addModeWidth' : 'normalWidth'}`}
        data-bs-theme="dark"
        tabindex="-1"
        id="projectRoutingOffcanvasRight"
        aria-labelledby="projectRoutingOffcanvasRightLabel"
      >
        <div className="offcanvas-header mx-1 text-muted">
          <h5 id="projectRoutingOffcanvasRightLabel">
            {currentOffCanvasRoute
              ? routeMode === "childView"
                ? "Manage Child Routes"
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
        <div className="offcanvas-body pdt text-muted">
          <div>
            <div>
              <div className="mx-1 form-floating" aria-label="path-input">
                <InputGroup className="">
                  {routeMode === "childView" && (
                    <InputGroup.Text className="mt-3 pb-3 pt-3" id="basic-addon1" title="parent path" role="button">
                      {currentOffCanvasRoute.path}
                    </InputGroup.Text>
                  )}
                  {(routeMode === "Add" || routeMode === "Edit" ) && (
                    <div style={{width: "60%"}}>
                      <Select
                        className="newRouteDropdown mt-3"
                        style={{width: "60%"}}
                        ref={selectRef}
                        isClearable={true}
                        placeholder="Select.. or search.. a parent path"
                        options={parentRouteOptions}
                        onChange={e => {
                          if (e?.value) {
                            setSelectedParentPathRoute(e.value);
                          }
                        }}
                        styles={{
                          placeholder: (base) => ({
                            ...base,
                            color: '#dee2e6bf'
                          }),
                          input: (base) => ({
                            ...base,
                            color: '#dee2e6bf'
                          }),
                          singleValue: (base) => ({
                            ...base,
                            color: '#dee2e6bf'
                          }),
                          control: (styles) => ({
                            ...styles,
                            backgroundColor: "#212529",
                            borderTopRightRadius: '0',
                            borderBottomRightRadius: '0',
                            borderColor: '#495057',
                            color: 'white',
                          }),
                          option: (base) => ({
                            ...base,
                            backgroundColor: "#212529",
                            width: '100%',
                            height: '100%',
                            color: '#dee2e6bf'
                          }),
                        }}
                      />
                    </div>

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
                        top: (routeMode === "childView" || routeMode === "Add" || routeMode === "Edit") ? "16px" : "18px",
                        paddingBottom: "25px",
                        minHeight: (routeMode === 'Add' || routeMode === "Edit") ? "38px" : "58px",
                        height: (routeMode === 'Add' || routeMode === "Edit") ? "38px" : "58px"
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
                {routeMode === 'View' && (<div
                  className="mx-1"
                >
                  <FloatingLabel
                    controlId="floatingInputGrid-path"
                    label="full route path"
                  >
                    <Form.Control
                      type="text"
                      contentEditable={true}
                      className={`my-3 py-1 form-floating`}
                      style={{
                        position: "relative",
                        top: (routeMode === "childView" || routeMode === "Add") ? "16px" : "18px",
                        paddingBottom: "25px",
                        minHeight: routeMode === 'Add' ? "38px" : "58px",
                        height: routeMode === 'Add' ? "38px" : "58px"
                      }}
                      value={displayRoute ? displayRoute.fullPath : ""}
                    />
                  </FloatingLabel>
                </div>)}

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
                      {[...new Set(routes?.map((route) => route.component))].map(
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
                  id="otherRouteObjectsMultiselect"
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
                  {isRouteWithAComponent && (
                    <div className="d-flex mt-1">
                      { showSelectedRouteObj.HydrateElement && (<div className="mx-1">
                        <label className="ms-2">Hydrate Element</label>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          value={displayRoute.hydrateFallbackElement || ""}
                          onChange={(e) =>
                            handleRouteObjectChange(displayRoute, "hydrateFallbackElement", e)
                          }
                          disabled={routeMode === "View"}
                        >
                          (<option value="">None</option>)
                          {[...new Set(routes?.map((route) => route.component))].map(
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
                          {[...new Set(routes?.map((route) => route.component))].map(
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
                    <div className="mx-1 mb-1">
                      <MonacoEditor
                        defaultValue={displayRoute.action || "/* Add action callback */"}
                        onChange={(e) =>
                          handleRouteObjectChange(displayRoute, "action", e)
                        }
                        height="120px"
                        width="560px"
                        id={`${routeMode !== 'Add' ? currentOffCanvasRoute.path : ''}-action`}
                        language="javascript"
                      />
                    </div>
                  </div>)}
                  {showSelectedRouteObj.Loader && (<div className="my-3">
                    <div>
                      <label className="ms-2">Loader</label>
                    </div>
                    <div className="mx-1 mt-1 mb-3">
                      <MonacoEditor
                        defaultValue={displayRoute.loader || "/* Add loader callback */"}
                        onChange={(e) =>
                          handleRouteObjectChange(displayRoute, "loader", e)
                        }
                        height="120px"
                        width="560px"
                        id={`${routeMode !== 'Add' ? currentOffCanvasRoute.path : ''}-loader`}
                        language="javascript"
                      />
                    </div>
                  </div>)}
                  {showSelectedRouteObj.Lazy && (<div className="my-3">
                    <div>
                      <label className="ms-2">Lazy</label>
                    </div>
                    <div className="mx-1 mt-1 mb-3">
                      <MonacoEditor
                        defaultValue={displayRoute.lazy || "/* Add lazy callback */"}
                        onChange={(e) =>
                          handleRouteObjectChange(displayRoute, "lazy", e)
                        }
                        height="120px"
                        width="560px"
                        id={`${routeMode !== 'Add' ? currentOffCanvasRoute.path : ''}-lazy`}
                        language="javascript"
                      />
                    </div>
                  </div>)}
                  {showSelectedRouteObj.ShouldRevalidate && (<div className="my-3">
                    <div>
                      <label className="ms-2">ShouldRevalidate</label>
                    </div>
                    <div className="mx-1 mt-1 mb-3">
                      <MonacoEditor
                        defaultValue={displayRoute.shouldRevalidate || "/* Add shouldRevalidate callback */"}
                        onChange={(e) =>
                          handleRouteObjectChange(displayRoute, "shouldRevalidate", e)
                        }
                        height="120px"
                        width="560px"
                        id={`${routeMode !== 'Add' ? currentOffCanvasRoute.path : ''}-shouldRevalidate`}
                        language="javascript"
                      />
                    </div>
                  </div>)}
                </div>
              )}
              {routeMode !== "View" && (
                <div className="my-4">
                  <div 
                    className={`${displayRoute ? '' : 'disableRouteButton'} btn btn-success mx-1`}
                    onClick={() => saveTheRoute()}
                    data-bs-dismiss="offcanvas"
                  >
                    {routeMode === 'Add' ? 'Save Route' : 'Save Changes'}
                  </div>
                  
                  <div 
                    className={`${displayRoute ? '' : 'disableRouteButton'} btn btn-danger mx-1`}
                    data-bs-dismiss="offcanvas"
                    onClick={() => {
                        loadDeleteRouteModal(() => {
                          deleteTheRoute(currentOffCanvasRoute)
                        }
                      )}
                    }
                  >
                    Delete Route
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* offcanvas ends */}

      {/* Route table starts */}
      { routes && (<div className="mx-3 px-3" style={{ maxHeight: "560px", overflowY: "auto" }}>
        <table className="table table-bordered table-dark table-responsive">
          <thead>
            <tr className="text-center">
              <th>Full Path</th>
              <th>Relative Path</th>
              <th>Component / redirectURL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(routes.map((route) => (
              <tr className="text-center" key={route.path}>
                <td width={"30%"} title={route.fullPath}>{route.fullPath}</td>
                <td width={"20%"} title={`${route.path}${route.initialParentPath ? ' - is a Child Route' : ''}`}>{route.path}{route.initialParentPath ? ' (CR)' : ''}</td>
                <td width={"20%"} title={route.component ? route.component : route.redirectTo}>
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
                <td width={"20%"}>
                  <ButtonGroup className="d-flex justify-content-center">
                    <Button
                      variant="dark"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#projectRoutingOffcanvasRight"
                      onClick={() => handleRouteOffCanvas(route, "Edit")}
                      title="Edit"
                    >
                      <img src={EditIcon} alt="" height={24} className="" />
                    </Button>
                    <Button
                      variant="dark"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#projectRoutingOffcanvasRight"
                      onClick={() => handleRouteOffCanvas(route, "View")}
                      title="View"
                    >
                      <img src={ViewIcon} alt="" height={24} className="" />
                    </Button>
                    <Button 
                      variant="dark"
                      title="Delete"
                      onClick={() => {
                        loadDeleteRouteModal(() => {
                          deleteTheRoute(route)
                        })
                      }}
                    >
                      <img src={DeleteIcon} alt="" height={24} className="" />
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>)}
      { !routes && <div>
        <div className="noRoutesPresent m-5">
          No Routes Present, add some!
        </div>
      </div>}
      {/* Route table ends */}

      {/* Modal */}
      <div>
        <ModalComponent
          showModal={isModalVisible}
          modalTitle={modalTitle}
          modalBody={modalBody}
          handleClose={() => setIsModalVisible(false)}
          submitText={'Delete Route'}
          submitHandler={modalSubmitHandler}
          isSubmitButtonPresent={isSubmitButtonPresent}
          submitVariant={'danger'}
        />
      </div>

      {/* toaster */}
      <ToasterComponent
        showToaster={showToaster}
        toastTitle={toasterObject.toastTitle || ''}
        toastBody={toasterObject.toastBody || ''}
        variant={toasterObject.variant}
        position={toasterObject.position}
        delay={toasterObject.delay}
        autohide={toasterObject.autohide}
        closeButton={toasterObject.closeButton}
        onClose={() => closeToaster()}
      />
    </div>
  );
}

export async function routerConfigLoader({ params }) {
  const projectName = params.projectName;
  const config = await getRouterConfig(projectName);
  return config;
}
