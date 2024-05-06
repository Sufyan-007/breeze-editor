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
  } = props;

  const [show, setShow] = useState(false);
  const [routeObj, setRouteObj] = useState({});
  
  const [selectedChildRoutes, setSelectedChildRoutes] = useState([]);
  const [allRoutes, setAllRoutes] = useState(routes);
  const [selectedRadioForURLOrComponent, setSelectedRadioForURLOrComponent] =
    useState({});
  const [displayRoute, setDisplayRoute] = useState(
    JSON.parse(JSON.stringify(routes))
  );

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

  const viewChildRoute = (route) => {
    console.log(route);
    handleShow();
    setRouteObj({...route, childRoutes: [{...route}, {...route}, {...route}, {...route}]})
  };
  const saveFunctions = {
    saveEditedRoutes: () => {
      console.log("saveEditedRoute");
      // give a calll to database, on success run below code
      configService.addAllRoutes(allRoutes);
      setProjectRoutes(allRoutes); // save  routes in redux store
      setDisplayRoute(allRoutes);
    },
  };

  setSaveRouteRef(compName, saveFunctions);

  useEffect(() => {
    const initialSelectedRadio = {};
    allRoutes.forEach((route, index) => {
      if (route.component) initialSelectedRadio[index] = "component";
      else if (route.redirectTo) initialSelectedRadio[index] = "redirectTo";
    });
    setSelectedRadioForURLOrComponent(initialSelectedRadio);
  }, [allRoutes]);

  return (
    <div className="me-4 ms-5 my-2" data-bs-theme="dark">
      <div className="accordion" id="accordionExample">
        {allRoutes.map((route, index) => (
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
                  {displayRoute[index].path + " - "}
                  {displayRoute[index].component
                    ? displayRoute[index].component
                    : displayRoute[index]?.redirectTo?.length > 15
                    ? displayRoute[index].redirectTo.slice(0, 15) + "..."
                    : displayRoute[index]?.redirectTo}
                </span>
                <span>
                  <div data-bs-toggle="collapse" variant="dark" title="Delete">
                    <img src={DeleteIcon} alt="" height={24} className="mx-3" />
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
                        <i className="h4 mx-4 mt-3 bi bi-router-fill"></i>
                        <div className="card">
                          <div className="d-flex">
                            <i
                              className="h1 lessen-h1-mb mx-2 bi bi-plus"
                              title="Add Child Route"
                              type="button"
                            ></i>
                            <i
                              className="h4 me-3 mt-2 ms-2 bi bi-box-arrow-in-down-left"
                              type="button"
                              title="View Child route"
                              onClick={() => viewChildRoute(route)}
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
                                    displayRoute.map((route) => route.component)
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
                                HydrateFallbackElement
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
                                    displayRoute.map((route) => route.component)
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
                                    displayRoute.map((route) => route.component)
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
                    {/* <div class="d-flex justify-content-around  my-2 mx-3"> */}
                    <div className="d-flex gap-3 mx-3 my-2">
                      <div className="flex-fill gap-2 mx-3">
                        <Form.Group
                          className="mb-3"
                          controlId="controlTextarea1"
                        >
                          <Form.Label>Action</Form.Label>
                          <Form.Control as="textarea" rows={4} />
                        </Form.Group>
                      </div>
                      <div className="flex-fill gap-2 mx-3">
                        <Form.Group
                          className="mb-3"
                          controlId="controlTextarea1"
                        >
                          <Form.Label>Loader</Form.Label>
                          <Form.Control as="textarea" rows={4} />
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
                          <Form.Control as="textarea" rows={4} />
                        </Form.Group>
                      </div>
                      <div className="flex-fill gap-2 mx-3">
                        <Form.Group
                          className="mb-3"
                          controlId="controlTextarea1"
                        >
                          <Form.Label>ShouldRevalidate</Form.Label>
                          <Form.Control as="textarea" rows={4} />
                        </Form.Group>
                      </div>
                    </div>
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
        />
      </div>
    </div>
  );
}

export default ProjectRouteDetails;
