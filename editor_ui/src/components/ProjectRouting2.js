import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWindowDimension } from "../hooks/useWindowDimension";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import CloudOpen from "../assets/icons/cloud-open.svg";
import CloudClose from "../assets/icons/cloud-close.svg";
import SaveChanges from "../assets/icons/save-changes.svg";
import Delete from "../assets/icons/delete-trash.svg";
import LastRoute from "../assets/icons/last-route.png";
import RootRouteNode from "../assets/icons/root-route.png";
import Settings from "../assets/icons/settings.svg";
import useDebounce from "../hooks/useDebounce";
import { uuid } from "uuid";
import "../css/ProjectRouting2.css";

const routes = [
  {
    name: "Home",
    path: "/",
    type: "base",
    component: "HomeComponent",
    children: [
      {
        name: "Teams",
        path: "/teams",
        type: "base",
        component: "TeamsComponent",
        children: [
          {
            name: "Team",
            path: "/teams/:teamId",
            type: "child",
            component: "TeamComponent",
          },
          {
            name: "Edit Team",
            path: "/teams/:teamId/edit/3000/project/test_project_1/          r5/3000/project/            test_project_1/         r5/3000/          project/          test_project_1/r5",
            type: "child",
            component: "Edit TeamComponent",
          },
          {
            name: "New Team",
            path: "/teams/new",
            type: "child",
            component: "NewTeamComponent",
          },
        ],
      },
      {
        name: "Privacy",
        path: "/privacy",
        type: "base",
        component: "PrivacyComponent",
      },
      {
        name: "TOS",
        path: "/tos",
        type: "index",
        component: "TOSComponent",
      },
      {
        name: "Contact Us",
        path: "/contact-us",
        type: "base",
        component: "ContactUsComponent",
      },
    ],
  },
];

const defaultRouteDetailsSection = {
  propDetails: {
    isExpanded: false,
    props: [
      {
        name: "path",
        value: "",
        isPropUpdating: false,
        isRemovable: true,
        isViewable: true,
      },
      {
        name: "element",
        value: "",
        isPropUpdating: false,
        isRemovable: false,
        isViewable: true,
      },
    ],
  },
  parentDetails: {
    isExpanded: false,
  },
  groupDetails: {
    isExpanded: false,
  },
};

const updateRouteStructure = (
  prevState,
  route,
  mandatoryProp,
  viewablePropTypes
) => {
  let newRouteDeatils = {
    ...prevState,
    propDetails: {
      ...prevState.propDetails,
      isExpanded: true,
      props: Object.entries(route).map((item) => {
        return {
          name: item[0],
          value: item[1],
          isPropUpdating: false,
          isRemovable: mandatoryProp.includes(item[0]) ? false : true,
          isViewable: viewablePropTypes.includes(typeof item[1]),
        };
      }),
    },
  };
  console.log(newRouteDeatils);
  return newRouteDeatils;
};

