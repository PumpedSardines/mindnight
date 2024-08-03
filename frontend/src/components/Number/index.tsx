import React from "react";

type NumberProps = {
  children: React.ReactNode;
};

const Number: React.FC<NumberProps> = (props) => {
  return (
    <span
      style={{
        fontVariantNumeric: "tabular-nums",
        letterSpacing: "-0.04em",
      }}
    >
      {props.children}
    </span>
  );
};

export default Number;
