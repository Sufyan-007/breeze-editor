import React, { useEffect, useState } from "react";
import { Form, Col, Button } from "react-bootstrap";
import { useParams } from "react-router";
import { getRouterConfig } from "../../../../../services/ConfigService";

function AddNavigation({ config, update }) {
  const [conf, setConf] = useState({ ...config });
  const [routes, setRoutes] = useState([]);
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
    setConf((state) => {
      state.parameters[0].value = value;
      return { ...state };
    });
  }

  return (
    <div className="d-flex h-100 flex-column justify-content-between">
      <div>
        <Form.Label htmlFor="routeSelect">Route</Form.Label>
        <Form.Group as={Col} controlId="routeSelect">
          <Form.Select
            className="form-select form-select-sm"
            value={conf?.parameters[0].value || ""}
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
        <Button
          variant="success"
          className="btn btn-sm"
          onClick={() => update(conf)}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default AddNavigation;
