import React, {
  useState,
  useMemo,
  useCallback,
  useRef
} from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
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
import MonacoEditor from "./common/MonacoEditor";
import { Tooltip } from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { saveRoute } from "../services/RouteConfigService";
import { deleteRoute } from "../services/RouteConfigService";
import ToasterComponent from "../common/display/d.toast";
import Emoji from "../common/display/d.emoji";
import ModalComponent from "../common/display/d.modal";
import Spinner from "react-bootstrap/Spinner";
import { setRouterConfig } from "../reducers/RouterConfigReducer";
import "../css/ProjectRouting2.css";

const defaultRouteDetailsSection = {
  propDetails: {
    isExpanded: false,
    props: [
      {
        name: "parent path",
        value: "",
        type: "selectTag",
      },
      {
        name: "path",
        value: "",
        type: "string",
      },
      {
        name: "element",
        value: "",
        type: "selectTag",
      },
      {
        name: "elementProp",
        value: {},
        type: "key-value-pair",
      },
    ],
  },
  advancePropDetails: {
    isExpanded: false,
    props: [
      {
        name: "index",
        value: false,
        type: "boolean",
      },
      {
        name: "caseSensitive",
        value: false,
        type: "boolean",
      },
      {
        name: "error-element",
        value: "",
        type: "selectTag",
      },
      {
        name: "loader",
        value: "",
        type: "string",
      },
      {
        name: "action",
        value: "",
        type: "string",
      },
      {
        name: "lazy",
        value: "",
        type: "string",
      },
    ],
  },
  routerProviderDetails: {
    isExpanded: false,
    props: [
      {
        name: "fallbackElement",
        value: "",
        type: "selectTag",
      },
    ],
  },
};

const updateRouteStructure = (prevState, route) => {
  const advanceProp = [
    { label: "index", value: "index" },
    { label: "caseSensitive", value: "caseSensitive" },
    { label: "action", value: "action" },
    { label: "loader", value: "loader" },
    { label: "error-element", value: "errorElement" },
    { label: "lazy", value: "lazy" },
  ];
  const basicProp = [
    { label: "parent path", value: "fullPath" },
    { label: "path", value: "path" },
    { label: "element", value: "component" },
  ];
  const routerProviderProp = [
    { label: "fallbackElement", value: "fallbackElement" },
  ];
  // const viewablePropTypes = ["string", "number", "bigint", "boolean"];
  let props = route.props ? route.props : {};
  let newRouteDeatils = {
    ...prevState,
    propDetails: {
      ...prevState.propDetails,
      isExpanded: true,
      props: [
        ...basicProp.map((item) => {
          return {
            ...prevState.propDetails.props.filter(
              (obj) => obj.name === item.label
            )[0],
            name: item.label,
            value:
              item.value === "fullPath"
                ? route[item.value].substr(
                    0,
                    route["fullPath"].length - (route["path"].length || +"")
                  )
                : item.value === "path"
                ? removeLayoutPartExtraSlashes(route[item.value], "", "path")
                : route[item.value] || "",
          };
        }),
        {
          ...prevState.propDetails.props.filter(
            (obj) => obj.name === "elementProp"
          )[0],
          value: props,
        },
      ],
    },
    advancePropDetails: {
      ...prevState.advancePropDetails,
      isExpanded: false,
      props: advanceProp.map((item) => {
        return {
          ...prevState.advancePropDetails.props.filter(
            (obj) => obj.name === item.label
          )[0],
          name: item.label,
          value: route[item.value] || "",
        };
      }),
    },
    routerProviderDetails: {
      ...prevState.routerProviderDetails,
      isExpanded: true,
      props: routerProviderProp.map((item, index) => {
        return {
          ...prevState.routerProviderDetails.props[index],
          name: item.label,
          value: route[item.value] || "",
        };
      }),
    },
  };
  return newRouteDeatils;
};

const displayRouteDetails = (route, setSelectedRoute, setRouteSection) => {
  setSelectedRoute(route);
  setRouteSection((prevState) => {
    let updatedRouteStructure = updateRouteStructure(prevState, route);
    return updatedRouteStructure;
  });
};

const getRelativeRouteProps = (componentName, routeName, compRouteProps) => {
  let finalProps = [];
  let allProps = {};
  if (compRouteProps.routeProps[routeName]) {
    compRouteProps.routeProps[routeName].forEach((prop) => {
      finalProps.push({ name: prop.name, value: prop.value });
      allProps[prop.name] = true;
    });
  }
  if (compRouteProps.compProps[componentName]) {
    compRouteProps.compProps[componentName].forEach((prop) => {
      if (!allProps.hasOwnProperty(prop.name)) {
        finalProps.push({ name: prop.name, value: prop.value });
      }
    });
  }
  return finalProps;
};

const placeChildren = (parentRoute, allRoutes) => {
  if (!parentRoute.childRoutes) return [];

  return Object.keys(parentRoute.childRoutes).map((childPath) => {
    const childRoute = allRoutes[childPath];
    const fullPath = childPath;
    return {
      ...childRoute,
      fullPath: fullPath,
      children: placeChildren(childRoute, allRoutes),
    };
  });
};

const getRouteTree = (baseRoutes, allRoutes) => {
  // Create the base route objects with their full paths and children
  const allBaseRoutes = Object.keys(baseRoutes).map((routePath) => {
    const routeObj = allRoutes[routePath];
    return {
      ...routeObj,
      fullPath: routePath,
      children: placeChildren(routeObj, allRoutes),
    };
  });

  return allBaseRoutes;
};

const containsPattern = (input, pType, mode = "sloppy") => {
  let patterns = { layout: [/layout__[\w-]{9}__/g, 20] };
  if (mode === "strict")
    return (
      patterns[pType][0].test(input) && input.length === patterns[pType][1]
    );
  return patterns[pType][0].test(input);
};
const removeLayoutPartExtraSlashes = (
  inputString,
  replacer,
  type = "fullPath"
) => {
  const pattern = /layout__[\w-]{9}__/;
  // it is important not to use global flag while checking the match case
  // since javascript variable remembers the last matched index and then
  // test method checks new one
  let result = inputString.replace(/layout__[\w-]{9}__/g, replacer);
  if (inputString.length === 20 && pattern.test(inputString)) {
    return result.replace(/^\/+|\/+$/g, "");
  }
  if (type === "fullPath" && !pattern.test(inputString)) {
    return "/" + result.replace(/^\/+|\/+$/g, "");
  }
  return pattern.test(inputString)
    ? (type === "path" ? "" : "/") + result.replace(/^\/+|\/+$/g, "")
    : inputString;
};

