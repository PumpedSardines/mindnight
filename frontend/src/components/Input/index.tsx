import React, { useId } from "react";
import styles from "./Input.module.scss";

type InputProps = {
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  placeholder?: string;
  minLength?: number;
  required?: boolean;
  maxLength?: number;
  label?: string;
  name?: string;
};

const Input: React.FC<InputProps> = (props) => {
  const id = "id-" + useId().replace(/:/g, "-");

  return (
    <div className={styles["root"]}>
      <label className={styles["label"]} htmlFor={id}>
        {props.label}
      </label>
      <input
        className={styles["input"]}
        id={id}
        name={props.name}
        placeholder={props.placeholder}
        defaultValue={props.defaultValue}
        minLength={props.minLength}
        maxLength={props.maxLength}
        required={props.required}
        value={props.value}
        onChange={(e) => props.onChange?.(e.currentTarget.value)}
      />
    </div>
  );
};

export default Input;
