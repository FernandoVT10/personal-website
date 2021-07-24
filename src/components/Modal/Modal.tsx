import React, { useEffect, useRef } from "react";

import styles from "./Modal.module.scss";

interface IModalProps {
  isActive: boolean
  setIsActive: React.Dispatch<boolean>
  children: JSX.Element
  maxWidth?: number
  centerModal?: boolean
}

const Modal = ({ isActive, setIsActive, children, maxWidth, centerModal }: IModalProps) => {
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

  const centerModalClass = centerModal ? styles.centerModal : "";

  return (
    <div
      className={`${styles.modal} ${centerModalClass}`}
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

      <div
        className={styles.content}
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: maxWidth ?? 1000 }}
      >
        { children }
      </div>
    </div>
  );
}

export default Modal;
