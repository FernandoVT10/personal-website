import React, { useEffect, useRef } from "react";

import styles from "./Modal.module.scss";

interface IModalProps {
  isActive: boolean
  setIsActive: React.Dispatch<boolean>
  children: JSX.Element
}

const Modal = ({ isActive, setIsActive, children }: IModalProps) => {
  const modalDiv = useRef<HTMLDivElement>(undefined);

  useEffect(() => {
    if(isActive) {
      modalDiv.current.scroll(0, 0);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isActive]);

  if(!isActive) return null;

  return (
    <div
      className={`${styles.modal}`}
      onClick={() => setIsActive(false)}
      ref={modalDiv}
    >
      <button
        onClick={() => setIsActive(false)}
        className={styles.closeButton}
        data-testid="modal-close-button"
      >
        <i className="fas fa-times" aria-hidden="true"></i>
      </button>

      <div className={styles.content} onClick={e => e.stopPropagation()}>
        { children }
      </div>
    </div>
  );
}

export default Modal;
