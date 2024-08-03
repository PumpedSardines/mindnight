import React from "react";

import styles from "./CenterView.module.scss";

type CenterViewProps = {
  children: React.ReactNode;
};

const CenterView: React.FC<CenterViewProps> = (props) => {
  return <div className={styles["centerView"]}>{props.children}</div>;
};

export default CenterView;
