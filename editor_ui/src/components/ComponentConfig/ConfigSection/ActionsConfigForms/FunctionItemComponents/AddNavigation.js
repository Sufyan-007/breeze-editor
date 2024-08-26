import React, { useEffect, useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useParams } from "react-router";
import { getRouterConfig } from "../../../../../services/ConfigService";

function AddNavigation({ config, update }) {
  const [conf, setConf] = useState({ ...config });
  const [routes, setRoutes] = useState([]);
  const [routeParams, setRouteParams] = useState({});
  const { projectName } = useParams();

  useEffect(() => {
    setConf({ ...config });
  }, [config]);

  useEffect(() => {
    async function fetchRouterConfig() {
      const config = await getRouterConfig(projectName);
      if (config && config.routes) {
        setRoutes(Object.keys(config.routes));
      }
    }

    fetchRouterConfig();
  }, [projectName]);

  function updateRoute(value) {
    const selectedRoute = routes.find((route) => route === value);
    if (selectedRoute) {
      const params = selectedRoute.match(/:(\w+)/g) || [];
      const formattedParams = params.reduce((acc, param) => {
        acc[param.slice(1)] = "";
        return acc;
      }, {});

      setRouteParams(formattedParams);
    }
    setConf((state) => {
      state.parameters[0].value = value;
      return { ...state };
    });
  }

  function handleParamChange(param, value) {
    setRouteParams((prevParams) => ({
      ...prevParams,
      [param]: value,
    }));
  }

  function formatRoute(route) {
    //Case to cover : formatting as per dynamic list its edit case
    let formattedRoute = route;
    Object.keys(routeParams).forEach((param) => {
      formattedRoute = formattedRoute.replace(`:${param}`, routeParams[param]);
    });
    return formattedRoute;
  }

  function handleSave() {
    const formattedRoute = formatRoute(conf?.parameters[0].value || "");
    setConf((state) => {
      state.parameters[0].value = formattedRoute;
      return { ...state };
    });
    update({
      ...conf,
      parameters: [{ ...conf.parameters[0], value: formattedRoute }],
    });
  }

  const selectedRoute = conf?.parameters[0]?.value || "";
  const routeParamsList = selectedRoute.match(/:(\w+)/g) || [];

  return (
    <div className="d-flex h-100 flex-column justify-content-between">
      <div>
        <Form.Label htmlFor="routeSelect">Route</Form.Label>
        <Form.Group as={Col} controlId="routeSelect">
          <Form.Select
            className="form-select form-select-sm"
            value={selectedRoute}
            onChange={(event) => updateRoute(event.target.value)}
            required
          >
            <option value="" disabled>
              Select a route
            </option>
            {routes.map((route, index) => (
              <option key={index} value={route}>
                {route}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        {routeParamsList.length > 0 && (
          <div className="mt-2">
            <strong className="mb-1 mx-2">Path Params</strong>
            {routeParamsList.map((param, index) => (
              <Form.Group
                key={index}
                as={Col}
                controlId={`param-${param}`}
                className="mx-2"
              >
                <Form.Label>{param.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  value={routeParams[param.slice(1)] || ""}
                  className="form-control-sm mb-2"
                  onChange={(e) =>
                    handleParamChange(param.slice(1), e.target.value)
                  }
                />
              </Form.Group>
            ))}
          </div>
        )}
        <div className="mt-2">
          <div className="d-flex">
            <div className="me-1">
              {" "}
              <strong>Note :</strong>
            </div>
            <div>
              <p>Add import "router" from "../App"</p>
            </div>
          </div>
        </div>
      </div>
      <div className="my-3 d-flex justify-content-between">
        <Button variant="success" className="btn btn-sm" onClick={handleSave}>
          Save
        </Button>
      </div>
    </div>
  );
}

export default AddNavigation;
