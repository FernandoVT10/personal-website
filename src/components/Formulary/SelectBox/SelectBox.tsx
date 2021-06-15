import React, {useState} from "react";

import styles from "./SelectBox.module.scss";

interface SelectBoxProps {
  availableValues: string[],
  currentValue: string,
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const SelectBox = ({ availableValues, currentValue, setValue }: SelectBoxProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleOnClick = (value: string) => {
    setValue(value);
    setIsActive(false);
  }

  const buttonClass = isActive ? styles.active : "";

  return (
    <div className={styles.selectBox}>
      <button
        type="button"
        className={`${styles.button} ${buttonClass}`}
        onClick={() => setIsActive(!isActive)}
      >
        { currentValue ? currentValue : "Select an option" }
        <i className="fas fa-sort-down" aria-hidden="true"></i>
      </button>

      { isActive &&
      <div className={styles.values}>
        {availableValues.map((value, index) => {
          return (
            <div
              className={styles.value}
              onClick={() => handleOnClick(value)}
              key={index}
            >
            { value }
            </div>
          );
        })}
      </div>
      }
    </div>
  );
}

export default SelectBox;
