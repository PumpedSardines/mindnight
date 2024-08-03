import React from "react";
import styles from "./Logo.module.scss";
import cx from "@/utils/cx";
import { Nullish } from "@/types";

type LogoProps = {
  variant?: "primary" | "contrast";
  className?: Nullish<string>;
};

const Logo: React.FC<LogoProps> = (props) => {
  const variant = props.variant ?? "black";

  return (
    <h1 className={cx(styles["logo"], styles[variant], props.className)}>
      MINDNIGHT
    </h1>
  );
};

export default Logo;
