import React from "react";

import styles from "./CheckBox.module.scss";

interface ICheckBoxProps {
  label: string
  prefix: string
  isActive: boolean
  setIsActive: (status: boolean) => void
}

const CheckBox = ({ label, prefix, isActive, setIsActive }: ICheckBoxProps) => {
  return (
    <div className={styles.checkBox}>
      <input
        type="checkBox"
        className={styles.input}
        id={`${prefix}-checkBox`}
        checked={isActive}
        onChange={({ target: { checked } }) => setIsActive(checked)}
      />

      <label
        htmlFor={`${prefix}-checkBox`}
        className={styles.label}
      >
        <span className={styles.customCheckBox} aria-hidden="true"></span>
        { label }
      </label>
    </div>
  );
}

export default CheckBox;
