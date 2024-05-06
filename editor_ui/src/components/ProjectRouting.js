import { useEffect, useRef, useState } from "react";
import { ButtonGroup, Button } from "react-bootstrap";
import DeleteIcon from "../assets/icons/delete-trash.svg";
import EditIcon from "../assets/icons/edit-icon.svg";
import ViewIcon from "../assets/icons/view-eye.svg";
import { Link } from "react-router-dom";
import ProjectRouteModal from "./ProjectRouteModal";
import { useSelector } from "react-redux";
import ProjectRouteDetails from "./ProjectRouteDetails";

export default function ProjectRouting() {
  // const [routes, setRoutes] = useState([
  //   { path: "/", component: "Main" },
  //   { path: "/r1", component: "GeneralSettings" ,
  //     childRoutes: { path: "/r3", component: "newSettings" }
  //   },
  //   { path: "/r2", redirectTo: "https://reactrouter.com/en/main/route/route" }
  // ]);

  const [show, setShow] = useState(false);
  const [routeObj, setRouteObj] = useState();
  const [routeMode, setRouteMode] = useState();
  const routerConfig = useSelector((state) => state.routerConfig);
  const [routes, setRoutes] = useState(routerConfig.routes);
  const saveRouteRefs = useRef({});
  const setSaveRouteRef = (name, refs) => {
    saveRouteRefs.current[name] = refs;
  }
  const callChildFunc = (compName, funcName) => {
    if (saveRouteRefs.current[compName] && saveRouteRefs.current[compName][funcName]) {
      saveRouteRefs.current[compName][funcName]();
    }
  }
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

  useEffect(() => {}, []);

  function handleAllRoutePropsModal(routeObj, routeMode) {
    handleShow();
    setRouteObj(routeObj);
    setRouteMode(routeMode);
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
    <div className="container-fluid text-white">
      <div className="mt-3 mb-1 mx-4">
        <h3 className="ms-2">Project Routes:</h3>
      </div>
      <div className="d-flex justify-content-end mt-1 mb-3 mx-4">
        <button
          className="btn btn-primary me-2"
          onClick={() => handleAllRoutePropsModal({}, "Add")}
        >
          Add Route
        </button>
        <button
          className="btn btn-success me-2"
          onClick={() => {
            callChildFunc('ProjectRouteDetails', 'saveEditedRoutes');
          }}
        >
          Save All Changes
        </button>
      </div>
      {/* <div className="mx-3 p-3">
        <table className="table table-bordered table-dark">
          <thead>
            <tr className="text-center">
              <th>Path</th>
              <th>Component</th>
              <th>All Route Props</th>
              <th style={{ color: 'transparent', userSelect: 'none' }} colSpan={3}>options</th>
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
      </div> */}
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
