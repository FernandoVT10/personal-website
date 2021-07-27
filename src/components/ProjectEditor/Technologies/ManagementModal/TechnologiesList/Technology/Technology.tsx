import React, { useState } from "react";

import { CheckBox } from "@/components/Formulary";
import DropDown from "@/components/DropDown";

import styles from "./Technology.module.scss";

export type ITechnology = {
  _id: string
  name: string
}

interface ITechnologyProps {
  isActive: boolean
  technology: ITechnology
  deleteTechnology: (technologyId: string) => void
  editTechnology: (technologyId: string, newName: string, oldName: string) => Promise<void>
  toggleTechnology: (technologyName: string) => void
}

const Technology = ({
  isActive,
  technology,
  deleteTechnology,
  editTechnology,
  toggleTechnology
}: ITechnologyProps) => {
  const [name, setName] = useState(technology.name);
  const [isEditing, setIsEditing] = useState(false);

  const [isConfirming, setIsConfirming] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  
  const handleDeleteTechnology = async () => {
    setIsConfirming(false);

    deleteTechnology(technology._id);
  }

  const handleOnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    try {
      await editTechnology(technology._id, name, technology.name);

      setIsEditing(false);
    } catch(err) {
      setErrorMessage(err.message);
    }
  }

  const dropdownActions = [
    {
      name: "Edit",
      handle: () => setIsEditing(true)
    },
    {
      name: "Delete",
      handle: () => setIsConfirming(true)
    }
  ];

  if(isEditing) {
    const technologyFormClass = errorMessage.length > 0 ? styles.error : "";

    return (
      <form onSubmit={handleOnSubmit} className={styles.formContainer}>
        <div className={`${styles.technologyForm} ${technologyFormClass}`}>
          <input
            type="text"
            className={styles.input}
            placeholder="Name"
            value={name}
            onChange={({ target: { value } }) => setName(value)}
          />

          <button
            type="submit"
            className={`${styles.button} ${styles.check}`}
            data-testid="technology-form-confirm-button"
          >
            <i className="fas fa-check"></i>
          </button>

          <button
            type="button"
            className={`${styles.button} ${styles.times}`}
            onClick={() => setIsEditing(false)}
            data-testid="technology-form-cancel-button"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        { errorMessage.length > -1 &&
        <p className={styles.errorMessage}>{ errorMessage }</p>
        }
      </form>
    );
  }

  const confirmationContainerClass = isConfirming ? styles.active : "";

  return (
    <div className={styles.technology}>
      <div
        className={`${styles.confirmationContainer} ${confirmationContainerClass}`}
        data-testid="technology-confirmation-container"
        onClick={() => setIsConfirming(false)}
      >
        <div className={styles.confirmation} onClick={e => e.stopPropagation()}>
          <p className={styles.message}>Are you sure to delete '{technology.name}'?</p>

          <button
            className={`${styles.button} ${styles.yes}`}
            onClick={handleDeleteTechnology}
          >
            Yes
          </button>
          <button
            className={`${styles.button} ${styles.no}`}
            onClick={() => setIsConfirming(false)}
          >
            No
          </button>
        </div>
      </div>

      <CheckBox
        label={technology.name}
        prefix={technology.name}
        isActive={isActive}
        setIsActive={() => toggleTechnology(technology.name)}
      />

      <DropDown actions={dropdownActions}>
        <button className={styles.button}>
          <i className="fas fa-ellipsis-h" aria-hidden="true"></i>
        </button>
      </DropDown>
    </div>
  );
}

export default Technology;
