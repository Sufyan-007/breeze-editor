import { useState } from "react";
import { Form } from "react-bootstrap";
import { addComponent } from "../services/ComponentConfigService";
import { useParams } from "react-router";
import { router } from "../App";

export default function AddNewComponent() {
  const { projectName } = useParams();
  const [newComponent, setNewComponent] = useState({
    name: "",
    type: "CUSTOM",
    route: "",
  });
  const [disableButton, setDisableButton] = useState(false);

  function setComponentName(name) {
    name = (name.charAt(0).toUpperCase() + name.slice(1)).trim();
    setNewComponent((state) => {
      return { ...state, name };
    });
  }

  function setComponentType(type) {
    setNewComponent((state) => {
      return { ...state, type };
    });
  }

  function setComponentRoute(route) {
    setNewComponent((state) => {
      return { ...state, route };
    });
  }

  function addComp(event) {
    console.log('newComponent::>>', newComponent);
    event.preventDefault();
    setDisableButton(true);
    addComponent(
      newComponent.name,
      newComponent.type,
      newComponent.route,
      projectName
    ).then((res) => {
      alert("Component added successfully");
      console.log(res.comp,"comp name");
      router.navigate("/project/" + projectName + "/component/" + res.comp);
    });
  }

  return (
    <div className={"container bg-dark"}>
      <Form className="row">
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            className=""
            value={newComponent.name}
            onChange={(event) => setComponentName(event.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Component Type</Form.Label>
          <div>
            <Form.Check
              type="radio"
              checked={newComponent.type === "CUSTOM"}
              label="Custom"
              name="type"
              inline
              onChange={() => setComponentType("CUSTOM")}
            />
            <Form.Check
              type="radio"
              checked={newComponent.type === "PAGE"}
              label="Page"
              name="type"
              inline
              onChange={() => setComponentType("PAGE")}
            />
          </div>
        </Form.Group>

        {newComponent.type === "PAGE" && (
          <Form.Group className="mb-3">
            <Form.Label>Route</Form.Label>
            <Form.Control
              value={newComponent.route}
              onChange={(event) => setComponentRoute(event.target.value)}
            />
          </Form.Group>
        )}
        <div className="mt-4">
          <button
            disabled={disableButton}
            className="btn btn-secondary"
            onClick={addComp}
          >
            Create
          </button>
        </div>
      </Form>
    </div>
  );
}
