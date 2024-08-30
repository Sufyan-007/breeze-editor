import { useState } from "react";
import { Form } from "react-bootstrap";
import { addComponent } from "../services/ComponentConfigService";
import { saveRoute } from "../services/ComponentConfigService";
import { useParams } from "react-router";
import { router } from "../App";
import { useSelector } from "react-redux";
import ToasterComponent from "../common/display/d.toast";

export default function AddNewComponent() {
  const { projectName } = useParams();
  const [newComponent, setNewComponent] = useState({
    name: "",
    type: "CUSTOM",
    route: "",
  });
  const [disableButton, setDisableButton] = useState(false);
  const routerConfig = useSelector(state => state.routerConfig);
  const [toasterObject, setToasterObject] = useState({});
  const [showToaster, setShowToaster] = useState(false);

  const closeToaster = () => {
    setShowToaster(false);
    setToasterObject({});
  };
  

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
    let providedPath = rectifyPath(newComponent.route, false);
    let matchingPath = Object.keys(routerConfig.routes).filter(path => path.toLowerCase() === providedPath)[0] || ""
    
    if (matchingPath) {
      setShowToaster(true);
      setToasterObject({
        toastTitle: "Oops found an error!",
        toastBody: (<> path already present</>),
        variant: "warning",
        closeButton: true,
      });
    }
    else {
      addComponent(
        newComponent.name,
        newComponent.type,
        newComponent.route,
        projectName
      ).then((res) => {
        if (providedPath) {
          return saveRoute({ path: rectifyPath(newComponent.route, true), component: res.comp, addCompRoute: true }, projectName);
        } else {
          router.navigate("/project/" + projectName + "/component/" + newComponent.name, {
            state: {
              showToast: true,
              toasterDetails: {
                toastTitle: "Success..",
                toastBody: 'component is added!',
                status: 'success',
                emojiSymbol: '0x1F60A',
                variant: "success",
                closeButton: false,
                bodyFontColor: 'text-white'
              }
            }
          });
        }
      }).then((res) => {
        if (res !== undefined) {
          if (res.status.toString().startsWith('2')) {
            router.navigate("/project/" + projectName + "/component/" + newComponent.name, {
              state: {
                showToast: true,
                toasterDetails: {
                  toastTitle: "Success..",
                  toastBody: 'route and component are added!',
                  status: 'success',
                  emojiSymbol: '0x1F60A',
                  variant: "success",
                  closeButton: false,
                  bodyFontColor: 'text-white'
                }
              }
            });
          } else {
            router.navigate("/project/" + projectName + "/component/" + newComponent.name, {
              state: {
                showToast: true,
                toasterDetails: {
                  toastTitle: "Oops, component added but...",
                  toastBody: `${res.body}`,
                  variant: "warning",
                  closeButton: false,
                }
              }
            });
          }
        }
      }).catch((res) => {
        console.log(res);
      });
    }
  }

  const rectifyPath = (routePath, isCaseSensitive) => {
    if (routePath) {
      routePath = routePath.trim();
      routePath = "/" + routePath.replace(/^\/+|\/+$/g, "")
      if (!isCaseSensitive) {
        routePath = routePath.toLowerCase();
      }
    }
    return routePath;
  };

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
      <ToasterComponent
        showToaster={showToaster}
        toastTitle={toasterObject.toastTitle || ""}
        toastBody={toasterObject.toastBody || ""}
        variant={toasterObject.variant}
        bodyFontColor={toasterObject.bodyFontColor}
        position={toasterObject.position}
        delay={toasterObject.delay}
        autohide={toasterObject.autohide}
        closeButton={toasterObject.closeButton}
        onClose={() => closeToaster()}
      />
    </div>
  );
}
