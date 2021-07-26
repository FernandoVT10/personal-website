import React, { useEffect, useRef, useState } from "react";

import styles from "./DropDown.module.scss";

interface IDropDownProps {
  actions: {
    name: string
    handle: () => void
  }[]
  children: JSX.Element
}

const DropDown = ({ actions, children }: IDropDownProps) => {
  const [isActive, setIsActive] = useState(false);

  const dropdownContainerRef = useRef<HTMLDivElement>(undefined);

  const handleMouseUp = (e: MouseEvent) => {
    const dropdownContainer = dropdownContainerRef.current;

    if(dropdownContainer && e.target instanceof Node && !dropdownContainer.contains(e.target)) {
      setIsActive(false);
    }
  }

  useEffect(() => {
    window.addEventListener("mouseup", handleMouseUp);

    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const dropdownClass = isActive ? styles.active : "";

  return (
    <div
      className={`${styles.dropdown} ${dropdownClass}`}
      data-testid="dropdown"
      ref={dropdownContainerRef}
    >
      <div className={styles.dropdownMenu}>
        {actions.map((action, index) => {
          const handleOnClick = () => {
            setIsActive(false);
            action.handle();
          }

          return (
            <button
              className={styles.dropdownItem}
              onClick={handleOnClick}
              key={index}
            >
              { action.name }
            </button>
          );
        })}
      </div>

      <div onClick={() => setIsActive(!isActive)}>
        { children }
      </div>
    </div>
  );
}

export default DropDown;
