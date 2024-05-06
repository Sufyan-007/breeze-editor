import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

function ProjectRouteModal(props) {
  const {
    routes,
    routeMode,
    routeData,
    show,
    onHide: handleClose,
    onSubmit,
  } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const submitFormData = (data) => {
    onSubmit(data);
  };
  const [isEditChildRoutePresent, setIsEditChildRoutePresent] = useState(false);
  const handleChildRouteChange = (selectedChildRoute) => {
    // reset({
    //   ...register,
    //   childRoutes: selectedChildRoute.value,
    // });
    // setChildRoute(e.target.value);
  };

  useEffect(() => {
    const getChildRoutes = () => {
      console.log(routeData?.childRoutes);

      if (routeMode === "Add") return "";
      if (routeMode === "View")
        return routeData.childRoutes ? routeData.childRoutes : "None";
      if (routeMode === "Edit") {
        console.log(routeData?.childRoutes);
        if (routeData.childRoutes) {
          console.log("child present");
          setIsEditChildRoutePresent(true);
          return routeData.childRoutes.length > 0
            ? routeData[0].childRoutes.component
            : routeData.childRoutes.component;
        } else {
          console.log("no child");
          setIsEditChildRoutePresent(false);
          return "na";
        }
      }
    };

    if (routeData) {
      reset({
        path: routeMode === "Add" ? "" : routeData.path,
        component:
          routeMode === "Add"
            ? ""
            : routeData.component || routeData?.redirectTo,
        // childRoutes: getChildRoutes(),
        action: routeMode === "Add" ? "" : routeData?.action,
        loader: routeMode === "Add" ? "" : routeData?.loader,
        lazy: routeMode === "Add" ? "" : routeData?.lazy,
        caseSensitive: routeMode === "Add" ? "" : routeData?.caseSensitive,
      });
    }
  }, [routeData, routeMode, reset]);

  return (
    <>
      {/* <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Route Properties</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(submitFormData)}>
            <Form.Group className="mb-3" controlId="formRoutePath">
              <Form.Label>Path</Form.Label>
              <Form.Control
                type="text"
                {...register("path", { required: true })}
                placeholder="Enter route path"
                disabled={routeMode === "View"}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formComponentURL">
              <Form.Label>Component/redirect_URL</Form.Label>
              <Form.Control
                type="text"
                {...register("component", { required: true })}
                placeholder="Component Name or redirect_URL"
                disabled={routeMode === "View"}
              />
            </Form.Group>
            {routeMode === "View" && (
              <Form.Group className="mb-3" controlId="formChildRoutes">
                <Form.Label>Child Routes</Form.Label>
                <Form.Control
                  // as={routeData.childRoutes ? 'textarea' : 'text'}
                  type={routeData.childRoutes ? "textarea" : "text"}
                  {...register("childRoutes")}
                  disabled={routeMode === "View"}
                  value={
                    routeData.childRoutes
                      ? JSON.stringify(routeData?.childRoutes, null, 2)
                      : "None"
                  }
                ></Form.Control>
              </Form.Group>
            )}

            {routeMode === "Edit" && (
              <>
                <Form.Label>Child Routes</Form.Label>
                <select
                  className="mb-3"
                  {...register("childRoutes")}
                  onChange={(e) => {
                    const selectedRoute = routes.find(
                      (route) => route.component === e.target.value
                    );
                    handleChildRouteChange(selectedRoute);
                  }}
                >
                  { !isEditChildRoutePresent && (<option value="" selected disabled> Select </option>)}
                  {routes.map(
                    (route) =>
                      route.component && (
                        <option key={route.component} value={route.component}>
                          {route.component}
                        </option>
                      )
                  )}
                </select>
              </>
            )}
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="caseSensitive" />
            </Form.Group>
            {routeMode === "Add" ? (
              <Button variant="primary" type="submit">
                Submit
              </Button>
            ) : null}
          </Form>
        </Modal.Body>
        {routeMode !== "Add" ? (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            {routeMode === "Edit" ? (
              <Button variant="primary" type="submit" onClick={handleClose}>
                Save Changes
              </Button>
            ) : null}
          </Modal.Footer>
        ) : null}
      </Modal> */}

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Child Routes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { routeData.childRoutes ? routeData.childRoutes.map((route) => (
            <div className="btn d-flex">{route.path + " - " + (routeData.component ? routeData.component : routeData.redirectTo) }</div>
          )) : 'No Child Route present'}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {false && (
            <Button variant="primary" onClick={handleClose}>
              Save Changes
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProjectRouteModal;

// https://www.google.com/search?q=CRUD+options+opening+in+accordion&tbm=isch&ved=2ahUKEwjcpsDwrN-FAxWIjWMGHaobAtUQ2-cCegQIABAA&oq=CRUD+options+opening+in+accordion&gs_lp=EgNpbWciIUNSVUQgb3B0aW9ucyBvcGVuaW5nIGluIGFjY29yZGlvbkjxF1CjC1iTFnAAeACQAQCYAYoBoAGDBqoBAzAuNrgBA8gBAPgBAYoCC2d3cy13aXotaW1niAYB&sclient=img&ei=21YrZpzNA4ibjuMPqreIqA0&bih=734&biw=1466&prmd=ivsnmbtz&hl=en#imgrc=p_NGM-vixQjOKM
// https://www.google.com/search?q=CRUD+options+opening+in+accordion+not+in+table&tbm=isch&ved=2ahUKEwjeg9KNrd-FAxX8o2MGHbFwANwQ2-cCegQIABAA&oq=CRUD+options+opening+in+accordion+not+in+table&gs_lp=EgNpbWciLkNSVUQgb3B0aW9ucyBvcGVuaW5nIGluIGFjY29yZGlvbiBub3QgaW4gdGFibGVI1T9QwAlYtjxwCXgAkAEBmAHhAaABkhqqAQYwLjIwLjO4AQPIAQD4AQGKAgtnd3Mtd2l6LWltZ4gGAQ&sclient=img&ei=GFcrZt6XCvzHjuMPseGB4A0&bih=734&biw=1466&prmd=ivsnmbtz&hl=en#imgrc=0rumj7wCsEN5dM&imgdii=YjJDy6Hnbt7vwM
