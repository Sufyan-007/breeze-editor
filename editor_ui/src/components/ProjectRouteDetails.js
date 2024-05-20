import React, { useEffect } from "react";
import { useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import Multiselect from "multiselect-react-dropdown";
import ProjectRouteModal from "./ProjectRouteModal";
import DeleteIcon from "../assets/icons/delete-trash.svg";
import "../CSS/ProjectRouteDetails.css";
import ComponentConfigService from "../services/ComponentConfigService";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { useMemo } from "react";

function ProjectRouteDetails(props) {
  const {
    routes,
    setProjectRoutes,
    compName,
    setSaveRouteRef,
    routeMode,
    searchedRoute,
    setSearchedRoute,
    clearSearchValue,
    setAddRouteModalShow,
    addRouteModalShow,
    getFunctionFromConfig
  } = props;

  const [show, setShow] = useState(false);
  const [routeObj, setRouteObj] = useState({});

  const [selectedChildRoutes, setSelectedChildRoutes] = useState([]);
  const [allRoutes, setAllRoutes] = useState(routes);
  const [selectedRadioForURLOrComponent, setSelectedRadioForURLOrComponent] =
    useState({});
  const [showAllRouteProp, setShowAllRouteProp] =
    useState({});
  const [displayRoute, setDisplayRoute] = useState(
    JSON.parse(JSON.stringify(routes))
  );
  const [childModalState, setChildModalState] = useState();
  const { projectName } = useParams();
  const dispatch = useDispatch();
  const configService = useMemo(() => {
    if (projectName) return new ComponentConfigService(projectName, dispatch);
  }, [projectName, dispatch]);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    // setRouteMode("");
    setShow(false);
  };
  const onSubmit = (data) => {
    console.log(data);
  };

  useEffect(() => {}, []);

  function handleAllRoutePropsModal(routeObj, routeMode) {
    handleShow();
    // setRouteObj(routeObj);
    // setRouteMode(routeMode);
  }

  const handlehydrateComponentChange = (index, value) => {
    const newRoutes = [...allRoutes];
    newRoutes[index] = { ...newRoutes[index], hydrateComponent: value };
    setAllRoutes(newRoutes);
  };

  const handleErrorElementChange = (index, value) => {
    const newRoutes = [...allRoutes];
    newRoutes[index] = { ...newRoutes[index], errorElement: value };
    setAllRoutes(newRoutes);
  };

  const handleRouteComponentChange = (currentRouteIndex, selectedComp) => {
    const newRoutes = allRoutes.map((route, index) => {
      if (index === currentRouteIndex) {
        return { ...route, component: selectedComp, redirectTo: "" };
      }
      return route;
    });
    setAllRoutes(newRoutes);
  };

  const handleRouteChange = (index, value) => {
    const newRoutes = [...allRoutes];
    newRoutes[index] = { ...newRoutes[index], path: value };
    setSearchedRoute('');
    setAllRoutes(newRoutes);
  };

  const handleRedirectToChange = (currentRouteIndex, value) => {
    const newRoutes = [...allRoutes];
    newRoutes[currentRouteIndex] = {
      ...newRoutes[currentRouteIndex],
      redirectTo: value,
      component: "",
    };
    setAllRoutes(newRoutes);
  };

  const handleRouteObjectProps = (index, prop, value) => {
    setAllRoutes(
      allRoutes.map((route, currentIndex) => {
        if (index === currentIndex) return { ...route, [prop]: value };
        return route;
      })
    );
  };

  const childRouteOptions = (index) => {
    return displayRoute.filter(
      (route) => route.path !== "/" && displayRoute[index].path !== route.path
    );
  };

  const handleRedirectToOrComponentChange = (index, value) => {
    setSelectedRadioForURLOrComponent({
      ...selectedRadioForURLOrComponent,
      [index]: value,
    });
  };

  const onSelect = (selectedRoutes, selectedChildRoute) => {
    setSelectedChildRoutes(selectedRoutes);
  };

  const onRemove = (selectedRoutes, removedChildRoute) => {
    setSelectedChildRoutes(selectedRoutes);
  };

  const viewAddChildRoute = (route, state) => {
    console.log(route);
    handleShow();
    setChildModalState(state);
    setRouteObj({
      ...route
    });
  };

  const addChildRoute = async (childObj) => {
    console.log("-------------childObj----------------");
    console.log(childObj);
    childObj['action'] = "() => {console.log('jap')}"
    handleClose();
    let res = await configService.addChildRoute(childObj);
    console.log(res);
    if (res.status === 200) {
      let updatedRoutes = getFunctionFromConfig(res.body.routes);
      // let updatedRoutes = res.body.routes;
      console.log(updatedRoutes);
      setProjectRoutes(updatedRoutes);
      setDisplayRoute(updatedRoutes);
      setAllRoutes(updatedRoutes);
    }
  }

  const saveFunctions = {
    saveEditedRoutes: async () => {
      console.log("saveEditedRoute");
      console.log(allRoutes);
      clearSearchValue();
      // give a calll to database, on success run below code
      let res = await configService.addAllRoutes(allRoutes);
      console.log(res);
      if (res.status === 200) {
        let updatedRoutes = getFunctionFromConfig(res.body.routes);
        console.log(updatedRoutes);
        setProjectRoutes(updatedRoutes); // save  routes in redux store
        setDisplayRoute(updatedRoutes);
        setAllRoutes(updatedRoutes);
      }
    },
  };

  const showFilteredDisplayRoutes = (property, index) => {
    let filteredDisplayRoutes = displayRoute.filter(
      (route) =>
        searchedRoute === "" ||
        route.path?.includes(searchedRoute) ||
        route.component?.toLowerCase()?.includes(searchedRoute?.toLowerCase()) ||
        route.redirectTo?.toLowerCase()?.includes(searchedRoute?.toLowerCase())
    );

    if (property === "path") {
      return filteredDisplayRoutes[index].path + " - ";
    } else if (property === "component/redirectTo") {
      return filteredDisplayRoutes[index].component
        ? filteredDisplayRoutes[index].component
        : filteredDisplayRoutes[index]?.redirectTo?.length > 15
        ? filteredDisplayRoutes[index].redirectTo.slice(0, 15) + "..."
        : filteredDisplayRoutes[index]?.redirectTo;
    }
  };

  setSaveRouteRef(compName, saveFunctions);

  useEffect(() => {
    const initialSelectedRadio = {};
    allRoutes.forEach((route, index) => {
      if (route.component) initialSelectedRadio[index] = "component";
      else if (route.redirectTo) initialSelectedRadio[index] = "redirectTo";
      if (!Object.keys(showAllRouteProp).length) {
        let fillShowAllRouteProp = {}
        fillShowAllRouteProp[index] = false;
        setShowAllRouteProp(fillShowAllRouteProp);
      }
    });
    setSelectedRadioForURLOrComponent(initialSelectedRadio);
  }, [allRoutes]);

  return (
    <div className="me-4 ms-5 my-2" data-bs-theme="dark">
      <div className="accordion routeAccordionDetails" id="accordionExample">
        {allRoutes
          .filter(
            (route) =>
              searchedRoute === "" ||
              route.path?.includes(searchedRoute) ||
              route.component
                ?.toLowerCase()
                ?.includes(searchedRoute?.toLowerCase()) ||
              route.redirectTo
                ?.toLowerCase()
                ?.includes(searchedRoute?.toLowerCase())
          )
          ?.map((route, index) => (
            <div key={index} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="d-flex accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${index}`}
                  aria-expanded={index === 0 ? true : false}
                  aria-controls={`collapse${index}`}
                >
                  <span className="w-100">
                    {showFilteredDisplayRoutes("path", index)}
                    {showFilteredDisplayRoutes("component/redirectTo", index)}
                  </span>
                  <span>
                    <div
                      data-bs-toggle="collapse"
                      variant="dark"
                      title="Delete"
                    >
                      <img
                        src={DeleteIcon}
                        alt=""
                        height={24}
                        className="mx-3"
                      />
                    </div>
                  </span>
                </button>
              </h2>
              <div
                id={`collapse${index}`}
                key={index}
                className="accordion-collapse collapse"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="card">
                    <div className="card-body ">
                      <div className="d-flex align-items-end mx-3">
                        <div className="mb-4 mx-3">
                          <FloatingLabel
                            controlId="floatingInputGrid-path"
                            label="path"
                          >
                            <Form.Control
                              type="text"
                              value={route.path}
                              onChange={(e) =>
                                handleRouteChange(index, e.target.value)
                              }
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

                        {/* <div className="d-inline-flex align-items-center gap-2 mb-2 mx-3">
                        <Multiselect
                          className="form-control p-0 mb-1 text-black"
                          options={childRouteOptions(index)}
                          selectedValues={selectedChildRoutes}
                          onSelect={onSelect}
                          onRemove={onRemove}
                          displayValue="path"
                          showCheckbox={true}
                          placeholder="Select Child Routes"
                          style={{ "search-wrapper-border": "none" }}
                          renderStyle={{
                            searchWrapper: {
                              border: "var(search-wrapper-border)",
                            },
                          }}
                        />
                      </div> */}

                        <div className="mb-2 mx-2">
                          <Form.Check
                            className="mb-1"
                            type="checkbox"
                            id="caseSensitive"
                            label="caseSensitive"
                          />
                        </div>
                        <div className="mb-3 d-flex ms-auto">
                        {/* <div className="mb-3 d-flex">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            height={30}
                            width={30}
                            className="mt-2"
                          >
                            <path
                              fill="#cfd2d8"
                              d="M512 96c0 50.2-59.1 125.1-84.6 155c-3.8 4.4-9.4 6.1-14.5 5H320c-17.7 0-32 14.3-32 32s14.3 32 32 32h96c53 0 96 43 96 96s-43 96-96 96H139.6c8.7-9.9 19.3-22.6 30-36.8c6.3-8.4 12.8-17.6 19-27.2H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320c-53 0-96-43-96-96s43-96 96-96h39.8c-21-31.5-39.8-67.7-39.8-96c0-53 43-96 96-96s96 43 96 96zM117.1 489.1c-3.8 4.3-7.2 8.1-10.1 11.3l-1.8 2-.2-.2c-6 4.6-14.6 4-20-1.8C59.8 473 0 402.5 0 352c0-53 43-96 96-96s96 43 96 96c0 30-21.1 67-43.5 97.9c-10.7 14.7-21.7 28-30.8 38.5l-.6 .7zM128 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM416 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z"
                            />
                          </svg>
                          <i className="h3 mx-4 mt-2 bi bi-router-fill"></i>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 576 512"
                            height={30}
                            width={30}
                            className="mt-2"
                          >
                            <path
                              fill="#dee2e8"
                              d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32v96V384c0 35.3 28.7 64 64 64H256V384H64V160H256V96H64V32zM288 192c0 17.7 14.3 32 32 32H544c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32H445.3c-8.5 0-16.6-3.4-22.6-9.4L409.4 9.4c-6-6-14.1-9.4-22.6-9.4H320c-17.7 0-32 14.3-32 32V192zm0 288c0 17.7 14.3 32 32 32H544c17.7 0 32-14.3 32-32V352c0-17.7-14.3-32-32-32H445.3c-8.5 0-16.6-3.4-22.6-9.4l-13.3-13.3c-6-6-14.1-9.4-22.6-9.4H320c-17.7 0-32 14.3-32 32V480z"
                            />
                          </svg> */}
                          <div className="card mx-3" role="button">
                            <div className="d-flex">
                              <i
                                className="h1 lessen-h1-mb mx-2 bi bi-plus"
                                title="Add Child Route"
                                type="button"
                                onClick={() => viewAddChildRoute(route, "add")}
                              ></i>
                              <i
                                className="h4 me-3 mt-2 ms-2 bi bi-box-arrow-in-down-left"
                                type="button"
                                title="View Child route"
                                onClick={() => viewAddChildRoute(route, "view")}
                              ></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center my-1 mx-3">
                        <div className="mx-4">
                          <Form.Check // prettier-ignore
                            type="radio"
                            id="redirectTo"
                            label="redirectTo"
                            checked={
                              selectedRadioForURLOrComponent[index] ===
                              "redirectTo"
                            }
                            onChange={() =>
                              handleRedirectToOrComponentChange(
                                index,
                                "redirectTo"
                              )
                            }
                          />
                          <Form.Check // prettier-ignore
                            type="radio"
                            id="Component"
                            label="Component"
                            checked={
                              selectedRadioForURLOrComponent[index] ===
                              "component"
                            }
                            onChange={() =>
                              handleRedirectToOrComponentChange(
                                index,
                                "component"
                              )
                            }
                          />
                        </div>
                        {selectedRadioForURLOrComponent[index] ===
                          "redirectTo" && (
                          <div className="mx-5 mt-3">
                            <FloatingLabel
                              controlId="floatingInputGrid-redirectTo"
                              label="redirectTo"
                            >
                              <Form.Control
                                type="text"
                                value={route.redirectTo}
                                onChange={(e) =>
                                  handleRedirectToChange(index, e.target.value)
                                }
                                contentEditable={true}
                                className="mb-5"
                                style={{
                                  position: "relative",
                                  top: "18px",
                                  paddingBottom: "22px",
                                }}
                              />
                            </FloatingLabel>
                          </div>
                        )}

                        {selectedRadioForURLOrComponent[index] ===
                          "component" && (
                          <div className="ms-4 my-3">
                            <div className="d-inline-flex align-items-center flex-fill gap-2 mx-3">
                              <div>
                                <Form.Label className="ms-1">
                                  Route Component
                                </Form.Label>
                                <Form.Select
                                  aria-label="Default select example"
                                  className="mb-3"
                                  onChange={(e) => {
                                    handleRouteComponentChange(
                                      index,
                                      e.target.value
                                    );
                                  }}
                                  value={route.component || ""}
                                >
                                  (<option value="">None</option>)
                                  {[
                                    ...new Set(
                                      displayRoute.map(
                                        (route) => route.component
                                      )
                                    ),
                                  ].map(
                                    (component, index) =>
                                      component && (
                                        <option key={index} value={component}>
                                          {component}
                                        </option>
                                      )
                                  )}
                                </Form.Select>
                              </div>
                            </div>
                            <div className="d-inline-flex align-items-center flex-fill gap-2 mx-3">
                              <div>
                                <Form.Label className="ms-1">
                                  HydrateFallback Element
                                </Form.Label>
                                <Form.Select
                                  aria-label="Default select example"
                                  className="mb-3"
                                  onChange={(e) => {
                                    handlehydrateComponentChange(
                                      index,
                                      e.target.value
                                    );
                                  }}
                                  value={route.hydrateComponent || ""}
                                >
                                  (<option value="">None</option>)
                                  {[
                                    ...new Set(
                                      displayRoute.map(
                                        (route) => route.component
                                      )
                                    ),
                                  ].map(
                                    (component, index) =>
                                      component && (
                                        <option key={index} value={component}>
                                          {component}
                                        </option>
                                      )
                                  )}
                                </Form.Select>
                              </div>
                            </div>
                            <div className="d-inline-flex align-items-center flex-fill gap-2 mx-3">
                              <div>
                                <Form.Label className="mx-1">
                                  Error Element
                                </Form.Label>
                                <Form.Select
                                  aria-label="Default select example"
                                  className="mb-3"
                                  onChange={(e) => {
                                    handleErrorElementChange(
                                      route,
                                      e.target.value
                                    );
                                  }}
                                  value={route.errorElement || ""}
                                >
                                  (<option value="">None</option>)
                                  {[
                                    ...new Set(
                                      displayRoute.map(
                                        (route) => route.component
                                      )
                                    ),
                                  ].map(
                                    (component, index) =>
                                      component && (
                                        <option key={index} value={component}>
                                          {component}
                                        </option>
                                      )
                                  )}
                                </Form.Select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="form-check mx-2 mb-4">
                        <input
                          className="form-check-input mx-1"
                          type="checkbox"
                          value=""
                          id="flexCheckDisabled"
                          checked={showAllRouteProp[index]}
                          onChange={() =>
                            setShowAllRouteProp({
                              ...showAllRouteProp,
                              [index]: !showAllRouteProp[index],
                            })
                          }
                        />
                        <label class="form-check-label" for="flexCheckDisabled">
                          See All Route Props
                        </label>
                      </div>
                      {showAllRouteProp[index] === true && (
                        <div>
                          <div className="d-flex gap-3 mx-3 my-2">
                            <div className="flex-fill gap-2 mx-3">
                              <Form.Group
                                className="mb-3"
                                controlId="controlTextarea1"
                              >
                                <Form.Label>Action</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  value={route.action}
                                  onChange={(e) =>
                                    handleRouteObjectProps(
                                      index,
                                      "action",
                                      e.target.value
                                    )
                                  }
                                  rows={4}
                                />
                              </Form.Group>
                            </div>
                            <div className="flex-fill gap-2 mx-3">
                              <Form.Group
                                className="mb-3"
                                controlId="controlTextarea1"
                              >
                                <Form.Label>Loader</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  value={route.loader}
                                  onChange={(e) =>
                                    handleRouteObjectProps(
                                      index,
                                      "loader",
                                      e.target.value
                                    )
                                  }
                                  rows={4}
                                />
                              </Form.Group>
                            </div>
                          </div>
                          <div className="d-flex gap-3 mx-3 mb-3">
                            <div className="flex-fill gap-2 mx-3">
                              <Form.Group
                                className="mb-3"
                                controlId="controlTextarea1"
                              >
                                <Form.Label>Lazy</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  value={route.lazy}
                                  onChange={(e) =>
                                    handleRouteObjectProps(
                                      index,
                                      "lazy",
                                      e.target.value
                                    )
                                  }
                                  rows={4}
                                />
                              </Form.Group>
                            </div>
                            <div className="flex-fill gap-2 mx-3">
                              <Form.Group
                                className="mb-3"
                                controlId="controlTextarea1"
                              >
                                <Form.Label>ShouldRevalidate</Form.Label>
                                <Form.Control
                                  as="textarea"
                                  value={route.shouldRevalidate}
                                  onChange={(e) =>
                                    handleRouteObjectProps(
                                      index,
                                      "shouldRevalidate",
                                      e.target.value
                                    )
                                  }
                                  rows={4}
                                />
                              </Form.Group>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div>
        <ProjectRouteModal
          routeMode={routeMode}
          routeData={routeObj}
          show={show}
          onHide={handleClose}
          onSubmit={onSubmit}
          routes={routes}
          addRouteModalShow={addRouteModalShow}
          setAddRouteModalShow={setAddRouteModalShow}
          childModalState={childModalState}
          addChildRoute={addChildRoute}
        />
      </div>
    </div>
  );
}

export default ProjectRouteDetails;