const getFunctionFromConfig = (allRoutes) => {
  let entries = Object.entries(allRoutes);
  entries = entries.map((obj) => {
    let route_obj = JSON.parse(JSON.stringify(obj));
    route_obj[1]["fullPath"] = route_obj[0];
    if (route_obj[1].props) {
      // setCompRouteProps((prevState) => {
      //   return {
      //     ...prevState,
      //     routeProps: {
      //       ...prevState.routeProps,
      //       [route_obj[0]]: Object.entries(route_obj[1].props).map((obj) => {
      //         return { name: obj[0], value: obj[1] };
      //       }),
      //     },
      //   };
      // });
    }
    return route_obj[1];
  });
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
      if (
        prop[1]?.implementation !== undefined &&
        prop[1]?.implementation !== null
      ) {
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
          prop[1].implementation.isAsync ? "async " : ""
        }(${parameters}) => { ${prop[1].implementation.functionBody.trim()} }`;
      }
    });
    return { ...route, ...routeObjImplementationProp };
  });
};

const RouteNode = ({ route, level, setRouteSection, setSelectedRoute }) => {
  const [expanded, setExpanded] = useState(false);
  const reservedPropKeywords = ["component", "path", "fullPath"];
  const mandatoryProp = ["element", "path", "fullPath"];
  const viewablePropTypes = ["string", "number", "bigint", "boolean"];
  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const routeItemClickHandler = (route, level) => {
    handleToggle();
    displayRouteDetails(route);
  };

  const displayRouteDetails = (route) => {
    setSelectedRoute(route);
    setRouteSection((prevState) =>
      updateRouteStructure(prevState, route, mandatoryProp, viewablePropTypes)
    );
    console.log(route);
  };

  return (
    <div
      className="route-node"
      style={{ marginLeft: `${level * 1}px` }}
      onClick={(e) => console.log(e)}
    >
      <div
        className={`route-item ${route.type}`}
        onClick={() => routeItemClickHandler(route)}
      >
        <span onClick={handleToggle}>
          {level === 0 && (
            <span>
              {<img src={RootRouteNode} alt="" height={13} className="mx-2" />}
            </span>
          )}
          {route.children && level !== 0 && (
            <span>
              {expanded ? (
                <img src={CloudClose} alt="" height={16} className="mx-1" />
              ) : (
                <img src={CloudOpen} alt="" height={16} className="mx-1" />
              )}
            </span>
          )}
        </span>
        {!route.children && (
          <span className="route-icon">
            <img src={LastRoute} alt="" height={16} className="ms-1" />
          </span>
        )}
        <span className="route-wrap">
          <span className="route-component">{route.component + " - "}</span>
          <span className="route-path">{route.path}</span>
        </span>
      </div>
      {expanded && route.children && (
        <div className="route-children">
          {route.children.map((child, index) => (
            <RouteNode
              key={index}
              route={child}
              level={level + 1}
              setRouteSection={setRouteSection}
              setSelectedRoute={setSelectedRoute}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RouteTree = ({ routes, setRouteSection, setSelectedRoute }) => {
  return (
    <div className="route-tree">
      {routes.map((route, index) => (
        <RouteNode
          key={index}
          route={route}
          level={0}
          setRouteSection={setRouteSection}
          setSelectedRoute={setSelectedRoute}
        />
      ))}
    </div>
  );
};

const InputField = React.memo(({ prop, index, updateRouteSection }) => (
  <input
    type="text"
    className={`form-control ${prop.isRemovable ? "" : "me-1"}`}
    placeholder="Route name"
    value={prop.value}
    onChange={(e) => {
      updateRouteSection(index, "value", e.target.value);
    }}
  />
));

const ExpandableRouteDetailsSection = ({
  title,
  section = "",
  isExpanded,
  toggleExpansion,
  children,
  className,
  style = {},
  addRouteProp,
}) => {
  return (
    <div className={className} style={style}>
      <nav
        className="header-strip mb-1 d-flex justify-content-between align-items-center"
        onClick={toggleExpansion}
        style={{ cursor: "pointer" }}
      >
        <span>{title}</span>
        <span className="float-end me-2">
          {section === "propDetails" ? (
            <i
              className="bi bi-plus-circle mx-2"
              title="Add Route Props"
              onClick={(e) => {
                e.stopPropagation();
                addRouteProp("__addNewPropKey__", "__addNewPropValue__");
              }}
            ></i>
          ) : (
            ""
          )}
          {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
        </span>
      </nav>
      {isExpanded && (
        <div
          className="route-details-expandable-content"
          style={{ height: "88%" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

function ProjectRouting2() {
  const [isRouteSectionSelected, setIsRouteSectionSelected] = useState(true);
  const [windowWidth, windowHeight] = useWindowDimension();
  const routerConfig = useSelector((state) => state.routerConfig);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [routeDetailsSection, setRouteDetailsSection] = useState(
    defaultRouteDetailsSection
  );
  const [justFocused, setJustFocused] = useState(false);
  const routerConfigNode = useMemo(
    () => getFunctionFromConfig(routerConfig?.routes),
    [routerConfig?.routes]
  );
  // const debounce = useDebounce()
  const [allRoutes, setAllRoutes] = useState([...routerConfigNode]);
  const [parentRouteOptions, setParentRouteOptions] = useState([
    { value: "none", label: "None" },
    ...routerConfigNode.map((route) => ({
      value: route,
      label: route.fullPath,
    })),
  ]);

  const toggleExpansion = (routeDetailKey, value) => {
    setRouteDetailsSection((prevState) => {
      return {
        ...prevState,
        [routeDetailKey]: { ...prevState[routeDetailKey], isExpanded: value },
      };
    });
  };

  const handleRouteDetailsSection = (section, sectionKey, value) => {
    setRouteDetailsSection((prevState) => {
      return {
        ...prevState,
        [section]: { ...prevState[section], [sectionKey]: value },
      };
    });
  };

  const toggleUpdatingState = (index) => {
    setRouteDetailsSection((prevState) => {
      return {
        ...prevState,
        propDetails: {
          ...prevState.propDetails,
          props: prevState.propDetails.props.map((prop, i) =>
            index === i
              ? { ...prop, isPropUpdating: !prop.isPropUpdating }
              : prop
          ),
        },
      };
    });
  };

  const updateRouteSection = useCallback((index, propName, propValue) => {
    setRouteDetailsSection((prevState) => {
      let abc = {
        ...prevState,
        propDetails: {
          ...prevState.propDetails,
          props: prevState.propDetails.props.map((prop, i) =>
            index === i ? { ...prop, [propName]: [propValue] } : prop
          ),
        },
      };
      console.log(abc);
      return abc;
    });
  }, []);

  console.log(routeDetailsSection);

  const addRouteProp = (key, value) => {
    if (routeDetailsSection.propDetails.isExpanded) {
      setRouteDetailsSection((prevState) => {
        let newState = { ...prevState };
        newState.propDetails.props.push({
          name: key,
          value: value,
          isViewable: true,
        });
        return newState;
      });
    }
  };

  return (
    <div className="container-fluid">
      <div
        className="text-white"
        data-bs-theme="dark"
        style={{ height: `${windowHeight - 95}px` }}
      >
        <div className="d-flex">
          <div
            className="ms-auto me-1 mt-1 text-muted badge rounded-pill text-bg-dark px-2"
            style={{ fontSize: "75%" }}
          >
            code preview
          </div>
        </div>

        <hr
          style={{ margin: "0.15rem 0", color: "black", borderWidth: "2px" }}
        />

        <div className="row h-100">
          <div
            className="col-4 border-end border-dark"
            aria-label="node render section"
          >
            <div className="mt-2">
              <div className="container">
                <div className="row">
                  <div className="my-1">
                    <div className="route-search-input-group">
                      <input
                        className="form-control py-2 rounded-pill me-1 pe-5"
                        type="search"
                        placeholder="search"
                        id="search-input"
                      />
                      <div className="route-search-input-group-append">
                        <button
                          aria-label="search-button"
                          className="btn rounded-pill border-0 ms-n5"
                          type="button"
                        >
                          <i className="bi bi-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* <p className="ms-3" style={{fontSize: '90%'}}>Route Tree</p> */}
              <RouteTree
                routes={routes}
                setRouteSection={setRouteDetailsSection}
                setSelectedRoute={setSelectedRoute}
              />
            </div>
          </div>

          {/* <div className="border-start border-grey"></div> */}

          <div className="col-8 px-0 h-100" aria-label="details section">
            <div className="d-flex">
              <div className="d-flex ms-auto me-2 ">
                <div
                  className="me-2 text-muted badge rounded-pill text-bg-dark px-2"
                  style={{ fontSize: "75%", marginBottom: "0.15rem" }}
                >
                  header bar
                </div>
                <div className="me-1">
                  <div
                    className="py-0 btn btn-warning btn-sm"
                    style={{
                      marginBottom: "0.15rem",
                      backgroundColor: "#bf8f00",
                      borderColor: "#bf8f00",
                    }}
                  >
                    <i>
                      <img src={Settings} height={11} className="me-1" alt="" />
                    </i>
                    <span
                      className="text-muted"
                      style={{
                        fontSize: "80%",
                      }}
                    >
                      RouterProvider
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <hr
              style={{
                margin: "0.01rem 0",
                color: "black",
                borderWidth: "1px",
              }}
            />
            <div className="d-flex align-items-center">
              <div className="ms-auto me-2 d-flex" style={{ fontSize: "85%" }}>
                <div className="me-2 my-1">
                  <div
                    className="py-0 btn btn-primary btn-sm"
                    style={{ height: "100%" }}
                  >
                    <i
                      className="bi bi-plus-circle text-muted me-1 mt-2"
                      style={{ fontSize: "90%" }}
                    ></i>
                    <span
                      className="text-muted"
                      style={{ fontSize: "80%", verticalAlign: "text-top" }}
                    >
                      Add Route
                    </span>
                  </div>
                </div>
                <div className="me-1 my-1">
                  <div
                    className="py-0 btn btn-success btn-sm"
                    style={{ height: "100%" }}
                  >
                    <i>
                      <img
                        src={SaveChanges}
                        height={11}
                        className="me-1"
                        alt=""
                      />
                    </i>
                    <span
                      className="text-muted"
                      style={{ fontSize: "80%", verticalAlign: "text-top" }}
                    >
                      save change(s)
                    </span>
                  </div>
                </div>
                <div className="my-1">
                  <div className="py-0" style={{ height: "100%" }}>
                    <i className="">
                      <img
                        src={Delete}
                        height={22}
                        style={{
                          borderStyle: "groove",
                          borderWidth: "1px",
                          padding: "2px",
                          borderColor: "#414243",
                          cursor: "pointer",
                          borderSpacing: "5px",
                          borderCollapse: "separate",
                        }}
                        className="mx-1"
                        alt=""
                      />
                    </i>
                  </div>
                </div>

                {/* <span className="text-muted badge rounded-pill text-bg-dark px-2">
                  route options bar
                </span> */}
              </div>
            </div>
            <div
              className="all-route-details h-88"
              aria-label="all props/groups details"
            >
              <ExpandableRouteDetailsSection
                title="route's props details"
                isExpanded={routeDetailsSection.propDetails.isExpanded}
                section="propDetails"
                style={{
                  height: routeDetailsSection.propDetails.isExpanded
                    ? "50%"
                    : "",
                }}
                toggleExpansion={() =>
                  toggleExpansion(
                    "propDetails",
                    !routeDetailsSection.propDetails.isExpanded
                  )
                }
                addRouteProp={addRouteProp}
              >
                <form className="route-details-form" data-bs-theme="dark">
                  {routeDetailsSection.propDetails.props.map(
                    (prop, index) =>
                      prop.isViewable && (
                        <div key={index} className="form-group row">
                          {!prop.isPropUpdating && (
                            <label
                              onClick={() => {
                                setJustFocused(true);
                                toggleUpdatingState(index);
                              }}
                              id="propLabel"
                              className="col-sm-4 col-form-label"
                              style={{ cursor: "pointer" }}
                            >
                              {prop.name}
                            </label>
                          )}
                          {prop.isPropUpdating && (
                            <input
                              type="text"
                              autoFocus={true}
                              id="updatePropName"
                              onBlur={() => {
                                setJustFocused(false);
                                toggleUpdatingState(index);
                              }}
                              className="col-sm-3 col-form-input ms-2"
                              defaultValue={prop.name}
                            />
                          )}
                          <div
                            className={`col-sm-${
                              !justFocused ? "8" : "8 ms-auto"
                            }`}
                          >
                            <span className="d-flex align-items-center">
                              {/* <input
                                type="text"
                                key={index}
                                className={`form-control ${
                                  prop.isRemovable ? "" : "me-1"
                                }`}
                                placeholder="Route name"
                                value={prop.value}
                                onChange={(e) => {
                                  console.log(e)
                                  updateRouteSection(index, 'value', e.target.value)
                                }}
                              /> */}
                              <InputField
                                key={index}
                                prop={prop}
                                index={index}
                                updateRouteSection={updateRouteSection}
                              />
                              {prop.isRemovable && (
                                <i
                                  className="ms-2 bi bi-dash-circle"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {}}
                                ></i>
                              )}
                              {!prop.isRemovable && (
                                <span className="mx-2"></span>
                              )}
                            </span>
                          </div>
                        </div>
                      )
                  )}
                </form>
              </ExpandableRouteDetailsSection>

              <ExpandableRouteDetailsSection
                title="parent details"
                isExpanded={routeDetailsSection.parentDetails.isExpanded}
                className=""
                style={{
                  height: routeDetailsSection.parentDetails.isExpanded
                    ? "24%"
                    : "",
                }}
                toggleExpansion={() =>
                  toggleExpansion(
                    "parentDetails",
                    !routeDetailsSection.parentDetails.isExpanded
                  )
                }
              >
                <form className="route-details-form" data-bs-theme="dark">
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Name</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Route name"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Path</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Route path"
                      />
                    </div>
                  </div>
                </form>
              </ExpandableRouteDetailsSection>

              <ExpandableRouteDetailsSection
                title="group details"
                isExpanded={routeDetailsSection.groupDetails.isExpanded}
                className="mt-1"
                style={{
                  height: routeDetailsSection.groupDetails.isExpanded
                    ? "24%"
                    : "",
                }}
                toggleExpansion={() =>
                  toggleExpansion(
                    "groupDetails",
                    !routeDetailsSection.groupDetails.isExpanded
                  )
                }
              >
                <form className="route-details-form" data-bs-theme="dark">
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Name</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Route name"
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">Path</label>
                    <div className="col-sm-8">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Route path"
                      />
                    </div>
                  </div>
                </form>
              </ExpandableRouteDetailsSection>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectRouting2;

// import React, { useState, useEffect, useRef } from "react";
// // import CONSTANTS from "../../common/constants";
// // import ContextMenu from "../../common/c.context_menu";
// import _ from "lodash";

// const SELECTS = [
//   "uuid",
//   "name",
//   "location_type",
//   "site_type_id",
//   "geometry_type",
//   "status",
//   "@children",
//   "parent_id",
//   "geometry",
//   "point",
// ];
// const SEARCH_SELECTS = [
//   "@lineage",
//   "uuid",
//   "name",
//   "location_type",
//   "site_type_id",
//   "geometry_type",
//   "status",
//   "@children",
//   "parent_id",
//   "geometry",
//   "point",
// ];
// const JOINS = ["location_type:site_type_id:id"];
// const ewars = {
//   g: {
//     // Mock data for locations
//     LOC_1: {
//       children: [
//         {
//           uuid: "2",
//           name: "Child 1",
//           location_type: { name: "Type A" },
//           status: "ACTIVE",
//           children: 0,
//         },
//         {
//           uuid: "3",
//           name: "Child 2",
//           location_type: { name: "Type B" },
//           status: "DELETED",
//           children: 0,
//         },
//       ],
//       showChildren: false,
//       isChecked: false,
//     },
//   },
//   I18N: (text) => {
//     // Simple internationalization mock function
//     const translations = {
//       "Location 1": "Location 1",
//       "Child 1": "Child 1",
//       "Child 2": "Child 2",
//       "Type A": "Type A",
//       "Type B": "Type B",
//     };
//     return translations[text] || text;
//   },
//   tx: (type, params) => {
//     // Mock transaction method
//     console.log(`Transaction type: ${type}`, params);
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         if (type === "com.ewars.query" && params[0] === "location") {
//           resolve([
//             {
//               uuid: "2",
//               name: "Child 1",
//               location_type: { name: "Type A" },
//               status: "ACTIVE",
//               children: 0,
//             },
//             {
//               uuid: "3",
//               name: "Child 2",
//               location_type: { name: "Type B" },
//               status: "DELETED",
//               children: 0,
//             },
//           ]);
//         } else if (type === "com.ewars.locations.search") {
//           resolve([
//             {
//               uuid: "4",
//               name: "Search Result 1",
//               location_type: { name: "Type A" },
//               status: "ACTIVE",
//               children: 0,
//             },
//             {
//               uuid: "5",
//               name: "Search Result 2",
//               location_type: { name: "Type B" },
//               status: "DELETED",
//               children: 0,
//             },
//           ]);
//         } else {
//           resolve([]);
//         }
//       }, 1000);
//     });
//   },
//   subscribe: (event, callback) => {
//     // Mock subscribe method
//     console.log(`Subscribed to event: ${event}`);
//   },
//   unsubscribe: (event, callback) => {
//     // Mock unsubscribe method
//     console.log(`Unsubscribed from event: ${event}`);
//   },
//   copy: (state) => {
//     // Mock copy method (deep copy)
//     return JSON.parse(JSON.stringify(state));
//   },
// };

// const TreeNodeComponent = ({
//   data,
//   checked,
//   hideInactive,
//   allowCheck,
//   onAction,
//   actions,
//   selectTypeId,
// }) => {
//   const [state, setState] = useState(
//     () =>
//       ewars.g["LOC_" + data.uuid] || {
//         children: null,
//         showChildren: false,
//         isChecked: false,
//       }
//   );

//   const itemRef = useRef(null);
//   const iconHandleRef = useRef(null);

//   useEffect(() => {
//     if (checked) {
//       setState((prevState) => ({
//         ...prevState,
//         isChecked: checked.indexOf(data.uuid) >= 0,
//       }));
//     }

//     ewars.subscribe("LOCATIONS_CHANGE", _changeReload);
//     if (window.__hack__) {
//       window.__hack__.addEventListener("click", _onBodyClick);
//     }

//     return () => {
//       ewars.g["LOC_" + data.uuid] = ewars.copy(state);
//       if (window.__hack__) {
//         window.__hack__.removeEventListener("click", _onBodyClick);
//       }
//     };
//   }, [checked]);

//   useEffect(() => {
//     if (checked) {
//       setState((prevState) => ({
//         ...prevState,
//         isChecked: checked.indexOf(data.uuid) >= 0,
//       }));
//     }
//   }, [checked]);

//   const _onBodyClick = (evt) => {
//     if (!itemRef.current.contains(evt.target)) {
//       setState((prevState) => ({
//         ...prevState,
//         showContext: false,
//       }));
//     }
//   };

//   const _load = (location_id, show) => {
//     iconHandleRef.current.setAttribute("className", "fa fa-spin fa-gear");
//     const query = {
//       parent_id: { eq: data.uuid },
//       status: hideInactive ? { eq: "ACTIVE" } : { neq: "DELETED" },
//     };

//     ewars
//       .tx("com.ewars.query", [
//         "location",
//         SELECTS,
//         query,
//         { "name.en": "ASC" },
//         null,
//         null,
//         JOINS,
//       ])
//       .then((resp) => {
//         setState((prevState) => ({
//           ...prevState,
//           children: resp,
//           showChildren: show ? show : prevState.showChildren,
//         }));
//       });
//   };

//   const _changeReload = (change_locs) => {
//     if (change_locs.indexOf(data.uuid) >= 0) {
//       const query = {
//         parent_id: { eq: data.uuid },
//         status: hideInactive ? { eq: "ACTIVE" } : { neq: "DELETED" },
//       };

//       ewars
//         .tx("com.ewars.query", [
//           "location",
//           SELECTS,
//           query,
//           { "name.en": "ASC" },
//           null,
//           null,
//           JOINS,
//         ])
//         .then((resp) => {
//           setState((prevState) => ({
//             ...prevState,
//             children: resp,
//           }));
//         });
//     }
//   };

//   const _reload = (location_id, show) => {
//     if (!state.isLoaded && data.children > 0) {
//       _load(location_id, show);
//     }
//   };

//   const _onCaretClick = () => {
//     if (state.children) {
//       setState((prevState) => ({
//         ...prevState,
//         showChildren: !prevState.showChildren,
//       }));
//       return;
//     }

//     _reload(data.uuid, true);
//   };

//   const _onLabelClick = () => {
//     if (selectTypeId && data.site_type_id === selectTypeId) return;
//     onAction("EDIT", data);
//   };

//   const _onCheck = () => {
//     onAction("CHECK", data);
//   };

//   const _onContext = (e) => {
//     e.preventDefault();
//     setState((prevState) => ({
//       ...prevState,
//       showContext: true,
//     }));
//   };

//   const _onContextAction = (action) => {
//     setState((prevState) => ({
//       ...prevState,
//       showContext: false,
//     }));
//     onAction(action, data);
//   };

//   const icon = state.showChildren
//     ? "fa-folder-open"
//     : data.children <= 0
//     ? "fa-map-marker"
//     : "fa-folder";
//   const iconClass = `fal ${icon}`;

//   const name = `${ewars.I18N(data.name)} (${ewars.I18N(
//     data.location_type.name
//   )})`;

//   const checkClass = state.isChecked ? "fal fa-check-square" : "fal fa-square";

//   //   const blockClass = `block-content ${data.status === CONSTANTS.ACTIVE ? 'status-green' : data.status === CONSTANTS.DISABLED ? 'status-red' : ''}`;

//   const lineage = data["@lineage"]
//     ? (data["@lineage"] || []).join(" \\ ")
//     : null;

//   return (
//     <div className="block">
//       <div
//         className={"blockClass"}
//         style={{ padding: 0 }}
//         ref={itemRef}
//         onContextMenu={_onContext}
//       >
//         <div className="ide-row">
//           <div
//             className="ide-col"
//             onClick={_onCaretClick}
//             style={{ maxWidth: 20, padding: 8 }}
//           >
//             <div className="node-control">
//               <i ref={iconHandleRef} className={iconClass}></i>
//             </div>
//           </div>
//           {allowCheck ? (
//             <div
//               className="ide-col"
//               onClick={_onCheck}
//               style={{ maxWidth: 20, padding: 8 }}
//             >
//               <div className="node-check">
//                 <i className={checkClass}></i>
//               </div>
//             </div>
//           ) : null}
//           <div
//             className="ide-col tree-node-item"
//             onClick={_onLabelClick}
//             style={{ padding: 8 }}
//           >
//             {name}
//             {lineage ? <i>{lineage}</i> : null}
//           </div>
//         </div>
//         {/* {actions && state.showContext ?
//           <ContextMenu
//             absolute={true}
//             onClick={_onContextAction}
//             actions={actions} />
//           : null} */}
//       </div>
//       {state.showChildren ? (
//         <div className="block-children">
//           {state.children &&
//             state.children.map((child, i) => (
//               <TreeNodeComponent
//                 actions={actions}
//                 key={child.uuid}
//                 hideInactive={hideInactive}
//                 checked={checked}
//                 allowCheck={allowCheck}
//                 onAction={onAction}
//                 index={i}
//                 selectTypeId={selectTypeId}
//                 data={child}
//               />
//             ))}
//         </div>
//       ) : null}
//     </div>
//   );
// };

// const debounce = (fn, delay) => {
//   let timer = null;
//   return function (...args) {
//     clearTimeout(timer);
//     timer = setTimeout(() => fn(...args), delay);
//   };
// };

// const SearchInput = ({ value = "", onChange, onSearch }) => {
//   const [searchTerm, setSearchTerm] = useState(value);

//   const sendForSearch = debounce(onSearch, 300);

//   const handleUpdate = (e) => {
//     const val = e.target.value;
//     setSearchTerm(val);
//     onChange(val);

//     if (val.length > 2) {
//       sendForSearch(val);
//     }

//     if (val === "") sendForSearch(null);
//   };

//   return <input type="text" onChange={handleUpdate} value={searchTerm} />;
// };

// const LocationTreeView = ({
//   allowCheck = false,
//   parentId = null,
//   hideInactive = false,
//   onAction = null,
//   actions = null,
//   selectTypeId = null,
//   checked = [],
// }) => {
//   const [state, setState] = useState({
//     steps: [],
//     rootElements: [],
//     checked: [],
//     nodesChecked: [],
//     search: "",
//   });

//   useEffect(() => {
//     _init();

//     ewars.subscribe("LOCATIONS_CHANGE", _init);

//     return () => {
//       ewars.unsubscribe("LOCATIONS_CHANGE", _init);
//     };
//   }, []);

//   useEffect(() => {
//     if (allowCheck) {
//       setState((prevState) => ({
//         ...prevState,
//         checked: checked,
//         checkedNodes: checked.map((uuid) => ({
//           uuid,
//           ...ewars.g[`LOC_${uuid}`],
//         })),
//       }));
//     }
//   }, [allowCheck, checked]);

//   const _init = () => {
//     const query = {};

//     if (!parentId) query.parent_id = { eq: "NULL" };
//     if (parentId) query.uuid = { eq: parentId };

//     if (hideInactive) {
//       query.status = { eq: "ACTIVE" };
//     } else {
//       query.status = { neq: "DELETED" };
//     }

//     ewars
//       .tx("com.ewars.query", [
//         "location",
//         SELECTS,
//         query,
//         { "name.en": "ASC" },
//         null,
//         null,
//         JOINS,
//       ])
//       .then((resp) => {
//         setState((prevState) => ({
//           ...prevState,
//           rootElements: resp,
//         }));
//       });
//   };

//   const _handleSearchChange = (val) => {
//     setState((prevState) => ({
//       ...prevState,
//       search: val,
//       rootElements: [],
//     }));

//     if (val.length >= 3) {
//       const query = {
//         "name.en": { like: val },
//       };

//       if (hideInactive) {
//         query.status = { eq: "ACTIVE" };
//       } else {
//         query.status = { neq: "DELETED" };
//       }

//       ewars.tx("com.ewars.locations.search", [val]).then((resp) => {
//         setState((prevState) => ({
//           ...prevState,
//           rootElements: resp,
//         }));
//       });
//     } else {
//       _init();
//     }
//   };

//   const _onCheck = (node) => {
//     const isChecked = checked.indexOf(node.uuid) < 0;
//     const updatedChecked = isChecked
//       ? [...checked, node.uuid]
//       : _.without(checked, node.uuid);

//     const updatedCheckedNodes = isChecked
//       ? [...state.checkedNodes, node]
//       : state.checkedNodes.filter((item) => item.uuid !== node.uuid);

//     setState((prevState) => ({
//       ...prevState,
//       checked: updatedChecked,
//       checkedNodes: updatedCheckedNodes,
//     }));

//     onAction(updatedChecked, updatedCheckedNodes);
//   };

//   const _clearSearch = () => {
//     setState((prevState) => ({
//       ...prevState,
//       search: "",
//     }));
//     _init();
//   };

//   const _search = (val) => {
//     if (!val) {
//       _init();
//       return;
//     }

//     const args = [val, null, null];

//     if (hideInactive) args[2] = { eq: "ACTIVE" };

//     if (val.length >= 2) {
//       const query = {
//         "name.en": { like: val },
//       };

//       if (hideInactive) {
//         query.status = { eq: "ACTIVE" };
//       } else {
//         query.status = { neq: "DELETED" };
//       }

//       ewars.tx("com.ewars.locations.search", [val]).then((resp) => {
//         setState((prevState) => ({
//           ...prevState,
//           rootElements: resp,
//         }));
//       });
//     } else {
//       _init();
//     }
//   };

//   const rootNodes = state.rootElements.map((element) => (
//     <TreeNodeComponent
//       key={element.uuid}
//       onAction={onAction}
//       hideInactive={hideInactive}
//       checked={checked}
//       allowCheck={allowCheck}
//       data={element}
//       actions={actions}
//       selectTypeId={selectTypeId}
//     />
//   ));

//   return (
//     <div className="ide-layout">
//       <div className="ide-row" style={{ maxHeight: 45 }}>
//         <div className="ide-col">
//           <div className="search">
//             <div className="search-inner">
//               <div className="ide-row">
//                 <div className="ide-col search-left" style={{ maxWidth: 25 }}>
//                   <i className="fal fa-search"></i>
//                 </div>
//                 <div className="ide-col search-mid">
//                   <SearchInput
//                     value={state.search}
//                     onChange={_handleSearchChange}
//                     onSearch={_search}
//                   />
//                 </div>
//                 {state.search !== "" && (
//                   <div
//                     className="ide-col search-right"
//                     style={{ maxWidth: 25 }}
//                     onClick={_clearSearch}
//                   >
//                     <i className="fal fa-times"></i>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="ide-row">
//         <div className="ide-col">
//           <div className="ide-panel ide-panel-absolute ide-scroll">
//             <div className="block-tree">{rootNodes}</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LocationTreeView;