const getFunctionFromConfig = (allRoutes, setCompRouteProps) => {
  let entries = Object.entries(allRoutes);
  entries = entries.map((obj) => {
    let route_obj = JSON.parse(JSON.stringify(obj));
    route_obj[1]["fullPath"] = route_obj[0];
    if (route_obj[1].props) {
      setCompRouteProps((prevState) => {
        return {
          ...prevState,
          routeProps: {
            ...prevState.routeProps,
            [route_obj[0]]: Object.entries(route_obj[1].props).map((obj) => {
              return { name: obj[0], value: obj[1] };
            }),
          },
        };
      });
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

const RouteNode = ({
  route,
  level,
  setRouteSection,
  setSelectedRoute,
  allRoutes,
  setIsRouterProviderActive,
  expandedNodes,
  toggleNode,
  selectedRoute,
}) => {
  const expanded = expandedNodes[route.fullPath] || false;
  const routeItemClickHandler = (route) => {
    toggleNode(route.fullPath);
    displayRouteDetails(route, setSelectedRoute, setRouteSection);
    setIsRouterProviderActive(false);
  };
  const getCompColor = (level) => {
    level = (level + 1) % 5;
    let levelColor = {
      1: "#C39BD3",
      2: "#5DADE2",
      3: "#48C9B0",
      4: "#F1948A",
      0: "#F8C471",
    };
    return levelColor[level];
  };

  return (
    <div className="route-node" style={{ marginLeft: `${level * 1}px` }}>
      <div className="d-flex" onClick={() => routeItemClickHandler(route)}>
        <div
          className="route-item flex-grow-1"
          // style={{backgroundColor: selectedRoute.fullPath === route.fullPath ? '#304356' : ''}}>
          style={{
            backgroundColor:
              selectedRoute.fullPath === route.fullPath ? "#0d1428" : "",
          }}
        >
          <span className="route-wrap">
            <span style={{ whiteSpace: "nowrap" }}>
              <span>
                {level === 0 && !!route.children.length && (
                  <span>
                    {
                      <img
                        src={RootRouteNode}
                        alt=""
                        height={12}
                        className="mx-2"
                      />
                    }
                  </span>
                )}
                {!!route.children.length && level !== 0 && (
                  <span>
                    {expanded ? (
                      <img
                        src={CloudClose}
                        alt=""
                        height={16}
                        className="ms-1 me-1"
                      />
                    ) : (
                      <img
                        src={CloudOpen}
                        alt=""
                        height={16}
                        className="ms-1 me-1"
                      />
                    )}
                  </span>
                )}
                {!route.children.length && (
                  <span className="route-icon">
                    <img
                      src={LastRoute}
                      alt=""
                      height={17}
                      className="ms-1 me-1"
                    />
                  </span>
                )}
                <span
                  className="route-component"
                  style={{ color: getCompColor(level) }}
                >
                  {route.component + " - "}
                </span>
              </span>
            </span>
            <span className="route-path">
              {removeLayoutPartExtraSlashes(route.path, "", "path")}
            </span>
          </span>
        </div>
        <span
          className="route-item-close-open"
          style={{
            padding: "0 8px",
            backgroundColor:
              selectedRoute.fullPath === route.fullPath ? "#0d1428" : "",
          }}
        >
          {route.children[0]
            ? expandedNodes[route.fullPath]
              ? " - "
              : " + "
            : ""}
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
              allRoutes={allRoutes}
              setIsRouterProviderActive={setIsRouterProviderActive}
              expandedNodes={expandedNodes}
              toggleNode={toggleNode}
              selectedRoute={selectedRoute}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const RouteTree = ({
  routeTreeNode,
  setRouteSection,
  setSelectedRoute,
  allRoutes,
  setIsRouterProviderActive,
  expandedNodes,
  toggleNode,
  selectedRoute,
}) => {
  return (
    <div className="route-tree">
      {routeTreeNode.map((route, index) => (
        <RouteNode
          key={index}
          route={route}
          level={0}
          setRouteSection={setRouteSection}
          setSelectedRoute={setSelectedRoute}
          allRoutes={allRoutes}
          setIsRouterProviderActive={setIsRouterProviderActive}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
          selectedRoute={selectedRoute}
        />
      ))}
    </div>
  );
};

const selectMenulistHeight = (windowHeight, labelName, allPageComponents) => {
  if (labelName === "parentPath") {
    if (windowHeight > 600 && windowHeight < 700) {
      return "203px";
    }
    if (windowHeight >= 700 && windowHeight < 800) {
      return "233px";
    }
    if (windowHeight >= 800 && windowHeight < 900) {
      return "283px";
    }
    if (windowHeight >= 900) {
      return "303px";
    }
  }
  if (labelName === "element") {
    if (windowHeight > 600 && windowHeight < 700) {
      return "127px";
    }
    if (windowHeight >= 700 && windowHeight < 800) {
      return "159px";
    }
    if (windowHeight >= 800 && windowHeight < 900) {
      return "200px";
    }
    if (windowHeight >= 900) {
      return "243px";
    }
  }
  if (labelName === "advancePropSection") {
    if (windowHeight < 700) {
      return "60%";
    }
    if (windowHeight >= 700 && windowHeight < 800) {
      return "65%";
    }
  }
  if (labelName === "routePropsElementSection") {
    let compLength = allPageComponents.length;
    if (compLength > 4) {
      return "60%";
    } else if (compLength === 4) {
      return "57%";
    } else if (compLength === 3) {
      return "50%";
    } else if (compLength === 2) {
      return "45%";
    } else {
      return "40%";
    }
  }
};

const ExpandableRouteDetailsSection = ({
  title,
  section = "",
  isExpanded,
  showExpansionToggle = true,
  toggleExpansion,
  children,
  className,
  style = {},
}) => {
  return (
    <div className={className} style={style}>
      <nav
        className="header-strip mb-1 d-flex justify-content-between align-items-center"
        onClick={toggleExpansion}
        style={{ cursor: "pointer" }}
      >
        <span>{title}</span>
        {showExpansionToggle && (
          <span className="float-end me-2">
            {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
          </span>
        )}
      </nav>
      {isExpanded && (
        <div
          className="pb-0 route-details-expandable-content"
          style={{ height: "88%" }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

function ProjectRouting2() {
  const { windowHeight } = useWindowDimension();
  const dispatch = useDispatch();
  const routerConfig = useSelector((state) => state.routerConfig);
  const [selectedRoute, setSelectedRoute] = useState("");
  const [routeDetailsSection, setRouteDetailsSection] = useState(
    defaultRouteDetailsSection
  );
  const { projectName } = useParams();
  const getRouteDetails = (section, propName, detailKey) => {
    if (propName === "isExpanded") {
      return routeDetailsSection[section].propName;
    }
    return routeDetailsSection[section].props.filter(
      (obj) => obj.name === propName
    )[0][detailKey];
  };
  const componentConfig = useSelector((state) => state.config);
  const allComponents = [
    ...Object.keys(componentConfig.custom_components),
    ...Object.keys(componentConfig.pages),
  ];
  const [isRouterProviderActive, setIsRouterProviderActive] = useState(false);
  const [selectedFocusedMenu, setSelectedFocusedMenu] = useState("");
  const [compRouteProps, setCompRouteProps] = useState({
    compProps: {
      ...Object.fromEntries(
        Object.entries({
          ...componentConfig.custom_components,
          ...componentConfig.pages,
        }).map(([key, value]) => [
          [key],
          value.propsVars.map((prop) => ({
            name: prop.name,
            value: "",
          })),
        ])
      ),
    },
    routeProps: {},
  });
  const routerConfigNode = useMemo(() => {
    let routerConfigNode = getFunctionFromConfig(
      routerConfig?.routes,
      setCompRouteProps
    );
    return routerConfigNode;
  }, [routerConfig?.routes]);
  const routeTreeNode = useMemo(() => {
    let routeTreeNode = getRouteTree(
      routerConfig?.baseRoutes,
      routerConfig?.routes
    );
    return routeTreeNode;
  }, [routerConfig?.baseRoutes, routerConfig?.routes]);

  const [allRoutes, setAllRoutes] = useState([...routerConfigNode]);
  const [parentRouteOptions, setParentRouteOptions] = useState([
    { value: "none", label: "None" },
    ...routerConfigNode.map((route) => ({
      value: route,
      label: removeLayoutPartExtraSlashes(
        route.fullPath,
        containsPattern(route.fullPath, "layout", "strict")
          ? `__LR__ - ${route.component}`
          : containsPattern(route.fullPath, "layout")
          ? "__LR__"
          : ""
      ),
    })),
  ]);
  const getParentRouteFromChildRoute = (childRoute) => {
    let parentPath =
      childRoute.fullPath.substr(
        0,
        childRoute["fullPath"].length - (childRoute["path"].length || +"")
      ) || "";
    const parentRoute = parentPath
      ? { ...routerConfig.routes[parentPath], fullPath: parentPath }
      : "";
    return parentRoute;
  };
  const isRouteAChildRoute = (route) => {
    if (selectedRoute && route.value !== "none") {
      return !route.value.fullPath.includes(selectedRoute.fullPath + "/");
    }
    return true;
  };
  const [isLoading, setIsLoading] = useState(false);

  const [searchedRoute, setSearchedRoute] = useState("");
  const [searchRouteCompOptions, setSearchRouteCompOptions] = useState([
    { value: "none", label: "None" },
    ...routerConfigNode.map((route) => ({
      value: route,
      label:
        route.component +
        " - " +
        removeLayoutPartExtraSlashes(route.fullPath, "__LR__"),
    })),
  ]);
  const [expandedNodes, setExpandedNodes] = useState({});
  const closeAllNodes = () => setExpandedNodes({});
  const toggleNode = (nodeId) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };
  const toggleSearchedNodeHierarchy = (node) => {
    displayRouteDetails(node, setSelectedRoute, setRouteDetailsSection);
    do {
      toggleNode(node.fullPath);
      node = getParentRouteFromChildRoute(node);
      if (!node.parentPath && node) {
        toggleNode(node.fullPath);
      }
    } while (node.parentPath);
  };
  const routePropsDisplayRef = useRef(null);
  const togglePropBody = () => {
    const propBody = routePropsDisplayRef.current;
    if (propBody) {
      const accordionInstance = new window.bootstrap.Collapse(propBody, {
        toggle: false, // Prevent automatic toggling on initialization
      });
      accordionInstance.toggle();
    }
  };
  const toggleExpansion = (routeDetailKey, value) => {
    setRouteDetailsSection((prevState) => {
      return {
        ...prevState,
        [routeDetailKey]: { ...prevState[routeDetailKey], isExpanded: value },
      };
    });
  };

  const handleRouteDetailsSection = useCallback(
    (section, sectionKey, searchKey, propName, value) => {
      setRouteDetailsSection((prevState) => {
        let routeDetailsSection = {
          ...prevState,
          [section]: {
            ...prevState[section],
            [sectionKey]: prevState[section][sectionKey].map((prop) =>
              searchKey === prop.name
                ? {
                    ...prop,
                    [propName]:
                      typeof prop[propName] === "object"
                        ? { ...prop[propName], ...value }
                        : value,
                  }
                : prop
            ),
          },
        };
        return routeDetailsSection;
      });
    },
    []
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("test");
  const [modalBody, setModalBody] = useState("testBody");
  const [modalSubmitHandler, setModalSubmitHandler] = useState(null);
  const [isSubmitButtonPresent, setIsSubmitButtonPresent] = useState(false);

  const loadDeleteRouteModal = (submitHandler) => {
    setModalTitle("Delete Route");
    setModalBody(
      "All the related routes will be affected, are you sure you want to delete it?"
    );
    setIsSubmitButtonPresent(true);
    setModalSubmitHandler(() => () => {
      submitHandler();
      setIsModalVisible(false);
    });
    setIsModalVisible(true);
  };

  const [toasterObject, setToasterObject] = useState({});
  const [showToaster, setShowToaster] = useState(false);

  const closeToaster = () => {
    setShowToaster(false);
    setToasterObject({});
  };

  const setTheRouteResponse = (res, method) => {
    if (res.status === 200) {
      dispatch(setRouterConfig(res.body.config));
      let updatedRoutes = getFunctionFromConfig(
        res.body.config.routes,
        setCompRouteProps
      );
      setAllRoutes(updatedRoutes);
      setParentRouteOptions([
        { value: "none", label: "None" },
        ...updatedRoutes.map((route) => ({
          value: route,
          label: removeLayoutPartExtraSlashes(
            route.fullPath,
            containsPattern(route.fullPath, "layout", "strict")
              ? `__LR__ - ${route.component}`
              : containsPattern(route.fullPath, "layout")
              ? "__LR__"
              : ""
          ),
        })),
      ]);
      setSearchRouteCompOptions([
        { value: "none", label: "None" },
        ...updatedRoutes.map((route) => ({
          value: route,
          label:
            route.component +
            " - " +
            removeLayoutPartExtraSlashes(route.fullPath, "__LR__"),
        })),
      ]);
      if (method !== "delete") {
        let path = getRouteDetails("propDetails", "path", "value")?.trim();
        let parentPath = getRouteDetails("propDetails", "parent path", "value");
        let newRoute = "";
        if (!path) {
          let changedRoutePath =
            res.body.helper_data.recently_saved_route_fullpath;
          newRoute = updatedRoutes.filter(
            (route) => route.fullPath === changedRoutePath
          )[0];
        } else {
          let newFullPath = parentPath + "/" + path.replace(/^\/+|\/+$/g, "");
          newRoute = updatedRoutes.filter(
            (route) => route.fullPath === newFullPath
          )[0];
        }
        if (!newRoute) {
          newRoute = updatedRoutes.filter((route) => route.fullPath === "/")[0];
        }
        toggleSearchedNodeHierarchy(newRoute);
        setSelectedRoute(newRoute);
      } else {
        setSelectedRoute("");
        setRouteDetailsSection({
          ...defaultRouteDetailsSection,
          propDetails: {
            ...defaultRouteDetailsSection.propDetails,
            isExpanded: true,
          },
          advancePropDetails: {
            ...defaultRouteDetailsSection.advancePropDetails,
            isExpanded: true,
          },
        });
        closeAllNodes();
      }

      setSearchedRoute("");
      setShowToaster(true);
      setToasterObject({
        toastTitle: "Success!",
        toastBody: (
          <>
            <Emoji symbol={"0x1F60A"} />{" "}
            {method !== "delete"
              ? "changes have been saved"
              : "route deleted successfully"}
            .
          </>
        ),
        delay: 3000,
        variant: "success",
        bodyFontColor: "text-white",
      });
    } else {
      console.log(res.body);
      setShowToaster(true);
      setToasterObject({
        toastTitle: "Oops found an error!",
        toastBody: `${res.body}`,
        variant: "warning",
      });
    }
  };

  const deleteTheRoute = async (route) => {
    if (route) {
      let res = await deleteRoute(route, projectName);
      setTheRouteResponse(res, "delete");
    } else {
      setRouteDetailsSection({
        ...defaultRouteDetailsSection,
        propDetails: {
          ...defaultRouteDetailsSection.propDetails,
          isExpanded: true,
        },
        advancePropDetails: {
          ...defaultRouteDetailsSection.advancePropDetails,
          isExpanded: true,
        },
      });
      closeAllNodes();
      setSearchedRoute("");
      setSelectedRoute("");
    }
  };

  const saveRouteDetails = async () => {
    let routeData = { ...routeDetailsSection, selectedRoute: selectedRoute };
    let res = await saveRoute(routeData, projectName);
    setIsLoading(false);
    setTheRouteResponse(res);
  };

  return (
    <div
      className={`container-fluid text-white ${
        isLoading ? " position-relative h-100" : ""
      }`}
    >
      <div
        className={`route-content-section ${isLoading ? "dull" : ""}`}
        data-bs-theme="dark"
        style={{ height: `${windowHeight - 95}px` }}
      >
        <div className="d-flex">
          <div className="ms-auto">
            <div
              className=" me-1 mt-1 text-muted badge rounded-pill text-bg-dark px-2"
              style={{ fontSize: "75%" }}
            >
              import config
            </div>
            <div
              className=" me-1 mt-1 text-muted badge rounded-pill text-bg-dark px-2"
              style={{ fontSize: "75%" }}
            >
              export config
            </div>
            <div
              className="me-1 mt-1 text-muted badge rounded-pill text-bg-dark px-2"
              style={{ fontSize: "75%" }}
            >
              code preview
            </div>
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
                      <div>
                        <Select
                          className=""
                          style={{ width: "60%" }}
                          id={"searchRoute"}
                          onMenuClose={() => setSelectedFocusedMenu("")}
                          placeholder="Select.. or search.. a route"
                          value={
                            searchedRoute
                              ? {
                                  value: searchedRoute.value,
                                  label: searchedRoute.label,
                                }
                              : ""
                          }
                          options={searchRouteCompOptions}
                          onChange={(e) => {
                            if (e?.value) {
                              setSearchedRoute(e);
                              closeAllNodes();
                              toggleSearchedNodeHierarchy(e.value);
                            }
                          }}
                          styles={{
                            placeholder: (base) => ({
                              ...base,
                              color: "#dee2e6bf",
                              marginLeft: "10px",
                            }),
                            input: (base) => ({
                              ...base,
                              color: "#dee2e6bf",
                              marginLeft: "10px",
                            }),
                            singleValue: (base) => ({
                              ...base,
                              color: "#dee2e6bf",
                              marginLeft: "10px",
                              fontSize: "90%",
                            }),
                            control: (styles) => ({
                              ...styles,
                              backgroundColor: "#212529",
                              borderRadius: "20px",
                              borderColor: "#495057",
                              color: "white",
                            }),
                            option: (base, { isFocused }) => ({
                              ...base,
                              fontSize: "80%",
                              backgroundColor: isFocused
                                ? "#343a40"
                                : "#212529",
                              width: "100%",
                              height: "100%",
                              color: "#dee2e6bf",
                              cursor: "pointer",
                              border: isFocused ? "1px solid #495057" : "none",
                            }),
                            menu: (base) => ({
                              ...base,
                              backgroundColor: "#212529",
                            }),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              {/* <p className="ms-3" style={{fontSize: '90%'}}>Route Tree</p> */}
              <RouteTree
                routeTreeNode={routeTreeNode}
                setRouteSection={setRouteDetailsSection}
                setSelectedRoute={setSelectedRoute}
                allRoutes={allRoutes}
                setIsRouterProviderActive={setIsRouterProviderActive}
                expandedNodes={expandedNodes}
                toggleNode={toggleNode}
                selectedRoute={selectedRoute}
              />
            </div>
          </div>

          <div className="col-8 px-0 h-100" aria-label="details section">
            <div className="d-flex">
              <div className="d-flex ms-auto me-2 ">
                <div className="me-1">
                  <div
                    className="py-0 btn btn-warning btn-sm"
                    onClick={() => {
                      toggleExpansion("advancePropDetails", false);
                      toggleExpansion("propDetails", false);
                      setIsRouterProviderActive((prevState) => !prevState);
                    }}
                    style={{
                      marginBottom: "0.15rem",
                      backgroundColor: "#bf8f00",
                      border: "none",
                    }}
                  >
                    <i>
                      <img src={Settings} height={14} className="me-1" alt="" />
                    </i>
                    <span
                      className="text-muted"
                      style={{
                        fontSize: "80%",
                      }}
                    >
                      Router Provider
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
                    onClick={() => {
                      setRouteDetailsSection({
                        ...defaultRouteDetailsSection,
                        propDetails: {
                          ...defaultRouteDetailsSection.propDetails,
                          isExpanded: true,
                        },
                        advancePropDetails: {
                          ...defaultRouteDetailsSection.advancePropDetails,
                          isExpanded: true,
                        },
                      });
                      closeAllNodes();
                      setIsRouterProviderActive(false);
                      setSearchedRoute("");
                      setSelectedRoute("");
                    }}
                  >
                    <i
                      className="bi bi-plus-circle text-muted me-1 mt-2"
                      style={{ fontSize: "90%" }}
                    ></i>
                    <span className="text-muted" style={{ fontSize: "80%" }}>
                      New Route
                    </span>
                  </div>
                </div>
                <div className="me-1 my-1">
                  <div
                    className={`py-0 btn btn-success btn-sm ${
                      false ? "disabled" : ""
                    }`}
                    style={{ height: "100%" }}
                    onClick={() => {
                      setIsLoading(true);
                      saveRouteDetails();
                    }}
                  >
                    <i>
                      <img
                        src={SaveChanges}
                        height={11}
                        className="me-1"
                        alt=""
                      />
                    </i>
                    <span className="text-muted" style={{ fontSize: "80%" }}>
                      save change(s)
                    </span>
                  </div>
                </div>
                {selectedRoute && (
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
                          onClick={() => {
                            loadDeleteRouteModal(() => {
                              deleteTheRoute(selectedRoute);
                            });
                          }}
                          className="mx-1"
                          alt=""
                        />
                      </i>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div
              className="all-route-details h-88"
              aria-label="all props/groups details"
            >
              <ExpandableRouteDetailsSection
                title="route prop details"
                isExpanded={routeDetailsSection.propDetails.isExpanded}
                section="propDetails"
                style={{
                  height: `${
                    selectedFocusedMenu === "elementTag"
                      ? selectMenulistHeight(
                          windowHeight,
                          "routePropsElementSection",
                          allComponents
                        )
                      : selectedFocusedMenu === "parentPath" &&
                        getRouteDetails("propDetails", "path", "value") !==
                          "/" &&
                        allRoutes.length !== 2
                      ? "60%"
                      : ""
                  }`,
                }}
                toggleExpansion={() => {
                  toggleExpansion(
                    "propDetails",
                    !routeDetailsSection.propDetails.isExpanded
                  );
                  setIsRouterProviderActive(false);
                }}
              >
                <form className="route-details-form" data-bs-theme="dark">
                  {routeDetailsSection.propDetails.props.map(
                    (prop, index) =>
                      prop.name !== "elementProp" && (
                        <div key={index} className="form-group row">
                          <label
                            id="propLabel"
                            className="col-sm-4 col-form-label"
                            style={{ cursor: "pointer" }}
                          >
                            {prop.name}
                          </label>
                          <div className={`col-sm-8 ms-auto`}>
                            {prop.type === "string" && (
                              <span className="d-flex align-items-center">
                                <input
                                  type="text"
                                  className={`form-control ${
                                    prop.isRemovable ? "" : "me-1"
                                  }`}
                                  style={{ fontSize: "115%" }}
                                  placeholder="Route name"
                                  value={removeLayoutPartExtraSlashes(
                                    prop.value,
                                    "",
                                    "path"
                                  )}
                                  onChange={(e) => {
                                    handleRouteDetailsSection(
                                      "propDetails",
                                      "props",
                                      prop.name,
                                      "value",
                                      e.target.value
                                    );
                                  }}
                                />
                              </span>
                            )}
                            {prop.type === "selectTag" &&
                              prop.name === "element" &&
                              (selectedFocusedMenu !== "parentPath" ||
                                getRouteDetails(
                                  "propDetails",
                                  "path",
                                  "value"
                                ) === "/") && (
                                <div className="route-prop-select-container z-999">
                                  <Select
                                    className="routePropSelection"
                                    style={{ width: "60%", height: "50%" }}
                                    id={prop.name}
                                    onMenuOpen={() => {
                                      setSelectedFocusedMenu("elementTag");
                                      toggleExpansion(
                                        "advancePropDetails",
                                        false
                                      );
                                    }}
                                    onMenuClose={() =>
                                      setSelectedFocusedMenu("")
                                    }
                                    placeholder="Select.. or search.. an element"
                                    value={
                                      prop.value
                                        ? {
                                            value: prop.value,
                                            label: prop.value,
                                          }
                                        : ""
                                    }
                                    options={[
                                      ...allComponents.map((comp) => ({
                                        value: comp,
                                        label: comp,
                                      })),
                                    ]}
                                    onChange={(e) => {
                                      if (e?.value) {
                                        handleRouteDetailsSection(
                                          "propDetails",
                                          "props",
                                          prop.name,
                                          "value",
                                          e.value
                                        );
                                        if (
                                          !!compRouteProps.compProps[
                                            getRouteDetails(
                                              "propDetails",
                                              "element",
                                              "value"
                                            )
                                          ]?.length
                                        ) {
                                          toggleExpansion(
                                            "advancePropDetails",
                                            false
                                          );
                                        }
                                      }
                                    }}
                                    styles={{
                                      placeholder: (base) => ({
                                        ...base,
                                        color: "#dee2e6bf",
                                      }),
                                      input: (base) => ({
                                        ...base,
                                        color: "#dee2e6bf",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "#dee2e6bf",
                                      }),
                                      control: (styles) => ({
                                        ...styles,
                                        backgroundColor: "#212529",
                                        borderTopRightRadius: "0",
                                        borderBottomRightRadius: "0",
                                        borderColor: "#495057",
                                        color: "white",
                                        zIndex: 7,
                                      }),
                                      option: (base, { isFocused }) => ({
                                        ...base,
                                        backgroundColor: isFocused
                                          ? "#343a40"
                                          : "#212529",
                                        width: "100%",
                                        height: "100%",
                                        color: "#dee2e6bf",
                                        cursor: "pointer",
                                        border: isFocused
                                          ? "1px solid #495057"
                                          : "none",
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        backgroundColor: "#212529",
                                      }),
                                      menuList: (provided) => ({
                                        ...provided,
                                        maxHeight: selectMenulistHeight(
                                          windowHeight,
                                          "element"
                                        ),
                                      }),
                                    }}
                                  />
                                  {selectedFocusedMenu !== "elementTag" &&
                                    getRouteDetails(
                                      "propDetails",
                                      "element",
                                      "value"
                                    ) &&
                                    getRouteDetails(
                                      "propDetails",
                                      "path",
                                      "value"
                                    ) &&
                                    !!compRouteProps.compProps[
                                      getRouteDetails(
                                        "propDetails",
                                        "element",
                                        "value"
                                      )
                                    ].length && (
                                      <div>
                                        <div
                                          className="accordion mt-2"
                                          id="componentsProp"
                                        >
                                          <div className="accordion-item">
                                            <h2 className="accordion-header">
                                              <button
                                                className="accordion-button routePropAccordian"
                                                type="button"
                                                onClick={(e) => {
                                                  let classList =
                                                    e.target.classList;
                                                  if (
                                                    !classList.contains(
                                                      "collapsed"
                                                    )
                                                  ) {
                                                    if (
                                                      routeDetailsSection
                                                        .advancePropDetails
                                                        .isExpanded
                                                    ) {
                                                      toggleExpansion(
                                                        "advancePropDetails",
                                                        false
                                                      );
                                                    }
                                                  }
                                                }}
                                                id="routePropsDisplay"
                                                data-bs-toggle="collapse"
                                                data-bs-target="#propsBody"
                                                aria-expanded="true"
                                                aria-controls="collapseOne"
                                              >
                                                <span className="me-1">
                                                  Props
                                                </span>
                                                <OverlayTrigger
                                                  placement={"right"}
                                                  overlay={
                                                    <Tooltip
                                                      id={`tooltip-prop-info`}
                                                    >
                                                      Insert Value to include
                                                      prop & remove value to
                                                      delete prop.
                                                    </Tooltip>
                                                  }
                                                >
                                                  <i
                                                    className="mt-1 bi bi-info-circle-fill"
                                                    style={{
                                                      fontSize: "14px",
                                                      cursor: "pointer",
                                                    }}
                                                  ></i>
                                                </OverlayTrigger>
                                              </button>
                                            </h2>
                                            <div
                                              id="propsBody"
                                              ref={routePropsDisplayRef}
                                              className="accordion-collapse collapse show"
                                              data-bs-parent="#componentsProp"
                                            >
                                              <div
                                                className="accordion-body"
                                                style={{
                                                  overflowY: "auto",
                                                  height: "140px",
                                                }}
                                              >
                                                {/* add selectedRoute's path for reference of props and should be saved on path change too*/}
                                                {getRelativeRouteProps(
                                                  getRouteDetails(
                                                    "propDetails",
                                                    "element",
                                                    "value"
                                                  ),
                                                  getRouteDetails(
                                                    "propDetails",
                                                    "parent path",
                                                    "value"
                                                  ) +
                                                    getRouteDetails(
                                                      "propDetails",
                                                      "path",
                                                      "value"
                                                    ),
                                                  compRouteProps
                                                )?.map((obj) => (
                                                  <div
                                                    key={obj.name}
                                                    className="mb-4 row"
                                                  >
                                                    <label className="col-sm-3 col-form-label text-white">
                                                      {obj.name}
                                                    </label>
                                                    <div className="col-sm-9 mt-2">
                                                      <MonacoEditor
                                                        key={obj.name}
                                                        defaultValue={
                                                          obj.value || ""
                                                        }
                                                        onChange={(value) => {
                                                          handleRouteDetailsSection(
                                                            "propDetails",
                                                            "props",
                                                            "elementProp",
                                                            "value",
                                                            {
                                                              [obj.name]: value,
                                                            }
                                                          );
                                                        }}
                                                        height="50px"
                                                        id={obj.name}
                                                        width="80%"
                                                        language="javascript"
                                                      />
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                </div>
                              )}
                            {prop.type === "selectTag" &&
                              prop.name === "parent path" && (
                                <div>
                                  <Select
                                    className="newRouteDropdown"
                                    style={{ width: "60%" }}
                                    // ref={selectRef}
                                    id={"parentpath"}
                                    onMenuOpen={() => {
                                      setSelectedFocusedMenu("parentPath");
                                      if (
                                        getRouteDetails(
                                          "propDetails",
                                          "path",
                                          "value"
                                        ) !== "/"
                                      ) {
                                        toggleExpansion(
                                          "advancePropDetails",
                                          false
                                        );
                                      }
                                    }}
                                    onMenuClose={() =>
                                      setSelectedFocusedMenu("")
                                    }
                                    placeholder={
                                      "Select.. or search.. a parent path"
                                    }
                                    value={
                                      prop.value
                                        ? {
                                            value: prop.value,
                                            label: removeLayoutPartExtraSlashes(
                                              prop.value,
                                              "__LR__"
                                            ),
                                          }
                                        : { value: "none", label: "None" }
                                    }
                                    options={
                                      getRouteDetails(
                                        "propDetails",
                                        "path",
                                        "value"
                                      ) !== "/"
                                        ? parentRouteOptions.filter(
                                            (obj) =>
                                              obj.value.fullPath !==
                                                selectedRoute.fullPath &&
                                              isRouteAChildRoute(obj)
                                          )
                                        : [{ value: "none", label: "None" }]
                                    }
                                    onChange={(e) => {
                                      if (e?.value) {
                                        handleRouteDetailsSection(
                                          "propDetails",
                                          "props",
                                          prop.name,
                                          "value",
                                          e.value.fullPath || "none"
                                        );
                                      }
                                    }}
                                    styles={{
                                      placeholder: (base) => ({
                                        ...base,
                                        color: "#dee2e6bf",
                                      }),
                                      input: (base) => ({
                                        ...base,
                                        color: "#dee2e6bf",
                                      }),
                                      singleValue: (base) => ({
                                        ...base,
                                        color: "#dee2e6bf",
                                      }),
                                      control: (styles) => ({
                                        ...styles,
                                        backgroundColor: "#212529",
                                        borderTopRightRadius: "0",
                                        borderBottomRightRadius: "0",
                                        borderColor: "#495057",
                                        color: "white",
                                      }),
                                      option: (base, { isFocused }) => ({
                                        ...base,
                                        backgroundColor: isFocused
                                          ? "#343a40"
                                          : "#212529",
                                        width: "100%",
                                        height: "100%",
                                        color: "#dee2e6bf",
                                        cursor: "pointer",
                                        border: isFocused
                                          ? "1px solid #495057"
                                          : "none",
                                      }),
                                      menu: (base) => ({
                                        ...base,
                                        backgroundColor: "#212529",
                                      }),
                                      menuList: (provided) => ({
                                        ...provided,
                                        maxHeight: selectMenulistHeight(
                                          windowHeight,
                                          "parentPath"
                                        ),
                                      }),
                                    }}
                                  />
                                </div>
                              )}
                          </div>
                        </div>
                      )
                  )}
                </form>
              </ExpandableRouteDetailsSection>

              <ExpandableRouteDetailsSection
                title="advance props details"
                isExpanded={routeDetailsSection.advancePropDetails.isExpanded}
                section={{ advancePropDetails: {} }}
                className={"z-5"}
                style={{
                  overflowY: "auto",
                  height: routeDetailsSection.advancePropDetails.isExpanded
                    ? selectMenulistHeight(windowHeight, "advancePropSection")
                    : "",
                }}
                toggleExpansion={() => {
                  toggleExpansion(
                    "advancePropDetails",
                    !routeDetailsSection.advancePropDetails.isExpanded
                  );
                  if (!routeDetailsSection.advancePropDetails.isExpanded) {
                    if (
                      !document
                        .getElementById("routePropsDisplay")
                        ?.classList.contains("collapsed")
                    ) {
                      togglePropBody();
                    }
                  }
                  setIsRouterProviderActive(false);
                }}
              >
                <form className="route-details-form" data-bs-theme="dark">
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label py-0">
                      index
                    </label>
                    <div className="col-sm-8">
                      <div className="form-check form-switch form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="indexState"
                          checked={
                            routeDetailsSection.advancePropDetails.props.filter(
                              (obj) => obj.name === "index"
                            )[0].value
                          }
                          onChange={() =>
                            handleRouteDetailsSection(
                              "advancePropDetails",
                              "props",
                              "index",
                              "value",
                              !routeDetailsSection.advancePropDetails.props.filter(
                                (obj) => obj.name === "index"
                              )[0].value
                            )
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor="indexState"
                        >
                          {routeDetailsSection.advancePropDetails.props.filter(
                            (obj) => obj.name === "index"
                          )[0].value
                            ? "true"
                            : "false"}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label py-0">
                      case-sensitive
                    </label>
                    <div className="col-sm-8">
                      <div className="form-check form-switch form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="caseSensitiveState"
                          checked={
                            routeDetailsSection.advancePropDetails.props.filter(
                              (obj) => obj.name === "caseSensitive"
                            )[0]?.value
                          }
                          onChange={() =>
                            handleRouteDetailsSection(
                              "advancePropDetails",
                              "props",
                              "caseSensitive",
                              "value",
                              !routeDetailsSection.advancePropDetails.props.filter(
                                (obj) => obj.name === "caseSensitive"
                              )[0].value
                            )
                          }
                        />

                        <label
                          className="form-check-label"
                          htmlFor="caseSensitiveState"
                        >
                          {routeDetailsSection.advancePropDetails.props.filter(
                            (obj) => obj.name === "caseSensitive"
                          )[0].value
                            ? "true"
                            : "false"}
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">
                      error element
                    </label>
                    <div className="col-sm-8">
                      {routeDetailsSection.advancePropDetails.props.filter(
                        (obj) =>
                          obj.name === "error-element" ||
                          obj.name === "errorElement"
                      )[0] && (
                        <div className="">
                          <Select
                            className=""
                            style={{ width: "60%", height: "50%" }}
                            id="errorElement"
                            onMenuOpen={() => {
                              setSelectedFocusedMenu("errorElement");
                            }}
                            onMenuClose={() => setSelectedFocusedMenu("")}
                            placeholder="Select.. or search.. an element"
                            value={
                              routeDetailsSection.advancePropDetails.props.filter(
                                (obj) => obj.name === "error-element"
                              )[0]?.value
                                ? {
                                    value:
                                      routeDetailsSection.advancePropDetails.props.filter(
                                        (obj) => obj.name === "error-element"
                                      )[0].value,
                                    label:
                                      routeDetailsSection.advancePropDetails.props.filter(
                                        (obj) => obj.name === "error-element"
                                      )[0].value,
                                  }
                                : { value: "", label: "None" }
                            }
                            options={[
                              { value: "none", label: "None" },
                              ...allComponents.map((comp) => ({
                                value: comp,
                                label: comp,
                              })),
                            ]}
                            onChange={(e) =>
                              handleRouteDetailsSection(
                                "advancePropDetails",
                                "props",
                                "error-element",
                                "value",
                                e.value
                              )
                            }
                            styles={{
                              placeholder: (base) => ({
                                ...base,
                                color: "#dee2e6bf",
                              }),
                              input: (base) => ({
                                ...base,
                                color: "#dee2e6bf",
                              }),
                              singleValue: (base) => ({
                                ...base,
                                color: "#dee2e6bf",
                              }),
                              control: (styles) => ({
                                ...styles,
                                backgroundColor: "#212529",
                                borderTopRightRadius: "0",
                                borderBottomRightRadius: "0",
                                borderColor: "#495057",
                                color: "white",
                                zIndex: 7,
                              }),
                              option: (base, { isFocused }) => ({
                                ...base,
                                backgroundColor: isFocused
                                  ? "#343a40"
                                  : "#212529",
                                width: "100%",
                                height: "100%",
                                color: "#dee2e6bf",
                                cursor: "pointer",
                                border: isFocused
                                  ? "1px solid #495057"
                                  : "none",
                              }),
                              menu: (base) => ({
                                ...base,
                                backgroundColor: "#212529",
                              }),
                              menuList: (provided) => ({
                                ...provided,
                                maxHeight: selectMenulistHeight(
                                  windowHeight,
                                  "element"
                                ),
                              }),
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">loader</label>
                    <div className="col-sm-8">
                      <textarea
                        type="text"
                        rows={2}
                        className="form-control"
                        placeholder="Route loader"
                        value={
                          routeDetailsSection.advancePropDetails.props.filter(
                            (obj) => obj.name === "loader"
                          )[0].value || ""
                        }
                        onChange={(e) => {
                          handleRouteDetailsSection(
                            "advancePropDetails",
                            "props",
                            "loader",
                            "value",
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">action</label>
                    <div className="col-sm-8">
                      <textarea
                        type="text"
                        rows={2}
                        className="form-control"
                        placeholder="Route action"
                        value={
                          routeDetailsSection.advancePropDetails.props.filter(
                            (obj) => obj.name === "action"
                          )[0].value || ""
                        }
                        onInput={(e) => {
                          handleRouteDetailsSection(
                            "advancePropDetails",
                            "props",
                            "action",
                            "value",
                            e.target.value
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-4 col-form-label">lazy</label>
                    <div className="col-sm-8">
                      {selectedFocusedMenu !== "errorElement" && (
                        <textarea
                          type="text"
                          rows={2}
                          className="form-control"
                          placeholder="Route lazy"
                          value={
                            routeDetailsSection.advancePropDetails.props.filter(
                              (obj) => obj.name === "lazy"
                            )[0].value || ""
                          }
                          onInput={(e) => {
                            handleRouteDetailsSection(
                              "advancePropDetails",
                              "props",
                              "lazy",
                              "value",
                              e.target.value
                            );
                          }}
                        />
                      )}
                    </div>
                  </div>
                </form>
              </ExpandableRouteDetailsSection>

              {isRouterProviderActive && (
                <ExpandableRouteDetailsSection
                  title="Router provider props"
                  isExpanded={isRouterProviderActive}
                  className="mt-1"
                  style={{ height: "80%" }}
                  showExpansionToggle={false}
                >
                  <form className="route-details-form" data-bs-theme="dark">
                    <div className="form-group row">
                      <label className="col-sm-4 col-form-label">
                        fallBackElement
                      </label>
                      <div className="col-sm-8">
                        {routeDetailsSection.routerProviderDetails.props.filter(
                          (obj) => obj.name === "fallbackElement"
                        )[0] && (
                          <div className="">
                            <Select
                              className=""
                              id="routerProviderDetails"
                              onMenuOpen={() => {
                                setSelectedFocusedMenu("fallbackElement");
                              }}
                              onMenuClose={() => setSelectedFocusedMenu("")}
                              placeholder="Select.. or search.. an element"
                              value={
                                routeDetailsSection.routerProviderDetails.props.filter(
                                  (obj) => obj.name === "fallbackElement"
                                )[0]?.value
                                  ? {
                                      value:
                                        routeDetailsSection.routerProviderDetails.props.filter(
                                          (obj) =>
                                            obj.name === "fallbackElement"
                                        )[0].value,
                                      label:
                                        routeDetailsSection.routerProviderDetails.props.filter(
                                          (obj) =>
                                            obj.name === "fallbackElement"
                                        )[0].value,
                                    }
                                  : ""
                              }
                              options={[
                                { value: "none", label: "None" },
                                ...allComponents.map((comp) => ({
                                  value: comp,
                                  label: comp,
                                })),
                              ]}
                              onChange={(e) =>
                                handleRouteDetailsSection(
                                  "routerProviderDetails",
                                  "props",
                                  "fallbackElement",
                                  "value",
                                  e.value
                                )
                              }
                              styles={{
                                placeholder: (base) => ({
                                  ...base,
                                  color: "#dee2e6bf",
                                }),
                                input: (base) => ({
                                  ...base,
                                  color: "#dee2e6bf",
                                }),
                                singleValue: (base) => ({
                                  ...base,
                                  color: "#dee2e6bf",
                                }),
                                control: (styles) => ({
                                  ...styles,
                                  backgroundColor: "#212529",
                                  borderTopRightRadius: "0",
                                  borderBottomRightRadius: "0",
                                  borderColor: "#495057",
                                  color: "white",
                                  zIndex: 7,
                                }),
                                option: (base, { isFocused }) => ({
                                  ...base,
                                  backgroundColor: isFocused
                                    ? "#343a40"
                                    : "#212529",
                                  width: "100%",
                                  height: "100%",
                                  color: "#dee2e6bf",
                                  cursor: "pointer",
                                  border: isFocused
                                    ? "1px solid #495057"
                                    : "none",
                                }),
                                menu: (base) => ({
                                  ...base,
                                  backgroundColor: "#212529",
                                }),
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </form>
                </ExpandableRouteDetailsSection>
              )}

              {isLoading && (
                <div className="container-fluid routing-overlay-spinner text-white d-flex justify-content-center align-items-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div>
        <ModalComponent
          showModal={isModalVisible}
          modalTitle={modalTitle}
          modalBody={modalBody}
          handleClose={() => setIsModalVisible(false)}
          submitText={"Delete Route"}
          submitHandler={modalSubmitHandler}
          isSubmitButtonPresent={isSubmitButtonPresent}
          submitVariant={"danger"}
        />
      </div>

      {/* toaster */}
      <ToasterComponent
        showToaster={showToaster}
        toastTitle={toasterObject.toastTitle || ""}
        toastBody={toasterObject.toastBody || ""}
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

export default ProjectRouting2;
