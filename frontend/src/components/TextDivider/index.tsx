import React from "react";

import styles from "./TextDivider.module.scss";

type TextDividerProps = {
  text?: string;
};

const TextDivider: React.FC<TextDividerProps> = (props) => {
  return (
    <div className={styles["root"]}>
      <div className={styles["divider"]} />
      <div className={styles["text"]}>{props.text}</div>
      <div className={styles["divider"]} />
    </div>
  );
};

export default TextDivider;
