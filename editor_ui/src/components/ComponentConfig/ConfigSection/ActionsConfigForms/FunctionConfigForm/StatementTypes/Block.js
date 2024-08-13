import { useEffect, useState } from "react";
import FunctionConfigStack from "../FunctionConfigStack";
import Offcanvas from "../../../../../common/Offcanvas";
import AddFunctionItem from "../AddFunctionItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Block({ config, updateParent }) {
  const [blockConfig, setBlockConfig] = useState(config);
  const [isOffcanvasOpen, setOffCanvasOpen] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  function handleClose(val) {
    if (val) {
      addStatement(val);
    }
    setOffCanvasOpen(false);
  }

  useEffect(() => {
    setBlockConfig(config);
  }, [config]);

  function addStatement(newStatement) {
    setBlockConfig((state) => {
      const newState = {
        ...state,
        statements: [...state.statements, newStatement],
      };
      updateParent(newState);
      return newState;
    });
  }

  function updateChild(child, index) {
    setBlockConfig((state) => {
      const newState = { ...state };
      if (child) {
        newState.statements[index] = child;
      } else {
        newState.statements.splice(index, 1);
      }
      updateParent(newState);
      return newState;
    });
  }

  function handleOnDragEnd(result) {
    if (!result.destination) return;

    const items = Array.from(blockConfig.statements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const newState = { ...blockConfig, statements: items };
    setBlockConfig(newState);
    updateParent(newState);
  }

  return (
    <div>
      <div
        className="d-flex justify-content-between mt-1"
        style={{ fontSize: "14px" }}
      >
        <div>Add function</div>
        <div className="d-flex">
          <div
            className="mx-1"
            style={{ cursor: "pointer" }}
            onClick={() => setOffCanvasOpen(true)}
          >
            <i className="bi bi-plus-circle"></i>
          </div>
          {blockConfig.statements.length > 1 && (
            <div className="mx-1">
              {isReordering ? (
                <>
                  <style>
                    {`
                      @keyframes blink {
                        0% { opacity: 1; }
                        50% { opacity: 0.3; }
                        100% { opacity: 1; }
                      }
                    `}
                  </style>
                  <div
                    title="Stop Reordering"
                    onClick={() => setIsReordering(!isReordering)}
                    style={{
                      cursor: "pointer",
                      color: "red",
                      animation: isReordering ? "blink 1s infinite" : "none",
                    }}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </div>
                </>
              ) : (
                <div
                  title="Reorder"
                  className=""
                  onClick={() => setIsReordering(!isReordering)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="bi bi-arrow-down-up"></i>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isReordering ? (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="statements">
            {(provided) => (
              <div
                className="function-config-stack mt-1"
                style={{ fontSize: "14px" }}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {blockConfig.statements.map((conf, index) => (
                  <Draggable
                    key={index}
                    draggableId={String(index)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <FunctionConfigStack
                          config={conf}
                          updateParent={(newChild) =>
                            updateChild(newChild, index)
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <div
          className="function-config-stack mt-1"
          style={{ fontSize: "14px" }}
        >
          {blockConfig.statements.map((conf, index) => (
            <FunctionConfigStack
              key={index}
              config={conf}
              updateParent={(newChild) => updateChild(newChild, index)}
            />
          ))}
        </div>
      )}
      <Offcanvas
        isOpen={isOffcanvasOpen}
        onClose={() => handleClose(false)}
        title={"Add Function"}
        width="50%"
      >
        {isOffcanvasOpen && (
          <AddFunctionItem update={(val) => handleClose(val)} />
        )}
      </Offcanvas>
    </div>
  );
}
