import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

import cx from "@/utils/cx";

import styles from "./Button.module.scss";
import { Nullish } from "@/types";

type ButtonProps = {
  children?: React.ReactNode;
  loading?: boolean;
  variant?: "primary" | "contrast" | "hack" | "fulfill";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: Nullish<() => void>;
};

const Button: React.FC<ButtonProps> = (props) => {
  const variant = props.variant ?? "primary";

  return (
    <button
      className={cx(
        styles["button"],
        props.fullWidth && styles["fullWidth"],
        styles[variant],
      )}
      type={props.type}
      onClick={props?.onClick ?? undefined}
    >
      {props.loading ? (
        <BounceLoader
          speedMultiplier={3}
          size={"1rem"}
          color="var(--color-contrast)"
        />
      ) : (
        props.children
      )}
    </button>
  );
};

export default Button;
