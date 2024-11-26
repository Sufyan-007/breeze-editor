import React, {
  ForwardedRef,
  forwardRef,
  ReactElement,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import './styles.css';
export interface MenuItem<T> {
  label: string;
  value: T;
  hasChildren: boolean;
  children?: Array<MenuItem<T>>;
  style?: React.CSSProperties;
  secondaryLabel?: string;
  getChildren?: (val: T) => Promise<Array<MenuItem<T>>>;
}
interface CustomContextMenuProps<T> {
  menuItems: Array<MenuItem<T>>;
  onSelection: (val: MenuItem<T>["value"]) => unknown;
  width?: number;
  elemHeight?: number;
  defaultOrientation?: {
    right: boolean;
    bottom: boolean;
  };
  getChildren?: MenuItem<T>["getChildren"];
}
export interface CustomContextMenuRef {
  handleEvent: (e: React.MouseEvent) => void;
  openContextMenu: (position: { x: number; y: number }) => void;
}
const CustomContextMenu = forwardRef(
  <T,>(
    {
      menuItems,
      onSelection,
      width = 240,
      elemHeight = 27,
      defaultOrientation = { right: true, bottom: true },
      getChildren,
    }: CustomContextMenuProps<T>,
    ref: ForwardedRef<CustomContextMenuRef>
  ) => {
    const [show, setShow] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const selectionAndClose = (val: T) => {
      setShow(false);
      onSelection(val);
    };
    const setMenuPosition = useCallback(
      (x: number, y: number) => {
        const pos = { x: 0, y: 0 };
        if (defaultOrientation.right) {
          if (x + width > document.body.clientWidth) {
            pos.x = x - width;
          } else {
            pos.x = x;
          }
        } else {
          if (x - width < 0) {
            pos.x = x;
          } else {
            pos.x = x - width;
          }
        }
        if (defaultOrientation.bottom) {
          if (y + elemHeight * menuItems.length > document.body.clientHeight) {
            pos.y = y - elemHeight * menuItems.length;
          } else {
            pos.y = y;
          }
        } else {
          if (y - elemHeight * menuItems.length < 0) {
            pos.y = y;
          } else {
            pos.y = y - elemHeight * menuItems.length;
            // console.log(pos, y, elemHeight * menuItems.length);
          }
        }
        setPosition(pos);
      },
      [defaultOrientation, elemHeight, menuItems.length, width]
    );
    const menuRef = useRef<HTMLUListElement>(null);
    useImperativeHandle(
      ref,
      () => {
        return {
          handleEvent: (event) => {
            event.preventDefault();
            event.stopPropagation();
            setMenuPosition(event.clientX, event.clientY);
            setShow(true);
          },
          openContextMenu: ({ x, y }) => {
            setPosition({ x, y });
            setShow(true);
          },
        };
      },
      [setMenuPosition]
    );
    useEffect(() => {
      // console.log(document.body.clientHeight);
      const handler = (e: MouseEvent) => {
        if (
          !(e.target instanceof Node && menuRef.current?.contains(e.target))
        ) {
          setShow(false);
        }
      }
      document.addEventListener("click", handler);
      document.addEventListener("contextmenu", handler)
      return () => {
        document.removeEventListener("click", handler);
        document.addEventListener("contextmenu", handler)
      }
    }, []);
    return (
      show && createPortal(
        <CustomContextMenuView
          menuItems={menuItems}
          onSelection={selectionAndClose}
          menuRef={menuRef}
          width={width}
          elemHeight={elemHeight}
          position={position}
          getChildren={getChildren}
        />
        , document.body, "context"
      )
    );
  }
) as <T>(
  props: CustomContextMenuProps<T> & { ref?: Ref<CustomContextMenuRef> }
) => ReactElement;
export default CustomContextMenu;
interface CustomContextMenuViewProps<T> {
  menuItems: CustomContextMenuProps<T>["menuItems"];
  menuRef?: React.RefObject<HTMLUListElement>;
  onSelection: CustomContextMenuProps<T>["onSelection"];
  width: NonNullable<CustomContextMenuProps<T>["width"]>;
  elemHeight: NonNullable<CustomContextMenuProps<T>["elemHeight"]>;
  position: { x: number; y: number };
  getChildren?: CustomContextMenuProps<T>["getChildren"];
}
const CustomContextMenuView = <T,>({
  menuItems,
  onSelection,
  menuRef,
  width,
  elemHeight,
  position,
  getChildren,
}: CustomContextMenuViewProps<T>) => {
  return (
    <>
      <div>
        <ul
          ref={menuRef}
          className="br-context-menu br-background-secondary br-text-primary med-font px-2 py-1 m-0"
          style={{
            width,
            height: elemHeight * menuItems.length + 8,
            left: position.x,
            top: position.y,
          }}>
          {menuItems.map((menuItem, index) => {
            return (
              <CustomContextMenuItem<T>
                key={index}
                menuItem={menuItem}
                onSelection={onSelection}
                width={width}
                elemHeight={elemHeight}
                getChildren={getChildren}
              />
            );
          })}
        </ul>
      </div>
    </>
  );
};
interface CustomContextMenuItemProps<T> {
  menuItem: CustomContextMenuProps<T>["menuItems"][0];
  onSelection: CustomContextMenuProps<T>["onSelection"];
  width: NonNullable<CustomContextMenuProps<T>["width"]>;
  elemHeight: NonNullable<CustomContextMenuProps<T>["elemHeight"]>;
  getChildren?: CustomContextMenuProps<T>["getChildren"];
}
const CustomContextMenuItem = <T,>({
  menuItem,
  onSelection,
  width,
  elemHeight,
  getChildren,
}: CustomContextMenuItemProps<T>) => {
  const [showChildren, setShowChildren] = useState(false);
  const [children, setChildren] = useState(menuItem.children);
  const leaveTimeout = useRef<NodeJS.Timeout | null>();
  const openTimeout = useRef<NodeJS.Timeout | null>();
  const menuRef = useRef<HTMLUListElement>(null);
  const itemRef = useRef<HTMLLIElement>(null);
  const openChildren = () => {
    if (menuItem.hasChildren) {
      setShowChildren(true);
      if (children === undefined) {
        if (menuItem.getChildren) {
          menuItem.getChildren(menuItem.value).then((children) => {
            setChildren(children);
          });
        } else {
          if (getChildren) {
            getChildren(menuItem.value).then((children) => {
              setChildren(children);
            });
          }
        }
      }
    }
  };
  const handleMouseEnter = () => {
    if (itemRef.current) {
      // console.log(itemRef.current.getBoundingClientRect())
    }
    if (leaveTimeout.current) {
      clearTimeout(leaveTimeout.current);
    }
    openTimeout.current = setTimeout(openChildren, 200);
  };
  const handleMouseLeave = (e: React.MouseEvent) => {
    if (menuRef.current && menuRef.current.contains(e.relatedTarget as Node)) {
      return;
    }
    clearTimeout(openTimeout.current);
    leaveTimeout.current = setTimeout(() => {
      setShowChildren(false);
    }, 200);
  };
  return (
    <>
      <li
        className="br-cursor-pointer br-context-menu-item"
        onMouseEnter={handleMouseEnter}
        ref={itemRef}
        onClick={() => {
          if (!menuItem.hasChildren) {
            onSelection(menuItem.value);
          }
        }}
        onMouseLeave={handleMouseLeave}
        style={{ height: elemHeight }}>
        <span className="d-flex justify-content-between">
          {menuItem.label}
          {menuItem.hasChildren && (
            <img
              width="10"
              height="10"
              src="https://img.icons8.com/fluency-systems-filled/50/FFFFFF/sort-right.png"
              alt="sort-right"
              className="my-2 mx-1"
            />
          )}
        </span>
        {showChildren && children && (
          <CustomContextMenuView
            menuItems={children}
            menuRef={menuRef}
            onSelection={onSelection}
            width={width}
            elemHeight={elemHeight}
            position={{ x: width, y: elemHeight + elemHeight * 5 }}
          />
        )}
      </li>
    </>
  );
};
